import { world, system, ItemStack } from "@minecraft/server";

const MAX_MANA = 100;
const SPELLS = {
  "mt:aqua_bullet": { cost: 8, level: "water", effect: "minecraft:slowness", power: 2, duration: 3, particle: "minecraft:water_splash_particle" },
  "mt:stone_cannon": { cost: 12, level: "earth", effect: "minecraft:weakness", power: 1, duration: 4, particle: "minecraft:critical_hit_emitter" }
};
const playerState = new Map();

function state(player) {
  let data = playerState.get(player.id);
  if (!data) {
    data = { mana: MAX_MANA, class: "Unchosen", water: 0, earth: 0, fire: 0, healing: 0, sword: 0, tick: 0 };
    playerState.set(player.id, data);
  }
  return data;
}

function tell(player, message) { player.sendMessage(`§b[World of Magic]§r ${message}`); }

function give(player, type, amount = 1) {
  const inventory = player.getComponent("minecraft:inventory")?.container;
  if (!inventory) return;
  const leftover = inventory.addItem(new ItemStack(type, amount));
  if (leftover) player.dimension.spawnItem(leftover, player.location);
}

function command(dimension, command) {
  try { dimension.runCommand(command); } catch {}
}

function block(dimension, id, x, y, z) { command(dimension, `setblock ${x} ${y} ${z} ${id}`); }
function fill(dimension, id, x1, y1, z1, x2, y2, z2) { command(dimension, `fill ${x1} ${y1} ${z1} ${x2} ${y2} ${z2} ${id}`); }

function roofHouse(dimension, x, y, z, material = "oak_planks") {
  fill(dimension, "stone_bricks", x, y, z, x + 6, y + 3, z + 5);
  fill(dimension, "air", x + 1, y + 1, z + 1, x + 5, y + 2, z + 4);
  fill(dimension, material, x - 1, y + 4, z - 1, x + 7, y + 4, z + 6);
  fill(dimension, material, x, y + 5, z, x + 6, y + 5, z + 5);
  block(dimension, "door", x + 3, y + 1, z);
  block(dimension, "lantern", x + 2, y + 2, z);
  block(dimension, "glass_pane", x + 1, y + 2, z + 5);
}

function marketStall(dimension, x, y, z, color) {
  fill(dimension, "oak_log", x, y, z, x, y + 2, z);
  fill(dimension, "oak_log", x + 4, y, z, x + 4, y + 2, z);
  fill(dimension, color, x, y + 3, z, x + 4, y + 3, z + 2);
  fill(dimension, "oak_planks", x + 1, y, z + 1, x + 3, y, z + 1);
  block(dimension, "chest", x + 2, y + 1, z + 1);
}

function castle(dimension, x, y, z, material) {
  fill(dimension, material, x, y, z, x + 18, y + 1, z + 18);
  fill(dimension, material, x, y + 2, z, x + 2, y + 10, z + 2);
  fill(dimension, material, x + 16, y + 2, z, x + 18, y + 10, z + 2);
  fill(dimension, material, x, y + 2, z + 16, x + 2, y + 10, z + 18);
  fill(dimension, material, x + 16, y + 2, z + 16, x + 18, y + 10, z + 18);
  fill(dimension, material, x + 3, y + 2, z + 3, x + 15, y + 5, z + 15);
  fill(dimension, "air", x + 4, y + 3, z + 4, x + 14, y + 5, z + 14);
  fill(dimension, "red_wool", x + 5, y + 6, z + 5, x + 13, y + 6, z + 13);
  fill(dimension, material, x + 8, y + 2, z, x + 10, y + 5, z + 2);
  fill(dimension, "air", x + 9, y + 2, z, x + 9, y + 4, z);
  block(dimension, "enchanting_table", x + 9, y + 3, z + 9);
  block(dimension, "bell", x + 9, y + 2, z + 12);
}

function caveAndOre(dimension, x, y, z, stone) {
  fill(dimension, "air", x, y, z, x + 8, y + 3, z + 5);
  fill(dimension, stone, x + 1, y - 1, z + 1, x + 7, y - 1, z + 4);
  for (let i = 0; i < 8; i++) {
    const ox = x + 1 + ((i * 5) % 7);
    const oz = z + 1 + ((i * 3) % 4);
    block(dimension, "lapis_ore", ox, y, oz);
  }
  block(dimension, "glowstone", x + 4, y + 3, z + 2);
}

function instructor(dimension, x, y, z, name, discipline) {
  command(dimension, `summon villager ${x} ${y} ${z} {CustomName:'{"text":"${name}"}',PersistenceRequired:1b}`);
  block(dimension, "lectern", x, y, z + 1);
  command(dimension, `particle minecraft:villager_happy ${x} ${y + 2} ${z}`);
  command(dimension, `say ${name} teaches ${discipline}`);
}

function generateRealm(player, realm) {
  const d = player.dimension;
  const x = Math.floor(player.location.x) + 8;
  const y = Math.floor(player.location.y);
  const z = Math.floor(player.location.z) + 8;
  const isAsura = realm === "asura";
  const stone = isAsura ? "stone_bricks" : "smooth_quartz";
  const roof = isAsura ? "red_wool" : "blue_wool";
  const path = isAsura ? "cobblestone" : "prismarine";
  fill(d, path, x - 6, y - 1, z - 6, x + 30, y - 1, z + 30);
  castle(d, x + 7, y, z + 7, stone);
  for (let i = 0; i < 4; i++) roofHouse(d, x + i * 8, y, z - 5, roof);
  for (let i = 0; i < 3; i++) roofHouse(d, x + i * 8, y, z + 25, roof);
  marketStall(d, x, y, z + 10, isAsura ? "red_wool" : "cyan_wool");
  marketStall(d, x + 7, y, z + 10, isAsura ? "yellow_wool" : "light_blue_wool");
  marketStall(d, x + 14, y, z + 10, isAsura ? "white_wool" : "blue_wool");
  instructor(d, x + 4, y + 1, z + 13, isAsura ? "Asuran Swordmaster" : "Millish Saint", isAsura ? "sword" : "healing");
  instructor(d, x + 13, y + 1, z + 13, isAsura ? "Royal Magician" : "Millish Water Sage", isAsura ? "fire and earth" : "water and healing");
  caveAndOre(d, x + 24, y - 5, z + 3, isAsura ? "deepslate" : "stone");
  for (let i = 0; i < 3; i++) command(d, `summon mt:magic_beast ${x + 23 + i * 2} ${y + 1} ${z + 20}`);
  player.setDynamicProperty(`mt_realm_${realm}`, true);
  tell(player, `${isAsura ? "Asura Kingdom" : "Millis Kingdom"} generated: castle, city, market, instructors, cavern and magic beasts.`);
}

function initialize(player) {
  state(player);
  if (player.getDynamicProperty("mt_initialized")) return;
  player.setDynamicProperty("mt_initialized", true);
  give(player, "mt:magic_grimoire");
  tell(player, "Your journey begins with a Magic Grimoire. Use it to choose a class and learn the basics.");
}

function castSpell(player, itemId) {
  const data = state(player);
  const spell = SPELLS[itemId];
  if (!spell) return;
  if (data.mana < spell.cost) return tell(player, `Not enough mana. Need ${spell.cost}; current mana: ${data.mana}.`);
  data.mana -= spell.cost;
  const direction = player.getViewDirection();
  const start = player.getHeadLocation();
  for (let step = 1; step <= 12; step++) {
    const point = { x: start.x + direction.x * step, y: start.y + direction.y * step, z: start.z + direction.z * step };
    try { player.dimension.spawnParticle(spell.particle, point); } catch {}
    const hits = player.dimension.getEntities({ location: point, maxDistance: 1.1, excludeTypes: ["minecraft:player"] });
    if (hits.length) {
      try { hits[0].applyDamage(itemId === "mt:stone_cannon" ? 8 + data.earth : 4 + data.water); } catch {}
      try { hits[0].addEffect(spell.effect, spell.duration * 20, { amplifier: spell.power - 1 }); } catch {}
      break;
    }
  }
  data[spell.level] += 1;
  tell(player, `${itemId === "mt:aqua_bullet" ? "Aqua Bullet" : "Stone Cannon"} cast. Mana ${data.mana}/${MAX_MANA}. ${spell.level} mastery ${data[spell.level]}.`);
  try { player.playSound("random.orb"); } catch {}
}

world.beforeEvents.itemUse.subscribe((event) => {
  const { source: player, itemStack } = event;
  if (!player || player.typeId !== "minecraft:player") return;
  if (SPELLS[itemStack.typeId]) { event.cancel = true; system.run(() => castSpell(player, itemStack.typeId)); }
  else if (itemStack.typeId === "mt:magic_grimoire") {
    event.cancel = true;
    system.run(() => tell(player, "Use !class mage, !class swordsman, or !class healer. Then use !learn water, !learn earth, !learn fire, !learn healing, or !learn sword."));
  }
});

world.beforeEvents.chatSend.subscribe((event) => {
  const player = event.sender;
  const text = event.message.trim().toLowerCase();
  if (!text.startsWith("!")) return;
  const args = text.slice(1).split(/\s+/);
  const data = state(player);
  event.cancel = true;
  system.run(() => {
    if (args[0] === "class") {
      const classes = { mage: "Mage", swordsman: "Swordsman", healer: "Healer" };
      if (!classes[args[1]]) return tell(player, "Choose mage, swordsman, or healer.");
      data.class = classes[args[1]];
      tell(player, `Class selected: ${data.class}. You can train other disciplines too.`);
      if (data.class === "Mage") give(player, "mt:aqua_bullet", 8);
      if (data.class === "Swordsman") give(player, "mt:sword_training");
    } else if (args[0] === "learn") {
      const key = { water: "water", earth: "earth", fire: "fire", healing: "healing", sword: "sword" }[args[1]];
      if (!key) return tell(player, "Available disciplines: water, earth, fire, healing, sword.");
      data[key] = Math.max(1, data[key]);
      if (key === "water") give(player, "mt:aqua_bullet", 8);
      if (key === "earth") give(player, "mt:stone_cannon", 8);
      tell(player, `${args[1]} mastery is now ${data[key]}.`);
    } else if (args[0] === "recover") {
      data.mana = MAX_MANA; data.healing += 1;
      try { player.addEffect("minecraft:regeneration", 160, { amplifier: 1 }); player.dimension.spawnParticle("minecraft:totem_particle", player.location); } catch {}
      tell(player, `Recovery complete. Mana restored. Healing mastery ${data.healing}.`);
    } else if (args[0] === "realm" && ["asura", "millis"].includes(args[1])) {
      if (!player.getDynamicProperty(`mt_realm_${args[1]}`)) generateRealm(player, args[1]);
      else tell(player, `${args[1]} has already been generated for this player.`);
    } else if (args[0] === "kingdom") {
      tell(player, "Use !realm asura or !realm millis to generate a complete kingdom at your location.");
    } else if (args[0] === "camp") {
      const p = player.location; const base = { x: Math.floor(p.x) + 3, y: Math.floor(p.y), z: Math.floor(p.z) + 3 };
      fill(player.dimension, "oak_planks", base.x, base.y - 1, base.z, base.x + 4, base.y - 1, base.z + 4);
      block(player.dimension, "crafting_table", base.x + 2, base.y, base.z + 2);
      instructor(player.dimension, base.x + 2, base.y, base.z + 1, "Wandering Instructor", "all disciplines");
      block(player.dimension, "lantern", base.x, base.y, base.z);
      tell(player, "Training camp created nearby.");
    } else if (args[0] === "status") {
      tell(player, `Class: ${data.class} | Mana: ${data.mana}/${MAX_MANA} | Water: ${data.water} Earth: ${data.earth} Fire: ${data.fire} Healing: ${data.healing} Sword: ${data.sword}`);
    } else if (args[0] === "help") {
      tell(player, "Commands: !class, !learn, !recover, !status, !camp, !realm asura, !realm millis.");
    } else tell(player, "Unknown command. Use !help.");
  });
});

world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => { if (initialSpawn) initialize(player); state(player); });

system.runInterval(() => {
  for (const player of world.getAllPlayers()) {
    const data = state(player); data.tick++;
    if (data.tick % 20 === 0 && data.mana < MAX_MANA) data.mana = Math.min(MAX_MANA, data.mana + 1);
    if (data.tick % 40 === 0) player.onScreenDisplay.setActionBar(`§b${data.class} §7| §9Mana §f${data.mana}/${MAX_MANA} §7| §dWater ${data.water} §6Earth ${data.earth} §aSword ${data.sword}`);
  }
}, 1);

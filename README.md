# Mushoku World Reborn Minecraft Bedrock Addon

Mushoku World Reborn is a Minecraft Bedrock addon that adds fantasy magic, character classes, mana, spell items, sword training, magic beasts, instructors, training camps, and generated Asura and Millis kingdoms. It is implemented as a Behavior Pack and Resource Pack with Minecraft Bedrock Script API support.

## Install

1. Import or place both pack folders in Minecraft Bedrock:
   - `MushokuTensei_BP`
   - `MushokuTensei_RP`
2. For packaged distribution, import both `.mcpack` files into Minecraft.
3. Create or edit a Bedrock world.
4. Activate both packs in the world settings.
5. Keep the Behavior Pack enabled together with the Resource Pack.
6. Enable the required Script API or Beta APIs setting if your Minecraft version requires it.
7. Enter the world. The first player receives a Magic Grimoire.

Requirements:

- Minecraft Bedrock Edition 1.21.0 or newer
- Script API dependency `@minecraft/server` 1.16.0
- Both the Behavior Pack and Resource Pack enabled

## Use

The Magic Grimoire displays the available class and training commands.

Choose a class:

- `!class mage` selects Mage and gives Aqua Bullet items.
- `!class swordsman` selects Swordsman and gives Sword Training.
- `!class healer` selects Healer.

Learn disciplines:

- `!learn water`
- `!learn earth`
- `!learn fire`
- `!learn healing`
- `!learn sword`

Available gameplay commands:

- `!help` displays the command list.
- `!recover` restores mana and applies regeneration.
- `!status` displays the current class, mana, and discipline mastery.
- `!camp` creates a nearby training camp with a wandering instructor.
- `!realm asura` generates the Asura Kingdom near the player.
- `!realm millis` generates the Millis Kingdom near the player.
- `!kingdom` displays the kingdom generation commands.
- `!summon mt:magic_beast` summons a hostile Magic Beast.

Hold and use spell items to cast them:

- Aqua Bullet consumes 8 mana, damages a target, applies slowness, and increases water mastery.
- Stone Cannon consumes 12 mana, damages a target, applies weakness, and increases earth mastery.

Mana is shown in the action bar and regenerates gradually. The `!recover` command restores it immediately.

The Asura Kingdom includes a castle, houses, market stalls, instructors, a cavern, and hostile Magic Beasts. The Millis Kingdom includes the same types of structures with a different quartz, prismarine, and blue-themed material palette. Use realm commands in a clear, mostly flat area because blocks are generated around the player's current position.

The addon does not currently add custom biomes, seed-level continents, a custom camera button, custom creature geometry, or full fire, healing, and sword combat systems. Magic Beasts use a zombie-based visual, while fire, healing, and sword disciplines currently provide progression values rather than separate spell systems.

---

More Minecraft mod projects by EnderDevelopment: https://github.com/EnderDevelopment

Project page: https://dash.enderdevelopment.com/community/35fa3e3e-f464-4d2f-88a7-505d7a725b1c?utm_source=github&utm_medium=readme&utm_campaign=auto_publish&utm_content=35fa3e3e-f464-4d2f-88a7-505d7a725b1c

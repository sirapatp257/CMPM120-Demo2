A simple adventure game by me (Sirapat "Poom" Phunjamaneechot) based on a simple adventure game engine by [Adam Smith](https://github.com/rndmcnlly).

Code requirements:
- **4+ scenes based on `AdventureScene`**:
    - `MainHall`
    - `Bedroom`
    - `IdolRoom`
    - `Outside`
- **2+ scenes *not* based on `AdventureScene`**:
    - `Intro`
    - `Splash`
    - `Title`
    - `Exposition`
    - 6 possible endings:
        - Good endings: `GoodA`, `GoodB`, `GoodC`
        - Bad endings: `BadA`, `BadB`, `BadC`
- **2+ methods or other enhancement added to the adventure game engine to simplify my scenes**:
    - Enhancement 1: `pickupItem()` - animates an item being picked up, followed by adding the item to the player's inventory.
    - Enhancement 2: `putDownItem()` - animates an item being put back to where it was picked up from and removes the item from the player's inventory.
    - Enhancement 3: `setPointerMessage()` - sets an item's `pointerover` message.
    - Enhancement 4: `pickupRefresh()` - called by `pickupItem()` to update relevant objects in the scene rather than using the `update()` method to check for changes every frame. Prototype is defined in adventure.js, but is only implemented in `Bedroom` since that is the only scene where such behavior is necessary.
    - Enhancement 5: `basicSetup()` - reads data from a JSON file to perform basic setup (e.g. placing background image and interactable items) on an Adventure scene.
    - Enhancement 6: modified `gotoScene()` to allow certain Boolean values related to the game to be passed around between scenes.


Experience requirements:
- **4+ locations in the game world**:
    - `MainHall`
    - `Bedroom`
    - `IdolRoom`
    - `Outside`
- **2+ interactive objects in most scenes**:
    - `Exposition`: Skip button to bring the player straight to `MainHall`.
    - All Adventure scenes (except `Outside`): 1-2 arrows that allow the player to move from one scene to another.
    - `MainHall`: Door that brings the player either to one of the endings or to the `Outside` scene depending on the player's inventory.
    - `Bedroom`: collectible items (Delta Rod, Umbrella, Raincoat)
    - `IdolRoom`: collectible item (Amulet), decoy object (Idol), Picture of Grandpa (starts horizontal, rotates to vertical).
    - `Outside`: 3 trees (each of which may or may not bring the player to a good ending), Evil Spirit (may bring player to good or bad ending depending on the player's inventory.)
    - All ending scenes: A quit button that brings the player to `Title`, and a restart button that brings the player to `MainHall`.
- **Many objects have `pointerover` messages**:
    - Interactive objects have `pointerover` messages that describe what the player character thinks of the object, which may or may not act as hints in the game. Examples include, but are not limited to:
        - The door in `MainHall` - "Frankie's probably out there somewhere. I have to go bring him back inside." (After Frankie disappears from the scene.)
        - The umbrella in `Bedroom` - "An umbrella. Could be useful if I need to head out for whatever reason."
        - The picture of the player character's grandfather in `IdolRoom` - "Huh. That's a weird way to place a picture of Grandpa."
        - Trees in `Outside`: "Frankie must be somewhere around here. I have to find him!"
- **Many objects have `pointerdown` effects**:
    - All collectible items call the `pickupItem()` method when clicked on.
        - In case of the umbrella and the raincoat in `Bedroom`, `putDownItem()` is also called, since the player can have one but not the other.
    - Arrows in `MainHall`, `Bedroom`, and `IdolRoom` bring the player to a different scene.
    - The door in `MainHall` brings the player to `Outside`, or a bad ending, depending on inventory.
    - One of the 3 trees in `Outside` brings the player to a good ending.
    - The evil spirit brings the player to a good ending or a bad ending, depending on the player's inventory.
    - The idol in `IdolRoom` shakes and displays a message.
    - The picture of the player character's grandfather in `IdolRoom` rotates into upright position, and sets a Boolean variable that determines the presence of the evil spirit in `Outside`.
- **Some objects are themselves animated**:
    - All interactable objects have a shine effect that plays periodically to bring the player's attention to them.
    - The arrows that move the player between scenes have a bouncing animation.
    - All collectibles move upward before disappearing to signify their collection.
        - In case of the umbrella and raincoat in `Bedroom`, they also move downward and reappear when they are replaced.
    - The idol in `IdolRoom` shakes when clicked.
    - The picture of the player character's grandfather in `IdolRoom` rotates into its proper position when clicked.
    - The amulet in `IdolRoom` and the Delta Rod in `Bedroom` also have a blinking animation that plays only if one of them is in the player's inventory while the other hasn't been collected. This is meant to signify that they're supposed to be used in tandem.
    - The evil spirits fades out, and fades back in after teleporting in `Outside`.
    - Frankie slides out from behind a tree and then slides back in behind the same tree in `Outside` to signal to the player which tree to click on.


Asset sources:
- All assets were made by me.
    - All image assets were made using [Aseprite](https://dacap.itch.io/aseprite).
    - Explosion6.wav was generated and modified with [Bfxr](https://www.bfxr.net/).
    - hum-edited.wav was generated using [Pure Data](https://puredata.info/) and edited in [Audacity](https://www.audacityteam.org/).
    - LilacCity.wav was based somewhat loosely on the [Lavender Town theme from the first generation Pokémon games](https://www.youtube.com/watch?v=JNJJ-QkZ8cM). It was made using [Bosca Ceoil](https://terrycavanagh.itch.io/bosca-ceoil).
    - refuse.wav was made using Pure Data.

Code sources:
- `adventure.js` and `index.html` were created for this project [Adam Smith](https://github.com/rndmcnlly) and edited by me.
- `game.js` was sketched by [Adam Smith](https://github.com/rndmcnlly) and rewritten by me.
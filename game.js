class MainHall extends AdventureScene {
    constructor() {
        super("adv1", "Main Hall");
    }

    onEnter() {
        this.basicSetup();
        let bgm = this.sound.get("bgm");
        if (bgm == null) bgm = this.sound.add("bgm");
        if (!bgm.isPlaying) bgm.play();

        if (this.leftMainHall) {
            this.items["Frankie"].destroy();
            this.setPointerMessage(this.items["Door"], "Frankie's probably out there somewhere. I have to go bring him back inside.");
            
            if (this.hasItem("Umbrella")) {
                this.items["Door"].on('pointerdown', () => this.cameras.main.fadeOut(1000, 0, 0, 0, (c, t) => {
                    if (t >= 1) {
                        this.sound.get("bgm").stop();
                        this.scene.start('badEndA');
                    }
                }));
            }
            else if (this.hasItem("Raincoat")) this.items["Door"].on('pointerdown', () => this.gotoScene('adv4'));
            else this.items["Door"].on('pointerdown', () => this.showMessage("I'll need something to shield me from the pouring rain."));
        }
    }
}

class Bedroom extends AdventureScene {
    constructor() {
        super("adv2", "Freddy's Bedroom");
    }

    onEnter() {
        this.basicSetup();
        this.leftMainHall = true;

        if (this.hasItem("Amulet")) {
            this.setPointerMessage(this.items["Delta Rod"], "It's flashing? On its own? I didn't know Delta Rod replicas do that!");
            
            this.tweens.addCounter({
                from: 0.4,
                to: 1,
                duration: 1000,
                yoyo: true,
                repeat: -1
            }).setCallback("onUpdate", (tween) => {
                let intensity = 255 * tween.getValue();
                this.items["Delta Rod"].tint = Phaser.Display.Color.GetColor(intensity, intensity, intensity);
            });
        }
    }

    pickupRefresh() {
        if (this.hasItem("Umbrella")) this.setPointerMessage(this.items["Raincoat"], "Maybe I should go with a raincoat instead?");
        if (this.hasItem("Raincoat")) this.setPointerMessage(this.items["Umbrella"], "Maybe I should go with an umbrella instead?");
    }
}

class IdolRoom extends AdventureScene {
    constructor() {
        super("adv3", "Idol Room");
    }

    onEnter() {
        this.basicSetup();
        this.leftMainHall = true;
        
        let picObject = this.items["Picture of Grandpa"];
        if (!this.picUpright) {
            picObject.on('pointerdown', () => {
                picObject.disableInteractive();
                this.tweens.add({
                    targets: picObject,
                    angle: 0,
                    duration: 800
                }).setCallback('onComplete', () => {
                    this.setPointerMessage(picObject, 
                        "A picture of Grandpa. I wonder if he's watching over me now."
                    );
                    picObject.on('pointerdown', () => {
                        this.showMessage("I should probably leave that as is.");
                    });
                    picObject.setInteractive();
                    this.picUpright = true;
                });
            });
        }
        else {
            this.setPointerMessage(picObject, 
                "A picture of Grandpa. I wonder if he's watching over me now."
            );

            picObject.setAngle(0)
            .on('pointerdown', () => {
                this.showMessage("I should probably leave that as is.");
            });
        }

        if (this.hasItem("Delta Rod")) {
            this.setPointerMessage(this.items["Amulet"], "Interesting. I've never seen that amulet blink like that before.");

            this.tweens.addCounter({
                from: 0.4,
                to: 1,
                duration: 1000,
                yoyo: true,
                repeat: -1
            }).setCallback("onUpdate", (tween) => {
                let intensity = 255 * tween.getValue();
                this.items["Amulet"].tint = Phaser.Display.Color.GetColor(intensity, intensity, intensity);
            });
        }
    }
}

class Outside extends AdventureScene {
    constructor() {
        super("adv4", "Outside Freddy's");
    }

    onEnter() {
        this.basicSetup();

        // Learned random integer generation in JavaScript from
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
        this.hideRoll = Math.floor(Math.random() * 3);

        this.spiritTeleportTimer = 0;

        let correctTree;
        switch(this.hideRoll) {
            case 0:
                correctTree = this.items["Left Tree"];
                break;
            case 1:
                correctTree = this.items["Middle Tree"];
                break;
            case 2:
                correctTree = this.items["Right Tree"];
                break;
            default:
                console.log("Unexpected roll value of " + roll);
        }
        
        correctTree.on('pointerdown', () => {
            let end = this.picUpright ? 'goodEndB' : 'goodEndA'
            this.cameras.main.fadeOut(1000, 0, 0, 0, (c, t) => {
                if (t >= 1) {
                    this.sound.get("bgm").stop();
                    this.scene.start(end);
                }
            })
        });

        this.items["Frankie"].setX(correctTree.x);
        this.tweens.chain({
            targets: this.items["Frankie"],
            tweens: [
                {
                    x: correctTree.x + 40,
                    duration: 500
                },

                {
                    x: correctTree.x,
                    duration: 300
                }
            ],
            repeatDelay: 2400,
            repeat: -1
        });

        if(this.picUpright) {
            this.items["Evil Spirit"].destroy();
        }
        else {
            let hasRequiredItems = this.hasItem("Amulet") && this.hasItem("Delta Rod");
            let end = hasRequiredItems ? 'goodEndC' : 'badEndB';
            this.items["Evil Spirit"].on('pointerdown', () => {
                this.cameras.main.fadeOut(1000, 0, 0, 0, (c, t) => {
                    if (t >= 1) {
                        this.sound.get("bgm").stop();
                        this.scene.start(end);
                    }
                })
            });
        }
    }

    update(t, dt) {
        if (this.picUpright) return;

        this.spiritTeleportTimer += dt;
        if (this.spiritTeleportTimer >= 3000) {
            this.spiritTeleportTimer = 0;
            this.teleportSpirit();
        }
    }

    teleportSpirit() {
        let findRoll = Math.floor(Math.random() * 3);

        let target;
        switch(findRoll) {
            case 0:
                target = this.items["Left Tree"];
                break;
            case 1:
                target = this.items["Middle Tree"];
                break;
            case 2:
                target = this.items["Right Tree"];
                break;
            default:
                console.log("Unexpected roll value of " + roll);
        }

        this.tweens.chain({
            targets: this.items["Evil Spirit"],
            tweens: [
                {
                    alpha: 0,
                    duration: 150
                },

                {
                    x: target.x + 40,
                    duration: 50
                },

                {
                    alpha: 1,
                    duration: 150
                }
            ]
        }).setCallback('onComplete', () => this.catchCheck(findRoll));
    }

    catchCheck(findRoll) {
        if (findRoll == this.hideRoll) {
            this.cameras.main.fadeOut(1000, 0, 0, 0, (c, t) => {
                if (t >= 1) {
                    this.sound.get("bgm").stop();
                    this.scene.start('badEndC');
                }
            })
        }
    }
}

class Intro extends Phaser.Scene {
    constructor() {
        super('intro')
    }
    
    preload() {
        this.load.path = "./assets/";
        this.load.image("gemstone", "images/Gemstone.png");
        this.load.image("halo", "images/LogoHalo.png");
        this.load.image("studioSign", "images/DivineGemstoneLogoText.png");
        
        this.load.image("arrow", "images/Arrow.png");
        this.load.image("mainHall", "images/MainHall.png");
        this.load.image("door", "images/FrontDoor.png");
        this.load.image("frank", "images/Frankie.png");
        
        this.load.image("bedroom", "images/Bedroom.png");
        this.load.image("delta", "images/DeltaRod.png");
        this.load.image("umbrella", "images/Umbrella.png");
        this.load.image("raincoat", "images/Raincoat.png");

        this.load.image("idolRoom", "images/IdolRoomBackground.png");
        this.load.image("amulet", "images/Amulet.png");
        this.load.image("idol", "images/Idol.png");
        this.load.image("grandpa", "images/GrampsPortrait.png");

        this.load.image("outside", "images/OutsideNight.png");
        this.load.image("tree", "images/Tree.png");
        this.load.image("spirit", "images/EvilSpirit.png");

        this.load.audio("hum", "sounds/hum-edited.wav");
        this.load.audio("boom", "sounds/Explosion6.wav");
        this.load.audio("bgm", "sounds/LilacCity.wav");

        this.load.json("sceneData", "miscellaneous/SceneData.json");
        this.load.json("endData", "miscellaneous/EndScenes.json");
    }

    create() {
        this.scene.start('goodEndA');
        this.add.text(960, 180, "NOTICE").setFontFamily('Serif')
            .setFontSize(90)
            .setColor("#fc0000")
            .setAlign('center')
            .setOrigin(0.5);
        
        this.add.text(960, 270, "This game requires a mouse for the best experience.\n\nMild horror elements may be present in this game.")
            .setFontFamily('Serif')
            .setFontSize(60)
            .setAlign('center')
            .setOrigin(0.5, 0)
            .setWordWrapWidth(800);
        
        let bottomLine = this.add.text(960, 840, "Click anywhere to proceed").setFontFamily('Serif')
            .setFontSize(40)
            .setAlign('center')
            .setOrigin(0.5, 0);
        
        this.tweens.add({
            targets: bottomLine,
            alpha: 0.1,
            yoyo: true,
            duration: 1200,
            repeat: -1
        });

        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('splash'));
        });
    }
}

class Splash extends Phaser.Scene {
    constructor() {
        super('splash');
    }
  
    create() {
        let sfx = this.sound.add("hum", {loop: false});
  
        let halo = this.add.image(960, 540, "halo").setScale(3);
        halo.setAlpha(0);
        this.tweens.add({
           targets: halo,
           alpha: 1,
           duration: 1800,
           delay: 750,
           ease: 'Linear',
        }).setCallback("onStart", () => sfx.play());
  
        let gemstone = this.add.image(960, -200, "gemstone").setScale(3);
        this.tweens.add({
           targets: gemstone,
           y: 540,
           duration: 700,
           ease: 'Linear'
        });
  
        let sign = this.add.image(960, -200, "studioSign").setScale(0.9);
        this.tweens.add({
           targets: sign,
           y: 920,
           duration: 500,
           delay: 2300,
           ease: 'Linear',
        }).setCallback("onComplete", () => {
            this.time.delayedCall(800, () => this.cameras.main.fadeOut(1000, 0, 0, 0, (c, t) => {
                if (t >= 1) this.scene.start('title');
            }))
        });
    }
}

class Title extends Phaser.Scene {
    constructor() {
        super('title');
    }

    create() {
        this.add.text(960, 200, "One Stormy Night\nat").setFontFamily('Serif')
            .setFontSize(80)
            .setAlign('center')
            .setOrigin(0.5)
            .setWordWrapWidth(800);

        this.add.text(960, 340, "Freddy's").setFontFamily('Serif')
            .setFontSize(80)
            .setColor("#fc0000")
            .setAlign('center')
            .setOrigin(0.5)
            .setWordWrapWidth(800);

        let bottomLine = this.add.text(960, 840, "Click anywhere to begin").setFontFamily('Serif')
            .setFontSize(40)
            .setAlign('center')
            .setOrigin(0.5, 0);
        
        this.tweens.add({
            targets: bottomLine,
            alpha: 0.1,
            yoyo: true,
            duration: 1200,
            repeat: -1
        });

        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('exposition'));
        });
    }
}

class Exposition extends Phaser.Scene {
    constructor() {
        super('exposition');
    }

    create() {
        let textDelay = 1800;

        let sfx = this.sound.add("boom", {loop: false});
        let bgm = this.sound.add("bgm", {loop: true});

        let tweenList;
        let tweensPlayed = 0;

        let text1 = this.add.text(960, 200, "It was raining, as it did most days in Freddy's neighborhood.").setFontFamily('Serif')
            .setFontSize(40)
            .setAlign('center')
            .setOrigin(0.5, 0);

        this.tweens.add({
            targets: text1,
            alpha: {start: 0, to: 1},
            duration: 600,
            paused: true
        }).setCallback("onComplete", () => this.time.delayedCall(textDelay, () => playTween(tweenList, tweensPlayed++)));

        let text2 = this.add.text(960, 300, "However, unlike most of the previous times, Freddy hears a loud boom going off just outside his house. \“Probably the transformer exploding again,\” Freddy thought.")
            .setFontFamily('Serif')
            .setFontSize(40)
            .setAlign('center')
            .setOrigin(0.5, 0)
            .setWordWrapWidth(1000);
        
        this.tweens.add({
            targets: text2,
            alpha: {start: 0, to: 1},
            duration: 600,
            paused: true
        }).setCallback("onStart", () => this.time.delayedCall(500, () => {
            sfx.play();
            this.time.delayedCall(textDelay - 500, () => playTween(tweenList, tweensPlayed++));
        }));

        let text3 = this.add.text(960, 480, "The house goes dark. Candles were then lit around the house to light the place up.")
            .setFontFamily('Serif')
            .setFontSize(40)
            .setAlign('center')
            .setOrigin(0.5, 0)
            .setWordWrapWidth(1000);
        
        this.tweens.add({
            targets: text3,
            alpha: {start: 0, to: 1},
            duration: 600,
            paused: true
        }).setCallback("onComplete", () => this.time.delayedCall(textDelay, () => playTween(tweenList, tweensPlayed++)));

        let text4 = this.add.text(960, 620, "Freddy’s little brother Frankie suggested that the Lilac City theme song be put on speaker to match the creepy atmosphere.")
            .setFontFamily('Serif')
            .setFontSize(40)
            .setAlign('center')
            .setOrigin(0.5, 0)
            .setWordWrapWidth(1000);
        
        this.tweens.add({
            targets: text4,
            alpha: {start: 0, to: 1},
            duration: 600,
            paused: true
        }).setCallback("onStart", () => this.time.delayedCall(800, () => {
            bgm.play();
            this.time.delayedCall(textDelay - 800, () => playTween(tweenList, tweensPlayed++));
        }));

        this.tweens.add({
            targets: [text1, text2, text3, text4],
            alpha: {from: 1, to: 0},
            duration: 1800,
            paused: true
        }).setCallback("onComplete", () => this.time.delayedCall(textDelay, () => playTween(tweenList, tweensPlayed++)));

        let text5 = this.add.text(960, 200, "Immediately regretting his suggestion, little Frankie bursted into tears and sobbed frantically.")
            .setFontFamily('Serif')
            .setFontSize(40)
            .setAlign('center')
            .setOrigin(0.5, 0)
            .setWordWrapWidth(1000);

        this.tweens.add({
            targets: text5,
            alpha: {start: 0, to: 1},
            duration: 600,
            paused: true
        }).setCallback("onComplete", () => this.time.delayedCall(textDelay, () => playTween(tweenList, tweensPlayed++)));

        let text6 = this.add.text(960, 320, "\“Everything will be alright, I\’m right here with you,\” said Freddy as he held Frankie until he calmed down.")
            .setFontFamily('Serif')
            .setFontSize(40)
            .setAlign('center')
            .setOrigin(0.5, 0)
            .setWordWrapWidth(1000);

        this.tweens.add({
            targets: text6,
            alpha: {start: 0, to: 1},
            duration: 600,
            paused: true
        }).setCallback("onComplete", () => this.time.delayedCall(textDelay, () => playTween(tweenList, tweensPlayed++)));

        let text7 = this.add.text(960, 480, "Unfortunately for them, something was out of place...")
            .setFontFamily('Serif')
            .setFontSize(60)
            .setColor("#fc0000")
            .setAlign('center')
            .setOrigin(0.5, 0)
            .setWordWrapWidth(1000);
        
        this.tweens.add({
            targets: text7,
            alpha: {start: 0, to: 1},
            duration: 600,
            paused: true
        }).setCallback("onComplete", () => {
            this.time.delayedCall(1000, () => {
                this.cameras.main.fadeOut(1200, 0, 0, 0, (c, t) => {
                    if (t >= 1) this.scene.start('adv1', {});
                })
            })
        });

        tweenList = this.tweens.getTweens();
        let playTween = function(tweenList, tweenNumber) {
            tweenList[tweenNumber].play();
        }

        let skipButton = this.add.text(1800, 840, "SKIP").setFontSize(36).setOrigin(0.5).setInteractive()
            .on('pointerdown', () => this.scene.start('adv1', {}));

        this.tweens.add({
            targets: skipButton,
            alpha: 0.25,
            yoyo: true,
            duration: 800,
            repeat: -1
        });

        playTween(tweenList, tweensPlayed++);
    }
}

class GoodA extends Phaser.Scene {
    constructor() {
        super('goodEndA');
    }

    create() {
        EndSceneSetup(this, 'Good', 'A');
    }
}

class GoodB extends Phaser.Scene {
    constructor() {
        super('goodEndB');
    }

    create() {
        EndSceneSetup(this, 'Good', 'B');
    }
}

class GoodC extends Phaser.Scene {
    constructor() {
        super('goodEndC');
    }

    create() {
        EndSceneSetup(this, 'Good', 'C');
    }
}

class BadA extends Phaser.Scene {
    constructor() {
        super('badEndA');
    }

    create() {
        EndSceneSetup(this, 'Bad', 'A');
    }
}

class BadB extends Phaser.Scene {
    constructor() {
        super('badEndB');
    }

    create() {
        EndSceneSetup(this, 'Bad', 'B');
    }
}

class BadC extends Phaser.Scene {
    constructor() {
        super('badEndC');
    }

    create() {
        EndSceneSetup(this, 'Bad', 'C');
    }
}

EndSceneSetup = function(target, type, variation) {
    let jsonData = target.cache.json.get('endData');
    let endData = jsonData[type][variation];
    let tweenList;
    target.tweensPlayed = 0;

    let headerColor = (type == "Good") ? "#7cd67c" : "#c21010";
    target.add.text(80, 160, `${type} Ending ${variation}:`).setOrigin(0, 0.5).setColor(headerColor)
        .setFontFamily('Serif')
        .setFontSize(70);

    target.add.text(600, 160, endData.endingName).setOrigin(0, 0.5).setColor("#fcfcfc")
        .setFontFamily('Serif')
        .setFontSize(70);

    for (let line of endData.bodyTextLines) {
        let textLine = target.add.text(960, line.y, line.text).setOrigin(0.5).setColor("#ececec")
            .setFontFamily('Serif')
            .setFontSize(40)
            .setAlign('center')
            .setWordWrapWidth(1000);
        
        target.tweens.add({
            targets: textLine,
            alpha: {start: 0, to: 1},
            duration: 600,
            paused: true
        }).setCallback('onComplete', () => target.time.delayedCall(800, () => {
            playTween(tweenList, target.tweensPlayed++);
        }));
    }

    let quitButton = target.add.rectangle(500, 940, 480, 120, 0xffffff).setInteractive();
    quitButton.on('pointerover', () => quitButton.setFillStyle(0xaaaaaa));
    quitButton.on('pointerout', () => quitButton.setFillStyle(0xffffff));
    quitButton.on('pointerdown', () => target.cameras.main.fadeOut(1000, 0, 0, 0, (c, t) => {
        if (t >= 1) target.scene.start('title');
    }));
    let quitText = target.add.text(500, 940, "Quit").setOrigin(0.5).setColor("0").setFontSize(40);

    let restartButton = target.add.rectangle(1360, 940, 480, 120, 0xffffff).setInteractive();
    restartButton.on('pointerover', () => restartButton.setFillStyle(0xaaaaaa));
    restartButton.on('pointerout', () => restartButton.setFillStyle(0xffffff));
    restartButton.on('pointerdown', () => target.cameras.main.fadeOut(1000, 0, 0, 0, (c, t) => {
        if (t >= 1) target.scene.start('adv1', {});
    }));
    let restartText = target.add.text(1360, 940, "Restart").setOrigin(0.5).setColor("0").setFontSize(40);

    target.tweens.add({
        targets: [quitButton, quitText, restartButton, restartText],
        alpha: {start: 0, to: 1},
        duration: 600,
        paused: true
    });

    tweenList = target.tweens.getTweens();
    let playTween = function(tweenList, tweenNumber) {
        tweenList[tweenNumber].play();
    }

    playTween(tweenList, target.tweensPlayed++);
}

const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    scene: [
        Intro,
        Splash,
        Title,
        Exposition,
        MainHall,
        Bedroom,
        IdolRoom,
        Outside,
        GoodA,
        GoodB,
        GoodC,
        BadA,
        BadB,
        BadC
    ],
    title: "Adventure Game",
});


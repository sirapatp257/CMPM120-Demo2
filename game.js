class MainHall extends AdventureScene {
    constructor() {
        super("adv1", "Main Hall");
    }

    onEnter() {
        this.basicSetup();
    }
}

class Bedroom extends AdventureScene {
    constructor() {
        super("adv2", "Freddy's Bedroom");
    }

    onEnter() {
        this.basicSetup();
    }
}

class IdolRoom extends AdventureScene {
    constructor() {
        super("adv3", "Idol Room");
    }

    onEnter() {
        this.basicSetup();
    }
}

class Outside extends AdventureScene {
    constructor() {
        super("adv4", "Outside Freddy's");
    }

    onEnter() {
        this.basicSetup();
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
    }

    create() {
        this.scene.start('adv2');
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
        }).setCallback("onComplete", () => this.time.delayedCall(textDelay, () => this.playTween(tweenList, tweensPlayed++)));

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
            this.time.delayedCall(textDelay - 500, () => this.playTween(tweenList, tweensPlayed++));
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
        }).setCallback("onComplete", () => this.time.delayedCall(textDelay, () => this.playTween(tweenList, tweensPlayed++)));

        let text4 = this.add.text(960, 620, "Freddy\’s little brother Frankie suggested that the Lilac City theme song be put on speaker to match the creepy atmosphere.")
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
            this.time.delayedCall(textDelay - 800, () => this.playTween(tweenList, tweensPlayed++));
        }));

        this.tweens.add({
            targets: [text1, text2, text3, text4],
            alpha: {from: 1, to: 0},
            duration: 1800,
            paused: true
        }).setCallback("onComplete", () => this.time.delayedCall(textDelay, () => this.playTween(tweenList, tweensPlayed++)));

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
        }).setCallback("onComplete", () => this.time.delayedCall(textDelay, () => this.playTween(tweenList, tweensPlayed++)));

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
        }).setCallback("onComplete", () => this.time.delayedCall(textDelay, () => this.playTween(tweenList, tweensPlayed++)));

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
                    if (t >= 1) this.scene.start('adv1');
                })
            })
        });

        tweenList = this.tweens.getTweens();
        this.playTween(tweenList, tweensPlayed++);
    }

    playTween(tweenList, tweenNumber) {
        tweenList[tweenNumber].play();
    }
}

class Outro extends Phaser.Scene {
    constructor() {
        super('outro');
    }
    create() {
        this.add.text(50, 50, "That's all!").setFontSize(50);
        this.add.text(50, 100, "Click anywhere to restart.").setFontSize(20);
        this.input.on('pointerdown', () => this.scene.start('intro'));
    }
}


const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    scene: [Intro, Splash, Title, Exposition, MainHall, Bedroom],
    title: "Adventure Game",
});


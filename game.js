class Demo1 extends AdventureScene {
    constructor() {
        super("demo1", "First Room");
    }

    onEnter() {

        let clip = this.add.text(this.w * 0.3, this.w * 0.3, "📎 paperclip")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => this.showMessage("Metal, bent."))
            .on('pointerdown', () => {
                this.showMessage("No touching!");
                this.tweens.add({
                    targets: clip,
                    x: '+=' + this.s,
                    repeat: 2,
                    yoyo: true,
                    ease: 'Sine.inOut',
                    duration: 100
                });
            });

        let key = this.add.text(this.w * 0.5, this.w * 0.1, "🔑 key")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage("It's a nice key.")
            })
            .on('pointerdown', () => {
                this.showMessage("You pick up the key.");
                this.gainItem('key');
                this.tweens.add({
                    targets: key,
                    y: `-=${2 * this.s}`,
                    alpha: { from: 1, to: 0 },
                    duration: 500,
                    onComplete: () => key.destroy()
                });
            })

        let door = this.add.text(this.w * 0.1, this.w * 0.15, "🚪 locked door")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                if (this.hasItem("key")) {
                    this.showMessage("You've got the key for this door.");
                } else {
                    this.showMessage("It's locked. Can you find a key?");
                }
            })
            .on('pointerdown', () => {
                if (this.hasItem("key")) {
                    this.loseItem("key");
                    this.showMessage("*squeak*");
                    door.setText("🚪 unlocked door");
                    this.gotoScene('demo2');
                }
            })

    }
}

class Demo2 extends AdventureScene {
    constructor() {
        super("demo2", "The second room has a long name (it truly does).");
    }
    onEnter() {
        this.add.text(this.w * 0.3, this.w * 0.4, "just go back")
            .setFontSize(this.s * 2)
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage("You've got no other choice, really.");
            })
            .on('pointerdown', () => {
                this.gotoScene('demo1');
            });

        let finish = this.add.text(this.w * 0.6, this.w * 0.2, '(finish the game)')
            .setInteractive()
            .on('pointerover', () => {
                this.showMessage('*giggles*');
                this.tweens.add({
                    targets: finish,
                    x: this.s + (this.h - 2 * this.s) * Math.random(),
                    y: this.s + (this.h - 2 * this.s) * Math.random(),
                    ease: 'Sine.inOut',
                    duration: 500
                });
            })
            .on('pointerdown', () => this.gotoScene('outro'));
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
        this.load.audio("hum", "sounds/hum-edited.wav");
        this.load.audio("boom", "sounds/Explosion6.wav");
        this.load.audio("bgm", "sounds/LilacCity.wav");
    }

    create() {
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
                if (t >= 1) this.scene.start('exposition');
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
                    if (t >= 1) this.scene.start('demo1');
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
    scene: [Intro, Splash, Title, Exposition, Demo1],
    title: "Adventure Game",
});


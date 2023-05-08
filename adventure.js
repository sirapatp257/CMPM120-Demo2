class AdventureScene extends Phaser.Scene {

    init(data) {
        this.inventory = data.inventory || [];
        this.leftMainHall = data.leftMainHall || false;
        this.picUpright = data.picUpright || false;
    }

    constructor(key, name) {
        super(key);
        this.name = name;
    }

    create() {
        this.transitionDuration = 1000;

        this.w = this.game.config.width;
        this.h = this.game.config.height;
        this.s = this.game.config.width * 0.01;

        this.cameras.main.setBackgroundColor('#444');
        this.cameras.main.fadeIn(this.transitionDuration, 0, 0, 0);

        this.add.rectangle(this.w * 0.75, 0, this.w * 0.25, this.h).setOrigin(0, 0).setFillStyle(0);
        this.add.text(this.w * 0.75 + this.s, this.s)
            .setText(this.name)
            .setStyle({ fontSize: `${3 * this.s}px` })
            .setWordWrapWidth(this.w * 0.25 - 2 * this.s);
        
        this.messageBox = this.add.text(this.w * 0.75 + this.s, this.h * 0.33)
            .setStyle({ fontSize: `${2 * this.s}px`, color: '#eea' })
            .setWordWrapWidth(this.w * 0.25 - 2 * this.s);

        this.inventoryBanner = this.add.text(this.w * 0.75 + this.s, this.h * 0.66)
            .setStyle({ fontSize: `${2 * this.s}px` })
            .setText("Inventory")
            .setAlpha(0);

        this.inventoryTexts = [];
        this.updateInventory();

        this.add.text(this.w-3*this.s, this.h-3*this.s, "📺")
            .setStyle({ fontSize: `${2 * this.s}px` })
            .setInteractive({useHandCursor: true})
            .on('pointerover', () => this.showMessage('Fullscreen?'))
            .on('pointerdown', () => {
                if (this.scale.isFullscreen) {
                    this.scale.stopFullscreen();
                } else {
                    this.scale.startFullscreen();
                }
            });

        this.onEnter();

    }

    showMessage(message) {
        this.messageBox.setText(message);
        this.tweens.add({
            targets: this.messageBox,
            alpha: { from: 1, to: 0 },
            easing: 'Quintic.in',
            duration: 4 * this.transitionDuration
        });
    }

    updateInventory() {
        if (this.inventory.length > 0) {
            this.tweens.add({
                targets: this.inventoryBanner,
                alpha: 1,
                duration: this.transitionDuration
            });
        } else {
            this.tweens.add({
                targets: this.inventoryBanner,
                alpha: 0,
                duration: this.transitionDuration
            });
        }
        if (this.inventoryTexts) {
            this.inventoryTexts.forEach((t) => t.destroy());
        }
        this.inventoryTexts = [];
        let h = this.h * 0.66 + 3 * this.s;
        this.inventory.forEach((e, i) => {
            let text = this.add.text(this.w * 0.75 + 2 * this.s, h, e)
                .setStyle({ fontSize: `${1.5 * this.s}px` })
                .setWordWrapWidth(this.w * 0.75 + 4 * this.s);
            h += text.height + this.s;
            this.inventoryTexts.push(text);
        });
    }

    hasItem(item) {
        return this.inventory.includes(item);
    }

    gainItem(item) {
        if (this.inventory.includes(item)) {
            console.warn('gaining item already held:', item);
            return;
        }
        this.inventory.push(item);
        this.updateInventory();
        for (let text of this.inventoryTexts) {
            if (text.text == item) {
                this.tweens.add({
                    targets: text,
                    x: { from: text.x - 20, to: text.x },
                    alpha: { from: 0, to: 1 },
                    ease: 'Cubic.out',
                    duration: this.transitionDuration
                });
            }
        }
    }

    loseItem(item) {
        if (!this.inventory.includes(item)) {
            console.warn('losing item not held:', item);
            return;
        }
        for (let text of this.inventoryTexts) {
            if (text.text == item) {
                this.tweens.add({
                    targets: text,
                    x: { from: text.x, to: text.x + 20 },
                    alpha: { from: 1, to: 0 },
                    ease: 'Cubic.in',
                    duration: this.transitionDuration
                });
            }
        }
        this.time.delayedCall(500, () => {
            this.inventory = this.inventory.filter((e) => e != item);
            this.updateInventory();
        });
    }

    gotoScene(key) {
        this.cameras.main.fade(this.transitionDuration, 0, 0, 0);
        this.time.delayedCall(this.transitionDuration, () => {
            this.scene.start(key, { 
                inventory: this.inventory,
                leftMainHall: this.leftMainHall,
                picUpright: this.picUpright
            });
        });
    }

    onEnter() {
        console.warn('This AdventureScene did not implement onEnter():', this.constructor.name);
    }

    pickupItem(itemName) {
        this.gainItem(itemName);

        let item = this.items[itemName];
        this.tweens.add({
            targets: this.items[itemName],
            y: item.y - 50,
            alpha: 0,
            duration: 500
        }).setCallback("onComplete", () => item.disableInteractive());
    }

    putDownItem(itemName) {
        let sceneDataJSON = this.cache.json.get('sceneData');
        let sceneData = sceneDataJSON[this.constructor.name];
        let originalY;

        for (let entry of sceneData.items) {
            if (entry.name == itemName) {
                originalY = entry.y;
                break;
            }
        }

        let item = this.items[itemName];
        this.tweens.add({
            targets: this.items[itemName],
            y: {start: originalY - 50, to: originalY},
            alpha: 1,
            duration: 500
        }).setCallback("onComplete", () => item.setInteractive());
    }

    setPointerMessage(item, msg) {
        item.on('pointerover', () => {
            this.showMessage(msg);
        });
    }

    pickupRefresh() {
        // Function prototype -- in case things in the scene need to be updated after an item is picked up.
        console.warn("pickupRefresh() not implemented in this scene");
    }

    basicSetup() {
        let sceneDataJSON = this.cache.json.get('sceneData');
        let sceneData = sceneDataJSON[this.constructor.name];
        this.items = [];

        let bgName = sceneData.backgroundKey;
        this.add.image(720, 540, bgName).setOrigin(0.5).setScale(4.5);

        for (let item of sceneData.items) {
            let anchor = (item.anchor) ? item.anchor : {"x" : 0.5, "y" : 0.5};
            let angle = (item.angle) ? item.angle : 0;
            let scale = (item.scale) ? item.scale: 1;

            this.items[item.name] = this.add.sprite(item.x, item.y, item.spriteKey).setOrigin(anchor.x, anchor.y)
                .setAngle(angle)
                .setScale(scale)
                .setInteractive()
            
            if (item.idleAnim) {
                let tweenConfig = {targets: this.items[item.name]};
                for (let attribute in item.idleAnim) {
                    tweenConfig[attribute] = item.idleAnim[attribute];
                }
                this.tweens.add(tweenConfig);
            }

            if (item.pointeroverMsg) this.setPointerMessage(this.items[item.name], item.pointeroverMsg);

            if (item.pointerdownFX) {
                switch(item.pointerdownFX.type) {
                    case "advTransition" :
                        this.items[item.name].on('pointerdown', () => this.gotoScene(item.pointerdownFX.target));
                        break;
                    case "itemPickup" :
                        this.items[item.name].on('pointerdown', () => {
                            this.pickupItem(item.name);
                            this.pickupRefresh();
                            if (item.pointerdownFX.swapTarget) {
                                let swapTarget = item.pointerdownFX.swapTarget;
                                if (this.hasItem(swapTarget)) {
                                    this.loseItem(swapTarget);
                                    this.putDownItem(swapTarget);
                                }
                            }
                        });

                        if (this.hasItem(item.name)) {
                            this.items[item.name].setAlpha(0);
                            this.items[item.name].disableInteractive();
                        }
                        break;
                    case "decoy":
                        this.items[item.name].on('pointerdown', () => {
                            this.items[item.name].disableInteractive();
                            this.tweens.add({
                                targets: this.items[item.name],
                                x: '+= 40',
                                ease: 'Sine.inOut',
                                yoyo: true,
                                duration: 200,
                                repeat: 1
                            }).setCallback('onComplete', () => {
                                this.items[item.name].setInteractive();
                            });

                            if (item.pointerdownFX.message) this.showMessage(item.pointerdownFX.message);
                        });
                        break;
                    default:
                        console.log("Effect type not supported: " + item.pointerdownFX.type);
                }
            }

            if (item.shine) this.items[item.name].postFX.addShine(item.shine[0], item.shine[1]);
        }
    }
}
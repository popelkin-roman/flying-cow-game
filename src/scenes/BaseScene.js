import Phaser from "phaser";

class BaseScene extends Phaser.Scene {
  constructor(key, config) {
    super(key);
    this.config = config;
    this.screenCenter = [config.width / 2, config.height / 2];
    this.fontSize = 34;
    this.lineHeight = 42;
    this.fontOption = {
      fontSize: `${this.fontSize}px`,
      fill: "#129",
      fontStyle: "bold",
    };
  }

  create() {
    // this.scale.displaySize.setAspectRatio(1080);
    this.scale.refresh();
    this.createBg(this.config.height);
    const soundButtonOn = this.add
      .image(this.config.width - 10, 50, "soundOn")
      .setOrigin(1)
      .setInteractive();
    const soundButtonOff = this.add
      .image(this.config.width - 10, 50, "soundOff")
      .setOrigin(1)
      .setInteractive();
    soundButtonOff.visible = false;
    if (this.game.sound.mute) {
      soundButtonOff.visible = true;
      soundButtonOn.visible = false;
    }
    soundButtonOn.on("pointerup", () => {
      this.game.sound.mute = true;
      soundButtonOff.visible = true;
      soundButtonOn.visible = false;
    });
    soundButtonOff.on("pointerup", () => {
      this.game.sound.mute = false;
      soundButtonOff.visible = false;
      soundButtonOn.visible = true;
    });

    if (this.config.canGoBack) {
      const backButton = this.add
        .image(this.config.width - 20, this.config.height - 20, "back")
        .setOrigin(0.5)
        .setScale(2)
        .setInteractive();

      backButton.on("pointerup", () => {
        this.scene.start("MenuScene");
      });
    }
  }

  createMenu(menu, setupMenuEvents) {
    let lastMenuPositionY = 0;
    menu.forEach((menuItem) => {
      const menuPosition = [
        this.screenCenter[0],
        this.screenCenter[1] + lastMenuPositionY,
      ];
      menuItem.textGameObject = this.add
        .text(...menuPosition, menuItem.text, this.fontOption)
        .setOrigin(0.5, 1);
      lastMenuPositionY += this.lineHeight;
      setupMenuEvents(menuItem);
    });
  }

  createBg(height) {
    this.add.image(0, height, "bg").setOrigin(0, 1);
  }
}

export default BaseScene;

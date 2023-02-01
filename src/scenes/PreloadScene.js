import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
  constructor(config) {
    super("PreloadScene");
  }

  preload() {
    this.load.image("bg", "assets/bg.png");
    this.load.spritesheet("cow", "assets/cow.png", {
      frameWidth: 190,
      frameHeight: 104,
    });
    this.load.image("pitchfork", "assets/pitchfork.png");
    this.load.image("pause", "assets/pause.png");
    this.load.image("back", "assets/back.png");
    this.load.image("soundOn", "assets/soundOn.png");
    this.load.image("soundOff", "assets/soundOff.png");
    this.load.image("spark0", "assets/red.png");
    this.load.image("spark1", "assets/muzzleflash4.png");

    this.load.audio("theme", "assets/theme.mp3");
    this.load.audio("moo", "assets/moo.mp3");
  }

  create() {
    this.scene.start("MenuScene");
  }

  update() {}
}

export default PreloadScene;

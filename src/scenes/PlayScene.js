import BaseScene from "./BaseScene";

const PITCHFORKS_TO_RENDER = 4;

class PlayScene extends BaseScene {
  constructor(config) {
    super("PlayScene", config);
    this.cow = null;
    this.pitchforks = null;

    this.horizontalDistance = 0;
    this.horizontalDistanceRange = [350, 400];
    this.flapVelocity = 250;
    this.pitchforkVelocity = -200;
    this.score = 1000;
    this.scoreText = 1000;
    this.isPaused = false;
  }

  create() {
    this.pitchforkVelocity = -200;
    super.create();
    this.createCow();
    this.createPitchforks();
    this.createColliders();
    this.handleInputs();
    this.createScore();
    this.createPause();
    this.listenToEvents();
    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("cow", { start: 0, end: 4 }),
      frameRate: 8,
      repeat: -1,
    });
    this.cow.play("fly");
    this.playBgMusic();
  }

  update() {
    this.checkGameStatus();
    this.recyclePitchforks();
  }

  listenToEvents() {
    if (this.pauseEvent) return;
    this.pauseEvent = this.events.on("resume", () => {
      this.initialTime = 3;
      this.countDownText = this.add.text(
        ...this.screenCenter,
        `${this.initialTime}`,
        this.fontOption
      );
      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        callbackScope: this,
        loop: true,
      });
    });
  }

  countDown() {
    this.isPaused = false;
    this.initialTime--;
    this.countDownText.setText(`${this.initialTime}`);
    if (this.initialTime <= 0) {
      this.countDownText.setText("");
      this.physics.resume();
      this.timedEvent.remove();
    }
  }

  createBg() {
    this.add.image(0, 0, "bg").setOrigin(0);
  }

  createCow() {
    this.cow = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "cow")
      .setScale(0.8)
      .setOrigin(0.5);
    this.cow.setBodySize(this.cow.width - 150, this.cow.height - 60);
    this.cow.body.gravity.y = 400;
    this.cow.setCollideWorldBounds(true);
  }

  createPitchforks() {
    this.pitchforks = this.physics.add.group();

    for (let i = 0; i < PITCHFORKS_TO_RENDER; i++) {
      let pitchfork = this.pitchforks
        .create(0, 0, "pitchfork")
        .setImmovable(true)
        .setOrigin(0, 1);
      this.drawPitchfork(pitchfork);
    }

    this.pitchforks.setVelocityX(this.pitchforkVelocity);
  }

  createColliders() {
    this.physics.add.collider(
      this.cow,
      this.pitchforks,
      this.gameOver,
      null,
      this
    );
  }

  handleInputs() {
    this.input.on("pointerdown", this.flap, this);
    this.input.keyboard.on("keydown_SPACE", this.flap, this);
  }

  createScore() {
    this.score = 1000;
    const bestScore = localStorage.getItem("bestScore");
    this.scoreText = this.add.text(16, 16, `До финиша: ${1000}`, {
      fontSize: "32px",
      fill: "#129",
      fontStyle: "bold",
    });
    this.add.text(16, 50, `Рекорд: ${bestScore || 1000}`, {
      fontSize: "24px",
      fill: "#129",
      fontStyle: "bold",
    });
  }

  createPause() {
    this.isPaused = false;
    const pauseButton = this.add
      .image(this.config.width - 10, this.config.height - 10, "pause")
      .setInteractive()
      .setScale(3)
      .setOrigin(1);

    pauseButton.on("pointerdown", () => {
      this.isPaused = true;
      this.physics.pause();
      this.scene.pause();
      this.scene.launch("PauseScene");
    });
  }

  checkGameStatus() {
    if (
      this.cow.getBounds().bottom >= this.config.height + 20 ||
      this.cow.getBounds().top + 20 <= 0
    ) {
      this.gameOver();
    }
  }

  drawPitchfork(pitch) {
    // const difficulty = this.difficulties[this.currentDifficulty];
    let rightMostX = this.getRightMostPitchfork();
    let horizontalDistance = Phaser.Math.Between(
      // ...difficulty.horizontalDistanceRange
      ...this.horizontalDistanceRange
    );
    let verticalPosition = Phaser.Math.Between(0, 800);
    pitch.x = rightMostX + horizontalDistance;
    pitch.y = verticalPosition;
  }

  recyclePitchforks() {
    this.pitchforks.getChildren().forEach((pitch) => {
      if (pitch.getBounds().right < 0) {
        this.drawPitchfork(pitch);
        this.increaseScore();
        this.saveBestScore();
        this.increaseDifficulty();
        this.checkEnd();
      }
    });
  }

  increaseDifficulty() {
    if (this.score % 50 === 0) {
      this.pitchforkVelocity -= 10;
      this.pitchforks.setVelocityX(this.pitchforkVelocity);
    }
  }

  checkEnd() {
    if (this.score === 0) {
      this.isPaused = true;
      this.physics.pause();
      this.scene.pause();
      this.scene.launch("WinScene");
    }
  }

  getRightMostPitchfork() {
    let rightMostX = 0;
    this.pitchforks.getChildren().forEach((pitch) => {
      rightMostX = Math.max(pitch.x, rightMostX);
    });
    return rightMostX;
  }

  saveBestScore() {
    const bestScoreText = localStorage.getItem("bestScore");
    const bestScore = bestScoreText && parseInt(bestScoreText, 10);

    if (!bestScore || this.score < bestScore) {
      localStorage.setItem("bestScore", this.score);
    }
  }
  gameOver() {
    this.sound.add("moo", { volume: 0.7 }).play();
    this.physics.pause();
    this.cow.setTint(0xff0000);

    this.saveBestScore();

    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
      },
      loop: false,
    });
  }

  flap() {
    if (this.isPaused) return;
    this.cow.body.velocity.y = -this.flapVelocity;
  }

  increaseScore() {
    this.score--;
    this.scoreText.setText(`До финиша: ${this.score}`);
  }

  playBgMusic() {
    if (this.sound.get("theme")) return;
    this.sound.add("theme", { loop: true, volume: 0.5 }).play();
  }
}

export default PlayScene;

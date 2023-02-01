import BaseScene from "./BaseScene";

class WinScene extends BaseScene {
  constructor(config) {
    super("WinScene", config);

    this.menu = [
      { scene: "PlayScene", text: "Ещё раз" },
      { scene: "ScoreScene", text: "Чемпионы" },
    ];
  }

  create() {
    super.create();
    this.createFireworks();
    this.createWinnerWord();
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
  }

  setupMenuEvents(menuItem) {
    const textGameObject = menuItem.textGameObject;
    textGameObject.setInteractive();

    textGameObject.on("pointerover", () => {
      textGameObject.setStyle({ fill: "#ff0" });
    });

    textGameObject.on("pointerout", () => {
      textGameObject.setStyle({ fill: "#129" });
    });

    textGameObject.on("pointerup", () => {
      this.scene.stop("PlayScene");
      console.log(menuItem.scene);
      this.scene.start(menuItem.scene);
    });
  }

  createFireworks() {
    // let p0 = new Phaser.Math.Vector2(200, 500);
    // let p1 = new Phaser.Math.Vector2(200, 200);
    // let p2 = new Phaser.Math.Vector2(600, 200);
    // let p3 = new Phaser.Math.Vector2(600, 500);
    let p0 = new Phaser.Math.Vector2(0, this.screenCenter[1] - 50);
    let p1 = new Phaser.Math.Vector2(0, this.screenCenter[1] - 100);
    let p2 = new Phaser.Math.Vector2(
      this.config.width,
      this.screenCenter[1] - 100
    );
    let p3 = new Phaser.Math.Vector2(
      this.config.width,
      this.screenCenter[1] - 50
    );

    let curve = new Phaser.Curves.CubicBezier(p0, p1, p2, p3);

    let max = 28;
    let points = [];
    let tangents = [];

    for (let c = 0; c <= max; c++) {
      let t = curve.getUtoTmapping(c / max);

      points.push(curve.getPoint(t));
      tangents.push(curve.getTangent(t));
    }

    let tempVec = new Phaser.Math.Vector2();

    let spark0 = this.add.particles("spark0");
    let spark1 = this.add.particles("spark1");

    for (let i = 0; i < points.length; i++) {
      let p = points[i];

      tempVec.copy(tangents[i]).normalizeRightHand().scale(-32).add(p);

      let angle = Phaser.Math.RadToDeg(
        Phaser.Math.Angle.BetweenPoints(p, tempVec)
      );

      let particles = i % 2 === 0 ? spark0 : spark1;

      particles.createEmitter({
        x: tempVec.x,
        y: tempVec.y,
        angle: angle,
        speed: { min: -100, max: 500 },
        gravityY: 200,
        scale: { start: 0.4, end: 0.1 },
        lifespan: 800,
        blendMode: "NORMAL",
      });
    }
  }

  createWinnerWord() {
    this.add
      .text(this.config.width / 2, this.config.height / 2 - 80, `ПОБЕДА!!!`, {
        fontSize: "42px",
        fill: "#C03",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
  }
}

export default WinScene;

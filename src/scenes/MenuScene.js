import BaseScene from "./BaseScene";

class MenuScene extends BaseScene {
  constructor(config) {
    super("MenuScene", config);

    this.menu = [
      { scene: "PlayScene", text: "Играть" },
      { scene: "ScoreScene", text: "Чемпионы" },
      { scene: null, text: "Выход" },
    ];
  }

  create() {
    super.create();
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
      menuItem.scene && this.scene.start(menuItem.scene);
      if (menuItem.text === "Выход") {
        this.game.destroy(true);
      }
    });
  }
}

export default MenuScene;

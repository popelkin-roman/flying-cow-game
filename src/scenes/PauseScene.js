import BaseScene from "./BaseScene";

class PauseScene extends BaseScene {
  constructor(config) {
    super("PauseScene", config);

    this.menu = [
      { scene: "PlayScene", text: "Продолжить" },
      { scene: "MenuScene", text: "Выйти" },
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
      if (menuItem.scene && menuItem.text === "Продолжить") {
        this.scene.stop();
        this.scene.resume(menuItem.scene);
      } else {
        this.scene.stop("PlayScene");
        this.scene.start(menuItem.scene);
      }
    });
  }
}

export default PauseScene;

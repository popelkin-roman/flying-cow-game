import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";
import MenuScene from "./scenes/MenuScene";
import ScoreScene from "./scenes/ScoreScene";
import PreloadScene from "./scenes/PreloadScene";
import PauseScene from "./scenes/PauseScene";
import WinScene from "./scenes/WinScene";

const WIDTH = window.innerWidth < 800 ? window.innerWidth : 800;
const HEIGHT = window.innerHeight > 600 ? window.innerHeight : 600;
const COW_POSITION = { x: 80, y: HEIGHT / 2 };
const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: COW_POSITION,
};

const Scenes = [
  PreloadScene,
  MenuScene,
  ScoreScene,
  PlayScene,
  PauseScene,
  WinScene,
];
const createScene = (Scene) => new Scene(SHARED_CONFIG);
const initScenes = () => Scenes.map(createScene);

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
    },
  },
  scene: initScenes(),
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    minWidth: 600,
    maxWidth: 1024,
  },
};

let game = new Phaser.Game(config);

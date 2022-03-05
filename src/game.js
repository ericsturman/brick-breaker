import Paddle from "./paddle";
import InputHandler from "./input";
import Ball from "./ball";
import Brick from "./brick";
import { buildLevel, level1, level2 } from "./levels";

const GAMESTATE = {
  PAUSED: 0,
  RUNNING: 1,
  MENU: 2,
  GAMEOVER: 3,
  NEWLEVEL: 4
};

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.gameObjects = [];
    this.lives = 3;
    this.levels = [level1, level2];
    this.currentLevel = 0;
    this.bricks = [];
    this.gameState = GAMESTATE.MENU;
    this.paddle = new Paddle(this);
    this.ball = new Ball(this);

    new InputHandler(this.paddle, this);
  }

  start() {
    if (
      this.gameState !== GAMESTATE.MENU &&
      this.gameState !== GAMESTATE.NEWLEVEL
    )
      return;
    this.bricks = buildLevel(this, this.levels[this.currentLevel]);
    this.ball.reset();
    this.gameObjects = [this.paddle, this.ball];
    this.gameState = GAMESTATE.RUNNING;
  }

  togglePause() {
    if (this.gameState === GAMESTATE.PAUSED) {
      this.gameState = GAMESTATE.RUNNING;
    } else {
      this.gameState = GAMESTATE.PAUSED;
    }
  }

  update(deltaTime) {
    if (this.lives === 0) this.gameState = GAMESTATE.GAMEOVER;

    if (
      this.gameState === GAMESTATE.PAUSED ||
      this.gameState === GAMESTATE.GAMEOVER ||
      this.gameState === GAMESTATE.MENU
    ) {
      return;
    }
    if (this.bricks.length === 0) {
      this.currentLevel++;
      this.gameState = GAMESTATE.NEWLEVEL;
      this.start();
    }

    [...this.gameObjects, ...this.bricks].forEach((element) => {
      element.update(deltaTime);
    });
    this.bricks = this.bricks.filter((obj) => !obj.markedForDeletion);
  }
  draw(ctx) {
    [...this.gameObjects, ...this.bricks].forEach((element) => {
      element.draw(ctx);
    });

    if (this.gameState === GAMESTATE.PAUSED) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fill();
      ctx.font = "30px Arial";
      ctx.fillStyle = "White";
      ctx.textAlign = "Center";
      ctx.fillText("Paused", this.gameWidth / 2, this.gameHeight / 2);
    }
    if (this.gameState === GAMESTATE.MENU) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fill();
      ctx.font = "30px Arial";
      ctx.fillStyle = "White";
      ctx.textAlign = "Center";
      ctx.fillText(
        "Press space bar to start...",
        this.gameWidth / 2,
        this.gameHeight / 2
      );
    }
    if (this.gameState === GAMESTATE.GAMEOVER) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fill();
      ctx.font = "50px Arial";
      ctx.fillStyle = "White";
      ctx.textAlign = "Center";
      ctx.fillText("GAME OVER", this.gameWidth / 2, this.gameHeight / 2);
    }
  }
}

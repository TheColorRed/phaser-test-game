declare global {
  interface Window {
    p2: any
    PIXI: any
    Phaser: Phaser
  }
}

import * as pixi from '../node_modules/phaser-ce/build/custom/pixi.js'
window.PIXI = pixi
import * as p2 from '../node_modules/phaser-ce/build/custom/p2.js'
window.p2 = p2
import * as Phaser from 'phaser-ce'
window.Phaser = Phaser
import { Game, Group, Sprite, Rope } from 'phaser-ce'

class SimpleGame {

  protected game: Game
  protected platforms: Group
  protected stars: Group
  protected player: Sprite

  constructor(width: number, height: number) {
    this.game = new Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update })
  }

  preload() {
    this.game.load.image('sky', 'assets/sky.png')
    this.game.load.image('ground', 'assets/platform.png')
    this.game.load.image('star', 'assets/star.png')
    this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48)
  }

  create() {
    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    this.game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    this.platforms = this.game.add.group();

    //  We will enable physics for any object that is created in this group
    this.platforms.enableBody = true;

    // Here we create the ground.
    var ground = this.platforms.create(0, this.game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = this.platforms.create(400, 400, 'ground');

    ledge.body.immovable = true;

    ledge = this.platforms.create(-150, 250, 'ground');

    ledge.body.immovable = true;

    // The player and its settings
    this.player = this.game.add.sprite(32, this.game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    this.game.physics.arcade.enable(this.player);

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.body.bounce.y = 0.2;
    this.player.body.gravity.y = 300;
    this.player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);

    this.stars = this.game.add.group();

    this.stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++) {
      //  Create a star inside of the 'stars' group
      var star = this.stars.create(i * 70, 0, 'star');

      //  Let gravity do its thing
      star.body.gravity.y = 100;

      //  This just gives each star a slightly random bounce value
      star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }
  }

  collectStar(player: Rope, star: Rope) {
    star.kill()
  }

  update() {
    let hitPlatform = this.game.physics.arcade.collide(this.player, this.platforms);

    let cursors = this.game.input.keyboard.createCursorKeys();

    //  Reset the players velocity (movement)
    this.player.body.velocity.x = 0;

    if (cursors.left.isDown) {
      //  Move to the left
      this.player.body.velocity.x = -150;

      this.player.animations.play('left');
    } else if (cursors.right.isDown) {
      //  Move to the right
      this.player.body.velocity.x = 150;

      this.player.animations.play('right');
    } else {
      //  Stand still
      this.player.animations.stop();

      this.player.frame = 4;
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && this.player.body.touching.down && hitPlatform) {
      this.player.body.velocity.y = -350;
    }

    this.game.physics.arcade.collide(this.stars, this.platforms);
    this.game.physics.arcade.overlap(this.player, this.stars, this.collectStar.bind(this), undefined, this);
  }

}

document.addEventListener('DOMContentLoaded', e => {
  new SimpleGame(800, 600)
})
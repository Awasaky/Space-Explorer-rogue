var spaceExplorer = spaceExplorer || {};

spaceExplorer.Preload = function(){};

spaceExplorer.Preload.prototype = {
  preload : function(){
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.load.setPreloadSprite(this.preloadBar);

    //Грузим арт
    this.load.image('space', 'assets/space.png');
    this.load.image('rock', 'assets/rock.png');
    this.load.spritesheet('playership', 'assets/ship.png', 12, 12);
    this.load.spritesheet('bonus', 'assets/bonus.png', 12, 12);
    this.load.spritesheet('power', 'assets/power.png', 12, 12);
  },

  create : function(){
    this.state.start('Game');
  }
};
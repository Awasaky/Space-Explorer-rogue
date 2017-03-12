var spaceExplorer = spaceExplorer || {};

spaceExplorer.Game = function(){};

spaceExplorer.Game.prototype = {
  shipMove : // поле для движения корабля по клику
    false,
  shipMaxPower :
    500,

  generatePowerups: function(minRange, maxRange) {
    var
      numPowerups = this.game.rnd.integerInRange(minRange, maxRange),
      powerup; // временный ярлык для элемента, в который копируется собираемый объект при создании,
    // используется в цикле расстановки
    this.powerups = this.game.add.group();
    this.powerups.enableBody = true;
    this.powerups.physicsBodyType = Phaser.Physics.ARCADE;
    
    // цикл расстановки собираемых объектов
    for (var i = 0; i < numPowerups; i++) {
      //add sprite
      powerup = this.powerups.create(this.game.world.randomX, this.game.world.randomY, 'power');
      powerup.animations.add('powerupfly', [0, 1, 2, 3, 4, 5], 5, true);
      powerup.animations.play('powerupfly');
    };

  },
  
  generateCollectables: function(minRange, maxRange) {
    var
      numCollectables = this.game.rnd.integerInRange(minRange, maxRange),
      collectable; // временный ярлык для элемента, в который копируется собираемый объект при создании,
    // используется в цикле расстановки

    this.collectables = this.game.add.group();
    this.collectables.enableBody = true;
    this.collectables.physicsBodyType = Phaser.Physics.ARCADE;
    
    // цикл расстановки собираемых объектов
    for (var i = 0; i < numCollectables; i++) {
      //add sprite
      collectable = this.collectables.create(this.game.world.randomX, this.game.world.randomY, 'bonus');
      collectable.animations.add('collectfly', [0, 1, 2, 3, 4], 5, true);
      collectable.animations.play('collectfly');
    };

  },

  showHud: function() {
    this.shipPower = this.shipMaxPower; // сила корабля
    this.playerScore = 0;

    var
      textScore = "Score: 0",
      textPower = "Power: " + this.shipPower,
      style = { font: "20px Arial", fill: "#fff", align: "center" };

    this.scoreLabel = this.game.add.text(this.game.width-150, this.game.height-30, textScore, style);
    this.scoreLabel.fixedToCamera = true;

    this.powerLabel = this.game.add.text(this.game.width-450, this.game.height-30, textPower, style);
    this.powerLabel.fixedToCamera = true;
  },

  generateAsteriods: function(speedAsteroid,sizeAsteroid) {
    var
      numAsteroids = this.game.rnd.integerInRange(150, 200),
      asteriod;

    this.asteroids = this.game.add.group();
    this.asteroids.enableBody = true;

    // цикл расстановки астероидов
    for (var i = 0; i < numAsteroids; i++) {
      asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
      asteriod.scale.setTo(this.game.rnd.integerInRange(5, sizeAsteroid)/10);

      //physics properties
      // назначается случайная скорость движения
      asteriod.body.velocity.x = this.game.rnd.integerInRange(-speedAsteroid, speedAsteroid);
      asteriod.body.velocity.y = this.game.rnd.integerInRange(-speedAsteroid, speedAsteroid);
      // на астероиды не способны повлиять другие объекты.
      asteriod.body.immovable = true;
      // Границы мира их останавливают
      asteriod.body.collideWorldBounds = true;
    }
  },

  upPower: function(player, powerUp) {
    this.shipPower = this.shipMaxPower;
    this.powerLabel.text = "Power: " + this.shipPower;

    //remove sprite
    powerUp.destroy();
  },

  downPower: function(player, powerUp) {
    this.shipPower -= 1;
    if (this.shipPower < 1 && this.player.alive) {
      this.noPower();
    };
    this.powerLabel.text = "Power: " + this.shipPower;
  },

  noPower: function(player, asteroid) {

    //make the player explode
    // создается эмиттер частиц на месте игрока
    var emitter = this.game.add.emitter(this.player.x, this.player.y, 100);
    emitter.makeParticles('bonus');
    emitter.minParticleSpeed.setTo(-100, -100);
    emitter.maxParticleSpeed.setTo(100, 100);
    emitter.gravity = 0;
    emitter.start(true, 1000, null, 100);

    // уничтожить игрока
    this.player.kill();
    this.game.time.events.add(3000, this.gameOver, this);
  },

  collect: function(player, collectable) {
    //update score
    this.playerScore += 100;
    this.scoreLabel.text = "Score: " + this.playerScore;

    //remove sprite
    collectable.destroy();
  },

  hitAsteroid: function(player, asteroid) {

    //make the player explode
    // создается эмиттер частиц на месте игрока
    var emitter = this.game.add.emitter(this.player.x, this.player.y, 100);
    emitter.makeParticles('power');
    emitter.minParticleSpeed.setTo(-100, -100);
    emitter.maxParticleSpeed.setTo(100, 100);
    emitter.gravity = 0;
    emitter.start(true, 1000, null, 100);

    // уничтожить игрока
    this.player.kill();
    this.game.time.events.add(3000, this.gameOver, this);
  },

  gameOver: function() {
    this.game.state.start('Game', true, false);
  },

  create : function(){
    this.playerScore = 0;
    this.playerPower = 100;

    this.game.world.setBounds(0, 0, 1920, 1920);
    this.background = this.game.add.tileSprite(0, 0, 1920, 1920, 'space');

    this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'playership');
    this.player.scale.setTo(2);
    this.player.animations.add('playerfly', [0, 1, 2, 3, 4], 5, true);
    this.player.animations.play('playerfly');

    this.game.physics.arcade.enable(this.player);
    this.playerSpeed = 120;
    this.player.body.collideWorldBounds = true;
    this.game.camera.follow(this.player);

    this.generatePowerups(40, 70); // топливные бонусы параметры - минимальное и макс число на карте
    this.generateCollectables(100, 150); // очковые бонусы параметры - минимальное и макс число на карте
    this.generateAsteriods(2, 20); // параметры - скорость и размер

    this.showHud();
  },

  update: function() {
    if (this.game.input.activePointer.justPressed()) {
      this.shipMove = true;
    };
    if (this.game.input.activePointer.justReleased()) {
      this.shipMove = false;
    };
    if (this.shipMove) {
      this.game.physics.arcade.moveToPointer(this.player, this.playerSpeed);
      this.downPower();
    } else {
      this.game.physics.arcade.moveToPointer(this.player, 0);
    };

    // Collectible overlap call hitAsteroid
    this.game.physics.arcade.overlap(this.player, this.powerups, this.upPower, null, this);

    // Collectible overlap call hitAsteroid
    this.game.physics.arcade.overlap(this.player, this.collectables, this.collect, null, this);

    // Asteroids collision call hitAsteroid
    this.game.physics.arcade.collide(this.player, this.asteroids, this.hitAsteroid, null, this);
  }
};
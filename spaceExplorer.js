var spaceExplorer = spaceExplorer || {};

spaceExplorer.game = new Phaser.Game(480, 320, Phaser.AUTO, '');

// Создание из пространства имен стейтов для игры
spaceExplorer.game.state.add('Boot', spaceExplorer.Boot);
spaceExplorer.game.state.add('Preload', spaceExplorer.Preload);
spaceExplorer.game.state.add('Game', spaceExplorer.Game);

// запуск стейта загрузки
spaceExplorer.game.state.start('Boot');
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fitness Games</title>
  <script src="https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.js"></script>
  <style>
    body {
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f0f0f0;
    }
    #game-container {
      width: 800px;
      height: 600px;
      border: 2px solid #333;
    }
  </style>
</head>
<body>

<div id="game-container"></div>

<script>
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: {
      preload: preload,
      create: create
    }
  };

  const game = new Phaser.Game(config);

  function preload() {
    this.load.image('background', 'assets/background.jpg');
  }

  function create() {
    this.add.image(400, 300, 'background');


    const button1 = this.add.text(400, 200, 'Fitness Game 1', { fill: '#0f0' }).setOrigin(0.5);
    const button2 = this.add.text(400, 300, 'Fitness Game 2', { fill: '#0f0' }).setOrigin(0.5);

    // Set button interactivity
    button1.setInteractive();
    button2.setInteractive();

    button1.on('pointerdown', () => {
      // Load and start Fitness Game 1
      this.scene.start('FitnessGame1');
    });
    button2.on('pointerdown', () => {
      // Load and start Fitness Game 2
      this.scene.start('FitnessGame2');
    });
  }
</script>

</body>
</html>

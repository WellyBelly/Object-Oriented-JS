const prompts = require('prompts');
let currentRoom = 0;
let continueGame = true;

// Creating all the classes and extended classes for the game

/* Class for rooms, including various functions and arrays for stored creatures
    and connections to other rooms. */
class Room {
  constructor(name, description, enteringDescription){
    this.name = name;
    this.description = description;
    this.enteringDescription = enteringDescription;
    this.connections = [];
    this.creatures = [];
    this.exit = false;
  }

  setConnections(connection){
    if(this.connections.length == 0){
      this.connections.splice(0, 1);
    }
    this.connections.push(connection);
  }

  setCreature(creature){
    if(this.creatures.length == 0){
      this.creatures.splice(0, 1);
    }
    this.creatures.push(creature);
  }

  deleteCreature(creature){
    let spliceIndex = this.creatures.indexOf(creature);
    this.creatures.splice(spliceIndex,1);
  }

  goToRoom(room){
    for(let i = 0; i < this.connections.length; i++) {
      if(this.connections[i] == room) {
        console.log(this.connections[i].enteringDescription);
        currentRoom = world.indexOf(room);
        if (this.connections[i].exit == true) {
          continueGame = false;
        }
      }
    }
  }

  getInfo() {
    console.log('---------------');
    console.log('You look around.')
    console.log(this.description + '\n');
    if (this.connections.length != 0) {
      console.log('From here you can go to:');
      for(let i = 0; i < this.connections.length; i++){
        console.log(this.connections[i].name);
      }
    }
    
    if(this.creatures.length != 0) {
      console.log('\nYou see following enemies in this room:')
      for(let i = 0; i < this.creatures.length; i++){
        console.log(this.creatures[i].name);
      }
    }
  }  
}

/* Creating a class for the exit (or potential exits)
    Same as Room but exit = true
      Methods and descriptions don't really matter bc the game ends once entered */
class Exit extends Room {
  constructor(name, description, enteringDescription) {
    super(name, description, enteringDescription);
    this.exit = true;
  }
}

// Creating the class for the player with attack method
class Player {
  constructor (name, hp, dmg, accuracy) {
    this.name = name,
    this.hp = hp,
    this.dmg = dmg,
    this.accuracy = accuracy
  }

  attack(target){
    let hitChance = Math.floor(Math.random() * 101);
    if(hitChance <= this.accuracy) {
      target.hp -= this.dmg;
      console.log('\nYou bravely attack the ' + target.name + '.\nYou made ' + this.dmg + ' points of damage! WOW!');
    } else {
      console.log('\nYou bravely attack the ' + target.name + '.\nAs you try to slay the ' + target.name + ' you slip and miss the attack...');
    }
    if (target.hp <= 0) {
      world[currentRoom].deleteCreature(target);
      console.log('As you take your stance after this mighty strike you watch the ' + target.name + ' tumble and fall! You have slain your enemy!');
    };
  }

}

/* Enemies are an extention of Player with it's own attack method
    (for clarity and different dialogue) */
class Enemy extends Player {
  constructor(name, hp, dmg, accuracy) {
    super(name, hp, dmg, accuracy);
  }
  attackPlayer(player){
    let hitChance = Math.floor(Math.random() * 101);
    if(hitChance <= this.accuracy) {
      player.hp -= this.dmg;
      console.log('\nThe ' + this.name + ' attacks you!\nThe attack hits! You loose ' + this.dmg + ' HP...');
      if(player.hp <= 0){
        console.log('=========================')
        console.log('Suddenly the world around you starts to spin. You feel a pain but you cannot locate where it is coming from.\nIn your last moment of consciousness you realize that you are laying on the floor...\ndefeated...\nYOU DIED.');
        console.log('===============')
        continueGame = false;
      } else {
        console.log('You have ' + player.hp + ' HP left.')
      }
    } else {
      console.log('\nThe ' + this.name + ' attacks you!\nThe attack misses!');
    }
  }
}


/* Creating the player object (this shouldn't be changed since it's a one player game
    attributes can be changed tho)  */
let player1 = new Player('Player 1', 10, 2, 75);

/* Creating the enemy objects (no limit to objects)
    Each enemy object should be placed in a room of choice */
let rat1 = new Enemy('Rat', 2, 1, 50);
let dragon1 = new Enemy('Dragon', 4, 8, 90);

// Creating the rooms for the game
let entrance = new Room('Dungeon entrance', 'You stand right before the entrance to the dungeon!\nYou see a dark and long stairway leading into the depths of the dungeon.\nBe careful!', 'You walk up the mossy stairs and are back at the entrance.');
let hallway = new Room('Hallway', 'The floor is dark and muddy, occasional torches light up bits and pieces of the Hallway.\nYou hear something move in the shadows, but you are not sure if it is only your imagination...', 'You enter the dark and eerie Hallway.');
let chamber = new Room('Chamber', "You are in a huge and grotesque room. You are not sure what it is,\nbut something about its shape and colors makes you feel unseasy.\nYou definitely don't want to stay here any longer than you have to", 'You walk through the ancient gate and enter the Chamber.')
let portal = new Exit('Portal', '', "As you set foot into the portal everything seems to shift. You cannot explain it,\nbut it feels like you are being pulled further and further away from the room behind you.\nYou close your eyes to blink and as you open them...\n!YOU WIN THE GAME!")

// Connecting the room objects
entrance.setConnections(hallway);
hallway.setConnections(entrance);
hallway.setConnections(chamber);
chamber.setConnections(hallway);
chamber.setConnections(portal);

// placing the enemy objects in the room objects
hallway.setCreature(rat1);
chamber.setCreature(dragon1);

// putting all the room objects in an array in order to keep track of which room the player is in
let world = [entrance, hallway, chamber, portal];


async function gameLoop() {
  console.log('\n---------------')
  // Set of UI options for the user to select
  const initialActionChoices = [
      { title: 'Look around', value: 'look around' },
      { title: 'Go to Room', value: 'go to' },
      { title: 'Attack', value: 'attack'},
      { title: 'Exit game', value: 'exit'}
  ];

  const response = await prompts({
    type: 'select',
    name: 'value',
    message: 'Choose your action',
    choices: initialActionChoices
  });

  // Deal with the selected value
  switch(response.value) {

    case 'look around':
      // Display the room description and hallways+enemies
      // Enemies attack when looking around
      console.log('You selected ' + response.value);
      world[currentRoom].getInfo()
      if(world[currentRoom].creatures.length != 0) {
        for (let i = 0; i < world[currentRoom].creatures.length; i++) {
          world[currentRoom].creatures[i].attackPlayer(player1)
        }
      }
      break;
    
    case 'go to':
      // New set of UI options with connecting rooms
      const roomChoices = new Array();
      for(let i= 0; i < world[currentRoom].connections.length; i ++) {
        roomChoices.push({title: world[currentRoom].connections[i].name, value: world[currentRoom].connections[i].name, roomObject: world[currentRoom].connections[i]})
      }
      roomChoices.push({title: 'Back', value: 'back'});

      const roomResponse = await prompts({
        type: 'select',
        name: 'value',
        message: 'Where do you want to go to?',
        choices: roomChoices
      });
      
      /* Dealing with the response value
          Possible to go back or go to room
            Enemies attack upon entering (if enemies in room) */
      for (let i = 0; i < roomChoices.length; i++) {
        if(roomResponse.value == 'back'){
          break;
        } else if(roomResponse.value == roomChoices[i].value) {
          world[currentRoom].goToRoom(roomChoices[i].roomObject)
          if(world[currentRoom].creatures.length != 0) {
            for (let i = 0; i < world[currentRoom].creatures.length; i++) {
              world[currentRoom].creatures[i].attackPlayer(player1)
            };
          };
          break;
        };
      };
      break;
    
    case 'attack':
      // New set of UI options with enemies which can be attacked
      const attackChoices = new Array();
      for (let i = 0; i < world[currentRoom].creatures.length; i ++) {
        if(world[currentRoom].creatures.length != 0){
          attackChoices.push({title: world[currentRoom].creatures[i].name, value: world[currentRoom].creatures[i].name, creatureObject: world[currentRoom].creatures[i]})
        }
      }
      attackChoices.push({title: 'Back', value: 'back'});

      const attackResponse = await prompts({
        type: 'select',
        name: 'value',
        message: 'Who do you want to attack?',
        choices: attackChoices 
      });

      /* Dealing with the response value
          Possible to go back or attack an enemy*/
      for (let i = 0; i < attackChoices.length; i++) {
        if(attackResponse.value == 'back'){
          console.log("You chose to lower your waepon... for now...");
          break;
        } else if(attackResponse.value == attackChoices[i].value) {
          player1.attack(attackChoices[i].creatureObject);
          break;
        }
      }
      break;
    
    case 'exit':
      // Ends the loop and exits the game
      continueGame = false;
      break;
  };
  
  if(continueGame) {
    gameLoop();
  };    
};

// clear screen on windows
process.stdout.write('\033c');

console.log('WELCOME TO THE DUNGEON OF LORD OBJECT ORIENTUS!')
console.log('===============================================')
console.log('You stand in front of the dungeon')
gameLoop();
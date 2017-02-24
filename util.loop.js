const Logger = require('class.logger');
const {
  everyTicks
} = require('util.helpers');

const runOrder = {
  logistics: 1,
  lorry: 2
};

// Prio to runOrder roles
const sortByRunOrder = function(a, b) {
  let aCreep = runOrder[a.memory.role] || 10;
  let bCreep = runOrder[b.memory.role] || 10;

  return aCreep - bCreep;
};

module.exports = {
  setup() {
    // Convert flags to an array
    this.flagsToArray();

    // TODO: Find a way to run it everyTicks (we can not save it in memory!)
    this.updateClaims();

    // If enemies are detected set flags
    // TODO: We can do it every 5 ticks
    everyTicks(2, () => this.setDefenseFlags());

    // Cleanup memory
    this.cleanup();
  },

  // Spawn
  spawn() {
    // Select all fully controlled rooms
    _
      .values(Game.rooms)
      .filter(room => room.controller.my == true)
      // Collect creeps population governed by the controller aka census
      .forEach((room) => room.controller.collectCreepsData())
      // Then we autoSpawnCreeps
      .forEach((room) => {
        room.controller.autoSpawnCreeps(this.claims, this.defendFlags);
      });
  },

  run() {
    // We sort the creeps by role via runOrder
    _
      .values(Game.creeps)
      .sort(sortByRunOrder)
      // TODO: Check if we need the if
      .forEach(function(creep) {
        if (creep) {
          creep.run();
        }
      });
  },

  defendAndRepair() {
    // Increase walls
    everyTicks(400, function() {
      for(let r in Game.rooms) {
        let room = Game.rooms[r];

        if(!room.memory.maxWallHits) {
          // set initial wall hits
          // TODO: Test - is this start scenario well adjusted
          if(room.isStronghold()) {
            room.memory.maxWallHits = 1000;
          }
        }
        // TODO: review 350000 limit
        else if(room.memory.maxWallHits < 350000) {
            room.memory.maxWallHits += 1000;
            Logger.log('Increased walls in ', room.name,' to:',  room.memory.maxWallHits);
        }
      }
    });

    _
      .toArray(Game.structures)
      .filter(s => s.structureType === STRUCTURE_TOWER)
      .forEach((tower) => {
        // TODO: WAR - Add war mode aka factor = 1
        // TODO: If the energy level is too low set to 0.25 or 0 (collect from rooms)
        tower.defend()
      });
  },

  // Helper
  flagsToArray() {
    this.flags = _.toArray(Game.flags);
  },

  // Claims are represented by BLUE flags
  // Returns Array of Flag
  updateClaims() {
    this.claims = this.flags.filter(f => f.color === COLOR_BLUE);
  },

  // Defense are represented by RED flags
  setDefenseFlags() {
    this.claims.forEach((flag) => {
      // console.log(JSON.stringify(flag.room));
      if (flag.room) {
        flag.pos.setDefenseFlag();
      }
    });

    this.defendFlags = this.flags.filter((f) => {
      return f.color === COLOR_RED && f.secondaryColor === COLOR_RED;
    });
  },

  cleanup() {
    Object
      .keys(Memory.creeps)
      .forEach((creep) => {
        if (!Game.creeps[creep]) {
          delete Memory.creeps[creep];
          // Logger.log('Clearing non-existing creep memory:', creep);
        }
      });
  }
};

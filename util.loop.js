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

    this.updateFlags();

    // If enemies are detected set flags
    // TODO: We can do it every 5 ticks
    everyTicks(2, () => this.setDefenseFlags());

    // Cleanup memory
    this.cleanup();
  },

  // Spawn
  spawn() {
    // Select all fully controlled rooms
    let controlledRooms = _
      .values(Game.rooms)
      .filter(room => room.controller.my == true)

    // Collect creeps population governed by the controller aka census
    controlledRooms.forEach((room) => {
        room.controller.collectCreepsData();
    });

    // Then we autoSpawnCreeps
    controlledRooms.forEach((room) => {
      room.controller.autoSpawnCreeps(
        this.claims, 
        this.defendFlags, 
        this.attackFlags
      );
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
    const time = 400;
    everyTicks(time, function() {
      for(let r in Game.rooms) {
        let room = Game.rooms[r];

        if(!room.memory.maxWallHits && room.isStronghold()) {
          // set initial wall hits
          // TODO: Test - is this start scenario well adjusted
          room.memory.maxWallHits = 1000;
        }
        else if(room.memory.maxWallHits < 3000000) {
            var oldLimit = room.memory.maxWallHits;
            const base = 1000;

            let walls = room.walls().length;

            // We increase the added value by controller level
            if(room.controller.level == 4) {
                let value = Math.floor((time / 4) / walls) * base;

                room.memory.maxWallHits += value;
            }
            else if(room.controller.level >= 5) {
                let value = Math.floor((time / 2) / walls) * base;

                room.memory.maxWallHits += value;
            } else {
              // Level 1 - 3
              room.memory.maxWallHits += base;
            }

            Logger.log(
              'Increased walls in', room.name,
              ' from', oldLimit,
              ' to:', room.memory.maxWallHits
            );
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

  attack() {
    let crusadeFlag = Game.flags['crusade'];
    let crusadeWithdrawalFlag = Game.flags['crusadeWithdrawal'];

    if(crusadeFlag){
        if(!crusadeFlag.memory.setUp) {
            crusadeFlag.memory = {
                setUp : true,
                active : false,
                //goal : 'conquest',
                tactic : 'sabotageWithDeathblow',
                tacticalPhase : 1,
                tacticalWithdrawalTo : 'crusadeWithdrawal',
                //attackerRooms : ['W83N9', 'W83N8'],
                //supporterRooms : [],
                unitTypes : {
                    pawnSacrifice : [],
                    melee : []
                },
                pawnLimit : 4,
                meleeLimit : 4
            }
        } else {
            // update
            for(let type in crusadeFlag.memory.unitTypes) {
                for(let u in type) {
                    let creepName = crusadeFlag.memory.unitTypes[type][u];
                    if(!Game.creeps[creepName]) {
                        crusadeFlag.memory.unitTypes[type].splice(u, 1);
                    }
                }
            }
        }
    }
  },

  // Helper
  flagsToArray() {
    this.flags = _.toArray(Game.flags);
  },

  updateFlags() {
    this.attackFlags = this.flags.filter((f) => {
      return f.color === COLOR_PURPLE && f.secondaryColor === COLOR_PURPLE;
    });
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

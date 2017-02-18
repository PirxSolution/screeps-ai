const Logger = require('class.logger');
const {
  everyTicks
} = require('util.helpers');

StructureController.prototype.autoSpawnCreeps = function(claimFlags, defendFlags) {
  let spawns = this.room.find(FIND_MY_SPAWNS);
  
    return spawns
      .reduce((creep, spawn) => {
        if (creep) { return creep; }

        return spawn.autoSpawnCreeps(claimFlags, defendFlags);
      }, undefined);
  /*
  spawns.forEach(function(spawn){
    if(spawn.spawning) { return; }

    spawn.autoSpawnCreeps(claimFlags, defendFlags);

    // to prevent spawning the same creep multiple times we have to update creepsData
    // between every spawning. To achiive this, we spawn only one time per tick and
    // room (TODO: better solution)
    return;
  });
  */
};

/*
  Helpers
*/

// Creeps governed by the controller
StructureController.prototype.collectCreepsData = function() {
  // Get all creeps
  this.creeps = _.toArray(Game.creeps).filter(c => c.memory.controllerId === this.id);

  // Collect creeps statistics
  this.creepsCounts = this.creeps.reduce(function(data, creep) {
    let role = creep.memory.role;

    data[role] = data[role] ? data[role] + 1 : 1;
    return data;
  }, {});

  // Show population per spawn
  everyTicks(100, () => {
    Logger.log(this.room.name , JSON.stringify(this.creepsCounts));
  });
};
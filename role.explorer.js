let actAsBuilder = require('role.builder');

module.exports = function() {
  let target = Game.flags[this.memory.flagName];;

  // Long distance (other room)
  if (target && target.pos.roomName !== this.room.name) {
    this.moveTo(target, {
      reusePath: 10
    });

    return;
  }

  // Default (same room)
  target = Game.getObjectById(this.memory.targetId);

  // Find new target
  if (!target || target.hits === target.hitsMax) {
    // repair structures when hits are below factor
    const damageFactor = 0.75;
    // repair walls only up to value
    // explorer try to build before tower
    const wallValue = this.room.memory.maxWallHits + 10000;

    // Select all structures below 'damageFactor'
    // Select all walls & ramps below increased maxWallHits
    target = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s) => {
          return (s.hits < s.hitsMax * damageFactor &&
            !((s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART)
            && s.hits > wallValue))
      }
    });

    if (target) {
      this.memory.targetId = target.id;
      // Remember all target´s except walls & ramps
      // TODO: need for a better wall solution
      if(!(target.structureType == STRUCTURE_WALL
        || target.structureType == STRUCTURE_RAMPART)) {

        this.memory.targetId = target.id;
      }
    }
  }

  if (target) {
    this.do('repair', target);
  } else {
    // We set it on autoPilot if it's a remote explorer
    let autoPilot = this.memory.flagName ? true : false;

    actAsBuilder.call(this, autoPilot);
  }
};

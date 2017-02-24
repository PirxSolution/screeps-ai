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

  // COMMIT:
  if(this.room.controller.level === 0 && this.room.hasConstructionSites()) {
    // We set it on autoPilot if it's a remote explorer
    let autoPilot = this.memory.flagName ? true : false;

    actAsBuilder.call(this, autoPilot);
    return;
  }

  target = Game.getObjectById(this.memory.targetId);

  // Find new target
  if (!target || target.hits === target.hitsMax) {
    // repair structures when hits are below factor
    const damageFactor = 0.75;
    // repair walls only up to value
    // explorer try to build before tower

    let wallValue = this.room.memory.maxWallHits ? this.room.memory.maxWallHits + 10000 : 0;

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
      // Remember all targets except walls & ramps
      // TODO: dont know if 'dont remember' is a good way
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

module.exports = function() {
  let flag = Game.flags[this.memory.flagName];

  if (flag && flag.pos.roomName !== this.room.name) {
    this.moveTo(flag, {
      reusePath: 0
    });
  } else {
  let target;

  // First attack HEAL (TODO: can be dangerous)
  target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
    filter: (enemy) => enemy.getActiveBodyparts(HEAL) > 0
  });

  // Then go for RANGED_ATTACK or ATTACK
  if (!target) {
    target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
      filter: (enemy) => {
        return enemy.getActiveBodyparts(RANGED_ATTACK) > 0 ||
          enemy.getActiveBodyparts(ATTACK) > 0
      }
    });
  }

  // Then go for RANGED_ATTACK or ATTACK
  if (!target) {
    target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
  }

    // if (_.isEmpty(target)) {
    //   // STRUCTURE_WALL
    //   let t = flag.pos.lookFor(LOOK_STRUCTURES);
    //   console.log(JSON.stringify(t));
    // }

    if (_.isEmpty(target)) {
      target = this.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);
    }

    this.do('attack', target);
  }

};

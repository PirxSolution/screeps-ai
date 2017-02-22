module.exports = function() {
  let flag = Game.flags[this.memory.flagName];

  // No more emails of dying creeps
  // this.notifyWhenAttacked(false);

  if (flag && flag.pos.roomName !== this.room.name) {
    this.moveTo(flag, {
      reusePath: 0
    });
  } else {
    // TODO: Add heal logic
    target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

    if (_.isEmpty(target)) {
      target = flag
        .pos
        .lookFor(LOOK_STRUCTURES)
        .find((s) => s.structureType === STRUCTURE_WALL);
    }

    if (_.isEmpty(target)) {
      target = this.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);
    }

    if (_.isEmpty(target)) {
      this.moveTo(flag, {
        reusePath: 0
      });

      return;
    }

    this.do('attack', target);
  }

};

module.exports = function() {
  this.notifyWhenAttacked(false);

  let flag = Game.flags[this.memory.flagName];

  if (flag && flag.pos.roomName !== this.room.name) {
    this.moveTo(flag, {
      reusePath: 0
    });
  } else {
    // TODO: Add heal logic
    let hostileCreeps = this.room.findEnemies();
    let target = this.pos.findClosestByRange(hostileCreeps);

    if (_.isEmpty(target) && !this.pos.isNearTo(flag)) {
      this.moveTo(flag);
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

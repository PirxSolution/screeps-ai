module.exports = function() {
  let flag = Game.flags[this.memory.flagName];

  if (flag && flag.pos.roomName !== this.room.name) {
    this.moveTo(flag, {
      reusePath: 0
    });
  } else {
    let target;  

    if(flag.memory.radius == 0) {
        if (_.isEmpty(target)) {
            target = flag.pos.lookFor(LOOK_STRUCTURES)[0];
        }
    } else {
        let targets = flag.pos.findInRange(FIND_STRUCTURES, 1);
        target = this.pos.findClosestByPath(targets);
    }

    //this.do('attack', target);
    if(this.dismantle(target) == ERR_NOT_IN_RANGE) {
        this.moveTo(target);
    }
    
    if (_.isEmpty(target)) {
      this.moveTo(flag);
    }
  }

};
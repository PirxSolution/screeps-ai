module.exports = function() {
  this.notifyWhenAttacked(false);
    
  let flag = Game.flags[this.memory.flagName];
  let withdrawalPosition = Game.flags[flag.memory.tacticalWithdrawalTo];
  
  let target;
  
  let value = 150;
  
  if(flag.memory.tacticalPhase == 1) { 
    if (withdrawalPosition.pos.roomName !== this.room.name) {
      this.moveTo(withdrawalPosition);
    } else {
      this.moveTo(withdrawalPosition);  
    }
  }
  else if(flag.memory.tacticalPhase == 2) {
    // this.moveTo(flag);
    if (flag.pos.roomName !== this.room.name) {
        // in friendly room
        target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        
        if(_.isEmpty(target)) {
            if(this.hits - this.hitsMax <= -value) {
                this.moveTo(withdrawalPosition);
            } else if(this.hits == this.hitsMax) {
                this.moveTo(flag);
            }
        } else {
            this.do('attack', target);
        }
    } else {
        // in the enemy room
        target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(this.hits - this.hitsMax > -value && this.hits - this.hitsMax < 0) {
            this.moveTo(withdrawalPosition);
            this.attack(target);
        } else {
            if(_.isEmpty(target)) {
                this.moveTo(flag);
            } else {
                this.do('attack', target);
            }
        }
    }
  }
  else if(flag.memory.tacticalPhase == 3) { 
    if (withdrawalPosition.pos.roomName !== this.room.name) {
      this.moveTo(withdrawalPosition);
    } else {
        target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(_.isEmpty(target)) {
            this.moveTo(withdrawalPosition);
        } else {
            this.do('attack', target);
        }
    }
  }
};
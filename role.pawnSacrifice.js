module.exports = function() {
  this.notifyWhenAttacked(false);
    
  let flag = Game.flags[this.memory.flagName];
  let withdrawalPosition = Game.flags[flag.memory.tacticalWithdrawalTo];

  if(flag.memory.tacticalPhase == 1) {
    if(this.hits - this.hitsMax <= -150) {
      if (withdrawalPosition.pos.roomName !== this.room.name) {
        this.moveTo(withdrawalPosition);
        this.heal(this);
      } else {
        this.moveTo(withdrawalPosition);
        this.heal(this);
      }
    }
    else if(this.hits - this.hitsMax > -150 && this.hits - this.hitsMax < 0) {
        if(withdrawalPosition.pos.roomName == this.room.name) {
            this.moveTo(withdrawalPosition);
            this.heal(this);
        }
        else if(flag.pos.roomName == this.room.name) {
            let injured = this.room.find(FIND_MY_CREEPS, {
                filter: (creep) => {return creep.hits < creep.hitsMax}
            });
            
            if(injured) {
                let target = this.pos.findClosestByRange(injured);
                
                if(this.heal(target) == ERR_NOT_IN_RANGE) {
                    this.moveTo(target);
                } else {
                    this.moveTo(flag);
                }
            } else {
                this.moveTo(flag);
                this.heal(this);
            }
        }

    }
    else {
        if(this.hits == this.hitsMax) {
            if(flag && flag.pos.roomName !== this.room.name) {
                this.moveTo(flag);
            }
            
            let injured = this.room.find(FIND_MY_CREEPS, {
                filter: (creep) => {return creep.hits < creep.hitsMax}
            });
            
            if(injured) {
                let target = this.pos.findClosestByRange(injured);
                
                if(this.heal(target) == ERR_NOT_IN_RANGE) {
                    this.moveTo(target);
                } else {
                    this.moveTo(flag);
                }
            }
            else if(!this.pos.isEqualTo(flag.pos)) {
                this.moveTo(flag);
            }
        }
    }
  }
  else if(flag.memory.tacticalPhase == 2) {
    if(withdrawalPosition.pos.roomName != this.room.name) {
        this.moveTo(withdrawalPosition);
        this.heal(this);
    } else {
        let injured = this.room.find(FIND_MY_CREEPS, {
            filter: (creep) => {return creep.hits < creep.hitsMax}
        });
        
        if(injured) {
            let target = this.pos.findClosestByRange(injured);
            
            if(this.rangedHeal(target) == ERR_NOT_IN_RANGE) {
                this.moveTo(target);
            } else {
                this.moveTo(withdrawalPosition);
            }
        }
    }
  }
  else if(flag.memory.tacticalPhase == 3) {
    if(withdrawalPosition.pos.roomName != this.room.name) {
        this.moveTo(withdrawalPosition);
        this.heal(this);
    } else {
        this.moveTo(withdrawalPosition);
    }
  }
};
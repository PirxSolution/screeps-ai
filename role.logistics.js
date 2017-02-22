let actAsBuilder = require('role.builder');

module.exports = function() {
  let target;

  /*
   Local - (same room)
  */

  let underAttack = this.room.underAttack();

  // Define the home
  let home = Game.getObjectById(this.memory.controllerId).room.name;
  // Define the claim
  let claim = Game.getObjectById(this.memory.sourceId).room.name;

  // Rooms which are not home or claim become no energy supply
  // TODO: exeptions are thinkable
  if(this.room.name === home || this.room.name == claim) {

    // If we are NOT under attack priorise spawn and extensions
    if (_.isEmpty(target) && !underAttack) {
      target = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) => {
          return [
            STRUCTURE_SPAWN,
            STRUCTURE_EXTENSION,
          ].includes(s.structureType) && s.energy < s.energyCapacity
        }
      });
    }

    // Towers need energy - the tower manages its energy level
    if (_.isEmpty(target)) {
      target = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) => {
          return s.structureType === STRUCTURE_TOWER &&
            s.energy < s.energyCapacity * s.engergyFactor;
        }
      });
    }

    // Spawns and extensions
    if (_.isEmpty(target)) {
      target = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) => {
          return [
            STRUCTURE_SPAWN,
            STRUCTURE_EXTENSION,
          ].includes(s.structureType) && s.energy < s.energyCapacity
        }
      });
    }

    // Do we have a container
    if (_.isEmpty(target)) {
      let targets = [];

      // How much free capacity must the container have
      let amount = this.carry[RESOURCE_ENERGY] + this.carry[RESOURCE_ENERGY] / 3;

      // Do we have a container next to the spawn
      // TODO: Revisit when we have 2 spawns
      if (this.room.hasSpawns()) {
        let spawn = this.room.spawns()[0];
        let containers = spawn.nearContainers();

        let selection = containerWithCapacity(containers, amount);

        if(selection) {
            targets.push(selection);
        }
      }

      // Do we have a container next to the controller
      let containers = this.room.controller.nearContainers(4);

      let selection = containerWithCapacity(containers, amount);

      if(selection) {
        targets.push(selection);
      }

      // Select the nearest container
      if (_.isEmpty(target) && !_.isEmpty(targets)) {
        target = this.pos.findClosestByPath(targets);
      }
    }

    // Do we have a storage? (only in HOME)
    if (_.isEmpty(target) && this.room.name === home) {
      target = this.room.storage;
    }
  }

  /*
   Remote - Long distance (other room)
  */

  // Get back to home controller room
  if (_.isEmpty(target)) {
    let controller = Game.getObjectById(this.memory.controllerId);

    // Find the room
    if (controller && controller.pos.roomName !== this.room.name) {
      this.moveTo(controller, {
        reusePath: 10
      });

      return;
    }
  }

  // if we have a target lets transfer
  if (!_.isEmpty(target)) {
    this.do('transfer', target, RESOURCE_ENERGY);
  } else {
    actAsBuilder.call(this);
  }
};

function containerWithCapacity(containers, amount) {
  amount = amount || 1;
  return _.find(containers, c => c.storeCapacity - c.store[RESOURCE_ENERGY] > amount);
}

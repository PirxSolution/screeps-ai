let actAsUpgrader = require('role.upgrader');

module.exports = function() {
  let target;

  // Build
  // This strategy is for efficiency
  if (Game.flags.autoPilot) {
    target = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

  // This strategy is for user control
  } else {
    target = this.room.find(FIND_CONSTRUCTION_SITES)[0];
  }

  if (target) {
    this.do('build', target);
  } else {
     actAsUpgrader.call(this);
  }
};

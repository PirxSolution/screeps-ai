RoomObject.prototype.nearContainers = function(distance = 1) {
  // returns [object, object]
  return this.pos.findInRange(FIND_STRUCTURES, distance, {
    filter: s => s.structureType === STRUCTURE_CONTAINER
  });
};

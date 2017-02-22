RoomObject.prototype.nearContainers = function(distance) {
  distance = distance || 1;
  return this.pos.findInRange(FIND_STRUCTURES, distance, {
    filter: s => s.structureType === STRUCTURE_CONTAINER
  });
};

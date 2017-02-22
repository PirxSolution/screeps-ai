Room.prototype.containers = function() {
  return this.find(FIND_STRUCTURES, {
    filter: s => s.structureType === STRUCTURE_CONTAINER
  });
};

Room.prototype.towers = function() {
  return this.find(FIND_STRUCTURES, {
    filter: s => s.structureType === STRUCTURE_TOWER
  });
};

Room.prototype.walls = function() {
  return this.find(FIND_MY_STRUCTURES, {
    filter: (s) => {
        return s.structureType === STRUCTURE_WALL ||
        s.structureType === STRUCTURE_RAMPART
    }
  });
};

Room.prototype.hasTowers = function() {
  return !_.isEmpty(this.towers());
};

Room.prototype.spawns = function() {
  return this.find(FIND_MY_SPAWNS);
};

Room.prototype.hasSpawns = function() {
  return !_.isEmpty(this.spawns());
};

Room.prototype.hasWalls = function() {
  return !_.isEmpty(this.walls());
};

Room.prototype.isStronghold = function() {
    return this.controller.level > 1 && this.controller.my && this.hasWalls()
};
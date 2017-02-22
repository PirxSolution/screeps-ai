Room.prototype.constructionSites = function() {
  return this.find(FIND_MY_CONSTRUCTION_SITES);
};

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

Room.prototype.extensions = function() {
  return this.find(FIND_MY_STRUCTURES, {
    filter: s => s.structureType === STRUCTURE_EXTENSION
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
  return this.find(FIND_MY_SPAWNS, {
      filter: s => s.isActive()
  });
};

Room.prototype.hasSpawns = function() {
  return !_.isEmpty(this.spawns());
};

Room.prototype.hasExtensions = function(amount) {
  return this.extensions().length >= amount;
};

Room.prototype.hasWalls = function() {
  return !_.isEmpty(this.walls());
};

Room.prototype.hasConstructionSites = function() {
  return !_.isEmpty(this.constructionSites());
};

Room.prototype.hasContainers = function() {
  return !_.isEmpty(this.containers());
};

Room.prototype.underAttack = function() {
  let enemys = this.find(FIND_HOSTILE_CREEPS);
  return !_.isEmpty();
};

Room.prototype.isStronghold = function() {
    return this.controller.level > 1 && this.controller.my && this.hasWalls()
};
module.exports = {
  config() {
    global.ME = 'pirx';
    global.allies = [global.me, 'fsmanuel'];

    const empire = {
      W83N9: {
        defense: {
          finalWallHits: 50000000,
          explorerEfficiency: 0.65
        }
      },
      W82N8: {
        defense: {
          finalWallHits: 50000000,
          explorerEfficiency: 0.5
        }
      },
      W83N6: {
        defense: {
          finalWallHits: 20000000,
          explorerEfficiency: 0.7
        }
      },
      W81N7: {
        defense: {
          finalWallHits: 1000000,
          explorerEfficiency: 0.55
        }
      },
      W84N7: {
        economy: {
          reserve: 100000,
          explorerEfficiency: 0.5
        }
      },
      W82N7: {
        economy: {
          reserve: 100000
        }
      },
      W83N8: {
        economy: {
          reserve: 100000
        }
      }
    };

    for(let colony of Object.keys(empire)) {
      let options;
      options = _.assign({
        wallUpgradeTime: 400,
        finalWallHits: 1000000,
        wallContainer: true,
        explorerCount: 1,
        explorerEfficiency: 0.5,
      }, empire[colony].defense);
      Memory.rooms[colony].defense = Memory.rooms[colony].defense || options;

      options = _.assign({
        reserve: 300000,
        maxUpgraderCount: 3,
      }, empire[colony].economy);
      Memory.rooms[colony].economy = Memory.rooms[colony].economy || options;
    }
  }
}
function StormyMustardSimulation(width, height, graphics, game) {
    this.game = game;
    this.height = height;
    this.width = width;
    this.entities = [];
    this.entityUIs = [];
    this.graphics = graphics;
    this.selectedIndex = 0;
    this.tick = 0;
    this._init();
};

StormyMustardSimulation.prototype = (function () {

    return {
        _init: function () {
            this.textGroup =  game.add.group();
            this.mustard = game.make.text(100, 130, 'MUSTARD',  { font: "24px Arial", fill: "#ffff00" });
            this.textGroup.add(this.mustard);

            let x = 0;
            let y = 0;

            for (let i = 0; i < StormyMustardConfig.ENTITY_COUNT; i++) {
                let e = new StormyMustardEntity();
                this.entities.push(e);
                let eui = new EntityUI(x, y, e);
                this.entityUIs.push(eui);
            }

            this.entityUIs[this.selectedIndex].selected = true;
            this._positionEntityUI();

        },

        /**
         * Positions the entity UI elements
         * @private
         */
        _positionEntityUI: function() {
            let x = 0;
            let y = this.height / 2;

            for (let i in this.entityUIs) {
                this.entityUIs[i].x = x;
                this.entityUIs[i].y = y;
                x += 120;
            }
        },

        run: function() {
            let k = this.entityUIs.length;

            while(k--) {
                this.entityUIs[k].run(this.tick);
            }

            this.tick++;

        },

        /**
         * Renders the simulation
         */
        render: function() {
            this.graphics.clear();
            let k = this.entityUIs.length;

            while(k--) {
                this.entityUIs[k].render(this.tick, this.graphics);
            }

            this._renderLogo(this.graphics);

        },

        _renderLogo: function(graphics) {
            let points = [
              {x:149, y:22},
              {x:191, y:25},
              {x:202, y:126},
              {x:181, y:118},
              {x:183, y:185},
              {x:170, y:182},
              {x:169, y:268},
              {x:142, y:166},
              {x:155, y:166},
              {x:141, y:87},
              {x:159, y:92},
              {x:149, y:22},
            ];
            this._renderOutline(points, graphics);
        },

        _renderOutline: function(points, graphics) {
            for(let i = points.length-1; i > 0; i--){
                Electricity.fireWeapon(points[i], points[i-1], graphics, 0xffa500, 1, 1);
            }
        },


        handleKey: function(key) {
            switch (key) {
                case 'L':
                    this.selectedIndex--;
                    if (this.selectedIndex < 0) {
                        this.selectedIndex = this.entityUIs.length - 1;
                    }
                    this._lazyUIUpdate();
                    break;
                case 'R':
                    this.selectedIndex++;
                    if (this.selectedIndex > this.entityUIs.length - 1) {
                        this.selectedIndex = 0;
                    }
                    this._lazyUIUpdate();
                    break;
                case 'S':
                    let alreadyPlaying = this.entityUIs[this.selectedIndex].playing;

                    if (!alreadyPlaying) {
                        this.entityUIs[this.selectedIndex].play();
                    } else {
                        this.entityUIs[this.selectedIndex].stop();
                    }

                    break;
                case 'M':
                    let k = this.entityUIs.length;
                    while (k--) {
                        this.entityUIs[k].stop();
                    }
                    this._mutate();
                    break;
            }
        },

        _mutate: function() {
          //TODO take selected ai
            //console.log('_mutate');
            let selectedEntity = this.entityUIs[this.selectedIndex];
            //console.log('selectedEntity=' + selectedEntity);
            this.entityUIs = [];
            this.entities = [];
            this.entityUIs.push(selectedEntity);
            let m = 2;
            let i = 1;
            while (this.entityUIs.length < StormyMustardConfig.ENTITY_COUNT) {
                let newEntity = Object.clone(selectedEntity, true);

                for (let k = 0; k <= m; k++) {
                    for (let j in newEntity.entity.voices) {
                        //console.log('mutating');
                        let nn = newEntity.entity.voices[j].nn;
                        mutateNetwork(nn);
                    }
                }
                m++;

                this.entityUIs.push(newEntity);
                this.entities.push(newEntity.entity);
            }

            this._positionEntityUI();

            //reset
            for (let i = 1; i < this.entityUIs.length; i++) {
                this.entityUIs[i].selected = false;
            }

            this.selectedIndex = 0;
            //console.log('done with mutating');
            //repopulate list with increasingly mutated children
        },



        _lazyUIUpdate: function() {
            for (let i in this.entityUIs) {
                if (i == this.selectedIndex) {
                    this.entityUIs[i].selected = true;
                } else {
                    this.entityUIs[i].selected = false;
                }
            }

        }
    };

})();

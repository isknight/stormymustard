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


            var x = 0;
            var y = 0;

            for (var i = 0; i < StormyMustardConfig.ENTITY_COUNT; i++) {
                var e = new StormyMustardEntity();
                this.entities.push(e);
                var eui = new EntityUI(x, y, e);
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
            var x = 0;
            var y = this.height / 2;

            for (var i in this.entityUIs) {
                this.entityUIs[i].x = x;
                this.entityUIs[i].y = y;
                x += 120;
            }
        },

        run: function() {
            var k = this.entityUIs.length;

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
            var k = this.entityUIs.length;

            while(k--) {
                this.entityUIs[k].render(this.tick, this.graphics);
            }

            this._renderLogo(this.graphics);

        },

        _renderLogo: function(graphics) {
            var points = [];
            points.push({x:149, y:22});
            points.push({x:191, y:25});
            points.push({x:202, y:126});
            points.push({x:181, y:118});
            points.push({x:183, y:185});
            points.push({x:170, y:182});
            points.push({x:169, y:268});
            points.push({x:142, y:166});
            points.push({x:155, y:166});
            points.push({x:141, y:87});
            points.push({x:159, y:92});
            points.push({x:149, y:22});
            this._renderOutline(points, graphics);
        },

        _renderOutline: function(points, graphics) {
            var lastPoint = null;

            var i = points.length;
            while (i--) {
                if (lastPoint) {
                    Electricity.fireWeapon(lastPoint, points[i], graphics, 0xffa500, 1, 1);
                }

                lastPoint = points[i];
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
                    var alreadyPlaying = this.entityUIs[this.selectedIndex].playing;

                    if (!alreadyPlaying) {
                        this.entityUIs[this.selectedIndex].play();
                    } else {
                        this.entityUIs[this.selectedIndex].stop();
                    }

                    break;
                case 'M':
                    var k = this.entityUIs.length;
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
            var selectedEntity = this.entityUIs[this.selectedIndex];
            //console.log('selectedEntity=' + selectedEntity);
            this.entityUIs = [];
            this.entities = [];
            this.entityUIs.push(selectedEntity);
            var m = 2;
            var i = 1;
            var mutator = new Mutator();
            while (this.entityUIs.length < StormyMustardConfig.ENTITY_COUNT) {
                var newEntity = Object.clone(selectedEntity, true);

                for (var k = 0; k <= m; k++) {
                    for (var j in newEntity.entity.voices) {
                        //console.log('mutating');
                        var nn = newEntity.entity.voices[j].nn;
                        mutator.mutateNetwork(nn);

                    }
                }
                m++;

                this.entityUIs.push(newEntity);
                this.entities.push(newEntity.entity);
            }

            this._positionEntityUI();

            //reset
            for (var i = 1; i < this.entityUIs.length; i++) {
                this.entityUIs[i].selected = false;
            }

            this.selectedIndex = 0;
            //console.log('done with mutating');
            //repopulate list with increasingly mutated children
        },



        _lazyUIUpdate: function() {
            for (var i in this.entityUIs) {
                if (i == this.selectedIndex) {
                    this.entityUIs[i].selected = true;
                } else {
                    this.entityUIs[i].selected = false;
                }
            }

        }
    };

})();
function EntityUI(x, y, entity) {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 100;

    this.entity = entity;
    this.playing = false;
    this.selected = false;

    // this.button.onInputUp.add(this.click(), this);

};


EntityUI.prototype = (function () {
    return {
        run: function () {
            if (this.playing) {
                // console.log('this.i=' + this.i);
                if (this.i < StormyMustardConfig.MAX_VOICE_DURATION) {
                    this.entity.run(this.i);
                } else {
                    this.i = 0;
                }
                this.i++;
            }
        },

        render: function (graphics) {

            graphics.lineStyle(1, 0x00ff00);
            graphics.drawRect(this.x, this.y, this.width, this.height);


            if (this.selected) {
                graphics.lineStyle(3, 0xffffff);
                graphics.drawRect(this.x + 2, this.y + 2, this.width - 2, this.height - 2);
            }

            this._renderNN(graphics);

        },

        /**
         *
         * @param graphics
         * @private
         */
        _renderNN: function (graphics) {
            var rows = this.entity.voices.length;
            var rowHeight = (this.height - 10) / rows;

            for(var i = 10; i < this.width - 10; i+=2) {
                var inputHeight = (i / this.width) * 2 - 1;
                for (var k in this.entity.voices) {
                    var output = Network.fire(this.entity.voices[k].nn, [inputHeight]);
                    var rgb = [];
                    rgb[0] = ((output[0] + 1) / 2) * 255;
                    rgb[2] = ((output[1] + 1) / 2) * 255;
                    rgb[1] = (rgb[0] + rgb[2]) / 2;

                    var c = this._rgb2hex(rgb);
                    graphics.lineStyle(1, c);
                    //graphics.beginFill(c, 1);

                    graphics.drawRect(this.x + i, this.y + rowHeight * k + 4, 2, rowHeight);
                }

            }
        },

        _rgb2hex: function (rgb) {
            return ((rgb[0]*255 << 16) + (rgb[1]*255 << 8) + rgb[2]*255);
        },


        play: function () {
            this.entity.start();
            this.i = 0;
            this.playing = true;
        },
        stop: function () {
            this.entity.stop();
            this.i = 0;
            this.playing = false;
        }

    };

})();
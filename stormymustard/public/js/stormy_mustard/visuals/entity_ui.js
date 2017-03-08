class EntityUI {

    constructor(x, y, entity) {
        this.i = 0;
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.entity = entity;
        this.playing = false;
        this.selected = false;
    }

    run(tick) {
        if (this.playing) {
            if (this.i < StormyMustardConfig.MAX_VOICE_DURATION) {
                this.entity.run(this.i);
            } else {
                this.i = 0;
            }
            this.i++;
        }
    }

    render(tick, graphics) {

        graphics.lineStyle(1, 0x00ff00);
        graphics.drawRect(this.x, this.y, this.width, this.height);

        if (this.selected) {
            graphics.lineStyle(3, 0xffffff);
            graphics.drawRect(this.x + 2, this.y + 2, this.width - 2, this.height - 2);
        }

        this._renderNN(graphics);

        if (this.playing) {
            this._renderPlaying2(tick, graphics);
        }
    }

    _renderPlaying2(tick, graphics) {
      //TODO: optimize by not recomputing and saving when playing, unless repositioning is desired...
      let outline = new Electricity(this._computePoints());
      outline.render(graphics, 0xffffff, 2, 1);
    }

    _computePoints(){
      let padding = 5;
      return [
        { x: this.x - padding, y: this.y - padding },
        { x: this.x + padding * 2 + this.width, y: this.y - padding },
        { x: this.x + padding * 2 + this.width, y: this.y + padding * 2 + this.height },
        { x: this.x - padding, y: this.y + padding * 2 + this.height },
        { x: this.x - padding, y: this.y - padding },
      ];
    }

    _renderOutline(points, tick, graphics) {
        let lastPoint = null;

        let i = points.length;
        while (i--) {
            if (lastPoint) {
                Electricity._drawSpark(lastPoint, points[i], graphics, 0xffffff, 2, 1);
            }

            lastPoint = points[i];
        }
    }

    _renderPlaying(tick, graphics) {
        let startingPaddingSize = 2;
        let endingPaddingSize = 20;
        let alpha = (tick % 10) / 10;
        let alphaStep = 1 / (endingPaddingSize / startingPaddingSize);

        while (startingPaddingSize <= endingPaddingSize) {
            graphics.lineStyle(1, 0xffffff, alpha);
            graphics.drawRect(this.x - startingPaddingSize, this.y - startingPaddingSize, this.width + startingPaddingSize * 2, this.height + startingPaddingSize * 2);

            startingPaddingSize++;
            alpha -= alphaStep;
            if (alpha < 0) {
                alpha = 1;
            }
        }
    }

    _renderNN(graphics) {
        let rows = this.entity.voices.length;
        let rowHeight = (this.height - 10) / rows;

        for (let i = 10; i < this.width - 10; i += 2) {
            let inputHeight = (i / this.width) * 2 - 1;
            for (let k in this.entity.voices) {
                let output = this.entity.voices[k].nn.fire([inputHeight]);
                let rgb = [];
                rgb[0] = ((output[0] + 1) / 2) * 255;
                rgb[2] = ((output[1] + 1) / 2) * 255;
                rgb[1] = (rgb[0] + rgb[2]) / 2;

                let c = this._rgb2hex(rgb);
                graphics.lineStyle(1, c);
                //graphics.beginFill(c, 1);
                graphics.drawRect(this.x + i, this.y + rowHeight * k + 4, 2, rowHeight);
            }
        }
    }

    _rgb2hex(rgb) {
        return ((rgb[0] * 255 << 16) + (rgb[1] * 255 << 8) + rgb[2] * 255);
    }

    play() {
        this.entity.start();
        this.i = 0;
        this.playing = true;
    }

    stop() {
        this.entity.stop();
        this.i = 0;
        this.playing = false;
    }
}

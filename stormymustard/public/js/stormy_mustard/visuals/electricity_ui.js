class Electricity {

    constructor(points) {
        this.points = points;
    }

    render(graphics, color, scale, colorScale) {
        for (let i = 0; i < this.points.length - 1; i++) {
            Electricity._drawSpark(this.points[i], this.points[i + 1], graphics, color, scale, colorScale);
        }
    }

    static _drawSpark(p1, p2, graphics, color, scale, colorScale) {

        if (!scale) {
            scale = 0;
        }

        if (scale > 1) {
            //  scale = 1;
        }

        if (scale < -1) {
            // scale = -1;
        }

        if (!colorScale) {
            colorScale = 0;
        }

        let points = Electricity._generatePoints(p1, p2, 20);

        if (!color) {
            color = 0xffffff;
        }

        let modifier = 4;

        let fireColor = 0xffffff;


        if (colorScale > 0) {
            //FFA500
            fireColor = 0xffa500;
        } else if (colorScale < 0) {
            //912CEE
            fireColor = 0x912cee;
        }

        fireColor = color;
        Electricity._drawLine(p1, p2, points, fireColor, 1 * scale, 1, graphics);
        Electricity._drawLine(p1, p2, points, fireColor, 4 * scale, .3, graphics);
        Electricity._drawLine(p1, p2, points, fireColor, 18 * scale, .2, graphics);
    }

    static _rgb2hex(rgb) {
        return ((rgb[0] * 255 << 16) + (rgb[1] * 255 << 8) + rgb[2] * 255);
    }


    /**
     * generates points for the synapse arc
     */
    static _generatePoints(p1, p2, segments) {
        let points = [];
        let angle = Electricity._angleBetweenPoints(p1, p2);
        let prevX = p1.x;
        let prevY = p1.y;
        let distance = Electricity._distanceBetweenPoints({
            x: prevX,
            y: prevY
        }, p2);
        let length = distance / segments;

        let mutation = 150;

        let giveUp = 100;

        while (distance > length && giveUp >= 0) {
            let randomAngleMutator = Util.randomInteger(0, mutation);
            randomAngleMutator -= (mutation / 2);
            randomAngleMutator = randomAngleMutator / 200;

            let x2 = prevX + Math.cos(angle + randomAngleMutator) * length;
            let y2 = prevY + Math.sin(angle + randomAngleMutator) * length;
            prevX = x2;
            prevY = y2;

            angle = Electricity._angleBetweenPoints({
                x: x2,
                y: y2
            }, p2);
            distance = Electricity._distanceBetweenPoints({
                x: prevX,
                y: prevY
            }, p2);

            points.push({
                x: x2,
                y: y2
            });
            giveUp--;

        }

        return points;
    }

    static _drawLine(p1, p2, points, color, width, opacity, graphics) {
        graphics.lineStyle(width, color, opacity);
        graphics.moveTo(p1.x, p1.y);
        for (let i in points) {
            let point = points[i];
            graphics.lineTo(point.x, point.y);
        }

        graphics.lineTo(p2.x, p2.y);
    }

    static _angleBetweenPoints(p1, p2) {
        return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 360 / Math.PI) / 100;
    }

    static _distanceBetweenPoints(p1, p2) {
        return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
    }
}

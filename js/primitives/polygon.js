class Polygon {
  constructor(points) {
    this.points = points;
    this.segments = [];
    for (let i = 1; i <= points.length; i++) {
      this.segments.push(
        new Segment(points[i - 1], points[i % points.length]) // modulo is used to wrap around
      );
    }
  }

  static break(poly1, poly2) {
    const segs1 = poly1.segments;
    const segs2 = poly2.segments;
    segs1.forEach((seg1, i) => {
      segs2.forEach((seg2, j) => {
        const int = getIntersection(seg1.p1, seg1.p2, seg2.p1, seg2.p2);

        if (int && int.offset !== 1 && int.offset !== 0) {
          const point = new Point(int.x, int.y);
          let aux = seg1.p2;
          seg1.p2 = point;
          segs1.splice(i + 1, 0, new Segment(point, aux));
          aux = seg2.p2;
          seg2.p2 = point;
          segs2.splice(j + 1, 0, new Segment(point, aux));
        }
      });
    });
  }

  drawSegments(ctx) {
    for (const seg of this.segments) {
      seg.draw(ctx, { color: getRandomColor(), width: 5 });
    }
  }

  draw(
    ctx,
    { stroke = 'blue', lineWidth = 2, fill = 'rgba(0,0,255,0.3)' } = {}
  ) {
    ctx.beginPath();
    ctx.fillStyle = fill;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = stroke;
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
}

class Envelope {
  constructor(skeleton, width) {
    this.skeleton = skeleton;
    this.poly = this.#generatePolygon(width);
  }

  #generatePolygon(width) {
    const { p1, p2 } = this.skeleton;

    const radius = width / 2;
    const alpha = Math.atan2(p1.y - p2.y, p1.x - p2.x);
    const alpha_cw = alpha + Math.PI / 2;
    const alpha_ccw = alpha - Math.PI / 2;
    const p1_ccw = translate(p1, alpha_ccw, radius);
  }
}

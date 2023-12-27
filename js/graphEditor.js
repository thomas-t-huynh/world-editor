class GraphEditor {
  constructor(viewport, graph) {
    this.viewport = viewport;
    this.canvas = viewport.canvas;
    this.graph = graph;

    this.ctx = this.canvas.getContext('2d');

    this.selected = null;
    this.hovered = null;
    this.dragging = false;
    this.mouse = null;
  }

  enable() {
    this.#addEventListeners();
  }

  disable() {
    this.#removeEventListeners();
  }

  #addEventListeners() {
    this.canvas.addEventListener('mousedown', (evt) =>
      this.#handleMouseDown(evt)
    );
    this.canvas.addEventListener('mousemove', this.#handleMouseMove.bind(this));
    this.canvas.addEventListener(
      'mousewheel',
      this.#handleMouseWheel.bind(this)
    );
    this.canvas.addEventListener('contextmenu', (evt) => evt.preventDefault());
    this.canvas.addEventListener('mouseup', () => (this.dragging = false));
  }

  #removeEventListeners() {
    this.canvas.removeEventListener('mousedown', (evt) =>
      this.#handleMouseDown(evt)
    );
    this.canvas.removeEventListener(
      'mousemove',
      this.#handleMouseMove.bind(this)
    );
    this.canvas.removeEventListener(
      'mousewheel',
      this.#handleMouseWheel.bind(this)
    );
    this.canvas.removeEventListener('contextmenu', (evt) =>
      evt.preventDefault()
    );
    this.canvas.removeEventListener('mouseup', () => (this.dragging = false));
  }

  #removePoint(point) {
    this.graph.removePoint(point);
    this.hovered = null;
    if (this.selected === point) {
      this.selected = null;
    }
  }

  #handleMouseDown(evt) {
    // right click
    if (evt.button === 2) {
      if (this.selected) {
        this.selected = null;
      } else if (this.hovered) {
        this.#removePoint(this.hovered);
      }
    }
    // left click
    if (evt.button === 0) {
      if (this.hovered) {
        this.#select(this.hovered);
        this.dragging = true;
        return;
      }
      this.graph.addPoint(this.mouse);
      this.#select(this.mouse);
      this.hovered = this.mouse;
    }
  }

  #handleMouseMove(evt) {
    this.mouse = this.viewport.getMouse(evt, true);
    this.hovered = getNearestPoint(
      this.mouse,
      this.graph.points,
      10 * this.viewport.zoom
    );
    if (this.dragging === true) {
      this.selected.x = this.mouse.x;
      this.selected.y = this.mouse.y;
    }
  }

  #handleMouseWheel(evt) {
    this.mouse = this.viewport.getMouse(evt);
  }

  #select(point) {
    if (this.selected) {
      this.graph.tryAddSegment(new Segment(this.selected, point));
    }
    this.selected = point;
  }

  dispose() {
    this.graph.dispose();
    this.selected = null;
    this.hovered = null;
  }

  display() {
    this.graph.draw(this.ctx);
    if (this.hovered) {
      this.hovered.draw(this.ctx, { fill: true });
    }
    if (this.selected) {
      const intent = this.hovered || this.mouse;
      new Segment(this.selected, intent).draw(ctx, { dash: [3, 3] });
      this.selected.draw(this.ctx, { outline: true });
    }
  }
}

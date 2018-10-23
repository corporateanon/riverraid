import { riverLineGenerator } from './river';

export default class RR {
  constructor({ onChange }) {
    this.rlBuffer = [];
    this.rlBufferHeight = 30;
    this.camY = 0;
    this.camX = 0;
    this.prevCamY = 0;
    this.camWidth = 100;
    this.camHeight = 100;
    this.width = 100;
    this.rlBufferStep = this.camHeight / this.rlBufferHeight;
    this.rlBufferPrecomputedHeight = 30;
    this.fps = 25;
    this.camSpeed = 20; //campixels/sec

    this.camLandBuffer = new Array(
      this.rlBufferHeight + this.rlBufferPrecomputedHeight
    );

    this.onChange = onChange;
    this.rlGen = riverLineGenerator();
    this.populateRlBuffer();
  }

  populateRlBuffer() {
    const { rlBuffer, rlBufferStep, rlBufferHeight, width } = this;
    const lastLine = this.rlBuffer[this.rlBuffer.length - 1];
    let y = lastLine ? lastLine.y + rlBufferStep : 0;
    const count = this.rlBufferHeight + this.rlBufferPrecomputedHeight;

    for (let i = 0; i < count; i++) {
      if (!rlBuffer[i]) {
        rlBuffer[i] = { xLeft: 0, xRight: 0, y: 0 };
      }
      const item = rlBuffer[i];
      const upperItem = rlBuffer[i + rlBufferHeight];
      if (upperItem) {
        item.y = upperItem.y;
        item.xLeft = upperItem.xLeft;
        item.xRight = upperItem.xRight;
      } else {
        const line = this.rlGen.next().value;
        item.y = y;
        item.xLeft = width * line[0];
        item.xRight = width * line[1];
        y += rlBufferStep;
      }
    }
  }

  start() {
    setInterval(this.tick.bind(this), 1000 / this.fps);
  }

  populateRlBufferIfNeeded() {
    const lastLine = this.rlBuffer[this.rlBuffer.length - 1];
    const topY = this.camY + this.camHeight;
    if (lastLine.y <= topY) {
      this.populateRlBuffer();
    }
  }

  handleChange() {
    const { rlBuffer, camY } = this;
    this.onChange({
      rlBuffer,
      camY
    });
  }

  tick() {
    this.camY += this.camSpeed / this.fps;
    this.populateRlBufferIfNeeded();
    this.handleChange();
  }
}

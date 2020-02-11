import { CanvasDimension } from './floating-avatars.interface';

const MIN_DIST = 250;
const SPRING_AMOUNT = 0.0001;
const SHADOW_BLEED = 10;
const SHADOW_BLUR = 15;

export class AvatarParticle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  scaleX: number;
  scaleY: number;
  lineWidth: number;
  isCenter: boolean;
  img: HTMLImageElement;
  allParticles: AvatarParticle[];
  context: CanvasRenderingContext2D;
  lines: boolean;
  shadows: boolean;
  imageLoaded: boolean;

  constructor(
    radius: number,
    imgUrl: string,
    lines: boolean,
    shadows: boolean,
    allParticles: AvatarParticle[],
    context: CanvasRenderingContext2D
  ) {
    this.x = 0;
    this.y = 0;
    this.radius = radius;
    this.vx = 0;
    this.vy = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.img = new Image();
    this.img.src = imgUrl;
    this.lineWidth = Math.min(Math.floor(radius / 10), 2);
    this.allParticles = allParticles;
    this.context = context;
    this.lines = lines;
    this.shadows = shadows;

    this.img.onload = () => {
      if (!this.imageLoaded) {
        this.imageLoaded = true;
        this.draw();
      }
    };
  }

  public draw() {
    if (this.imageLoaded) {
      this.context.save();
      this.context.translate(this.x, this.y);
      this.context.scale(this.scaleX, this.scaleY);

      this.context.fillStyle = 'rgba(248,247,247,1)';
      this.context.beginPath();
      this.context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
      this.context.closePath();
      this.context.fill();
      this.context.clip();

      this.context.drawImage(
        this.img,
        -this.radius,
        -this.radius,
        this.radius * 2,
        this.radius * 2
      );

      this.context.restore();
      this.context.save();
      this.context.translate(this.x, this.y);
      this.context.scale(this.scaleX, this.scaleY);

      if (this.lineWidth > 0) {
        this.context.beginPath();
        this.context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
        this.context.closePath();
        this.context.lineWidth = this.lineWidth;
        this.context.strokeStyle = 'rgba(255,255,255,1)';
        if (this.shadows) {
          this.context.shadowColor = 'grey';
          this.context.shadowBlur = SHADOW_BLUR;
        }
        this.context.stroke();
      }

      this.context.restore();
    }
  }

  public move(canvasDimension: CanvasDimension, index: number): void {
    if (!this.isCenter) {
      this.x += this.vx;
      this.y += this.vy;
    }

    if (this.x > canvasDimension.width - this.radius - this.shadowBleed()) {
      this.x = canvasDimension.width - this.radius - this.shadowBleed() - 2;
      this.vx = -this.vx;
    } else if (this.x < this.radius + this.shadowBleed()) {
      this.x = this.radius + this.shadowBleed() + 2;
      this.vx = -this.vx;
    }

    if (this.y > canvasDimension.height - this.radius - this.shadowBleed()) {
      this.y = canvasDimension.height - this.radius - this.shadowBleed() - 2;
      this.vy = -this.vy;
    } else if (this.y < this.radius + this.shadowBleed()) {
      this.y = this.radius + this.shadowBleed() + 2;
      this.vy = -this.vy;
    }

    if (this.lines) {
      this.spring(index);
    }
  }

  private spring(index: number): void {
    let avtrPartcl2: AvatarParticle;

    for (let j = index + 1; j < this.allParticles.length; j++) {
      avtrPartcl2 = this.allParticles[j];

      const dx = avtrPartcl2.x - this.x;
      const dy = avtrPartcl2.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MIN_DIST) {
        const alpha = 1 - dist / MIN_DIST;
        this.context.strokeStyle = `rgba(200,200,200, ${alpha})`;
        this.context.lineWidth = 1;
        this.context.beginPath();
        this.context.moveTo(this.x, this.y);
        this.context.lineTo(avtrPartcl2.x, avtrPartcl2.y);
        this.context.closePath();
        this.context.stroke();

        const ax = dx * SPRING_AMOUNT;
        const ay = dy * SPRING_AMOUNT;
        this.vx += ax / 500;
        this.vy += ay / 500;
        avtrPartcl2.vx -= ax / 500;
        avtrPartcl2.vy -= ay / 500;
      }
    }
  }

  private shadowBleed(): number {
    return this.shadows ? SHADOW_BLEED : 0;
  }
}

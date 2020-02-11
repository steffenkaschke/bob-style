import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { UtilsService } from '../../services/utils/utils.service';
import { combineLatest, Subscription } from 'rxjs';
import { outsideZone } from '../../services/utils/rxjs.operators';
import { AvatarLocation, CanvasDimension } from './floating-avatars.interface';
import {
  AVATAR_LOCATIONS_DEF_DESK,
  AVATAR_LOCATIONS_DEF_MOB,
} from './floating-avatars.const';
import { MobileService, MediaEvent } from '../../services/utils/mobile.service';
import { notFirstChanges } from '../../services/utils/functional-utils';
import { skip } from 'rxjs/operators';
import { AvatarParticle } from './avatar.particle';

@Component({
  selector: 'b-floating-avatars',
  template: '<canvas #canvas></canvas>',
  styleUrls: ['./floating-avatars.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingAvatarsComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  @Input() avatarImages: string[] = [];
  @Input() centerAvatarImage: string = null;
  @Input() speed = 2.5;
  @Input() lines = false;
  @Input() shadows = false;
  @Input() animateOnDesktop = true;
  @Input() animateOnMobile = false;
  @Input()
  avatarsLocationsDesktop: AvatarLocation[] = AVATAR_LOCATIONS_DEF_DESK;
  @Input()
  avatarLocationsMobile: AvatarLocation[] = AVATAR_LOCATIONS_DEF_MOB;

  private canvasEl: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private loopReq;
  private canvasDimension: CanvasDimension = {
    width: 0,
    height: 0,
  };
  private particles: AvatarParticle[] = [];
  private resizeSubscriber: Subscription;
  private isMobile = false;

  constructor(
    private hostRef: ElementRef,
    private zone: NgZone,
    private utils: UtilsService,
    private mobileService: MobileService
  ) {}

  ngOnInit(): void {
    this.isMobile = this.mobileService.getMediaData().matchMobile;
    this.build();

    this.resizeSubscriber = combineLatest([
      this.mobileService
        .getMediaEvent()
        .pipe(outsideZone<MediaEvent>(this.zone), skip(1)),
      this.utils.getResizeEvent().pipe(outsideZone(this.zone)),
    ]).subscribe(([mediaEvent, resizeEvent]) => {
      this.isMobile = mediaEvent.matchMobile;
      this.stop();
      this.build();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (notFirstChanges(changes)) {
      this.stop();
      this.build();
    }
  }

  ngOnDestroy(): void {
    this.stop();
    if (this.resizeSubscriber) {
      this.resizeSubscriber.unsubscribe();
    }
  }

  private stop() {
    window.cancelAnimationFrame(this.loopReq);
    this.particles = [];
    this.loopReq = null;
  }

  private build() {
    this.canvasEl = this.canvas.nativeElement;
    this.context = this.canvasEl.getContext('2d');

    this.scaleCanvas();
    this.setScene();

    if (
      (!this.isMobile && this.animateOnDesktop) ||
      (this.isMobile && this.animateOnMobile)
    ) {
      this.zone.runOutsideAngular(() => {
        this.loop();
      });
    }
  }

  private scaleCanvas(): void {
    this.canvasDimension = {
      width: this.hostRef.nativeElement.clientWidth,
      height: this.hostRef.nativeElement.clientHeight,
    };
    this.canvasEl.width = this.canvasDimension.width;
    this.canvasEl.height = this.canvasDimension.height;
  }

  private setScene(): void {
    this.context.clearRect(
      0,
      0,
      this.canvasDimension.width,
      this.canvasDimension.height
    );

    if (
      (!this.isMobile && !this.animateOnDesktop) ||
      (this.isMobile && !this.animateOnMobile)
    ) {
      this.createStaticDisplayParts(
        this.isMobile
          ? this.avatarLocationsMobile
          : this.avatarsLocationsDesktop
      );
    } else {
      this.createAnimatedDisplayParts();
    }
    if (this.centerAvatarImage) {
      const particle: AvatarParticle = this.createCenterAvatar(
        this.centerAvatarImage
      );
      this.particles.push(particle);
    }
  }

  private loop(): void {
    this.context.clearRect(
      0,
      0,
      this.canvasDimension.width,
      this.canvasDimension.height
    );
    this.particles.forEach((particle, index) => {
      particle.move(this.canvasDimension, index);
      particle.draw();
    });
    this.loopReq = requestAnimationFrame(this.loop.bind(this));
  }

  private createStaticDisplayParts(
    staticAvatarsLocation: AvatarLocation[]
  ): void {
    for (let i = 0; i < staticAvatarsLocation.length; i++) {
      const ballData = staticAvatarsLocation[i];
      const particle = new AvatarParticle(
        ballData.avatarSize,
        this.avatarImages[i],
        this.lines,
        this.shadows,
        this.particles,
        this.context
      );
      particle.x = ballData.x * this.canvasDimension.width;
      particle.y = ballData.y * this.canvasDimension.height;
      this.particles.push(particle);
    }
  }

  private createAnimatedDisplayParts(): void {
    for (let i = 0; i < this.avatarImages.length; i++) {
      const particle = new AvatarParticle(
        Math.round(Math.random() * 30 + 20),
        this.avatarImages[i],
        this.lines,
        this.shadows,
        this.particles,
        this.context
      );
      particle.x = Math.random() * this.canvasDimension.width;
      particle.y = Math.random() * this.canvasDimension.height;
      particle.vx = Math.random() * this.speed - this.speed / 3;
      particle.vy = Math.random() * this.speed - this.speed / 3;

      this.particles.push(particle);
    }
  }

  private createCenterAvatar(centerAvatarImage: string): AvatarParticle {
    const particle: AvatarParticle = new AvatarParticle(
      90,
      centerAvatarImage,
      this.lines,
      this.shadows,
      this.particles,
      this.context
    );
    particle.x = this.canvasDimension.width / 2;
    particle.y = this.canvasDimension.height / 2;
    particle.vx = 1;
    particle.vy = 1;
    particle.isCenter = true;

    return particle;
  }
}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarComponent, AvatarSize } from './avatar.component';
import { Observer } from 'rxjs';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvatarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    spyOn(component.handleClick, 'emit');
    fixture.detectChanges();
  });

  it('should create with default values', () => {
    expect(component).toBeTruthy();
    expect(component.size).toEqual(AvatarSize.mini);
  });

  describe('onClick', () => {
    it('Should emit the click event', () => {
      const e = {
        id: 1
      };
      component.onClick(e);
      expect(component.handleClick.emit).toHaveBeenCalledWith(e);
    });
  });

  describe('getClassNames', () => {
    it('Should return avatar class name when clickable', () => {
      component.isClickable = true;
      component.size = AvatarSize.large;
      const result = component.getClassNames();
      expect(result).toEqual('large clickable');
    });

    it('Should return avatar class name when not clickable', () => {
      component.isClickable = false;
      component.size = AvatarSize.medium;
      const result = component.getClassNames();
      expect(result).toEqual('medium');
    });
  });
});

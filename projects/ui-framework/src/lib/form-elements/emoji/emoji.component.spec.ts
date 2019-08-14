import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiComponent } from './emoji.component';
import {By} from '@angular/platform-browser';
import {TypographyModule} from '../../typography/typography.module';

describe('EmojiComponent', () => {
  let component: EmojiComponent;
  let fixture: ComponentFixture<EmojiComponent>;
  let emojiSelect;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TypographyModule],
      declarations: [ EmojiComponent ]
    })
    .compileComponents().then(() => {
      fixture = TestBed.createComponent(EmojiComponent);
      component = fixture.componentInstance;
      emojiSelect = spyOn(component.emojiSelect, 'emit');
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', function () {
    it('should render emoji-cat-list class', () => {
      component.toggleMenu();
      const catListObj = fixture.debugElement.query(By.css('.emoji-cat-list'));
      expect(catListObj).toBeTruthy();
    });
  });
  describe('toggleMenu', function () {
    it('should update menu state when using toggle menu,' +
      'and toggle menu function with force state', () => {
      expect(component.emojiMenuState).toBeFalsy();
      component.toggleMenu();
      fixture.detectChanges();
      expect(component.emojiMenuState).toBeTruthy();
      component.toggleMenu(true);
      fixture.detectChanges();
      expect(component.emojiMenuState).toBeTruthy();
    });
    it('should update menu state remain false when toggleWith force false', () => {
      component.toggleMenu(false);
      fixture.detectChanges();
      expect(component.emojiMenuState).toBeFalsy();
    });
  });
  describe('selectEmoji', function () {
    it('should select emoji trigger output with input string / emoji', () => {
      component.selectEmoji('😀');
      fixture.detectChanges();
      setTimeout(() => {
        expect(emojiSelect).toHaveBeenCalledWith('😀');
      });
    });
  });
});

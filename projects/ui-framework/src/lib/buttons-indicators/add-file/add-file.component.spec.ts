import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AddFileComponent} from './add-file.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {IconsModule} from '../../icons/icons.module';
import {Icons} from '../../icons/icons.enum';
import {By} from '@angular/platform-browser';

describe('AddFileComponent', () => {
  let fixture: ComponentFixture<AddFileComponent>;
  let component: AddFileComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddFileComponent],
      imports: [IconsModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AddFileComponent);
        component = fixture.componentInstance;
        spyOn(component.clicked, 'emit');
        fixture.detectChanges();
      });
  }));

  describe('onClick', () => {
    it('should emit Clicked event', () => {
      component.onClick();
      expect(component.clicked.emit).toHaveBeenCalled();
    });
  });
  describe('icon', () => {
    it('Should set selectedIcon to pencil icon if image url ', () => {
      component.imageUrl = 'file url';
      fixture.detectChanges();
      const iconElement = fixture.debugElement.query(By.css('b-icon')).nativeElement.getAttribute('ng-reflect-icon');
      expect(iconElement).toEqual('edit_field_pencil');
    });
    it('Should set original icon to pencil icon if no image url ', () => {
      component.icon = Icons.add_photo;
      fixture.detectChanges();
      const iconElement = fixture.debugElement.query(By.css('b-icon')).nativeElement.getAttribute('ng-reflect-icon');
      expect(iconElement).toEqual('add_photo');
    });
    it('Should set icon color to normal if no image url ', () => {
      // fixture.detectChanges();
      const iconElementColor =
        fixture.debugElement.query(By.css('b-icon')).nativeElement.getAttribute('ng-reflect-color');
      expect(iconElementColor).toEqual('normal');
    });
    it('Should set icon color to white if image url ', () => {
      component.imageUrl = 'some url';
      fixture.detectChanges();
      const iconElementColor =
        fixture.debugElement.query(By.css('b-icon')).nativeElement.getAttribute('ng-reflect-color');
      expect(iconElementColor).toEqual('white');
    });
  });
  describe('container', () => {
    it('Should add edit-mode class if image url', () => {
      component.imageUrl = 'some url';
      fixture.detectChanges();
      const elementContainerClasses =
        fixture.debugElement.query(By.css('.container')).nativeElement.classList;
      expect(elementContainerClasses).toContain('edit-mode')
    });
    it('Should add background image url to style if backgroundImage', () => {
      component.imageUrl = 'url';
      fixture.detectChanges();
      const elementContainerStyle =
        fixture.debugElement.query(By.css('.container')).nativeElement.getAttribute('style');
      expect(elementContainerStyle).toEqual('background-image: url("url");');
    });
  });
});

import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AddFileComponent} from './add-file.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {IconsModule} from '../../icons/icons.module';
import {Icons} from '../../icons/icons.enum';

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
      component.onClick('hello');
      expect(component.clicked.emit).toHaveBeenCalledWith('hello');
    });
  });
  describe('ngOnChanges', () => {
    it('Should set selectedIcon to pencil icon if image url ', () => {
      component.imageUrl = 'file url';
      component.ngOnChanges();
      expect(component.selectedIcon).toEqual('pencil_icon');
    });
    it('Should set selectedIcon to icon if no image url ', () => {
      component.icon = Icons.add_photo;
      component.ngOnChanges();
      expect(component.selectedIcon).toEqual('add_photo');
    });
  });
  describe('updateIconClass', () => {
    it('Should leave iconColor as undefined if no imageUrl', () => {
      component.updateIconClass();
      expect(component.iconColor).toEqual(undefined);
    });
    it('Should set iconColo white if imageUrl', () => {
      component.imageUrl = 'some url';
      component.updateIconClass();
      expect(component.iconColor).toEqual('white');
    });
  });
});

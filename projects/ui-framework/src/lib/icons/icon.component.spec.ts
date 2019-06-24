import { IconComponent } from './icon.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IconColor, Icons, IconSize } from './icons.enum';
import createSpyObj = jasmine.createSpyObj;
import SpyObj = jasmine.SpyObj;

describe('IconElementComponent', () => {
  let fixture: ComponentFixture<IconComponent>;
  let component: IconComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IconComponent],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconComponent);
    component = fixture.componentInstance;
    component.icon = Icons.toDos_link;
    fixture.detectChanges();
  });

  describe('getClassNames', () => {
    it('Should return correct icon class', () => {
      component.color = IconColor.primary;
      component.size = IconSize.medium;
      const result = component.getIconClass();
      expect(result).toEqual(Icons.toDos_link + ' medium primary');
    });
  });
});

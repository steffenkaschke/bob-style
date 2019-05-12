import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ActionsCellComponent} from './actions-cell.component';
import {MenuItem} from '../../../navigation/menu/menu.interface';
import {MenuModule} from '../../../navigation/menu/menu.module';
import {ButtonsModule} from '../../../buttons-indicators/buttons/buttons.module';
import {By} from '@angular/platform-browser';
import {IconColor, Icons} from '../../../icons/icons.enum';
import {ButtonType} from '../../../buttons-indicators/buttons/buttons.enum';

describe('ActionsCellComponent', () => {
  let component: ActionsCellComponent;
  let fixture: ComponentFixture<ActionsCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActionsCellComponent],
      imports: [
        MenuModule,
        ButtonsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionsCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should get menu items data', () => {
    const mockMenuItems: MenuItem[] = [{ label: 'first action' }, { label: 'second action' }];
    component.agInit({ value: mockMenuItems });
    expect(component.menuItems).toEqual(mockMenuItems);
  });

  it('should check menu element in template', () => {
    const mockMenuItems: MenuItem[] = [{ label: 'first action' }, { label: 'second action' }];
    component.menuItems = mockMenuItems;
    fixture.detectChanges();
    const menuElement = fixture.debugElement.query(By.css('b-menu'));
    expect(menuElement.componentInstance.menu).toEqual(mockMenuItems);
    expect(menuElement.componentInstance.openLeft).toBeTruthy();
  });

  it('should check b-square-button element', () => {
    const mockMenuItems: MenuItem[] = [{ label: 'first action' }, { label: 'second action' }];
    component.menuItems = mockMenuItems;
    fixture.detectChanges();
    const triggerButtonElement = fixture.debugElement.query(By.css('b-square-button'));
    expect(triggerButtonElement.componentInstance.color).toEqual(IconColor.dark);
    expect(triggerButtonElement.componentInstance.type).toEqual(ButtonType.tertiary);
    expect(triggerButtonElement.componentInstance.icon).toEqual(Icons.three_dots);
  });
});

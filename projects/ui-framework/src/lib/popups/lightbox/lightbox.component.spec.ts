import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LightboxComponent } from './lightbox.component';
import { MockComponent } from 'ng-mocks';
import { IconComponent } from '../../icons/icon.component';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { TypographyModule } from '../../typography/typography.module';

// describe('LightboxComponent', () => {
//   let component: LightboxComponent;
//   let fixture: ComponentFixture<LightboxComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [ButtonsModule, TypographyModule],
//       declarations: [LightboxComponent, MockComponent(IconComponent)]
//     })
//       .compileComponents()
//       .then(() => {
//         fixture = TestBed.createComponent(LightboxComponent);
//         component = fixture.componentInstance;
//         component.closeLightboxCallback = Function;
//         spyOn(component, 'closeLightboxCallback');
//         fixture.detectChanges();
//       });
//   }));

//   it('should call to close lightbox callback', () => {
//     component.closeLightbox();
//     expect(component.closeLightboxCallback).toHaveBeenCalled();
//   });
// });

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EditCommentComponent} from './edit-comment.component';
import {COMMENT_ITEM, eventEnterShiftKey} from '../comments.mocks';
import {AvatarModule} from '../../avatar/avatar/avatar.module';
import {MatTooltipModule} from '@angular/material';
import {TextareaModule} from '../../form-elements/textarea/textarea.module';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('EditCommentComponent', () => {
  let component: EditCommentComponent;
  let fixture: ComponentFixture<EditCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AvatarModule, MatTooltipModule, TextareaModule ],
      declarations: [ EditCommentComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents().then(() => {
      fixture = TestBed.createComponent(EditCommentComponent);
      component = fixture.componentInstance;
      component.placeholder = 'text of placeholder';
      component.comment = COMMENT_ITEM;
      fixture.detectChanges();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('enterPress', () => {
    let doneCommentingSpy;
    beforeEach(() => {
       doneCommentingSpy = spyOn(component as any, 'doneCommenting').and.callThrough();
    });
    it('should not run if shiftKey === false', () => {
      component.enterPress(eventEnterShiftKey(false));
      expect(doneCommentingSpy).toHaveBeenCalled();
    });
    it('should not run if shiftKey === false', () => {
      const sendCommentSpy = spyOn(component.sendComment as any, 'emit');
      component.commentInput.value = 'some input update';
      fixture.detectChanges();
      component.enterPress(eventEnterShiftKey(false));
      expect(sendCommentSpy).toHaveBeenCalledWith({content: 'some input update'});

    });
    it('should run if shiftKey === true', () => {
      component.enterPress(eventEnterShiftKey(true));
      expect(doneCommentingSpy).not.toHaveBeenCalled();
    });
  });
});

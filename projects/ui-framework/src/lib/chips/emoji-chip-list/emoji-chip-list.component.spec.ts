import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmojiChipListComponent } from './emoji-chip-list.component';

describe('EmojiChipListComponent', () => {
  let component: EmojiChipListComponent;
  let fixture: ComponentFixture<EmojiChipListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmojiChipListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmojiChipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

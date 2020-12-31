import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompactSearchComponent } from './compact-search.component';

describe('CompactSearchComponent', () => {
  let component: CompactSearchComponent;
  let fixture: ComponentFixture<CompactSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompactSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompactSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SimpleChange } from '@angular/core';

export const elementsFromFixture = (
  fixtr: ComponentFixture<any>,
  selector: string
) => {
  const debugElems = fixtr.debugElement.queryAll(By.css(selector));

  if (debugElems.length === 1) {
    return debugElems[0].nativeElement;
  } else {
    return debugElems.map(de => de.nativeElement);
  }
};

export const simpleChange = changes => {
  const simpleChanges = {};
  Object.keys(changes).forEach(key => {
    simpleChanges[key] = new SimpleChange(undefined, changes[key], false);
  });
  return simpleChanges;
};

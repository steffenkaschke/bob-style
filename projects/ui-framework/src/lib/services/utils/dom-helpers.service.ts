import { Injectable } from '@angular/core';

export interface Styles {
  [key: string]: string | number;
}

export interface TextProps {
  [key: string]: number;
}

export interface NotEmptyChildren {
  total: number;
  firstIndex: number | null;
}

@Injectable()
export class DOMhelpers {
  constructor() {}

  // set any css properties
  // (provided as JSON with props in kebab-case),
  // including css variables ('--color-red')
  public setCssProps(element: HTMLElement, props: Styles): void {
    for (const prop of Object.keys(props)) {
      element.style.setProperty(prop, props[prop] as string);
    }
  }

  // returns line-height and font-size as unitless numbers
  public getElementTextProps(element: HTMLElement): TextProps {
    const computedStyle = getComputedStyle(element),
      fontSize = parseFloat(computedStyle.fontSize),
      lineHeight =
        computedStyle.lineHeight.indexOf('px') !== -1
          ? parseFloat(computedStyle.lineHeight) / fontSize
          : computedStyle.lineHeight.indexOf('%') !== -1
          ? parseFloat(computedStyle.lineHeight) / 100
          : undefined;
    return {
      fontSize: fontSize,
      lineHeight: lineHeight
    };
  }

  public hasChildren(element: HTMLElement): boolean {
    return element.children.length !== 0;
  }

  public hasChildrenWithText(element: HTMLElement): NotEmptyChildren {
    const defAcc = { total: 0, firstIndex: null };
    return element.children.length > 0
      ? Array.from(element.children).reduce((acc, node, index) => {
          const hasText = !!(node as HTMLElement).innerText;
          return {
            total: hasText ? acc.total + 1 : acc.total,
            firstIndex:
              hasText && acc.firstIndex === null ? index : acc.firstIndex
          };
        }, defAcc)
      : defAcc;
  }

  public hasTextNodes(element: HTMLElement): boolean {
    return (
      element.childNodes.length > 0 &&
      !!Array.from(element.childNodes).find(
        node => node.nodeType === Node.TEXT_NODE
      )
    );
  }

  public isEmpty(element: HTMLElement): boolean {
    return element && !this.hasChildren(element) && !this.hasTextNodes(element);
  }

  // returns deepest element that has text
  // or multiple children with text
  // or combination of above
  public getDeepTextElement(element: HTMLElement): HTMLElement {
    let hasChildrenWithText = this.hasChildrenWithText(element);
    while (hasChildrenWithText.total === 1 && !this.hasTextNodes(element)) {
      element = element.children[hasChildrenWithText.firstIndex] as HTMLElement;
      hasChildrenWithText = this.hasChildrenWithText(element);
    }
    return element;
  }
}

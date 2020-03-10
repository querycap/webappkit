export function getComputedStyle(element: Element) {
  if (element.nodeType !== 1) {
    return {} as CSSStyleDeclaration;
  }
  const window = element.ownerDocument!.defaultView!;
  return window.getComputedStyle(element, null);
}

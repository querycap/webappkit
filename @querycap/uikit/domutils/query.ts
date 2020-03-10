import { getComputedStyle } from "./style";

export function getParentNode(element: Element) {
  if (element.nodeName === "HTML") {
    return element;
  }
  return (element.parentNode || (element as any).host) as Element;
}

export const getScrollableParent = (element: Element | null): Element => {
  if (!element) {
    return document.body as Element;
  }

  switch (element.nodeName) {
    case "HTML":
    case "BODY":
      return element.ownerDocument!.body;
    case "#document":
      return (element as any).body as Element;
  }

  // Firefox want us to check `-x` and `-y` variations as well
  const { overflow, overflowX, overflowY } = getComputedStyle(element);
  if (/(auto|scroll|overlay)/.test(`${overflow}${overflowY}${overflowX}`)) {
    return element;
  }

  return getScrollableParent(getParentNode(element) as any);
};

export const getScrollParents = (element: Element): Element[] => {
  const scrollParents: Element[] = [];

  let scrollParent = getScrollableParent(element);

  while (scrollParent.nodeName !== "BODY") {
    scrollParents.push(scrollParent);
    scrollParent = getScrollableParent(scrollParent.parentNode as Element);
  }

  scrollParents.push(scrollParent);

  return scrollParents;
};

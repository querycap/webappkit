import React, { memo, useLayoutEffect, useRef } from "react";

export const HTMLComment = memo(({ text = "" }: { text: string }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const el = ref.current;
    const parent = el.parentNode;
    const comm = globalThis.document.createComment(` ${text.trim()} `);

    try {
      if (parent && parent.contains(el)) {
        parent.replaceChild(comm, el);
      }
    } catch (err) {
      console.error(err);
    }

    return () => {
      if (parent && el && comm) {
        parent.replaceChild(el, comm);
      }
    };
  }, []);

  return <span ref={ref} style={{ display: "none" }} />;
});

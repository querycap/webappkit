import React, { memo, useLayoutEffect, useRef, useState } from "react";

export const HTMLComment = memo(({ text = "" }: { text: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const el = ref.current;
    const parent = el.parentNode;

    if (!parent) {
      return;
    }

    const comm = globalThis.document.createComment(` ${text.trim()} `);

    try {
      parent.insertBefore(comm, el);
    } catch (err) {
      console.error(err);
    }

    setReady(true);

    return () => {
      if (comm) {
        try {
          comm.remove();
        } catch (err) {
          console.error(err);
        }
      }
    };
  }, []);

  return <>{ready ? null : <span ref={ref} style={{ display: "none" }} />}</>;
});

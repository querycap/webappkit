import { preventDefault } from "@querycap-ui/core";
import { HTMLComment } from "@querycap/reactutils";
import { map } from "lodash";
import  { useState } from "react";
import { pipe } from "rxjs";

export const HTMLComments = () => {
  const [v, setV] = useState<any[]>([]);

  return (
    <>
      <HTMLComment text={"todo"} />
      {map(v, (_, i) => (
        <span key={i}>
          <HTMLComment text={"todo"} />
          {i}
        </span>
      ))}
      <HTMLComment text={"todo"} />
      <a href="#" onClick={pipe(preventDefault, () => setV((v) => [...v, null]))}>
        add
      </a>
    </>
  );
};

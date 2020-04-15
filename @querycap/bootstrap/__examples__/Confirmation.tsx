import { DialogPrompt, ModalDialog } from "@querycap-ui/blocks";
import { preventDefault } from "@querycap-ui/core";
import { useConfirm, useConfirmContext } from "@querycap/bootstrap";
import { useObservable } from "@reactorx/core";
import { isUndefined, map } from "lodash";
import React from "react";
import { pipe } from "rxjs";

const Confirmations = () => {
  const { confirmations$, confirm, destroy } = useConfirmContext();

  const confirmations = useObservable(confirmations$);

  return (
    <>
      {map(confirmations, ({ id, content, confirmed }) => (
        <ModalDialog
          key={id}
          isOpen={isUndefined(confirmed)}
          onRequestClose={() => confirm(id, false)}
          onDestroyed={() => destroy(id)}>
          <DialogPrompt onRequestClose={() => confirm(id, false)} onRequestConfirm={() => confirm(id, true)}>
            {content}
          </DialogPrompt>
        </ModalDialog>
      ))}
    </>
  );
};

export const Confirmation = () => {
  const confirm = useConfirm();

  return (
    <>
      <Confirmations />
      <a
        href="#"
        onClick={pipe(preventDefault, () => {
          confirm("hello", (confirmed) => {
            confirmed && console.log("111");
          });
        })}>
        trigger confirm
      </a>
    </>
  );
};

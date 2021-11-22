import { DialogPrompt, ModalDialog } from "@querycap-ui/blocks";
import { preventDefault } from "@querycap-ui/core";
import { confirmationStore, useConfirm } from "@querycap/notify";
import { useObservable } from "@reactorx/core";
import { isUndefined, map } from "lodash";

import { pipe } from "rxjs";

const Confirmations = () => {
  const [confirmations$, { confirm, destroy }] = confirmationStore.useState();

  const confirmations = useObservable(confirmations$);

  return (
    <>
      {map(confirmations, ({ id, content, confirmed }) => (
        <ModalDialog
          key={id}
          isOpen={isUndefined(confirmed)}
          onRequestClose={() => confirm({ id, confirmed: false })}
          onDestroyed={() => destroy(id)}
        >
          <DialogPrompt
            onRequestClose={() => confirm({ id, confirmed: false })}
            onRequestConfirm={() => confirm({ id, confirmed: true })}
          >
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
          confirm("hello", console.log);
          confirm("hello", console.log);
        })}
      >
        trigger confirm
      </a>
    </>
  );
};

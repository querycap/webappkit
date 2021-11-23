import { roundedEm } from "@querycap-ui/core";
import { preventDefault, select, shadows, stopPropagation, theme, withTextSize } from "@querycap-ui/core/macro";
import { Button } from "@querycap-ui/form-controls";
import { IconX } from "@querycap-ui/icons";
import { Stack } from "@querycap-ui/layouts";
import { ReactNode } from "react";
import { pipe } from "rxjs";

export const DialogContainer = withTextSize(theme.fontSizes.s)(
  ({ width = 400, children, ...otherProps }: { width?: number; children?: ReactNode }) => {
    return (
      <div
        css={select()
          .position("relative")
          .fontSize(theme.state.fontSize)
          .borderRadius(theme.radii.s)
          .minWidth(width)
          .backgroundColor(theme.state.backgroundColor)
          .boxShadow(shadows.large)}
        {...otherProps}
      >
        {children}
      </div>
    );
  },
);

export const DialogClose = ({ float, onRequestClose }: { float?: boolean; onRequestClose: () => void }) => {
  return (
    <a
      href="#"
      onClick={pipe(preventDefault, stopPropagation, onRequestClose)}
      css={select()
        .opacity(0.3)
        .colorFill(theme.state.color)
        .with(float && select().position("absolute").right(0).top(0).padding(roundedEm(0.9)))}
    >
      <IconX />
    </a>
  );
};

export const DialogHeading = ({ children }: { children?: ReactNode }) => {
  return (
    <div
      role={"title"}
      css={select()
        .paddingX(roundedEm(1.2))
        .paddingY(roundedEm(0.6))
        .borderBottom("1px solid")
        .display("flex")
        .alignItems("center")
        .justifyContent("space-between")
        .borderColor(theme.state.borderColor)
        .with(select("& h1,h2,h3,h4,h5,h6").margin(0))}
    >
      {children}
    </div>
  );
};

export const DialogContent = ({ children }: { children?: ReactNode }) => {
  return (
    <Stack spacing={roundedEm(1.2)} css={select().padding(roundedEm(1.2))} role={"content"}>
      {children}
    </Stack>
  );
};

export const DialogControls = ({ children }: { children?: ReactNode }) => {
  return (
    <Stack spacing={roundedEm(0.6)} inline justify="flex-end">
      {children}
    </Stack>
  );
};

export const Dialog = ({
  title,
  children,
  onRequestClose,
  onRequestConfirm,
  confirmText = "确定",
  cancelText = "取消",
  ...otherProps
}: {
  title: ReactNode;
  children?: ReactNode;
  onRequestClose: () => void;
  onRequestConfirm: () => void;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
}) => {
  return (
    <DialogContainer {...otherProps}>
      <DialogHeading>
        <h4>{title}</h4>
        <DialogClose onRequestClose={onRequestClose} />
      </DialogHeading>
      <DialogContent>
        <div>{children}</div>
        <DialogControls>
          <Button small invisible onClick={onRequestClose}>
            {cancelText}
          </Button>
          <Button small primary onClick={onRequestConfirm}>
            {confirmText}
          </Button>
        </DialogControls>
      </DialogContent>
    </DialogContainer>
  );
};

export const DialogPrompt = ({
  children,
  onRequestClose,
  onRequestConfirm,
  confirmText = "确定",
  cancelText = "取消",
  ...otherProps
}: {
  children?: ReactNode;
  onRequestClose: () => void;
  onRequestConfirm: () => void;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
}) => {
  return (
    <DialogContainer {...otherProps}>
      <DialogContent>
        <div>{children}</div>
        <DialogControls>
          <Button small invisible onClick={onRequestClose}>
            {cancelText}
          </Button>
          <Button small primary onClick={onRequestConfirm}>
            {confirmText}
          </Button>
        </DialogControls>
      </DialogContent>
    </DialogContainer>
  );
};

export const DialogAlert = ({ children, onRequestClose }: { children?: ReactNode; onRequestClose: () => void }) => {
  return (
    <DialogContainer>
      <DialogClose float onRequestClose={onRequestClose} />
      <div css={select().padding(roundedEm(1.4))}>{children}</div>
    </DialogContainer>
  );
};

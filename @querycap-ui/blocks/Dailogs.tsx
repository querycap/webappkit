import { selector, themes, withTextSize, shadows } from "@querycap-ui/core";
import { Button } from "@querycap-ui/form-controls";
import { IconX } from "@querycap-ui/icons";
import { Stack } from "@querycap-ui/layouts";
import React, { ReactNode } from "react";

export const DialogContainer = withTextSize(themes.fontSizes.s)(
  ({ width = 400, children }: { width?: number; children?: ReactNode }) => {
    return (
      <div
        css={selector()
          .position("relative")
          .fontSize(themes.state.fontSize)
          .borderRadius(themes.radii.s)
          .width(width)
          .backgroundColor(themes.state.backgroundColor)
          .boxShadow(shadows.large)}>
        {children}
      </div>
    );
  },
);

export const DialogClose = ({ float, onRequestClose }: { float?: boolean; onRequestClose: () => void }) => {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onRequestClose();
      }}
      css={selector()
        .opacity(0.3)
        .colorFill(themes.state.color)
        .with(float && selector().position("absolute").right(0).top(0).padding(themes.space.s3))}>
      <IconX />
    </a>
  );
};

export const DialogHeading = ({ children }: { children?: ReactNode }) => {
  return (
    <div
      css={selector()
        .paddingX(themes.space.s3)
        .paddingY(themes.space.s2)
        .borderBottom("1px solid")
        .display("flex")
        .alignItems("center")
        .justifyContent("space-between")
        .borderColor(themes.state.borderColor)
        .with(selector("& h1,h2,h3,h4,h5,h6").margin(0))}>
      {children}
    </div>
  );
};

export const DialogContent = ({ children }: { children?: ReactNode }) => {
  return (
    <Stack spacing={themes.space.s4} css={selector().paddingX(themes.space.s3).paddingY(themes.space.s3)}>
      {children}
    </Stack>
  );
};

export const DialogControls = ({ children }: { children?: ReactNode }) => {
  return (
    <Stack spacing={themes.space.s2} inline justify="flex-end">
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
}: {
  title: ReactNode;
  children?: ReactNode;
  onRequestClose: () => void;
  onRequestConfirm: () => void;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
}) => {
  return (
    <DialogContainer>
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
}: {
  children?: ReactNode;
  onRequestClose: () => void;
  onRequestConfirm: () => void;
  confirmText?: ReactNode;
  cancelText?: ReactNode;
}) => {
  return (
    <DialogContainer>
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
      <div css={selector().padding(themes.space.s4)}>{children}</div>
    </DialogContainer>
  );
};

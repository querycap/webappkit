import { roundedEm, select, shadows, theme, transparentize } from "@querycap-ui/core/macro";
import { getBoundingClientRect, Overlay, position } from "@querycap/uikit";
import { useObservableEffect } from "@reactorx/core";
import { flow } from "lodash";
import React, { forwardRef, ReactNode, RefObject, useRef } from "react";
import { distinctUntilChanged, tap } from "rxjs/operators";
import { OptGroup, OptGroupProps, OptionFocusedAttr, useSelect } from "./Select";

export const Menu = forwardRef(({ children, ...otherProps }: { children: ReactNode }, containerRef) => {
  return (
    <div css={select().padding("0.6em 0 0")} {...otherProps}>
      <div
        ref={containerRef as any}
        css={select()
          .fontSize(theme.state.fontSize)
          .backgroundColor(theme.state.backgroundColor)
          .colorFill(theme.state.color)
          .borderRadius(theme.radii.s)
          .minWidth(100)
          .maxHeight(320)
          .boxShadow(shadows.large)
          .padding("0.2em 0")
          .overflowY("auto")}>
        {children}
      </div>
    </div>
  );
});

export function SelectMenu({ children, ...otherProps }: { children: ReactNode }) {
  const ctx = useSelect();

  const containerRef = useRef<HTMLDivElement>(null);

  useObservableEffect(() => {
    if (!containerRef.current) {
      return;
    }

    return [
      ctx.focused$.pipe(
        distinctUntilChanged(),
        tap((focused) => {
          if (!focused) {
            return;
          }

          containerRef.current!.querySelector(`[${OptionFocusedAttr}]`)?.removeAttribute(OptionFocusedAttr);

          const $focusedOpt = containerRef.current!.querySelector(`[data-opt="${focused}"]`) as HTMLElement;

          if ($focusedOpt) {
            $focusedOpt.setAttribute(OptionFocusedAttr, String(true));

            const rect = position($focusedOpt, containerRef.current!);
            const parentRect = getBoundingClientRect(containerRef.current!);

            if (rect.top > parentRect.height - 2) {
              containerRef.current!.scrollTop = rect.top;
            }

            if (rect.top < 0) {
              containerRef.current!.scrollTop += rect.top;
            }
          }
        }),
      ),
    ];
  }, [containerRef.current]);

  return (
    <Menu {...otherProps} ref={containerRef}>
      {children}
    </Menu>
  );
}

export function SelectMenuPopover({
  fullWidth,
  onRequestClose,
  updateBy,
  placement,
  children,
  triggerRef,
}: {
  triggerRef: RefObject<HTMLElement>;
  onRequestClose: () => void;
  children: ReactNode;
  fullWidth?: boolean;
  placement?: string;
  updateBy?: any[];
}) {
  return (
    <Overlay
      updateBy={updateBy}
      triggerRef={triggerRef}
      placement={placement as any}
      fullWidth={fullWidth}
      onRequestClose={onRequestClose}>
      <SelectMenu>{children}</SelectMenu>
    </Overlay>
  );
}

export function MenuPopover({
  fullWidth,
  onRequestClose,
  updateBy,
  placement,
  children,
  triggerRef,
}: {
  triggerRef: RefObject<HTMLElement>;
  onRequestClose: () => void;
  children: ReactNode;
  fullWidth?: boolean;
  placement?: string;
  updateBy?: any[];
}) {
  return (
    <Overlay
      updateBy={updateBy}
      triggerRef={triggerRef}
      placement={placement as any}
      fullWidth={fullWidth}
      onRequestClose={onRequestClose}>
      <Menu>{children}</Menu>
    </Overlay>
  );
}

console.log("MenuGroup");

export const MenuGroup = ({ children }: { children: ReactNode }) => (
  <div
    css={select()
      .paddingY(flow(theme.state.fontSize, roundedEm(0.25)))
      .with(select("& + &").borderTop("1px solid").borderColor(theme.state.borderColor))
      .with(
        select("& > *")
          .display("block")
          .paddingX("1em")
          .paddingY(flow(theme.state.fontSize, roundedEm(0.25)))
          .colorFill(theme.state.color)
          .cursor("pointer")
          .with(
            select(`&[${OptionFocusedAttr}=true]`)
              .cursor("pointer")
              .color(theme.state.color)
              .backgroundColor(flow(theme.state.color, transparentize(0.88))),
          ),
      )}>
    {children}
  </div>
);

export const MenuOptGroup = ({ children }: { children: OptGroupProps["children"] }) => (
  <MenuGroup>
    <OptGroup>{children}</OptGroup>
  </MenuGroup>
);

import type {  ReactElement  } from "react";

export const createIcon = (svg: ReactElement) => (props: any) => <div {...props}>{svg}</div>;

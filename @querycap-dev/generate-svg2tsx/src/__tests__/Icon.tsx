import React from "react";

export const createIcon = (svg: React.ReactElement) => (props: any) => <div {...props}>{svg}</div>;

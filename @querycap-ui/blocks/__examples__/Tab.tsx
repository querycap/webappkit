import { Tab, Tabs } from "@querycap-ui/blocks";
import React from "react";

export const TabDemo = () => {
  return (
    <div>
      <Tabs>
        <Tab name={"a"} title={"短信验证"}>
          123123
        </Tab>
        <Tab name={"b"} title={"密码验证"}>
          13123
        </Tab>
      </Tabs>
    </div>
  );
};

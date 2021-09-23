import { Tab, Tabs } from "@querycap-ui/blocks";

export const TabDemo = () => {
  return (
    <div>
      <Tabs cacheKey={"tab"}>
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

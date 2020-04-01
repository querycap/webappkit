import { FormControl, Input, InputIcon } from "@querycap-ui/form-controls";
import { IconEyeOff, IconLock, IconUser } from "@querycap-ui/icons";
import { headings } from "@querycap-ui/texts";
import React from "react";

export const Inputs = () => {
  return (
    <>
      <h2 css={headings.h2}>表单 </h2>
      <div>
        <FormControl label={"用户名"} desc={"手机号/邮箱"}>
          <Input>
            <InputIcon>
              <IconUser />
            </InputIcon>
            <input name="username" type="text" />
            <InputIcon>
              <IconEyeOff />
            </InputIcon>
          </Input>
        </FormControl>
        <FormControl label={"密码"} error={"密码不正确"}>
          <Input danger>
            <InputIcon>
              <IconLock />
            </InputIcon>
            <input name={"password"} type="password" />
          </Input>
        </FormControl>
      </div>
    </>
  );
};

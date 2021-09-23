import { select } from "@querycap-ui/core";
import { Button, FormControl, Input, InputControlSuffix, InputIcon } from "@querycap-ui/form-controls";
import { IconEyeOff, IconLock, IconUser } from "@querycap-ui/icons";
import { headings } from "@querycap-ui/texts";

export const Inputs = () => {
  return (
    <>
      <h2 css={headings.h2}>表单 </h2>
      <div css={select().width(220)}>
        <FormControl label={"用户名"} desc={"手机号/邮箱"}>
          <Input>
            <InputIcon>
              <IconUser />
            </InputIcon>
            <input name="username" type="text" />
            <InputIcon pullRight>
              <IconEyeOff />
            </InputIcon>
          </Input>
        </FormControl>
        <FormControl label={"密码"} error={"密码不正确"}>
          <Input danger small>
            <InputIcon>
              <IconLock />
            </InputIcon>
            <input name={"password"} type="password" />
          </Input>
        </FormControl>
        <FormControl label={"密码"} error={"密码不正确"}>
          <Input danger>
            <input name={"password"} type="password" />
            <InputControlSuffix>
              <Button small invisible css={select().paddingX("0.5em")}>
                发送验证码
              </Button>
            </InputControlSuffix>
          </Input>
        </FormControl>
      </div>
    </>
  );
};

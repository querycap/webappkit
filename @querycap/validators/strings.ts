import { isEmpty } from "lodash";
import { createValidator } from "./validator";

export const required = createValidator("必填", (v: any) => !isEmpty(v));

export const validIDNumber = createValidator("请填写 18 位 合法身份证", (value: string) => {
  if (value.length !== 18) {
    return false;
  }

  const first17 = value.slice(0, 17);

  if (!/\d{17}/.test(first17)) {
    return false;
  }

  const lastChar = value.slice(17);

  const numbers = first17.split("");
  const first = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += Number(numbers[i]) * first[i];
  }
  const expectedLastChar = "10X98765432"[sum % 11];

  return lastChar === expectedLastChar;
});

export const validEmail = createValidator("请填写有效邮箱", (v: string) =>
  /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(v),
);

export const validCellPhone = createValidator("请填写有效手机号", (v: string) => /^1\d{10}$/.test(v));

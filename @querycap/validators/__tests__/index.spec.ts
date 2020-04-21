import { all, createValidator, errorMsg, required, validEmail } from "@querycap/validators";
import { pipe } from "rxjs";

describe("validate", () => {
  it("required", () => {
    expect(errorMsg(required()(""))).toBe("必填");
    expect(errorMsg(required()("111"))).toBe(undefined);
  });

  it("pipable", () => {
    expect(errorMsg(pipe(required(), validEmail())(""))).toBe("必填");
    expect(errorMsg(pipe(required(), validEmail())("xxx"))).toBe("请填写有效邮箱");
  });

  it("all", () => {
    const v1 = createValidator("长度不够 10", (v = "") => v.length > 10);
    const v2 = createValidator("长度不够 20", (v = "") => v.length > 20);

    expect(errorMsg(pipe(required(), all(v1(), v2()))(""))).toBe("必填");
    expect(errorMsg(pipe(required(), all(v1(), v2()))("1"))).toBe("长度不够 10; 长度不够 20");
  });
});

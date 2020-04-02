import { theme, ThemeState } from "@querycap-ui/core";
import { Button, FormControlWithField, InputSelect } from "@querycap-ui/form-controls";
import { Stack } from "@querycap-ui/layouts";
import { SimpleInputText, useNewForm } from "@querycap/form";
import { chain, required, validCellPhone, validEmail } from "@querycap/validators";
import React from "react";

const displayGender = (v: string) => {
  switch (v) {
    case "MALE":
      return (
        <span>
          M<small>ale</small>
        </span>
      );
    case "FEMALE":
      return (
        <span>
          F<small>emale</small>
        </span>
      );
  }
  return "";
};

export const SimpleForm = () => {
  const [{ reset }, Form] = useNewForm("SimpleForm", {
    name: "231",
    email: "xxx@x.com",
  });

  return (
    <ThemeState fontSize={theme.fontSizes.s}>
      <Form
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
        }}>
        <FormControlWithField name="gender">
          {(props) => <InputSelect {...props} enum={["FEMALE", "MALE"]} display={displayGender} />}
        </FormControlWithField>
        <FormControlWithField name="cell" validate={chain(required(), validCellPhone())}>
          {SimpleInputText}
        </FormControlWithField>
        <FormControlWithField name="name">{SimpleInputText}</FormControlWithField>
        <FormControlWithField name="email" desc="邮箱" validate={chain(required(), validEmail())}>
          {SimpleInputText}
        </FormControlWithField>
        <Stack inline spacing={theme.space.s2}>
          <Button type="submit" primary>
            Submit
          </Button>
          <Button
            onClick={(e) => {
              e.preventDefault();
              reset();
            }}>
            Reset
          </Button>
        </Stack>
      </Form>
    </ThemeState>
  );
};

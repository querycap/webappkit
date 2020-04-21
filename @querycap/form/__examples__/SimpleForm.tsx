import { preventDefault, ThemeState } from "@querycap-ui/core";
import { Button, FormControls, FormControlWithField, InputSelect } from "@querycap-ui/form-controls";
import { SimpleInputText, useNewForm } from "@querycap/form";
import { required, validCellPhone, validEmail } from "@querycap/validators";
import React from "react";
import { pipe } from "rxjs";

const displayGender = (v: string) => {
  switch (v) {
    case "MALE":
      return (
        <span>
          M<small>ale</small> ~~~~~~~~~~~~~~~~~~~~~~~~~~~
        </span>
      );
    case "FEMALE":
      return (
        <span>
          F<small>emale</small> ~~~~~~~~~~~~~~~~~~~~~~~~~~~
        </span>
      );
  }
  return "";
};

export const SimpleForm = () => {
  const [{ reset }, Form] = useNewForm("SimpleForm", {
    name: "231",
    email: "xxx@x.com",
    gender: "FEMALE",
  });

  return (
    <ThemeState>
      <Form
        onSubmit={(values) => {
          alert(JSON.stringify(values, null, 2));
        }}>
        <FormControlWithField name="gender">
          {(props) => <InputSelect {...props} enum={["FEMALE", "MALE"]} display={displayGender} />}
        </FormControlWithField>
        <FormControlWithField name="cell" validate={pipe(required(), validCellPhone())}>
          {SimpleInputText}
        </FormControlWithField>
        <FormControlWithField name="name">{SimpleInputText}</FormControlWithField>
        <FormControlWithField name="email" desc="邮箱" validate={pipe(required(), validEmail())}>
          {SimpleInputText}
        </FormControlWithField>
        <FormControls>
          <Button type="submit" primary>
            Submit
          </Button>
          <Button onClick={pipe(preventDefault, reset)}>Reset</Button>
        </FormControls>
      </Form>
    </ThemeState>
  );
};

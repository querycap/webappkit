import { theme } from "@querycap-ui/core";
import { Button, FormControlWithField } from "@querycap-ui/form-controls";
import { Stack } from "@querycap-ui/layouts";
import { SimpleInputText, useNewForm } from "@querycap/form";
import { required, validateQueue, validEmail } from "@querycap/validators";
import React from "react";

export function SimpleForm() {
  const [{ reset }, Form] = useNewForm("SimpleForm", {
    firstName: "123",
    lastName: "231",
    email: "xxx@x.com",
  });

  return (
    <Form
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}>
      <FormControlWithField name="firstName">{SimpleInputText}</FormControlWithField>
      <FormControlWithField name="lastName">{SimpleInputText}</FormControlWithField>
      <FormControlWithField name="email" desc={"邮箱"} validate={validateQueue(required(), validEmail())}>
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
  );
}

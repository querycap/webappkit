import { select, roundedEm } from "@querycap-ui/core/macro";
import { Button, FormControlWithField, InputIcon } from "@querycap-ui/form-controls";
import { IconTrash } from "@querycap-ui/icons";
import { Stack } from "@querycap-ui/layouts";
import { FieldArray, FormSection, SimpleInputText, useNewForm } from "@querycap/form";

export const NestedForm = () => {
  const [, Form] = useNewForm("NestedForm");

  return (
    <Form
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
    >
      <FormSection name="people">
        <FormControlWithField name="firstName">{SimpleInputText}</FormControlWithField>
        <FormControlWithField name="lastName">{SimpleInputText}</FormControlWithField>
      </FormSection>
      <FieldArray name={"addresses"} defaultValues={[""]}>
        {({ each, remove, add }) => (
          <>
            {each((i) => (
              <Stack inline spacing={roundedEm(0.3)}>
                <div css={select().flex(1)}>
                  <FormControlWithField>
                    {(props) => (
                      <>
                        <SimpleInputText
                          {...props}
                          autoFocus={i !== 0}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              add("");
                            }
                          }}
                        />
                        <InputIcon>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              remove(i);
                            }}
                          >
                            <IconTrash />
                          </a>
                        </InputIcon>
                      </>
                    )}
                  </FormControlWithField>
                </div>
              </Stack>
            ))}
          </>
        )}
      </FieldArray>
      <div>
        <Button type="submit" primary>
          Submit
        </Button>
      </div>
    </Form>
  );
};

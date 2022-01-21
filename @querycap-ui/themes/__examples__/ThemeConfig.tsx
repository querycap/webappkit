import { defaultTheme, select, theme } from "@querycap-ui/core";
import { FormControlWithField, InputSelect } from "@querycap-ui/form-controls";
import { Stack } from "@querycap-ui/layouts";
import { SimpleInputText, useNewForm } from "@querycap/form";

export const Headings = () => {
  const [, Form] = useNewForm('theme', {})

  console.info(defaultTheme.fontSizes.normal, '===')
  return (
    <Form onSubmit={(value) => {
      console.info(value)
    }}>
      <h2>颜色选择</h2>
      <Stack inline spacing={32}>
        {Object.keys(theme.colors).map(e => <div key={e}>
          {e}
        </div>)}
      </Stack>
      <h2>字体配置</h2>
      <h4>支持的字体有：***，***，***</h4>
      <Stack inline spacing={32}>
        <div css={select().minWidth(300)}>
          <FormControlWithField name="fontFamily" label="全局字体"  >{(props) =>
            <InputSelect {...props} enum={defaultTheme.fonts.normal.split(',')} ></InputSelect>
          }
          </FormControlWithField></div>
        <div css={select().minWidth(300)}>
          <FormControlWithField name="fontFamilyHead" label="等宽字体">{(props) =>
            <InputSelect {...props} enum={defaultTheme.fonts.mono.split(',')} css={select().minWidth(200)}></InputSelect>
          }
          </FormControlWithField>
        </div>
      </Stack>
      <h4>字体尺寸</h4>
      <Stack inline spacing={16}>
        {Object.keys(defaultTheme.fontSizes).map(e => <div key={e}>
          <FormControlWithField name={`fontSize.${e}`} label={e}>{(props) =>
            <SimpleInputText  {...props} defaultValue={defaultTheme.fontSizes.normal} />
          }
          </FormControlWithField>
        </div>)}
      </Stack>
      <h4>间距</h4>
      <Stack inline spacing={16}>
        {Object.keys(theme.radii).map(e => <div key={e}>
          <FormControlWithField name={`space.${e}`} label={e}>{(props) =>
            <SimpleInputText  {...props} />
          }
          </FormControlWithField>
        </div>)}
      </Stack>
      <h4>圆角</h4>
      <Stack inline spacing={16}>
        {Object.keys(theme.radii).map(e => <div key={e}>
          <FormControlWithField name={`radii.${e}`} label={e}>{(props) =>
            <SimpleInputText  {...props} />
          }
          </FormControlWithField>
        </div>)}
      </Stack>
      <h4>fontWeight</h4>
      <Stack inline spacing={16}>
        {Object.keys(theme.fontWeights).map(e => <div key={e}>
          <FormControlWithField name={`fontWeights.${e}`} label={e}>{(props) =>
            <SimpleInputText  {...props} />
          }
          </FormControlWithField>
        </div>)}
      </Stack>
      <h4>线高</h4>
      <Stack inline spacing={16}>
        {Object.keys(theme.lineHeights).map(e => <div key={e}>
          <FormControlWithField name={`lineHeights.${e}`} label={e}>{(props) =>
            <SimpleInputText  {...props}
            // defaultValue={defaultTheme.lineHeights[e as any]}
            />
          }
          </FormControlWithField>
        </div>)}
      </Stack>
    </Form>
  );
};

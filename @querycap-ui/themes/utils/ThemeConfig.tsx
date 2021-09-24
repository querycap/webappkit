import { theme } from "@querycap-ui/core";
import { FormControlWithField, InputSelect } from "@querycap-ui/form-controls";
import { Stack } from "@querycap-ui/layouts";
import { SimpleInputText, useNewForm } from "@querycap/form";
// import { SketchPicker } from 'react-color';

export const ThemeConfig = () => {
    const fontFamily = ['']
    const [, Form] = useNewForm('theme', {})
    return <>
        <Form>
            <h2>颜色选择</h2>
            <Stack inline spacing={32}>
                {Object.keys(theme.colors).map(e => <div key={e}>
                    {e}
                </div>)}
            </Stack>
            <h2>字体配置</h2>
            <h4>支持的字体有：***，***，***</h4>
            <Stack inline spacing={32}>
                <FormControlWithField name="fontFamily" label="全局字体">{(props) =>
                    <InputSelect {...props} enum={fontFamily}></InputSelect>
                }
                </FormControlWithField>
                <FormControlWithField name="fontFamilyHead" label="等款字体">{(props) =>
                    <InputSelect {...props} enum={fontFamily}></InputSelect>
                }
                </FormControlWithField>
            </Stack>
            <Stack inline spacing={16}>
                {Object.keys(theme.fontSizes).map(e => <div key={e}>
                    <span>{e}</span>
                    <FormControlWithField name={`font.${e}`} label="字体尺寸">{(props) =>
                        <SimpleInputText  {...props} />
                    }
                    </FormControlWithField>
                </div>)}
            </Stack>
            <Stack inline spacing={16}>
                {Object.keys(theme.radii).map(e => <div key={e}>
                    <span>{e}</span>
                    <FormControlWithField name={`space.${e}`} label="间距">{(props) =>
                        <SimpleInputText  {...props} />
                    }
                    </FormControlWithField>
                </div>)}
            </Stack>
        </Form>
    </>
}
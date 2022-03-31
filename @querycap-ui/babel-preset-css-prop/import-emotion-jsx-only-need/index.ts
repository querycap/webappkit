import { Visitor } from "@babel/core";
// @ts-ignore
import jsx from "@babel/plugin-syntax-jsx";

const createComponentBlock = (value: string) => ({
  type: "CommentBlock",
  value,
});

export const importEmotionJSXOnlyNeed = () => {
  return {
    name: "import-emotion-jsx-only-need",
    inherits: (jsx as any).default || jsx, // ugly to make esm & cjs work
    visitor: {
      Program: {
        enter(path, state: any) {
          let hasJSX = false;
          let needEmotion = false;

          path.traverse({
            JSX() {
              hasJSX = true;
            },
            JSXAttribute(path) {
              if (path.get("name").node.name === "css") {
                needEmotion = true;
              }
            },
          });

          if (hasJSX) {
            if (needEmotion) {
              state.file.ast.comments.push(createComponentBlock(`@jsxImportSource @querycap-ui/core`));
            }
          }
        },
      },
    } as Visitor,
  };
};

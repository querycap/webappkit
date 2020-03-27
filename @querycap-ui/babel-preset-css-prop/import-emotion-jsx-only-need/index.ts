import { Visitor } from "@babel/core";
// @ts-ignore
import { addNamed } from "@babel/helper-module-imports";
// @ts-ignore
import jsx from "@babel/plugin-syntax-jsx";

const createComponentBlock = (value: string) => ({
  type: "CommentBlock",
  value,
});

export const importEmotionJSXOnlyNeed = () => {
  return {
    name: "import-emotion-jsx-only-need",
    inherits: jsx,
    visitor: {
      Program: {
        enter(path, state: any) {
          let hasFragment = false;
          let hasJSX = false;
          let needEmotion = false;

          path.traverse({
            JSX() {
              hasJSX = true;
            },
            JSXFragment() {
              hasFragment = true;
            },
            JSXAttribute(path) {
              if (path.get("name").node.name === "css") {
                needEmotion = true;
              }
            },
          });

          if (hasJSX) {
            if (needEmotion) {
              state.file.ast.comments.push(createComponentBlock(`@jsx ${addNamed(path, "jsx", "@emotion/core").name}`));
            } else {
              state.file.ast.comments.push(
                createComponentBlock(`@jsx ${addNamed(path, "createElement", "react").name}`),
              );
            }

            if (hasFragment) {
              state.file.ast.comments.push(
                createComponentBlock(`@jsxFrag ${addNamed(path, "Fragment", "react").name}`),
              );
            }
          }
        },
      },
    } as Visitor,
  };
};

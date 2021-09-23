import chalk from "chalk";
import { version } from "../package.json";

export const createLogger = (name: string) => {
  return {
    info: (...args: any[]) => {
      console.log(`[${name}@${version}]`, ...args);
    },
    success: (...args: any[]) => {
      console.log(`[${name}@${version}]`, chalk.green(...args));
    },
    warning: (...args: any[]) => {
      console.log(`[${name}@${version}]`, chalk.yellow(...args));
    },
    danger: (...args: any[]) => {
      console.log(`[${name}@${version}]`, chalk.red(...args));
    },
  };
};

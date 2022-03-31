import chalk from "chalk";

export const createLogger = (name: string) => {
  return {
    info: (...args: any[]) => {
      console.log(`[${name}]`, ...args);
    },
    success: (...args: any[]) => {
      console.log(`[${name}]`, chalk.green(...args));
    },
    warning: (...args: any[]) => {
      console.log(`[${name}]`, chalk.yellow(...args));
    },
    danger: (...args: any[]) => {
      console.log(`[${name}]`, chalk.red(...args));
    },
  };
};

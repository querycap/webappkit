import { confLoader } from "@querycap/config";

export const APP_CONFIG = {};

export const conf = confLoader<keyof typeof APP_CONFIG>();

import path, { join } from "path";
import dotenv from "dotenv";
import findRoot from "find-root";

export type ProcessEnv = {
  NODE_ENV: "development" | "production" | "test";
  SECRET: string;
  HOST: string;
  PORT: string | number;
  APP_URL: string;
  PROJECT_NAME: string;
};

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export const numberOfItemsPerPage = 15;

const processEnvObj = process.env as unknown as ProcessEnv;

export const NODE_ENV = String(processEnvObj.NODE_ENV).toLowerCase() as
  | "development"
  | "production"
  | "local"
  | "test";

export const SECRET = String(processEnvObj.SECRET || "") || "key";

export const HOST = String(processEnvObj.HOST || "") || "127.0.0.1";

export const PORT = parseInt(String(processEnvObj.PORT), 10);

export const APP_URL = processEnvObj.APP_URL;

// This must match the name in package.json
export const PROJECT_NAME = processEnvObj.PROJECT_NAME || "func-flow backend";

export const rootProjectDir = (): string => {
  try {
    const root = findRoot(__dirname);
    return root;
  } catch {
    return process.cwd();
  }
};

export const pathFromRoot = (path: string) => {
  return join(rootProjectDir(), path);
};

export const pathFromSrc = (path: string) => {
  return join(__dirname, "../", path);
};

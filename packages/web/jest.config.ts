// jest.config.ts
import type { Config } from "@jest/types";

// Sync object
// const config: Config.InitialOptions = {
//   verbose: true,
// };
// export default config;

// Or async function
export default async (): Promise<Config.InitialOptions> => {
  return {
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "./__mocks__/fileMock.js",
      "\\.(css|less)$": "identity-obj-proxy"
    },
    verbose: true,
  };
};

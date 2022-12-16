import getConfig from "next/config";
import { ConfigEnum, DEV_CONFIG, ParimutuelConfig, STAGING_CONFIG } from "@hxronetwork/parimutuelsdk";

// eslint-disable-next-line
export const getWeb3Config = (config?: ParimutuelConfig): any => {
  const {
    publicRuntimeConfig: { APP_ENV },
  } = getConfig();

  if (APP_ENV === ConfigEnum.DEV) return DEV_CONFIG;
  if (APP_ENV === ConfigEnum.STAGING) return STAGING_CONFIG;
  return config as ParimutuelConfig;
};

export const getWeb3Url = () => {
  const {
    publicRuntimeConfig: { APP_ENV },
  } = getConfig();

  if (APP_ENV === ConfigEnum.STAGING)
    return "https://hxro.rpcpool.com/";
  return "https://hxro-hxro-b289.devnet.rpcpool.com/";
};

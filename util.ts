import type { BigNumberish } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import jwt from "jsonwebtoken";

export function shortenHex(hex: string, length = 4) {
  return `${hex.substring(0, length + 2)}…${hex.substring(
    hex.length - length
  )}`;
}

const ETHERSCAN_PREFIXES = {
  1: "",
  3: "ropsten.",
  4: "rinkeby.",
  5: "goerli.",
  42: "kovan.",
  80001: "",
};

export function formatEtherscanLink(
  type: "Account" | "Transaction",
  data: [number, string]
) {
  switch (type) {
    case "Account": {
      const [chainId, address] = data;
      if (chainId === 80001)
        return `https://mumbai.polygonscan.com/address/${address}`;
      return `https://${ETHERSCAN_PREFIXES[chainId]}etherscan.io/address/${address}`;
    }
    case "Transaction": {
      const [chainId, hash] = data;
      if (chainId === 80001) return `https://mumbai.polygonscan.com/tx/${hash}`;
      return `https://${ETHERSCAN_PREFIXES[chainId]}etherscan.io/tx/${hash}`;
    }
  }
}

export const parseBalance = (
  value: BigNumberish,
  decimals = 18,
  decimalsToDisplay = 3
) => parseFloat(formatUnits(value, decimals)).toFixed(decimalsToDisplay);

export const formatMessage = (nonce: string) => {
  return `You are signing to login into Grassroot: ${nonce}`;
};

export const decodeToken = (token: string) => {
  return jwt.decode(token);
};

export type Type = "transaction" | "address";

export interface Links {
  url: string;
}

const explorerPrefixes = {
  maticmum: "mumbai.polygonscan.com",
};

const typeToLink = (type: Type, prefix: string, link: string) => {
  switch (type) {
    case "transaction":
      return `https://${prefix}/tx/${link}`;
    case "address":
      return `https://${prefix}/address/${link}`;
    default:
      return `https://${prefix}/${link}`;
  }
};

export const resolveBlockchainLinks = (
  network: string,
  type: Type,
  link: string
): Links => {
  switch (network) {
    case "maticmum":
      return { url: typeToLink(type, explorerPrefixes["maticmum"], link) };
    default:
      return { url: typeToLink(type, explorerPrefixes["maticmum"], link) };
  }
};

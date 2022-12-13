import { InjectedConnector } from "@web3-react/injected-connector";

export const injected = new InjectedConnector({
  // Only Mumbai Allowed
  supportedChainIds: [80001],
});

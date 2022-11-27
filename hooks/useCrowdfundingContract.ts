import Crowdfunding_ABI from "../contracts/GrassrootCrowdfunding.json";
import type { GrassrootCrowdfunding } from "../contracts/types/GrassrootCrowdfunding";
import useContract from "./useContract";

export default function useCrowdfundingContract(contractAddress?: string) {
  return useContract<GrassrootCrowdfunding>(contractAddress, Crowdfunding_ABI);
}

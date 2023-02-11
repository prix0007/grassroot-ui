import Crowdfunding_ABI from "../contracts/GrassrootCrowdfunding.json";
import type { GrassrootCrowdfunding } from "../contracts/types/GrassrootCrowdfunding";
import { useContract } from "wagmi";
import { Signer } from "ethers";

export default function useCrowdfundingContract(contractAddress?: string, signer?: Signer) {
  return useContract({
    address: contractAddress,
    abi: Crowdfunding_ABI,
    signerOrProvider: signer
  });
}

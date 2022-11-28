import { BigNumber, ethers } from "ethers";
import useSWR from "swr";
import { GrassrootCrowdfunding } from "../contracts/types/GrassrootCrowdfunding";
import index from "../pages/crowdfunding";
import useCrowdfundingContract from "./useCrowdfundingContract";
import useKeepSWRDataLiveAsBlocksArrive from "./useKeepSWRDataLiveAsBlocksArrive";
import useTokenContract from "./useTokenContract";

export type ICampaignBC = {
  id: number;
  campaignAdmin: string;
  tokenAddress: string;
  campaignName: string;
  metadataCid: string;
  minAmountContribution: BigNumber;
  targetAmount: BigNumber;
  tokenCollected: BigNumber;
  category: number;
  isCompleted: boolean;
  isRedeemed: boolean;
  validUntil: BigNumber;
};

function decodeCampaign(campaign, index): ICampaignBC {
  const campaignTypes = [
    "address",
    "address",
    "bytes32",
    "string",
    "uint256",
    "uint256",
    "uint256",
    "uint16",
    "bool",
    "bool",
    "uint256",
  ];

  const decodedCampaign = ethers.utils.defaultAbiCoder.decode(
    campaignTypes,
    campaign
  );

  return {
    id: index,
    campaignAdmin: decodedCampaign[0],
    tokenAddress: decodedCampaign[1],
    campaignName: decodedCampaign[2],
    metadataCid: decodedCampaign[3],
    minAmountContribution: decodedCampaign[4],
    targetAmount: decodedCampaign[5],
    tokenCollected: decodedCampaign[6],
    category: decodedCampaign[7],
    isCompleted: decodedCampaign[8],
    isRedeemed: decodedCampaign[9],
    validUntil: decodedCampaign[10],
  };
}

function getContractState(contract: GrassrootCrowdfunding) {
  return async (address: string) => {
    const crowdfundingCount = await contract._crowdfundingsCounter();

    const campaignsEncoded = await contract.getCampaignsInIdxRange(
      0,
      crowdfundingCount
    );

    const campaigns = campaignsEncoded.map((campaign, index) =>
      decodeCampaign(campaign, index)
    );

    return { crowdfundingCount, campaigns };
  };
}

export default function useCrowdfundingState(
  crowdfundignContractAddress: string,
  suspense = false
) {
  const contract = useCrowdfundingContract(crowdfundignContractAddress);

  const shouldFetch =
    typeof crowdfundignContractAddress === "string" && !!contract;

  const result = useSWR(
    shouldFetch ? ["CrowdfundingState", crowdfundignContractAddress] : null,
    getContractState(contract),
    {
      suspense,
    }
  );

  useKeepSWRDataLiveAsBlocksArrive(result.mutate);

  return result;
}

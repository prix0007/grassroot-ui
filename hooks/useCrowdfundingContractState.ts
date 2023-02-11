import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from "ethers";
import { useContractRead, useContractReads } from "wagmi";
import Crowdfunding_ABI from "../contracts/GrassrootCrowdfunding.json";

import { networkContract } from "../constants";

const crowdfundingContract = {
  abi: Crowdfunding_ABI,
  address: (networkContract["maticmum"].CAMPAIGNS_ADDRESS ||
    "0x076c043bffB56F75dae2aba1E2a889F193A84cDF") as `0x${string}`,
};

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

interface IuseCrowdfundingContractState {
  chainId: number;
}

const useCrowdfundingContractState = ({
  chainId,
}: IuseCrowdfundingContractState): {
  crowdfundingCount: BigNumber;
  campaigns: ICampaignBC[];
} => {
  const { data, isError, isLoading } = useContractRead({
    ...crowdfundingContract,
    functionName: "_crowdfundingsCounter",
    chainId,
    cacheOnBlock: true,
  });

  const totalCampaigns = data as BigNumber;

  //TODO:  Make it split in batch divided
  const {
    data: campaignsBc,
    isError: isContractsFetchError,
    isLoading: isContractsLoading,
  } = useContractRead({
    ...crowdfundingContract,
    functionName: "getCampaignsInIdxRange",
    chainId,
    args: [0, totalCampaigns],
    cacheOnBlock: true,
  });

  const campaignsEncoded = campaignsBc as string[];

  const campaigns = campaignsEncoded?.map((campaign, index) =>
    decodeCampaign(campaign, index)
  );

  return { crowdfundingCount: totalCampaigns, campaigns };
};

export default useCrowdfundingContractState;

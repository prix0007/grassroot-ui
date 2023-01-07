import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { makeGraphQLInstance } from "../../graphql";
import { POST_CAMPAIGN } from "../../graphql/mutations/campaign";
import { GET_CAMPAIGN_BY_ID } from "../../graphql/queries/getCampaign";

const useCampaignById = (id: string) => {
  const client = makeGraphQLInstance("");

  return useQuery({
    queryKey: ["getCampaignById", id],
    queryFn: async () => {
      return await client.request(GET_CAMPAIGN_BY_ID, { id: id });
    },
    cacheTime: 60 * 60 * 60 * 1000, // 1 hr.
    refetchInterval: 60 * 60 * 60 * 1000,
    retry: 5,
    enabled: !!id,
  });
};

export interface ICreateCampaign {
  city: string;
  campaignId: string;
  completionDate: string;
  country: string;
  goalAmount: string;
  minAmount: string;
  videos: string[];
  images: string[];
  transactionHash: string;
  tokenCurrencyAddress: string;
  tokenCurrency: string;
  title: string;
  subtitle: string;
  state: string;
  metadata: any;
  daoId: string;
}

export interface Campaign extends ICreateCampaign {
  id: string;
}

const postCampaign = (accessToken: string, handleOnCampaignCreated: any) => {
  const client = makeGraphQLInstance(accessToken);

  return useMutation({
    mutationKey: ["postCampaign"],
    mutationFn: async (variables: ICreateCampaign) => {
      return await client.request(POST_CAMPAIGN, variables);
    },
    cacheTime: 60 * 60 * 60 * 1000, // 1 hr.
    retry: 5,
    onSuccess: handleOnCampaignCreated,
  });
};

export { postCampaign, useCampaignById };

import { gql } from "graphql-request";

export const POST_CAMPAIGN = gql`
  mutation createCampaign(
    $city: String!
    $campaignId: String!
    $completionDate: String!
    $country: String!
    $goalAmount: String!
    $minAmount: String!
    $videos: [String!]!
    $images: [String!]!
    $transactionHash: String!
    $tokenCurrencyAddress: String!
    $tokenCurrency: String!
    $title: String!
    $subtitle: String!
    $state: String!
    $metadata: JSON!
    $daoId: String!
  ) {
    createCampaign(
      createCampaignInput: {
        city: $city
        campaignId: $campaignId
        completionDate: $completionDate
        country: $country
        goalAmount: $goalAmount
        minAmount: $minAmount
        videos: $videos
        images: $images
        transactionHash: $transactionHash
        tokenCurrencyAddress: $tokenCurrencyAddress
        tokenCurrency: $tokenCurrency
        title: $title
        subtitle: $subtitle
        state: $state
        metadata: $metadata
      }
      daoId: $daoId
    ) {
      city
      campaignId
      completionDate
      country
      goalAmount
      minAmount
      videos
      images
      transactionHash
      tokenCurrencyAddress
      tokenCurrency
      title
      subtitle
      state
      metadata
    }
  }
`;
// createCampaign(createCampaignInput: {
//     #     city: "London",
//     #     campaignId: "1"
//     #     completionDate: "1671303165",
//     #     country: "India",
//     #     goalAmount: "200000000",
//     #     minAmount: "10000000",
//     #     videos: [],
//     #     images: [],
//     #     transactionHash: "0x0000",
//     #     tokenCurrencyAddress: "0x00000",
//     #     tokenCurrency: "USDC",
//     #     title: "Building a place for peoples",
//     #     subtitle: "Getting a chance to be give people places to live.",
//     #     state: "India",
//     #   }, daoId: "clbpgxte40004ugdnbx8y4dfe") {
//     #     city
//     #   }

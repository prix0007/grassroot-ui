import { gql } from "graphql-request";

export const GET_CAMPAIGN_BY_ID = gql`
  query GetMyDaos($id: String!) {
    campaignById(id: $id) {
      id
      title
      subtitle
      daoId
      campaignId
      city
      completionDate
      country
      createdAt
      updatedAt
      goalAmount
      minAmount
      metadata
      images
      videos
      dao {
        id
        adminAddress
        adminId
        name
        profilePicture
        backgroundPicture
        blockchainDaoId
        description
        metadata
      }
    }
  }
`;

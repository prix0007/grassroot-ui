import { gql } from "graphql-request";

export const GET_ALL_DAOS = gql`
  query GetAllDAOs {
    daos {
      adminAddress
      adminId
      name
      profilePicture
      backgroundPicture
      description
      metadata
      id
      blockchainDaoId
    }
  }
`;

export const GET_DAO_BY_ID = gql`
  query GetDaoById($id: String!) {
    daoById(id: $id) {
      adminAddress
      adminId
      blockchainDaoId
      name
      profilePicture
      backgroundPicture
      description
      metadata
      id,
      activeCampaigns {
        id,
        title,
        subtitle,
        daoId,
        campaignId,
        city,
        completionDate,
        country,
        createdAt,
        updatedAt,
        goalAmount,
        minAmount,
        metadata,
        images,
        videos
      }
    }
  }
`;

export const GET_MY_DAOS = gql`
  query GetMyDaos {
    myDaos {
      id
      adminAddress
      adminId
      name
      profilePicture
      backgroundPicture
      description
      metadata
      blockchainDaoId
    }
  }
`;

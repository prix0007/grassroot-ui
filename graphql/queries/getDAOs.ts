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
    }
  }
`;

export const GET_DAO_BY_ID = gql`
  query GetDaoById($id: String!) {
    daoById(id: $id) {
      adminAddress
      adminId
      name
      profilePicture
      backgroundPicture
      description
      metadata
      id
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
    }
  }
`;

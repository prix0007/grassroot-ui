import { gql } from "graphql-request";

export const POST_DAO = gql`
  mutation CreateDao(
    $backgroundPicture: String!
    $profilePicture: String!
    $name: String!
    $description: String!
    $metadata: JSON!
  ) {
    createDao(
      createDaoInput: {
        backgroundPicture: $backgroundPicture
        profilePicture: $profilePicture
        description: $description
        metadata: $metadata
        name: $name
      }
    ) {
      name
      id
      adminId
      adminAddress
      backgroundPicture
      profilePicture
      description
      metadata
    }
  }
`;

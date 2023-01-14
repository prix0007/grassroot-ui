import { gql } from "graphql-request";

export const CREATE_NONCE = gql`
  mutation GenerateNonce($address: String!) {
    generateNonce(data: { address: $address }) {
      address
      nonce
      success
    }
  }
`;

export const CREATE_USER_OR_LOGIN = gql`
  mutation SignupOrLogin($address: String!, $signature: String!) {
    signupOrLogin(data: { address: $address, signature: $signature }) {
      accessToken
      refreshToken
    }
  }
`;

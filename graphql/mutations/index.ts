import { gql } from "@apollo/client";

export const CREATE_NONCE = gql`
  mutation GenerateNonce($address: String!) {
    generateNonce(data: { address: $address }) {
      address
      nonce
      success
    }
  }
`;

export const CREATE_USER = gql`
  mutation Signup($address: String!, $signature: String!) {
    signup(data: {
      address: $address,
      signature: $signature
    }) {
      accessToken,
      refreshToken
    }
  }
`;

import { GraphQLClient } from "graphql-request";

export const makeGraphQLInstance = (token: string) => {
  return new GraphQLClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

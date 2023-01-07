import { useMutation, useQuery } from "@tanstack/react-query";
import { GraphQLClient, request } from "graphql-request";
import { makeGraphQLInstance } from "../../graphql";
import { POST_DAO } from "../../graphql/mutations/dao";
import { GET_ALL_DAOS, GET_DAO_BY_ID } from "../../graphql/queries/getDAOs";

const useDaosQueries = (client: GraphQLClient) => {
  return useQuery({
    queryKey: ["getAllDaos"],
    queryFn: async () => {
      return await client.request(GET_ALL_DAOS);
    },
    cacheTime: 60 * 60 * 60 * 1000, // 1 hr.
    retry: 5,
  });
};

export interface GetDAOProps {
  id: string;
}

const useDaoQuery = (variables: GetDAOProps ) => {
  const client = makeGraphQLInstance("");
  return useQuery({
    queryKey: ["getADao", variables.id],
    queryFn: async () => {
      return await client.request(GET_DAO_BY_ID, variables);
    },
    cacheTime: 60 * 60 , // 1 min.
    retry: 5,
    enabled: !!variables.id
  });
};

export interface POSTDAOProps {
  name: string;
  description: string;
  backgroundPicture: string;
  profilePicture: string;
  blockchainDaoId: string;
  metadata: any;
}

const postDao = (client: GraphQLClient) => {
  return useMutation({
    mutationKey: ["postDao"],
    mutationFn: async (variables: POSTDAOProps) => {
      return await client.request(POST_DAO, variables);
    },
    cacheTime: 60 * 60 * 60 * 1000, // 1 hr.
    retry: 5,
  });
};

export { useDaosQueries, postDao, useDaoQuery };

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GraphQLClient } from "graphql-request";
import { describe } from "node:test";
import { POST_DAO } from "../../graphql/mutations/postContract";
import { GET_ALL_DAOS } from "../../graphql/queries/getContracts";

const useDaosQueries = (client: GraphQLClient) => {
  return useQuery({
    queryKey: ["getAllDaos"],
    queryFn: async () => {
      return await client.request(GET_ALL_DAOS);
    },
    cacheTime: 60 * 60 * 60 * 1000, // 1 hr.
    retry: 5
  });
};

export interface POSTDAOProps {
  name: string,
  description: string,
  backgroundPicture: string,
  profilePicture: string,
  metadata: any,
}

const postDao = (client: GraphQLClient) => {
  return useMutation({
    mutationKey: ["postDao"],
    mutationFn: async (variables: POSTDAOProps) => {
      return await client.request(POST_DAO, variables);
    },
    cacheTime: 60 * 60 * 60 * 1000, // 1 hr.
    retry: 5
  });
}

export { useDaosQueries, postDao };

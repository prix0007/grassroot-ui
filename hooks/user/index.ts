import { useToast } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { GET_LOGGED_IN_USER } from "../../graphql/queries/getUser";
import { ACCESS_TOKEN_KEYS } from "../../localStorageKeys";

const useUserQuery = (client: GraphQLClient) => {
  return useQuery({
    queryKey: ["getMeUser"],
    queryFn: async () => {
      return await client.request(GET_LOGGED_IN_USER);
    },
    cacheTime: 60 * 60 * 60 * 1000, // 1 hr.
    retry: 5,
  });
};

const useTokensQuery = (account: string) => {
  const toast = useToast();

  return useQuery({
    queryKey: [ACCESS_TOKEN_KEYS],
    queryFn: () => {
      let tokens = localStorage.getItem(ACCESS_TOKEN_KEYS);
      if (!tokens) {
        throw new Error("Must be logged in to use this feature.");
      } else {
        return JSON.parse(tokens)[account];
      }
    },
    refetchInterval: 3000,
    cacheTime: 3000,
    onError: (error) => {
      toast({
        title: "Please Login.",
        description: "You need to be logged in.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
    enabled: !!account,
  });
};

export { useUserQuery, useTokensQuery };

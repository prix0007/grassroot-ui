import { useToast } from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useEffect, useState } from "react";
import { makeGraphQLInstance } from "../../graphql";
import {
  CREATE_NONCE,
  CREATE_USER_OR_LOGIN,
} from "../../graphql/mutations/user";
import { GET_LOGGED_IN_USER } from "../../graphql/queries/getUser";
import { ACCESS_TOKEN_KEYS } from "../../localStorageKeys";
import { decodeToken, formatMessage } from "../../util";
import { useWalletErrors, WalletErrorsType } from "../../hooks/error";
import useLocalStorage from "../useLocalStorage";

const useUserQuery = (token: string) => {
  // Logged In Query
  const client = makeGraphQLInstance(token);
  return useQuery({
    queryKey: ["getMeUser"],
    queryFn: async () => {
      return await client.request(GET_LOGGED_IN_USER);
    },
    cacheTime: 60 * 60 * 60 * 1000, // 1 hr.
    retry: 5,
    enabled: !!token,
  });
};

const useTokensQuery = (account: string) => {
  return useQuery({
    queryKey: [ACCESS_TOKEN_KEYS],
    queryFn: () => {
      let tokens = localStorage.getItem(ACCESS_TOKEN_KEYS);
      if (!tokens || !!tokens[account]) {
        throw new Error("Must be logged in to use this feature.");
      } else {
        return JSON.parse(tokens)[account];
      }
    },
    refetchInterval: 3000,
    cacheTime: 3000,
    enabled: !!account,
  });
};

const useSignInUser = (account: string) => {
  // Try to decouple this later
  const { library } = useWeb3React();
  const isConnected = typeof account === "string" && !!library;

  const walletErrors = useWalletErrors();
  const [tokens, setToken] = useLocalStorage(ACCESS_TOKEN_KEYS, "");
  const [isSigning, setIsSigning] = useState(false);
  const toast = useToast();

  // Responsibility. Fetch tokens from localstorage.
  // If not present then login account.
  const {
    isError: tokenIsError,
    error: tokenError,
    isFetched,
    isLoading,
    data: tokenData,
  } = useTokensQuery(account);

  const client = makeGraphQLInstance(tokenData?.accessToken);

  const {
    mutate: createNonceMutation,
    data: nonceData,
    error: nonceError,
    isError: nonceIsError,
    isLoading: nonceIsLoading,
  } = useMutation({
    mutationKey: ["createNonce"],
    mutationFn: () => {
      return client.request(CREATE_NONCE, {
        address: account,
      });
    },
  });

  const {
    mutate: createUserMutation,
    data: userData,
    error: userError,
    isError: userIsError,
    isLoading: userIsLoading,
  } = useMutation({
    mutationKey: ["createUser"],
    mutationFn: (signature: string) => {
      return client.request(CREATE_USER_OR_LOGIN, {
        signature: signature,
        address: account,
        firstName: "",
        lastName: "",
        email: "",
      });
    },
  });

  // Check updates on wallet connection
  useEffect(() => {
    if (tokenData) {
      const decodedToken = decodeToken(tokenData?.accessToken);
      const currentTimeStamp = parseInt((Date.now() / 1000).toString());
      if (decodedToken?.exp < currentTimeStamp) {
        // Tokens have been found but need to resign!!
        createNonceMutation();
      }
    }

    if (tokenIsError) {
      createNonceMutation();
    }
  }, [tokenData, tokenError]);

  // Utility Function to take user Signin
  const handleSign = async (nonce: string, account: string) => {
    const signer = library.getSigner();
    const message = formatMessage(nonce);
    try {
      const signature = await signer?.signMessage(message);
      // Post Signature to Create a New User here.
      createUserMutation(signature);
    } catch (error) {
      if (error instanceof UserRejectedRequestError) {
        walletErrors(WalletErrorsType.USER_REJECTED, error.message);
      } else if (error instanceof UnsupportedChainIdError) {
        walletErrors(
          WalletErrorsType.UNSUPPORTED_CHAIN,
          "Switch to Polygon Mumbai Test Network to use Application." ||
            error.message
        );
      } else {
        walletErrors(WalletErrorsType.OTHER, error.message);
      }
    }
    setIsSigning(false);
  };

  // UseEffect to Manage Updated on Nonce Creation
  useEffect(() => {
    const generatedNonce = nonceData?.generateNonce;
    if (generatedNonce) {
      setIsSigning(true);
      if (isConnected && !isSigning) {
        handleSign(generatedNonce.nonce, account);
      }
    }
    if (nonceError) {
      toast({
        title: "Failed to Generate Nonce for user !!",
        colorScheme: "red",
        status: "error",
        description: nonceError?.toString() ?? "Some Error Occured!!",
        isClosable: true,
      });
    }
  }, [nonceData, nonceError, nonceIsLoading]);

  // State to Manage User with SignIn
  useEffect(() => {
    const generatedUserTokens = userData?.signupOrLogin;
    if (generatedUserTokens) {
      setToken({
        ...tokens,
        [account]: generatedUserTokens,
      });
    }

    if (userError) {
      toast({
        title: "Failed to Create User!!",
        colorScheme: "red",
        status: "error",
        description: userError?.toString() || "Some Error Occured.",
        isClosable: true,
      });
    }
  }, [userData, userError]);

  const { data: currentUser } = useUserQuery(tokenData?.accessToken);

  return {
    isLoggedIn: !!tokenData?.accessToken,
    accessToken: tokenData?.accessToken,
    currentUser: currentUser?.me,
    refreshToken: tokenData?.refreshToken,
  };
};

export { useUserQuery, useTokensQuery, useSignInUser };

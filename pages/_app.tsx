import { Web3ReactProvider } from "@web3-react/core";
import type { AppProps } from "next/app";
import getLibrary from "../getLibrary";
import { Box, ChakraProvider, Flex, HStack } from "@chakra-ui/react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import theme from "../theme";
import SideNavbar from "../components/Sidebar";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_BACKEND_URL + "/graphql" || "http://localhost:3000/graphql",
  cache: new InMemoryCache(),
});

const queryClient = new QueryClient();

function NextWeb3App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={client}>
        <ChakraProvider theme={theme}>
          <Web3ReactProvider getLibrary={getLibrary}>
            <Flex>
              <SideNavbar>
                <div></div>
              </SideNavbar>
              <Box flexGrow={1}>
                <Component {...pageProps} />
              </Box>
            </Flex>
          </Web3ReactProvider>
        </ChakraProvider>
      </ApolloProvider>
    </QueryClientProvider>
  );
}

export default NextWeb3App;

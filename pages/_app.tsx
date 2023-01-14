import { Web3ReactProvider } from "@web3-react/core";
import type { AppProps } from "next/app";
import getLibrary from "../getLibrary";
import { Box, ChakraProvider, Flex, HStack } from "@chakra-ui/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import theme from "../theme";
// import SideNavbar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Head from "next/head";
import Footer from "../components/Footer";

const queryClient = new QueryClient();

function NextWeb3App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Head>
            <title>Grassroot</title>
            <link rel="icon" href="/grassroot_small.png" />
            <meta
              name="description"
              content="Grassroot is all in one solution for DAO. You can create, manage and communicate with your DAO Community with ease from Grassroot."
            />
          </Head>
          <Navbar />
          <Flex alignItems={"stretch"}>
            <Flex
              flexGrow={1}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"flex-start"}
            >
              <Box width={"100%"} maxWidth={"1920px"}>
                <Component {...pageProps} />
              </Box>
            </Flex>
          </Flex>
          <Footer />
        </Web3ReactProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default NextWeb3App;

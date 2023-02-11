import { WagmiConfig, createClient, configureChains, goerli } from "wagmi";

import type { AppProps } from "next/app";
import { Box, ChakraProvider, Flex } from "@chakra-ui/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import theme from "../theme";
import Navbar from "../components/Navbar";
import Head from "next/head";
import Footer from "../components/Footer";
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import allowedChains from "../chains";

const queryClient = new QueryClient();

const { chains, provider } = configureChains(allowedChains, [publicProvider()])

const client = createClient({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
  ],
  provider
});

function NextWeb3App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <WagmiConfig client={client}>
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
        </WagmiConfig>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default NextWeb3App;

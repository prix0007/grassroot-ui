import { Web3ReactProvider } from "@web3-react/core";
import type { AppProps } from "next/app";
import getLibrary from "../getLibrary";
import { Box, ChakraProvider, Flex, HStack } from "@chakra-ui/react";

import theme from "../theme";
import SideNavbar from "../components/Sidebar";

function NextWeb3App({ Component, pageProps }: AppProps) {
  return (
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
  );
}

export default NextWeb3App;

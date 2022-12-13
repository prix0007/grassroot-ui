import { Box } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import ExploreDaos from "../components/index/exploreDaos";
import IndexHero from "../components/index/hero";

function Home() {
  const { account, library } = useWeb3React();

  return (
    <div>
      <Head>
        <title>Grassroot</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <IndexHero />
        <ExploreDaos />
      </Box>
    </div>
  );
}

export default Home;

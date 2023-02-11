import { Box } from "@chakra-ui/react";
import Head from "next/head";
import ExploreDaos from "../components/index/exploreDaos";
import IndexHero from "../components/index/hero";

// export const config = { amp: true }

function Home() {
  return (
    <div>
      <Head>
        <title>Grassroot</title>
      </Head>
      <Box>
        <IndexHero />
        <ExploreDaos />
      </Box>
    </div>
  );
}

export default Home;

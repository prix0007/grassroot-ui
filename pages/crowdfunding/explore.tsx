import { Box, Container, Grid, GridItem, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import BackButton from "../../components/BackButton";
import CampaignCard from "../../components/CampaignCard";
import useCrowdfundingContract from "../../hooks/useCrowdfundingContract";
import useCrowdfundingState from "../../hooks/useCrowdfundingState";

const items = [1, 2, 3, 4, 5, 7];

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const Explore = () => {
  const router = useRouter();
  const handleBack = () => {
    router.push("/crowdfunding");
  };

  const { data } = useCrowdfundingState(CONTRACT_ADDRESS);

  const contract = useCrowdfundingContract(CONTRACT_ADDRESS);

  return (
    <Box w="100%" p={4} background={"none"}>
      <br />
      <BackButton onClick={handleBack} />
      <br />
      <Heading textAlign={"center"}>Explore and Fund Campaigns</Heading>
      <br />
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={7}
      >
        {data?.campaigns.map((campaign) => {
          return (
            <GridItem w="100%" key={campaign.metadataCid}>
              <CampaignCard campaign={campaign} contract={contract}/>
            </GridItem>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Explore;

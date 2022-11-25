import { Box, Container, Grid, GridItem, Heading } from "@chakra-ui/react";
import React from "react";
import CampaignCard from "../../components/CampaignCard";

const items = [1,2,3,4,5,7];

const Explore = () => {
  return (
    <Box w="100%" p={4} background={"none"}>
      <br />
      <br />
      <Heading textAlign={"center"}>Explore and Fund Campaigns</Heading>
      <br />
      <Grid templateColumns="repeat(3, 1fr)" gap={7}>
        {items.map((item) => {
            return <GridItem w="100%" key={item}>
                <CampaignCard />
            </GridItem>
        })}
      </Grid>
    </Box>
  );
};

export default Explore;

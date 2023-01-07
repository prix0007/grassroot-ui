import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import useCrowdfundingContract from "../../../hooks/useCrowdfundingContract";
import useCrowdfundingState from "../../../hooks/useCrowdfundingState";
import CampaignCard from "../../CampaignCard";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

const CampaignsTabPanel = () => {
  const router = useRouter();

  // const { data } = useCrowdfundingState(CONTRACT_ADDRESS);
  const data = undefined;
  const contract = useCrowdfundingContract(CONTRACT_ADDRESS);

  return (
    <VStack>
      <Flex justifyContent={"space-between"} w={"100%"}>
        <Heading>Explore Daos Campaigns</Heading>
        <Button as={"div"} colorScheme={"blue"}>
          <Link href={`${router.asPath}/campaign/new`}>New</Link>
        </Button>
      </Flex>
      <Box w="100%" py={4} background={"none"}>
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
                <CampaignCard campaign={campaign} contract={contract} />
              </GridItem>
            );
          })}
          {
            data === undefined && 
            <Text>No Campaigns Yet</Text>
          }
        </Grid>
      </Box>
    </VStack>
  );
};

export default CampaignsTabPanel;

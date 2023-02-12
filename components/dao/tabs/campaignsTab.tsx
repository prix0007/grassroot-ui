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
import { useWeb3React } from "@web3-react/core";
import Link from "next/link";
import { useRouter } from "next/router";
import { Campaign } from "../../../hooks/campaigns";
import { useDaoQuery } from "../../../hooks/daos";
import useCrowdfundingContract from "../../../hooks/useCrowdfundingContract";
import CampaignCard from "../../CampaignCard";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export interface ICampaignsTabPanel {
  activeCampaigns?: Array<Campaign>;
  daoId: string;
}

const CampaignsTabPanel: React.FC<ICampaignsTabPanel> = ({
  activeCampaigns,
  daoId,
}) => {
  const router = useRouter();
  const { account } = useWeb3React();

  const { data: dao } = useDaoQuery({ id: daoId });

  const contract = useCrowdfundingContract(CONTRACT_ADDRESS);

  return (
    <VStack>
      <Flex justifyContent={"space-between"} w={"100%"}>
        <Heading>Explore Daos Campaigns</Heading>
        {/* TODO: Make it more extractable */}
        {dao?.daoById?.adminAddress === account && (
          <Button as={"div"} colorScheme={"blue"}>
            <Link href={`${router.asPath}/campaign/new`}>New</Link>
          </Button>
        )}
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
          {activeCampaigns?.map((campaign, index) => {
            return (
              <GridItem
                w="100%"
                key={`${campaign?.metadata?.blockchainData?.metdataCid}-${index}`}
              >
                <CampaignCard
                  newCampaignData={campaign}
                  campaign={campaign.metadata.metadata}
                  contract={contract}
                />
              </GridItem>
            );
          })}
          {activeCampaigns === undefined ||
            (activeCampaigns.length === 0 && <Text>No Campaigns Yet</Text>)}
        </Grid>
      </Box>
    </VStack>
  );
};

export default CampaignsTabPanel;

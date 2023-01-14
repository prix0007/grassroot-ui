import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Box,
  VStack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import SimpleLayout from "../layouts/simpleLayout";
import CampaignsTabPanel, { ICampaignsTabPanel } from "./tabs/campaignsTab";
import CommunicationTabPanel from "./tabs/communicationTab";
import ResourcesTabPanel from "./tabs/resourcesTab";
import TreasuryTabPanel, { TreasuryTabPanelProps } from "./tabs/treasuryTab";

const tabsJson = [
  {
    name: "Campaigns",
    panel: (props) => (
      <TabPanel key="campaigns">
        <CampaignsTabPanel {...props} key={"campaignsTabPanel"} />
      </TabPanel>
    ),
  },
  {
    name: "Treasury",
    panel: (props) => (
      <TabPanel key="treasury">
        <TreasuryTabPanel {...props} key={"treasuryTabPanel"} />
      </TabPanel>
    ),
  },
  {
    name: "Resources",
    panel: (props) => (
      <TabPanel key="resources">
        <ResourcesTabPanel {...props} key={"resourceTabPanel"} />
      </TabPanel>
    ),
  },
  {
    name: "Communications",
    panel: (props) => (
      <TabPanel key="communcation">
        <CommunicationTabPanel {...props} key={"communicationsTabPanel"} />
      </TabPanel>
    ),
  },
];

interface DaoTabsProps {
  resourceProps: any;
  treasuryProps: TreasuryTabPanelProps;
  communicationProps: any;
  campaignsProps: ICampaignsTabPanel;
}

const DaoTabs: React.FC<DaoTabsProps> = ({
  resourceProps,
  treasuryProps,
  communicationProps,
  campaignsProps,
}) => {
  const resolveTabToProps = (tabName: string) => {
    switch (tabName) {
      case "Resources":
        return resourceProps;
      case "Treasury":
        return treasuryProps;
      case "Communication":
        return communicationProps;
      case "Campaigns":
        return campaignsProps;
      default:
        return {};
    }
  };

  return (
    <SimpleLayout>
      <Box width={"100%"}>
        <Tabs isFitted variant="soft-rounded" colorScheme={"blue"}>
          <TabList mb="1em" flexWrap={"wrap"}>
            {tabsJson.map((tab, index) => {
              return <Tab key={tab.name + index}>{tab.name}</Tab>;
            })}
          </TabList>
          <TabPanels>
            {tabsJson.map((tabpanel, index) => {
              return tabpanel.panel(resolveTabToProps(tabpanel.name));
            })}
          </TabPanels>
        </Tabs>
      </Box>
    </SimpleLayout>
  );
};

export default DaoTabs;

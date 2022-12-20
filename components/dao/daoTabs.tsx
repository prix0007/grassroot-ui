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
import AboutTabPanel from "./tabs/aboutTab";
import CommunicationTabPanel from "./tabs/communicationTab";
import ResourcesTabPanel from "./tabs/resourcesTab";
import TreasuryTabPanel from "./tabs/treasuryTab";

const tabsJson = [
  {
    name: "About",
    panel: (
      <TabPanel key="about">
        <AboutTabPanel />
      </TabPanel>
    ),
  },
  {
    name: "Resources",
    panel: (
      <TabPanel key="resources">
        <ResourcesTabPanel />
      </TabPanel>
    ),
  },
  {
    name: "Treasury",
    panel: (
      <TabPanel key="treasury">
        <TreasuryTabPanel />
      </TabPanel>
    ),
  },
  {
    name: "Communications",
    panel: (
      <TabPanel key="communcation">
        <CommunicationTabPanel />
      </TabPanel>
    ),
  },
];

const DaoTabs = () => {
  return (
    <Box width={"100%"}>
      <Tabs isFitted variant="soft-rounded" colorScheme={"blue"}>
        <TabList mb="1em">
          {tabsJson.map((tab, index) => {
            return <Tab key={tab.name + index}>{tab.name}</Tab>;
          })}
        </TabList>
        <TabPanels>
          {tabsJson.map((tabpanel, index) => {
            return tabpanel.panel;
          })}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default DaoTabs;

import React, { ReactNode } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Button,
  useColorMode,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  Center,
  MenuDivider,
  MenuItem,
} from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
} from "react-icons/fi";

import Jdenticon from "react-jdenticon";
import { IconType } from "react-icons";
import { BsFillChatSquareTextFill, BsPeopleFill } from "react-icons/bs";
import { GiArchiveRegister, GiOpenTreasureChest } from "react-icons/gi";

import Image from "next/image";

import grassrootIcon from "../public/grassroot_full.png";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import ETHBalance from "./ETHBalance";
import Account from "./Account";
import { shortenHex } from "../util";
import { useWeb3React } from "@web3-react/core";
import useEagerConnect from "../hooks/useEagerConnect";

interface LinkItemProps {
  name: string;
  icon: IconType;
  href: string;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Crowdfunding", icon: BsPeopleFill, href: "/crowdfunding" },
  { name: "Communicate", icon: BsFillChatSquareTextFill, href: "/communicate" },
  { name: "Register", icon: GiArchiveRegister, href: "/register" },
  { name: "Treasury", icon: GiOpenTreasureChest, href: "/treasury" },
];

export default function SideNavbar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box
      minH="100vh"
      bg={useColorModeValue("gray.100", "gray.900")}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
    >
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const { account, library } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;

  return (
    <Box w={{ base: "full", md: 60 }} pos="fixed" h="full" {...rest}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        spacing={7}
        px={2}
        py={4}
      >
        <Button onClick={toggleColorMode}>
          {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        </Button>
        <Menu>
          <MenuButton
            as={Button}
            rounded={"full"}
            variant={"link"}
            cursor={"pointer"}
            _hover={{
              border: "gray.800",
              borderWidth: "1px",
            }}
            minW={0}
          >
            <Jdenticon size={"30"} value={account || ""} />
          </MenuButton>
          <MenuList alignItems={"center"}>
            <br />
            <Center>
              <Jdenticon size={"50"} value={account || ""} />
            </Center>
            <Center>
              <p>{account && shortenHex(account, 4)}</p>
            </Center>
            <br />
            <MenuDivider />
            <MenuItem>Your Profile</MenuItem>
            <MenuItem>
              <ETHBalance />
            </MenuItem>
            <MenuItem>Logout</MenuItem>
            <MenuItem>
              <Account triedToEagerConnect={triedToEagerConnect} />
            </MenuItem>
          </MenuList>
        </Menu>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Stack>
      <Box px={2} mb={4}>
        <Box
          backgroundColor={colorMode === "dark" && "white"}
          borderRadius={10}
          display={"flex"}
          justifyContent={"center"}
        >
          <Image
            src={grassrootIcon}
            alt={"Grassroot Icon"}
            width={170}
            height={70}
          />
        </Box>
      </Box>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon}>
          <Link href={link.href}>{link.name}</Link>
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactNode;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
  return (
    <Link
      as={"div"}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />
    </Flex>
  );
};

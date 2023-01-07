import React, { ReactNode, useEffect, useState } from "react";
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
  useToast,
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
import {
  decodeToken,
  formatEtherscanLink,
  formatMessage,
  shortenHex,
} from "../util";
import { useWeb3React } from "@web3-react/core";
import useEagerConnect from "../hooks/useEagerConnect";
import TokenBalance from "./TokenBalance";
import BuyToken from "./BuyToken";
import useCrowdfundingContract from "../hooks/useCrowdfundingContract";
import AllowanceToken from "./AllowanceToken";
import { useMutation } from "@apollo/client";
import { CREATE_NONCE, CREATE_USER_OR_LOGIN } from "../graphql/mutations";
import { ethers } from "ethers";
import useLocalStorage from "../hooks/useLocalStorage";
import { ACCESS_TOKEN_KEYS } from "../localStorageKeys";

const USDC_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

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
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  const { account, library, chainId, deactivate, connector } = useWeb3React();

  const [tokens, setToken] = useLocalStorage(ACCESS_TOKEN_KEYS, "");

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;

  // const crowdfundingContract = useCrowdfundingContract(
  //   CROWDFUNDING_CONTRACT_ADDRESS
  // );

  const [createNonce, { data, error: errorGql, loading }] =
    useMutation(CREATE_NONCE);

  const [
    createUser,
    { data: user, error: errorUser, loading: userLoading },
  ] = useMutation(CREATE_USER_OR_LOGIN);

  useEffect(() => {
    const shouldCreate = isConnected && (!tokens || !tokens[account]);

    if (tokens && tokens[account]) {
      console.log( tokens[account])
      const decodedToken = decodeToken(tokens[account].accessToken);
      const currentTimeStamp = parseInt((Date.now() / 1000).toString());
      if (decodedToken?.exp < currentTimeStamp) {
        createNonce({
          variables: {
            address: account,
          },
        });
      }
    }

    if (shouldCreate) {
      if (!localStorage.getItem(ACCESS_TOKEN_KEYS)) {
        createNonce({
          variables: {
            address: account,
          },
        });
      }
    }
  }, [isConnected, account]);

  const [isSigning, setSigning] = useState(false);

  const handleMessage = async (nonce: string) => {
    if (isConnected && !isSigning) {
      const signer = library.getSigner();
      const message = formatMessage(nonce);

      try {
        const signature = await signer?.signMessage(message);
       
        // Post Signature to Create a New User here.
        createUser({
          variables: {
            signature: signature,
            address: account,
            firstName: "",
            lastName: "",
            email: "",
          },
        });
      } catch (e) {
        toast({
          title: "Something Went Wrong!!",
          colorScheme: "red",
          status: "error",
          description: "Try loggin in Again.",
          isClosable: true,
        });
        console.log(e);
      }
      setSigning(false);
    }
  };

  useEffect(() => {
    const generatedUserTokens = user?.signupOrLogin;
    if (generatedUserTokens) {
      setToken({
        ...tokens,
        [account]: generatedUserTokens,
      });
    }

    if (errorUser) {
      toast({
        title: "Failed to Create User!!",
        colorScheme: "red",
        status: "error",
        description: errorUser.message,
        isClosable: true,
      });
    }
  }, [user, userLoading, errorUser]);

  useEffect(() => {
    const generatedNonce = data?.generateNonce;
    if (generatedNonce) {
      handleMessage(generatedNonce.nonce);
      setSigning(true);
    }

    if (errorGql) {
      toast({
        title: "Failed to Generate Nonce.",
        colorScheme: "red",
        description: errorGql.message,
        isClosable: true,
      });
    }
  }, [data, loading, errorGql]);

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
        <Account triedToEagerConnect={triedToEagerConnect} />
        {isConnected && (
          <Menu>
            <MenuButton
              as={Button}
              rounded={"full"}
              variant={"link"}
              cursor={"pointer"}
              p={2}
              _hover={{
                background: "gray.700",
              }}
              minW={0}
            >
              <Jdenticon value={account} size={"30"} />
            </MenuButton>
            <MenuList alignItems={"center"}>
              <br />
              <Center>
                <Jdenticon size={"50"} value={account || ""} />
              </Center>
              <Center>
                <a
                  {...{
                    href: formatEtherscanLink("Account", [chainId, account]),
                    target: "_blank",
                    rel: "noopener noreferrer",
                  }}
                >
                  {account && `${shortenHex(account, 4)}`}
                </a>
              </Center>
              <br />
              <MenuDivider />
              <MenuItem>
                <Link href={`/profile/${account}`}>Your Profile</Link>
              </MenuItem>
              <MenuItem>
                <ETHBalance />
              </MenuItem>
              <MenuItem onClick={deactivate} textColor={"red.600"}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        )}
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Stack>
      <Box px={2} mb={4}>
        <Box
          backgroundColor={colorMode === "dark" && "white"}
          borderRadius={10}
          display={"flex"}
          justifyContent={"center"}
        >
          <Link href="/">
            <Image
              src={grassrootIcon}
              alt={"Grassroot Icon"}
              width={170}
              height={70}
            />
          </Link>
        </Box>
      </Box>
      {/* {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon}>
          <Link href={link.href}>{link.name}</Link>
        </NavItem>
      ))} */}
      <TokenBalance symbol="USDC" tokenAddress={USDC_TOKEN_ADDRESS} />
      <br />
      <BuyToken tokenAddress={USDC_TOKEN_ADDRESS} />
      <br />
      <AllowanceToken
        tokenAddress={USDC_TOKEN_ADDRESS}
        address={account}
        spenderAddress={CONTRACT_ADDRESS}
      />
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

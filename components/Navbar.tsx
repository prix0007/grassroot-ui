import { ReactNode, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  Link as ChakraLink,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  IconButton,
  Text,
  Circle,
  useToast,
} from "@chakra-ui/react";

import Link from "next/link";
import {
  CheckCircleIcon,
  CloseIcon,
  MoonIcon,
  SunIcon,
} from "@chakra-ui/icons";
import Account from "./Account";

import grassrootIcon from "../public/grassroot_full.png";
import Image from "next/image";
import ETHBalance from "./ETHBalance";
import { resolveBlockchainLinks, shortenHex } from "../util";
import Jdenticon from "react-jdenticon";
import { useSignInUser, useTokensQuery } from "../hooks/user";
import TokenBalance from "./TokenBalance";
import { useAccount, useDisconnect } from "wagmi";
import { networkContract } from "../constants";

const USDC_TOKEN_ADDRESS = networkContract["maticmum"].TOKEN_ADDRESS;

// const NavLink = ({ children }: { children: ReactNode }) => (
//   <ChakraLink
//     px={2}
//     py={1}
//     rounded={"md"}
//     _hover={{
//       textDecoration: "none",
//       bg: useColorModeValue("gray.200", "gray.700"),
//     }}
//     href={"#"}
//   >
//     {children}
//   </ChakraLink>
// );

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const { address, isConnected } = useAccount({
    onDisconnect: () => {
      toast({
        title: "Wallet disconnected successfully",
        status: "warning",
        duration: 3000,
      });
    },
  });
  const { disconnect } = useDisconnect();

  const { isLoggedIn, accessToken, refreshToken } = useSignInUser(address);

  // DOM Loaded

  const [isDomLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    if (window !== undefined) {
      setDomLoaded(true);
    } else {
      setDomLoaded(false);
    }
  }, []);

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} py={2} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Link href={`/`}>
            <Box
              backgroundColor={
                colorMode === "dark" ? "whiteAlpha.800" : "white"
              }
              borderColor={"darkgrey"}
              borderWidth={"1px"}
              borderRadius={10}
            >
              <Image
                src={grassrootIcon}
                alt={"Grassroot Icon"}
                width={170}
                height={60}
              />
            </Box>
          </Link>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>
              <Account />
              {isConnected && (
                <Menu>
                  {({ isOpen, onClose }) => (
                    <>
                      <MenuButton
                        as={Button}
                        rounded={"full"}
                        variant={"link"}
                        cursor={"pointer"}
                        minW={0}
                      >
                        {isOpen ? (
                          <IconButton
                            aria-label="close naivation menu"
                            onClick={onClose}
                          >
                            <CloseIcon />
                          </IconButton>
                        ) : (
                          <Jdenticon size={"30"} value={address ?? ""} />
                        )}
                      </MenuButton>
                      <MenuList alignItems={"center"}>
                        <Center p={0}>
                          <Link href={`/profile/${address}`}>
                            <Text>{address && shortenHex(address, 4)}</Text>
                          </Link>
                          {isLoggedIn && (
                            <CheckCircleIcon color="green" ml={2} />
                          )}
                        </Center>
                        <MenuDivider />
                        <MenuItem>
                          <ETHBalance address={address} />
                        </MenuItem>
                        <MenuItem>
                          <Link
                            href={
                              resolveBlockchainLinks(
                                "maticmum",
                                "address",
                                USDC_TOKEN_ADDRESS
                              ).url
                            }
                            target="_blank"
                            rel="noreferrer noopenner"
                          >
                            <TokenBalance
                              symbol="USDT"
                              tokenAddress={USDC_TOKEN_ADDRESS as `0x${string}`}
                            />
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={() => disconnect()}>Logout</MenuItem>
                      </MenuList>
                    </>
                  )}
                </Menu>
              )}
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

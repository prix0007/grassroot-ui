import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  Link,
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
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import Account from "./Account";
import { useWeb3React } from "@web3-react/core";
import useEagerConnect from "../hooks/useEagerConnect";

import grassrootIcon from "../public/grassroot_full.png";
import Image from "next/image";
import ETHBalance from "./ETHBalance";
import { shortenHex } from "../util";
import Jdenticon from "react-jdenticon";

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { account, library } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;
  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box
            backgroundColor={colorMode === "dark" && "white"}
            borderRadius={10}
          >
            <Image
              src={grassrootIcon}
              alt={"Grassroot Icon"}
              width={170}
              height={70}
            />
          </Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
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
                    borderWidth: "1px"
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
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

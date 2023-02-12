import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Link,
  ResponsiveValue,
  SimpleGrid,
  Tag,
  Text,
  Tooltip,
  useBreakpoint,
  useBreakpointValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FaHandshake, FaHeading } from "react-icons/fa";
import { resolveBlockchainLinks, Type } from "../../util";
import { BiCategoryAlt } from "react-icons/bi";
import { MdOutlineCategory, MdOutlineShareLocation } from "react-icons/md";
import SimpleLayout from "../layouts/simpleLayout";
import { useDaoQuery } from "../../hooks/daos";
import { useMemo, useState } from "react";
import useDAOSContract from "../../hooks/useDAOContract";
import { useWeb3React } from "@web3-react/core";
import { useIsAddressMember } from "../../hooks/daos/blockchain";
import { CheckCircleIcon } from "@chakra-ui/icons";

const DAOS_CONTRACT = process.env.NEXT_PUBLIC_DAOS_ADDRESS;

export interface IAboutDao {
  metadata: {
    adminAddress: string;
    adminId: number;
    backgroundPicture: string;
    categories: Array<string>;
    country: string;
    description: string;
    name: string;
    profilePicture: string;
    social: Array<Object>;
    subCategories: Array<string>;
    tags: Array<string>;
  };
  transactionHash?: string;
  ipfsMetadata?: {
    cid: string;
    url: string;
  };
  daoId: string;
}

const AboutDao: React.FC<IAboutDao> = ({
  metadata,
  transactionHash,
  ipfsMetadata,
  daoId,
}) => {
  const toast = useToast();

  const { data: dao, isError, isLoading } = useDaoQuery({ id: daoId });

  const daoData = useMemo(() => {
    if (!isError && !isLoading) {
      if (dao?.daoById) {
        return dao?.daoById;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }, [dao, isError, isLoading]);

  const daosContract = useDAOSContract(DAOS_CONTRACT);
  const { account } = useWeb3React();
  const [isJoinProcess, setJoinProcess] = useState(false);

  const { data: isMember } = useIsAddressMember(
    daoData?.blockchainDaoId,
    account
  );

  const isDaoAdmin = useMemo(() => {
    if (!!daoData && !!account) {
      return daoData?.adminAddress === account;
    } else {
      return false;
    }
  }, [daoData, account]);

  const handleJoin = async () => {
    if (!daosContract || !daoData) {
      toast({
        title: "Something went wrong.",
        description: "Try Again Later! Check Wallet connection?",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
      return;
    }
    if (daoData?.adminAddress === account) {
      toast({
        title: "Admin can't join.",
        description: "You are admin to this dao.",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
      return;
    }

    setJoinProcess(true);

    try {
      const tx = await daosContract.getMembership(daoData?.blockchainDaoId);
      await tx.wait();
    } catch (e) {
      toast({
        title: "Something went wrong while joining!!",
        description: e?.data?.message || "Try again later.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    setJoinProcess(false);
  };

  return (
    <SimpleLayout>
      <VStack>
        <Box w={"100%"} my={"10px"}>
          <SimpleGrid columns={{ base: 1, md: 2 }}>
            <Box>
              <Heading variant={"h1"} color={"brand.700"}>
                {metadata?.name}
              </Heading>
            </Box>
            <Box>
              <Text textAlign={"right"} fontWeight={"bold"}>
                Admin Address
              </Text>
              <Link
                target={"_blank"}
                rel={"noopener noreferrer"}
                href={
                  resolveBlockchainLinks(
                    "maticmum",
                    "address",
                    metadata?.adminAddress
                  ).url
                }
              >
                <Text textAlign={"right"}>{metadata?.adminAddress}</Text>
              </Link>
            </Box>
          </SimpleGrid>
          <Divider my={"20px"} />
          <Flex
            justifyContent={{ base: "space-between" }}
            direction={{ base: "column", md: "row" }}
          >
            <Box>
              <Box my={"2px"} display={"inline-flex"} w={"100%"}>
                <Text>Created on @:</Text>
                <Link
                  target={"_blank"}
                  rel={"noopener noreferrer"}
                  href={
                    resolveBlockchainLinks(
                      "maticmum",
                      "transaction",
                      transactionHash
                    ).url
                  }
                  ml={"5px"}
                >
                  <Text
                    color={"brand.700"}
                    fontWeight={"bold"}
                    wordBreak={"break-all"}
                  >
                    {transactionHash}
                  </Text>
                </Link>
              </Box>
              <Box my={"2px"} display={"inline-flex"}>
                <Text>Metadata @: </Text>
                <Link
                  target={"_blank"}
                  rel={"noopener noreferrer"}
                  href={ipfsMetadata?.url}
                  ml={"5px"}
                >
                  <Text
                    color={"green.700"}
                    fontWeight={"bold"}
                    wordBreak={"break-all"}
                  >
                    {ipfsMetadata?.cid}
                  </Text>
                </Link>
              </Box>
            </Box>
            <Box>
              {isMember ? (
                <Tooltip label={"You are already a member of this dao."}>
                  <Tag variant={"solid"} colorScheme={"green"}>
                    Member
                  </Tag>
                </Tooltip>
              ) : isDaoAdmin ? (
                <Tooltip label={"You are admin of this dao."}>
                  <Tag variant={"solid"} colorScheme={"blue"}>
                    Admin
                  </Tag>
                </Tooltip>
              ) : (
                <Button
                  variant={"solid"}
                  leftIcon={<FaHandshake />}
                  onClick={handleJoin}
                  disabled={isJoinProcess}
                >
                  {!isJoinProcess ? (
                    "Join DAO"
                  ) : (
                    <CircularProgress isIndeterminate size={"20px"} />
                  )}
                </Button>
              )}
            </Box>
          </Flex>
          <Divider my={"20px"} />
          <Text textAlign={"left"}>{metadata?.description}</Text>
        </Box>
        <Box w={"100%"} my={"10px"}>
          {metadata?.tags?.map((value: string, index: number) => {
            return (
              <Tag
                id={value + index}
                key={`tag-${value}-${index}`}
                m={"2px"}
                colorScheme={"green"}
              >
                #{value}
              </Tag>
            );
          })}
        </Box>
        <Flex w={"100%"} my={"10px"}>
          <BiCategoryAlt fontSize={"20px"} color={"gray"} />
          {metadata?.categories?.map((value: string, index: number) => {
            return (
              <Badge key={value + index} m={"2px"} colorScheme={"blue"}>
                {value}
              </Badge>
            );
          })}
        </Flex>
        <Flex w={"100%"} my={"10px"}>
          <MdOutlineCategory fontSize={"20px"} />
          {metadata?.subCategories?.map((value: string, index: number) => {
            return (
              <Badge key={value + index} m={"2px"} colorScheme={"purple"}>
                {value}
              </Badge>
            );
          })}
        </Flex>
        <Flex w={"100%"} my={"10px"}>
          <Box w={"100%"} display={"flex"}>
            <MdOutlineShareLocation fontSize={"20px"} />
            <Text ml={"2px"}>Location: {metadata?.country}</Text>
          </Box>
        </Flex>
      </VStack>
    </SimpleLayout>
  );
};

export default AboutDao;

import {
  Badge,
  Box,
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
  useBreakpoint,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import { FaHeading } from "react-icons/fa";
import { resolveBlockchainLinks, Type } from "../../util";
import { BiCategoryAlt } from "react-icons/bi";
import { MdOutlineCategory, MdOutlineShareLocation } from "react-icons/md";
import SimpleLayout from "../layouts/simpleLayout";

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
}

const AboutDao: React.FC<IAboutDao> = ({
  metadata,
  transactionHash,
  ipfsMetadata,
}) => {
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

import {
  CircularProgress,
  Heading,
  Link,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { useEffect, useMemo } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { resolveBlockchainLinks, shortenHex, Type } from "../../../util";
import { ethers } from "ethers";

export interface TreasuryTabPanelProps {
  adminAddress: string;
}

export interface TransferTableRowProps {
  assetTransfer: {
    category: string;
    blockNum: string;
    hash: string;
    from: string;
    to: string;
    rawContract?: any;
    tokenId?: string;
  };
  network: string;
}

const TransferTableRow: React.FC<TransferTableRowProps> = ({
  assetTransfer,
  network,
}) => {
  switch (assetTransfer?.category) {
    case "erc721":
      const tokenId = ethers.BigNumber.from(assetTransfer?.tokenId);
      return (
        <Tr>
          <Td isNumeric>
            {ethers.BigNumber.from(assetTransfer?.blockNum).toNumber()}
          </Td>
          <Td>
            <Link
              target={"_blank"}
              rel={"noopener noreferrer"}
              href={
                resolveBlockchainLinks(
                  network,
                  "transaction",
                  assetTransfer?.hash
                ).url
              }
            >
              {shortenHex(assetTransfer?.hash)}
            </Link>
          </Td>
          <Td>
            <Tag colorScheme={"blue"}>ERC721</Tag>
          </Td>
          <Td>
            <Link
              target={"_blank"}
              rel={"noopener noreferrer"}
              href={
                resolveBlockchainLinks(
                  network,
                  "address",
                  assetTransfer?.from
                ).url
              }
            >
              {shortenHex(assetTransfer?.from)}
            </Link>
          </Td>
          <Td>
            <Link
              target={"_blank"}
              rel={"noopener noreferrer"}
              href={
                resolveBlockchainLinks(network, "address", assetTransfer?.to)
                  .url
              }
            >
              {shortenHex(assetTransfer?.to)}
            </Link>
          </Td>
          <Td>{tokenId.toString()}</Td>
        </Tr>
      );
    case "erc20":
      const erc20Value = ethers.BigNumber.from(
        assetTransfer?.rawContract?.value
      );
      return (
        <Tr>
          <Td isNumeric>
            {ethers.BigNumber.from(assetTransfer?.blockNum).toNumber()}
          </Td>
          <Td>
            {" "}
            <Link
              target={"_blank"}
              rel={"noopener noreferrer"}
              href={
                resolveBlockchainLinks(
                  network,
                  "transaction",
                  assetTransfer?.hash
                ).url
              }
            >
              {shortenHex(assetTransfer?.hash)}
            </Link>
          </Td>
          <Td>
            <Tag colorScheme={"green"}>ERC20</Tag>
          </Td>
          <Td>
            <Link
              target={"_blank"}
              rel={"noopener noreferrer"}
              href={
                resolveBlockchainLinks(
                  network,
                  "address",
                  assetTransfer?.from
                ).url
              }
            >
              {shortenHex(assetTransfer?.from)}
            </Link>
          </Td>
          <Td>
            <Link
              target={"_blank"}
              rel={"noopener noreferrer"}
              href={
                resolveBlockchainLinks(network, "address", assetTransfer?.to)
                  .url
              }
            >
              {shortenHex(assetTransfer?.to)}
            </Link>
          </Td>
          <Td>{ethers.utils.formatUnits(erc20Value, 18)}</Td>
        </Tr>
      );
    case "erc1155":
      return (
        <Tr>
          <Td isNumeric>
            {ethers.BigNumber.from(assetTransfer?.blockNum).toNumber()}
          </Td>
          <Td>
            {" "}
            <Link
              target={"_blank"}
              rel={"noopener noreferrer"}
              href={
                resolveBlockchainLinks(
                  network,
                  "transaction",
                  assetTransfer?.hash
                ).url
              }
            >
              {shortenHex(assetTransfer?.hash)}
            </Link>
          </Td>
          <Td>
            <Tag colorScheme={"purple"}>ERC1155</Tag>
          </Td>
          <Td>
            <Link
              target={"_blank"}
              rel={"noopener noreferrer"}
              href={
                resolveBlockchainLinks(
                  network,
                  "address",
                  assetTransfer?.from
                ).url
              }
            >
              {shortenHex(assetTransfer?.from)}
            </Link>
          </Td>
          <Td>
            <Link
              target={"_blank"}
              rel={"noopener noreferrer"}
              href={
                resolveBlockchainLinks(network, "address", assetTransfer?.to)
                  .url
              }
            >
              {shortenHex(assetTransfer?.to)}
            </Link>
          </Td>
          <Td>{assetTransfer?.rawContract?.value}</Td>
        </Tr>
      );
    case "external":
      const value = ethers.BigNumber.from(assetTransfer?.rawContract?.value);
      return (
        <Tr>
          <Td isNumeric>
            {ethers.BigNumber.from(assetTransfer?.blockNum).toNumber()}
          </Td>
          <Td>
            {" "}
            <Link
              target={"_blank"}
              rel={"noopener noreferrer"}
              href={
                resolveBlockchainLinks(
                  network,
                  "transaction",
                  assetTransfer?.hash
                ).url
              }
            >
              {shortenHex(assetTransfer?.hash)}
            </Link>
          </Td>
          <Td>
            <Tag colorScheme={"gray"}>EXTERNAL</Tag>
          </Td>
          <Td>
            <Link
              target={"_blank"}
              rel={"noopener noreferrer"}
              href={
                resolveBlockchainLinks(
                  network,
                  "address",
                  assetTransfer?.from
                ).url
              }
            >
              {shortenHex(assetTransfer?.from)}
            </Link>
          </Td>
          <Td>
            <Link
              target={"_blank"}
              rel={"noopener noreferrer"}
              href={
                resolveBlockchainLinks(network, "address", assetTransfer?.to)
                  .url
              }
            >
              {shortenHex(assetTransfer?.to)}
            </Link>
          </Td>
          <Td>{ethers.utils.formatEther(value)} MATIC</Td>
        </Tr>
      );
  }
};

const TreasuryTabPanel: React.FC<TreasuryTabPanelProps> = ({
  adminAddress,
}) => {
  const { chainId } = useWeb3React();

  const query = useQuery({
    queryKey: ["transfersData"],
    queryFn: async () => {
      const res = await axios.get(
        `/api/backend/alchemy?type=transactions&toAddress=${adminAddress}`
      );
      return res?.data?.transfers;
    },
    enabled: !!adminAddress,
  });

  const balancequery = useQuery({
    queryKey: ["balanceQuery"],
    queryFn: async () => {
      const res = await axios.get(
        `/api/backend/alchemy?type=balance&address=${adminAddress}`
      );
      return res?.data;
    },
    enabled: !!adminAddress,
  });

  const ethBalance = useMemo(() => {
    if (balancequery?.data) {
      const val = ethers.BigNumber.from(balancequery?.data?.hex);
      return ethers.utils.formatEther(val).substring(0, 4);
    } else {
      return "0.00";
    }
  }, [balancequery?.data]);

  return (
    <VStack>
      <Heading>Treasury wallets to DAO</Heading>
      <Link
        target={"_blank"}
        rel={"noopener noreferrer"}
        href={
          resolveBlockchainLinks("maticmum", "address", adminAddress).url
        }
      >
        <Text textAlign={"right"} fontWeight={"bold"}>
          {adminAddress}
        </Text>
      </Link>
      <Text>Balance : {ethBalance} MATIC</Text>
      {query.isLoading && (
        <CircularProgress isIndeterminate color={"brand.700"} fontSize={32} />
      )}
      {query.isFetched && !query.isError && (
        <TableContainer scrollBehavior={"smooth"}>
          <Heading size={"lg"} color={"brand.700"}>
            Latest Transactions
          </Heading>
          <Table variant="simple" colorScheme="blue">
            <Thead>
              <Tr>
                <Th>Block Number</Th>
                <Th>Txn Hash</Th>
                <Th>Category</Th>
                <Th>From</Th>
                <Th>To</Th>
                <Th>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              {query?.data?.map((assetTransfer, idx) => {
                return (
                  <TransferTableRow
                    assetTransfer={assetTransfer}
                    network={"maticmum"}
                    key={`${assetTransfer?.hash}-${idx}`}
                  />
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </VStack>
  );
};

export default TreasuryTabPanel;

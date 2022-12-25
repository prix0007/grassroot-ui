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
import { useEffect } from "react";
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
}

const TransferTableRow: React.FC<TransferTableRowProps> = ({
  assetTransfer,
}) => {
  switch (assetTransfer?.category) {
    case "erc721":
      const tokenId = ethers.BigNumber.from(assetTransfer?.tokenId)
      return (
        <Tr>
          <Td>{assetTransfer?.blockNum}</Td>
          <Td>{shortenHex(assetTransfer?.hash)}</Td>
          <Td>
            <Tag colorScheme={"blue"}>ERC721</Tag>
          </Td>
          <Td>{shortenHex(assetTransfer?.from)}</Td>
          <Td>{shortenHex(assetTransfer?.to)}</Td>
          <Td>{tokenId.toString()}</Td>
        </Tr>
      );
    case "erc20":
      const erc20Value = ethers.BigNumber.from(assetTransfer?.rawContract?.value);
      return (
        <Tr>
          <Td>{assetTransfer?.blockNum}</Td>
          <Td>{shortenHex(assetTransfer?.hash)}</Td>
          <Td>
            <Tag colorScheme={"green"}>ERC20</Tag>
          </Td>
          <Td>{shortenHex(assetTransfer?.from)}</Td>
          <Td>{shortenHex(assetTransfer?.to)}</Td>
          <Td>{ethers.utils.formatUnits(erc20Value, 18)}</Td>
        </Tr>
      );
    case "erc1155":
      return (
        <Tr>
          <Td>{assetTransfer?.blockNum}</Td>
          <Td>{shortenHex(assetTransfer?.hash)}</Td>
          <Td>
            <Tag colorScheme={"purple"}>ERC1155</Tag>
          </Td>
          <Td>{shortenHex(assetTransfer?.from)}</Td>
          <Td>{shortenHex(assetTransfer?.to)}</Td>
          <Td>{assetTransfer?.rawContract?.value}</Td>
        </Tr>
      );
    case "external":
      const value = ethers.BigNumber.from(assetTransfer?.rawContract?.value);
      return (
        <Tr>
          <Td>{assetTransfer?.blockNum}</Td>
          <Td>{shortenHex(assetTransfer?.hash)}</Td>
          <Td>
            <Tag colorScheme={"gray"}>EXTERNAL</Tag>
          </Td>
          <Td>{shortenHex(assetTransfer?.from)}</Td>
          <Td>{shortenHex(assetTransfer?.to)}</Td>
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
        `/api/backend/alchemy?toAddress=${adminAddress}`
      );
      return res?.data?.transfers;
    },
    enabled: !!adminAddress,
  });

  return (
    <VStack>
      <Heading>Treasury wallets to DAO</Heading>
      <Link
        target={"_blank"}
        rel={"noopener noreferrer"}
        href={
          resolveBlockchainLinks("maticmum", Type.address, adminAddress).url
        }
      >
        <Text textAlign={"right"} fontWeight={"bold"}>
          {adminAddress}
        </Text>
      </Link>
      {query.isLoading && (
        <CircularProgress isIndeterminate color={"brand.700"} fontSize={32} />
      )}
      {query.isFetched && !query.isError && (
        <TableContainer>
          <Table variant="striped" colorScheme="blue">
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

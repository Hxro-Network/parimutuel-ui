import React, { useMemo } from "react";
import { Column, useSortBy, useTable } from "react-table";
import { getMarketPubkeys, shortenAddress } from "@hxronetwork/parimutuelsdk";
import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";

import CurrentPriceColumn from "@components/Column/CurrentPriceColumn/CurrentPriceColumn";
import KeyColumn from "@components/Column/KeyColumn/KeyColumn";
import LockedPriceColumn from "@components/Column/LockedPriceColumn/LockedPriceColumn";
import MarketColumn from "@components/Column/MarketColumn/MarketColumn";
import MyPositionColumn from "@components/Column/MyPositionColumn/MyPositionColumn";
import PayoutColumn from "@components/Column/PayoutColumn/PayoutColumn";
import PoolSizeColumn from "@components/Column/PoolSizeColumn/PoolSizeColumn";
import TimeColumn from "@components/Column/TimeColumn/TimeColumn";
import Sort from "@components/Sort/Sort";
import { getWeb3Config } from "@constants/config";
import { usePyth } from "@contexts/pyth";
import { useSetting } from "@contexts/setting";
import { MarketBoardItem, useMarket } from "@hooks/useMarket";

const columns: Column<MarketBoardItem>[] = [
  {
    Header: "ID",
    accessor: "key",
    Cell: ({ cell: { value } }) => <KeyColumn pubkey={shortenAddress(value.parimutuelPubkey)} />,
    sortType: (rowA, rowB, columnId) => {
      const a = rowA.values[columnId].parimutuelPubkey;
      const b = rowB.values[columnId].parimutuelPubkey;
      return a > b ? 1 : -1;
    },
  },
  {
    Header: "MARKET",
    accessor: "market",
    Cell: ({ cell: { value } }) => (
      <MarketColumn cryptoPair={value.marketPair} duration={value.duration} />
    ),
    sortType: (rowA, rowB, columnId) => {
      const a = rowA.values[columnId].cryptoPair;
      const b = rowB.values[columnId].cryptoPair;
      return a > b ? 1 : -1;
    },
  },
  {
    Header: "TIME",
    accessor: "time",
    Cell: ({ cell: { value } }) => <TimeColumn endTime={value.endTime} />,
    sortType: (rowA, rowB, columnId) => {
      const a = rowA.values[columnId].endTime;
      const b = rowB.values[columnId].endTime;
      return a > b ? 1 : -1;
    },
  },
  {
    Header: "POOL SIZE",
    accessor: "pool",
    Cell: ({ cell: { value } }) => (
      <PoolSizeColumn poolSize={value.poolSize} long={value.long} short={value.short} />
    ),
    sortType: (rowA, rowB, columnId) => {
      const a = rowA.values[columnId].poolSize;
      const b = rowB.values[columnId].poolSize;
      return a > b ? 1 : -1;
    },
  },
  {
    Header: "MY POSITION",
    accessor: "position",
    Cell: ({ cell: { value } }) => (
      <MyPositionColumn long={value.long || undefined} short={value.short || undefined} />
    ),
    sortType: (rowA, rowB, columnId) => {
      const a = rowA.values[columnId].long;
      const b = rowB.values[columnId].long;
      return a > b ? 1 : -1;
    },
  },
  {
    Header: "LOCKED PRICE",
    accessor: "locked",
    Cell: ({ cell: { value } }) => <LockedPriceColumn price={value.price} />,
  },
  {
    Header: "CURRENT PRICE",
    accessor: "settled",
    Cell: ({ cell: { value } }) => <CurrentPriceColumn price={value.price} />,
  },
  {
    Header: "EXP. PAYOUT",
    accessor: "payout",
    Cell: ({ cell: { value } }) => (
      <PayoutColumn
        long={value.longPosition}
        short={value.shortPosition}
        longPool={value.longPool}
        shortPool={value.shortPool}
        lockedPrice={value.lockedPrice}
        settledPrice={value.settledPrice}
        showSettle={false}
        parimutuelPubkey={value.parimutuelPubkey}
        isExpired={value.isExpired}
      />
    ),
    sortType: (rowA, rowB, columnId) => {
      const a = rowA.values[columnId]?.longPosition ?? 0;
      const b = rowB.values[columnId]?.longPosition ?? 0;
      return a > b ? 1 : -1;
    },
  },
];

export const LiveBoard = () => {
  const { selectedDurations, selectedMarketPair } = useSetting();
  const { liveParimutuels } = useMarket();
  const { priceMap } = usePyth();

  const cryptoPrice = useMemo(() => {
    const price = priceMap[selectedMarketPair];
    return price?.priceData.price ?? 0;
  }, [priceMap, selectedMarketPair]);

  const data = useMemo(() => {
    const markets = getMarketPubkeys(getWeb3Config(), selectedMarketPair);
    const marketPubkeys = markets
      .filter((market) => selectedDurations.includes(market.duration))
      .map((market) => market.pubkey.toBase58());

    const modified = liveParimutuels.map((live) => {
      live.settled.price = cryptoPrice;
      live.payout.settledPrice = cryptoPrice;
      return live;
    });
    return modified.filter((market) => marketPubkeys.includes(market.key.marketPubkey));
  }, [selectedDurations, cryptoPrice, liveParimutuels, selectedMarketPair]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
  );

  const getWidth = (index: number): string => {
    if (index === 0) return "10%";
    if (index === 3) return "20%";
    return "11%";
  };

  return (
    <Table {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup) => {
          const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
          return (
            <Tr key={key} {...restHeaderGroupProps}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  paddingX="1px"
                  paddingY="0px"
                  width={getWidth(index)}
                  height="26px"
                  border="0px"
                  key={index}
                >
                  <Flex
                    paddingY="4px"
                    bgColor="brand.100"
                    width="100%"
                    height="100%"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text textStyle="table" color="gray.400">
                      {column.Header}
                    </Text>
                    <Sort column={column} />
                  </Flex>
                </Th>
              ))}
            </Tr>
          );
        })}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          const { key, ...restRowProps } = row.getRowProps();
          return (
            <Tr key={key} {...restRowProps}>
              {row.cells.map((cell) => {
                const { key, ...restCellProps } = cell.getCellProps();
                return (
                  <Td key={key} {...restCellProps} textAlign="center" padding="0px" border="0px">
                    {cell.render("Cell")}
                  </Td>
                );
              })}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

export default LiveBoard;

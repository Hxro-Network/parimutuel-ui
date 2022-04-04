import React from "react";
import { shortenAddress } from "parimutuel-web3";
import { Flex, FlexProps, Text } from "@chakra-ui/react";

export type KeyColumnProps = FlexProps & {
  pubkey: string;
};

export const KeyColumn: React.FC<KeyColumnProps> = ({ pubkey, ...restProps }) => {
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="80px"
      borderBottom="1px"
      borderBottomColor="brand.100"
      borderRight="1px"
      borderRightColor="brand.100"
      {...restProps}
    >
      <Text textStyle="small" color="white">
        {shortenAddress(pubkey)}
      </Text>
    </Flex>
  );
};

export default KeyColumn;

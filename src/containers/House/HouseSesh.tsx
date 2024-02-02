import { Box, Card, Heading } from "@radix-ui/themes";

import { HouseInitialize } from "./HouseInitialize";
import {MarketNftsContainer } from "./HouseKeypairInput";


export function HouseSesh() {
  return (
    <Box grow={"1"} shrink={"1"}>
      <Card style={{ width: "100%" }}>
        <Heading size="4" align={"center"}>
          User Panal
        </Heading>
        <MarketNftsContainer />
        <HouseInitialize />
      </Card>
    </Box>
  );
}

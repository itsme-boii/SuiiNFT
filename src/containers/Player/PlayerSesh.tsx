import { Box, Card, Heading } from "@radix-ui/themes";
import { PlayerCreateGame } from "./PlayerCreateGame";
import { PlayerListCounterNft } from "./PlayerListCounterNft";


export function PlayerSesh() {
  return (
    <Box grow={"1"} shrink={"1"}>
      <Card style={{ width: "100%" }}>
        <Heading size="8" align={"center"}>
          NFTs
        </Heading>
        <PlayerListCounterNft />
        <PlayerCreateGame />
      </Card>
    </Box>
  );
}

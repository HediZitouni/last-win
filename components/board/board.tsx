import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Button } from "react-native";
import { background_grey, button_grey, last_green } from "../../utils/common-styles";
import { getGame } from "../game/game.service";
import { Game } from "../games/games.type";
import { getUsers } from "../users/users.service";
import { User } from "../users/users.type";

interface BoardProperties {
  game: Game;
  ws: WebSocket;
}

const Board = ({ game: { id: idGame, users, last }, ws: initWebsocket }: BoardProperties) => {
  const [triggerRefresh, setTriggerRefresh] = React.useState<boolean>(false);
  const [ws, setWebSocket] = React.useState(initWebsocket);
  const [mapUsers, setMapUsers] = React.useState<Map<String, User>>();

  useEffect(() => {
    setWebSocket((lastWs) => {
      lastWs.onmessage = (e) => {
        const { message } = JSON.parse(e.data.toString());
        switch (message) {
          case "lastChanged":
            setTriggerRefresh(!triggerRefresh);
            break;
          default:
            console.log(`${message} not known as ws event`);
            break;
        }
      };
      return lastWs;
    });
    getUsers(idGame).then((uigs) => {
      const mapUigs = new Map(uigs.map((uig) => [uig.id, uig]));
      setMapUsers(mapUigs);
    });
  }, [triggerRefresh]);

  return mapUsers ? (
    <>
      <View style={styles.board_container}>
        <ScrollView>
          {users.map((uig, index) => {
            const user = mapUsers.get(uig.idUser);
            return (
              <View style={[styles.board_item, user.id === last.idUser ? styles.board_item_last : null]} key={index}>
                <View style={styles.board_item_name}>
                  <Text>{user.name}</Text>
                </View>
                <View style={styles.board_item_score}>
                  <Text>{uig.score}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </>
  ) : (
    <View>
      <Text>Loading</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  board_container: {
    flex: 8,
    backgroundColor: background_grey,
  },
  board_item: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  board_item_last: {
    backgroundColor: last_green,
  },
  board_item_name: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
  },
  board_item_score: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  refresh_button_container: {
    flex: 1,
    backgroundColor: background_grey,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Board;

import React, { useEffect } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { background_grey, button_grey, button_grey_press } from "../../utils/common-styles";
import Board from "../board/board";
import Clock from "../clock/clock.component";
import { getGame } from "../game/game.service";
import { Game } from "../games/games.type";
import { getUserById, setLast } from "../users/users.service";
import { __retrieveUserId, __storeUserId } from "../users/users.store";
import { User } from "../users/users.type";

interface ButtonLastProperties {
  user: User;
  game: Game;
  ws: WebSocket;
  setViewData: Function;
}
const ButtonLast = ({ user, game: initGame, ws: initWebsocket, setViewData }: ButtonLastProperties) => {
  const [{ id: idUser, name }, setUser] = React.useState<User | null>(user);
  const [game, setGame] = React.useState<Game | null>(initGame);
  const [{ credit, score }, setUserInGame] = React.useState(game.users?.find((u) => u.idUser === idUser));
  const [triggerRefresh, setTriggerRefresh] = React.useState<boolean>(false);
  const [triggerScoreRefresh, setTriggerScoreRefresh] = React.useState<boolean>(false);
  const [ws, setWebSocket] = React.useState(initWebsocket);
  const { id: idGame, last } = game;
  useEffect(() => {
    getUserById(idUser)
      .then((user) => {
        setUser(user);
      })
      .catch((error) => {
        console.log(error);
      });
    getGame(idGame)
      .then((game) => {
        setGame(game);
        setUserInGame(game.users?.find((u) => u.idUser === idUser));
      })
      .catch((error) => {
        console.log(error);
      });
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
  }, [triggerRefresh]);

  useEffect(() => {
    if (isLast() && Math.round(Date.now() / 1000) < +game.endedAt) {
      setUserInGame((prev) => {
        const newScore = prev.score + 1;
        const currUser = game.users?.find((u) => u.idUser === idUser);
        if (currUser) currUser.score = newScore;
        return { ...prev, score: newScore };
      });
    }
  }, [triggerScoreRefresh]);

  async function addCount() {
    await setLast(idGame, idUser);
    setTriggerRefresh((prev) => !prev);
  }

  function isLast() {
    return idUser === last.idUser;
  }

  return user ? (
    <View style={styles.last_button_view_container}>
      <View style={styles.header}>
        <Pressable style={styles.name_container} onPress={() => setViewData({ index: 2 })}>
          <Text style={styles.name_text}>{name}</Text>
        </Pressable>
        <View style={styles.clock_container}>
          <Clock
            startedAt={+game.startedAt}
            minutes={game.time}
            setTriggerScoreRefresh={setTriggerScoreRefresh}
          ></Clock>
        </View>
        <View style={styles.placeholder_2}></View>
        <View style={styles.score_container}>
          <Text>{score} Pts</Text>
        </View>
        <View style={styles.credit_container}>
          <Text>{credit} Credits</Text>
        </View>
      </View>
      <View style={styles.game_name_container}>
        <Text style={styles.name_text}>{game.name || "NO NAME GAME"}</Text>
      </View>

      <View style={styles.button_container}>
        <Pressable style={({ pressed }) => [styles.button, styleOnPress(pressed)]} onPress={addCount}>
          <Text style={styles.button_text}>{isLast() ? "You are last" : "Be the last"}</Text>
        </Pressable>
      </View>
      <View style={styles.board_container}>
        <Board game={game} ws={ws}></Board>
      </View>
    </View>
  ) : (
    <View>
      <Text>Loading BUTTON LAST</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  last_button_view_container: {
    flex: 9,
    display: "flex",
    backgroundColor: background_grey,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder_1: { flex: 1 },
  name_container: { flex: 1 },
  name_text: { fontSize: 25 },
  score_container: { flex: 1 },
  button_container: { flex: 1, flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "center" },
  button: {
    backgroundColor: button_grey,
    color: "white",
    padding: "8px",
    textTransform: "uppercase",
    borderRadius: 2,
    textAlign: "center",
    width: "30%",
  },
  button_text: { color: "white", fontWeight: "500" },
  placeholder_4: { flex: 4 },
  placeholder_3: { flex: 3 },
  placeholder_2: { flex: 2 },
  credit_container: { flex: 1, textAlign: "center" },
  header: { flex: 1, flexDirection: "row", width: "100%", alignItems: "center" },
  board_container: { flex: 8, width: "100%" },
  game_name_container: { flex: 1, justifyContent: "center" },
  clock_container: { flex: 2 },
});

const styleOnPress = (pressed) => ({
  backgroundColor: pressed ? button_grey_press : button_grey,
});

export default ButtonLast;

import React, { useEffect } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { background_grey, button_grey, button_grey_press } from "../../utils/common-styles";
import { getGame } from "../game/game.service";
import { Game } from "../games/games.type";
import { getUserById, setLast } from "../users/users.service";
import { __retrieveUserId, __storeUserId } from "../users/users.store";
import { User } from "../users/users.type";

interface ButtonLastProperties {
  user: User;
  game: Game;
}
const ButtonLast = ({ user, game }: ButtonLastProperties) => {
  const [{ id: idUser, name }, setUser] = React.useState<User | null>(user);
  const [{ id: idGame, last }, setGame] = React.useState<Game | null>(game);
  const [{ credit, score }, setUserInGame] = React.useState(game.users?.find((u) => u.idUser === idUser));
  const [triggerRefresh, setTriggerRefresh] = React.useState<boolean>(false);

  const ws = new WebSocket("ws://localhost:3000/");
  ws.onopen = () => {
    console.log("open");
    ws.send(JSON.stringify({ message: "setupUser", content: { idUser } }));
  };
  ws.onclose = (e) => {
    console.log("close");
  };
  ws.onerror = (e) => {
    console.log("error", e);
  };
  ws.onmessage = (e) => {
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
  }, [triggerRefresh]);

  async function addCount() {
    await setLast(idGame, idUser);
    setTriggerRefresh((prev) => !prev);
  }

  function isLast() {
    return idUser === last.idUser;
  }

  return (
    user && (
      <View style={styles.last_button_view_container}>
        <View style={styles.placeholder_2}></View>
        <View style={styles.name_container}>
          <Text style={styles.name_text}>{name}</Text>
        </View>
        <View style={styles.score_container}>
          <Text>{score} Pts</Text>
        </View>
        <View style={styles.button_container}>
          <View style={styles.placeholder_2}></View>
          <Pressable style={({ pressed }) => [styles.button, styleOnPress(pressed)]} onPress={addCount}>
            <Text style={styles.button_text}>{isLast() ? "You are last" : "Be the last"}</Text>
          </Pressable>
          <View style={styles.credit_container}>
            <Text>{credit} Credits</Text>
          </View>
          <View style={styles.placeholder_1}></View>
        </View>
        <View style={styles.placeholder_4}></View>
      </View>
    )
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
  name_text: { fontSize: 40 },
  score_container: { flex: 1 },
  button_container: { flex: 1, flexDirection: "row", alignItems: "center", width: "100%" },
  button: {
    backgroundColor: button_grey,
    color: "white",
    padding: "8px",
    textTransform: "uppercase",
    borderRadius: 2,
    flex: 1,
    textAlign: "center",
  },
  button_text: { color: "white", fontWeight: "500" },
  placeholder_4: { flex: 4 },
  placeholder_2: { flex: 2 },
  credit_container: { flex: 1, textAlign: "center" },
});

const styleOnPress = (pressed) => ({
  backgroundColor: pressed ? button_grey_press : button_grey,
});

export default ButtonLast;

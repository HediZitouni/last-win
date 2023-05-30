import React, { useEffect } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { background_grey, button_grey, button_grey_press } from "../../utils/common-styles";
import Board from "../board/board";
import Clock from "../clock/clock.component";
import { setLast } from "../users/users.service";
import { __retrieveUserId, __storeUserId } from "../users/users.store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { addScoreToLast } from "../game/game.slice";

interface ButtonLastProperties {
  route: any;
  navigation: any;
}
const ButtonLast = ({ route, navigation }: ButtonLastProperties) => {
  const dispatch = useDispatch();

  const game = useSelector((state: RootState) => state.game[route.params.idGame]);
  const user = useSelector((state: RootState) => state.user);
  const uig = game.users.find((u) => u.idUser === user.id);
  const [triggerRefresh, setTriggerRefresh] = React.useState<boolean>(false);

  function updateScoreLast() {
    if (game && Math.round(Date.now() / 1000) < +game.endedAt) {
      dispatch(addScoreToLast([game.id, 1]));
    }
  }

  async function addCount() {
    await setLast(game.id, user.id);

    setTriggerRefresh((prev) => !prev);
  }

  function isLast() {
    return user.id === game.last.idUser;
  }

  return user && game ? (
    <View style={styles.last_button_view_container}>
      <View style={styles.header}>
        <View style={styles.game_name_container}>
          <Text style={styles.game_text}>{game.name || "NO NAME GAME"}</Text>
        </View>

        <View style={styles.clock_container}>
          <Clock idGame={game.id} setTriggerRefresh={updateScoreLast}></Clock>
        </View>
        <View style={styles.placeholder_2}></View>
        <View style={styles.score_container}>
          <Text>{uig.score} Pts</Text>
        </View>
        <View style={styles.credit_container}>
          <Text>{uig.credit} Credits</Text>
        </View>
      </View>
      <Pressable style={styles.name_container} onPress={() => navigation.navigate("UserInput", { idGame: game.id })}>
        <Text style={styles.name_text}>{user.name}</Text>
      </Pressable>

      <View style={styles.button_container}>
        <Pressable style={({ pressed }) => [styles.button, styleOnPress(pressed)]} onPress={addCount}>
          <Text style={styles.button_text}>{isLast() ? "You are last" : "Be the last"}</Text>
        </Pressable>
      </View>
      <View style={styles.board_container}>
        <Board idGame={game.id}></Board>
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
  game_text: { fontSize: 25, textAlign: "center" },
  name_text: { fontSize: 25, textAlign: "center" },
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

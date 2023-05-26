import React, { useEffect } from "react";
import { StyleSheet, View, Button, Text, Pressable } from "react-native";
import StyledPressable from "../pressable/pressable.component";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { getGame } from "../game/game.service";
import { setGame as setGameSlice } from "../game/game.slice";
import { Game } from "../games/games.type";

interface GameMenuProps {
  navigation: any;
}
const GameMenu = ({ navigation }: GameMenuProps) => {
  const dispatch = useDispatch();
  const { games } = useSelector((state: RootState) => state.user);
  const gameStore = useSelector((state: RootState) => state.game);

  const handleGamePress = async (game: Game) => {
    if (game.startedAt) {
      if (!gameStore[game.id]) {
        const dbGame = await getGame(game.id);
        dispatch(setGameSlice(dbGame));
      }
      navigation.navigate("ButtonLast", { idGame: game.id });
    } else {
      navigation.navigate("GameView", { idGame: game.id });
    }
  };

  return (
    <View style={styles.game_menu_view_container}>
      <View style={styles.game_menu_left_container}>
        {games ? (
          games.map((game, key) => {
            return (
              <StyledPressable
                onPressFunction={() => {
                  handleGamePress(game);
                }}
                defaultStyle={styles.game_menu_left_item}
                pressedStyle={styles.pressed_game_menu_left_item}
                text={game.name || "no name game"}
                key={key}
              ></StyledPressable>
            );
          })
        ) : (
          <View>
            <Text>No current games</Text>
          </View>
        )}
      </View>
      <View style={styles.game_menu_middle_container}></View>
      <View style={styles.game_menu_right_container}>
        <StyledPressable
          onPressFunction={() => navigation.navigate("GameCreation")}
          defaultStyle={styles.game_menu_right_item}
          pressedStyle={styles.pressed_game_menu_right_item}
          text={"Create a game"}
        ></StyledPressable>
        <StyledPressable
          onPressFunction={() => navigation.navigate("GameJoin")}
          defaultStyle={styles.game_menu_right_item}
          pressedStyle={styles.pressed_game_menu_right_item}
          text={"Join a game"}
        ></StyledPressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  game_menu_view_container: {
    flex: 9,
    backgroundColor: "blue",
    flexDirection: "row",
  },
  game_menu_left_container: {
    flex: 99,
    backgroundColor: "cyan",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  game_menu_right_container: {
    flex: 99,
    backgroundColor: "red",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  game_menu_middle_container: {
    flex: 2,
    backgroundColor: "black",
  },
  game_menu_left_item: {
    backgroundColor: "green",
    width: "30%",
    marginBottom: "10px",
    textAlign: "center",
  },
  game_menu_right_item: {
    backgroundColor: "grey",
    width: "30%",
    marginBottom: "20px",
    textAlign: "center",
  },
  pressed_game_menu_right_item: {
    backgroundColor: "blue",
  },
  pressed_game_menu_left_item: {
    backgroundColor: "blue",
  },
});
export default GameMenu;

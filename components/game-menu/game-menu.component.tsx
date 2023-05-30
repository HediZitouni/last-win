import React, { useEffect } from "react";
import { StyleSheet, View, Button, Text, Pressable, ScrollView } from "react-native";
import StyledPressable from "../pressable/pressable.component";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { getGame } from "../game/game.service";
import { setGame as setGameSlice } from "../game/game.slice";
import { Game } from "../games/games.type";
import { background_grey, button_grey, button_grey_press } from "../../utils/common-styles";

interface GameMenuProps {
  navigation: any;
}
const GameMenu = ({ navigation }: GameMenuProps) => {
  const dispatch = useDispatch();
  const { games } = useSelector((state: RootState) => state.user);
  const gameStore = useSelector((state: RootState) => state.game);

  const handleGamePress = async (game: Game) => {
    const dbGame = await getGame(game.id);
    dispatch(setGameSlice(dbGame));
    if (dbGame.startedAt) {
      navigation.navigate("ButtonLast", { idGame: dbGame.id });
    } else {
      navigation.navigate("GameView", { idGame: dbGame.id });
    }
  };

  return (
    <View style={styles.game_menu_view_container}>
      <View style={styles.game_menu_left_container}>
        <ScrollView style={styles.scroll_view} contentContainerStyle={styles.scroll_view_container}>
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
        </ScrollView>
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
    //backgroundColor: "blue",
    flexDirection: "row",
  },
  game_menu_left_container: {
    flex: 99,
    backgroundColor: background_grey,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "50px",
  },
  game_menu_right_container: {
    flex: 99,
    backgroundColor: background_grey,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  game_menu_middle_container: {
    flex: 2,
    backgroundColor: "black",
  },
  game_menu_left_item: {
    //backgroundColor: "green",
    backgroundColor: button_grey,
    width: "30%",
    marginBottom: "10px",
    textAlign: "center",
  },
  game_menu_right_item: {
    backgroundColor: button_grey,

    width: "30%",
    marginBottom: "20px",
    textAlign: "center",
  },
  pressed_game_menu_right_item: {
    backgroundColor: button_grey_press,
  },
  pressed_game_menu_left_item: {
    backgroundColor: button_grey_press,
  },
  scroll_view: {
    width: "100%",
  },

  scroll_view_container: {
    alignItems: "center",
  },
});
export default GameMenu;

import { useState } from "react";
import { Pressable, Text, StyleSheet, View, TextInput } from "react-native";
import Checkbox from "expo-checkbox";
import { Game, GameInput } from "../games/games.type";
import StyledPressable from "../pressable/pressable.component";
import { background_grey, button_grey, button_grey_press } from "../../utils/common-styles";
import { createGame } from "./game-creation.service";
import { getGame } from "../game/game.service";
import { setGame as setGameSlice } from "../game/game.slice";
import { useDispatch } from "react-redux";

interface GameCreationProps {
  navigation: any;
}

const GameCreation = ({ navigation }: GameCreationProps) => {
  const dispatch = useDispatch();
  const [game, setGame] = useState<GameInput>(defaultGameInput);

  function changeValue(gameInput: GameInput) {
    setGame({ ...game, ...gameInput });
  }

  async function onCreateClick() {
    const idGame = await createGame(game);
    const dbGame = await getGame(idGame);
    dispatch(setGameSlice(dbGame));
    navigation.navigate("GameView", { idGame });
  }

  return (
    <View style={styles.game_creation_view_container}>
      <View style={styles.input_container}>
        <Text>Name</Text>
        <TextInput
          placeholder="Name of the game"
          value={game.name}
          onChangeText={(value) => changeValue({ name: value })}
          style={styles.border}
        ></TextInput>
      </View>
      <View style={styles.input_container}>
        <Text>Credits</Text>
        <TextInput
          placeholder="credits"
          value={game.credits}
          onChangeText={(value) => changeValue({ credits: value })}
          keyboardType="numeric"
          style={styles.border}
        ></TextInput>
      </View>

      <View style={styles.input_container}>
        <Text>Time</Text>
        <TextInput
          placeholder="time"
          value={game.time}
          onChangeText={(value) => changeValue({ time: value })}
          style={styles.border}
        ></TextInput>
      </View>
      <View style={styles.input_container}>
        <Text>Blind</Text>
        <View style={[styles.blind_checkbox_container, styles.border]}>
          <Checkbox value={game.blind} onValueChange={(newValue) => changeValue({ blind: newValue })} />
        </View>
      </View>
      <View style={styles.input_container}>
        <Text>Number of players</Text>
        <TextInput
          placeholder="maxPlayers"
          value={game.maxPlayers}
          onChangeText={(value) => changeValue({ maxPlayers: value })}
          style={styles.border}
        ></TextInput>
      </View>
      <StyledPressable
        defaultStyle={styles.button_default}
        pressedStyle={styles.button_pressed}
        text={"Create the game"}
        onPressFunction={onCreateClick}
      ></StyledPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  game_creation_view_container: {
    flex: 9,
    backgroundColor: background_grey,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  blind_container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: background_grey,
  },
  blind_checkbox_container: {
    flexDirection: "row",
    marginBottom: 1,
  },
  checkbox: {
    alignSelf: "center",
  },
  input_container: {
    width: "70%",
    marginBottom: 5,
    //backgroundColor: "red",
  },
  border: {
    borderWidth: 1,
    borderColor: button_grey,
  },
  button_default: {
    backgroundColor: button_grey,
    color: "white",
    padding: "8px",
    textTransform: "uppercase",
    borderRadius: 2,
    textAlign: "center",
  },
  button_pressed: {
    backgroundColor: button_grey_press,
  },
});

const defaultGameInput: GameInput = {
  name: "",
  blind: false,
  credits: "5",
  time: "5",
  maxPlayers: "5",
  idOwner: "",
};

export default GameCreation;

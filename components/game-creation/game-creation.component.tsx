import { useState } from "react";
import { Pressable, Text, StyleSheet, View, TextInput } from "react-native";
import Checkbox from "expo-checkbox";
import { Game } from "../games/games.type";
import StyledPressable from "../pressable/pressable.component";
import { button_grey, button_grey_press } from "../../utils/common-styles";

interface GameInput {
  name?: string;
  credits?: string;
  time?: string;
  blind?: boolean;
  maxPlayers?: string;
}

const GameCreation = () => {
  const [game, setGame] = useState<GameInput>(defaultGameInput);

  function changeValue(gameInput: GameInput) {
    setGame({ ...game, ...gameInput });
  }

  return (
    <View style={styles.game_creation_view_container}>
      <View style={styles.input_container}>
        <Text>Name</Text>
        <TextInput
          placeholder="name"
          value={game.name}
          onChangeText={(value) => changeValue({ name: value })}
        ></TextInput>
      </View>
      <View style={styles.input_container}>
        <Text>Credits</Text>
        <TextInput
          placeholder="credits"
          value={game.credits}
          onChangeText={(value) => changeValue({ credits: value })}
          keyboardType="numeric"
        ></TextInput>
      </View>

      <View style={styles.input_container}>
        <Text>Time</Text>
        <TextInput
          placeholder="time"
          value={game.time}
          onChangeText={(value) => changeValue({ time: value })}
        ></TextInput>
      </View>
      <View style={styles.input_container}>
        <Text>Blind</Text>
        <View style={styles.blind_checkbox_container}>
          <Checkbox value={game.blind} onValueChange={(newValue) => changeValue({ blind: newValue })} />
        </View>
      </View>
      <View style={styles.input_container}>
        <Text>Number of players</Text>
        <TextInput
          placeholder="maxPlayers"
          value={game.maxPlayers}
          onChangeText={(value) => changeValue({ maxPlayers: value })}
        ></TextInput>
      </View>
      <StyledPressable
        defaultStyle={styles.bututon_default}
        pressedStyle={styles.button_pressed}
        text={"Create the game"}
        onPressFunction={() => {
          console.log("hellooo");
        }}
      ></StyledPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  game_creation_view_container: {
    flex: 9,
    backgroundColor: "blue",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  blind_container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "green",
  },
  blind_checkbox_container: {
    flexDirection: "row",
    marginBottom: 1,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
  input_container: {
    width: "70%",
    marginBottom: 5,
    backgroundColor: "red",
  },
  bututon_default: {
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
};

export default GameCreation;

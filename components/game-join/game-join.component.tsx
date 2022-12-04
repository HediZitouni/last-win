import { useState, useEffect } from "react";
import { Text, StyleSheet, View, TextInput } from "react-native";
import { GameInput } from "../games/games.type";
import StyledPressable from "../pressable/pressable.component";
import { button_grey, button_grey_press } from "../../utils/common-styles";
import { getIdGameByHashtag, joinGame } from "./game-join.service";
import { User } from "../users/users.type";

interface GameJoinProps {
  setViewData: Function;
  user: User;
}

const GameJoin = ({ setViewData, user }: GameJoinProps) => {
  const [hashtag, setHashtag] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { id: idUser } = user;

  useEffect(() => {
    console.log(user);
  }, [user]);

  function changeValue(newHash: string) {
    setHashtag(newHash);
  }

  async function onJoinClick() {
    const idGame = await getIdGameByHashtag(hashtag, idUser);
    if (idGame) {
      const joinStatus = await joinGame(idGame);
      if (joinStatus) {
        setErrorMessage(joinStatus);
      } else {
        setViewData({ index: 5, props: { idGame } });
      }
      setErrorMessage("");
    } else {
      setErrorMessage("Game not found");
    }
  }

  return idUser ? (
    <View style={styles.game_join_view_container}>
      <View style={styles.input_container}>
        <Text>{errorMessage}</Text>
        <Text>Game Hashtag</Text>
        <TextInput placeholder="name" value={hashtag} onChangeText={(value) => changeValue(value)}></TextInput>
      </View>

      <StyledPressable
        defaultStyle={styles.button_default}
        pressedStyle={styles.button_pressed}
        text={"Join the game"}
        onPressFunction={onJoinClick}
      ></StyledPressable>
    </View>
  ) : (
    <View>
      <Text>LOADING GAME JOIN</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  game_join_view_container: {
    flex: 9,
    backgroundColor: "blue",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  input_container: {
    width: "70%",
    marginBottom: 5,
    backgroundColor: "red",
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

export default GameJoin;

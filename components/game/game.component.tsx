import { useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";

import { Game } from "../games/games.type";
import StyledPressable from "../pressable/pressable.component";
import { button_grey, button_grey_press } from "../../utils/common-styles";
import { __retrieveUserId } from "../users/users.store";
import { getGame, launchGame } from "./game.service";
import { setUserReady } from "../users/users.service";
import { User } from "../users/users.type";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface GameProps {
  navigation: any;
  route: any;
}

const GameView = ({ route, navigation }: GameProps) => {
  // const [game, setGame] = useState<Game>();
  const game = useSelector((state: RootState) => state.game[route.params.idGame]);

  const idUser = useSelector((state: RootState) => state.user.id);

  useEffect(() => {
    // getGame(route.params.idGame)
    //   .then((game) => {
    //     setGame(game);
    //   })
    //   .catch((error) => console.log(error));
  }, [route.params.idGame]);

  function onLaunchClick() {
    launchGame(game.id);
  }

  function onUserReadyClick() {
    setUserReady(idUser, game.id);
  }

  function buttonText(): string {
    if (game.idOwner !== idUser) return "Ready";
    if (game.users?.some(({ ready }) => !ready)) return "Waiting...";
    return "Launch Game";
  }
  function buttonDisabled(): boolean {
    if (game.idOwner !== idUser) return false;
    return game.users?.some(({ ready }) => !ready);
  }

  return game && idUser ? (
    <View style={styles.game_container}>
      <View style={styles.game_name_container}>
        <Text>
          {game.name} - {game.hashtag}
        </Text>
      </View>
      <View style={styles.game_content_container}>
        <View style={styles.players_container}>
          <Text style={styles.title}>Players</Text>
          {game.users.map((user, index) => {
            return (
              <View style={styles.user_item} key={index}>
                <Text>{user.idUser}</Text>
                <View style={[styles.ready_box, user.ready ? styles.ready : styles.not_ready]}></View>
              </View>
            );
          })}
        </View>
        <View style={styles.rules_container}>
          <Text style={styles.title}>Rules</Text>
          <View style={styles.rule}>
            <Text>Credits: {game.credits}</Text>
          </View>
          <View style={styles.rule}>
            <Text style={game.blind ? styles.ready : styles.not_ready}>Blind: {game.blind}</Text>
          </View>
          <View style={styles.rule}>
            <Text>Maximum players: {game.maxPlayers}</Text>
          </View>
          <View style={styles.rule}>
            <Text>Duration(minutes): {game.time}</Text>
          </View>
          <View style={styles.rule}>
            <Text>Credits: {game.credits}</Text>
          </View>
        </View>
      </View>

      <StyledPressable
        defaultStyle={styles.button_default}
        pressedStyle={styles.button_pressed}
        text={buttonText()}
        onPressFunction={game.idOwner === idUser ? onLaunchClick : onUserReadyClick}
        disabled={buttonDisabled()}
      ></StyledPressable>
    </View>
  ) : (
    <></>
  );
};

const styles = StyleSheet.create({
  game_container: {
    flex: 9,
    backgroundColor: "blue",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  game_name_container: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
    width: "100%",
  },
  game_content_container: {
    flex: 8,
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  players_container: {
    flex: 1,
    backgroundColor: "orange",
    paddingLeft: "5px",
    paddingRight: "5px",
  },
  rules_container: {
    flex: 1,
    backgroundColor: "cyan",
    paddingLeft: "5px",
    paddingRight: "5px",
  },
  rule: {
    backgroundColor: "yellow",
  },
  button_default: {
    backgroundColor: button_grey,
    color: "white",
    padding: "8px",
    textTransform: "uppercase",
    borderRadius: 2,
    textAlign: "center",
    marginTop: "5px",
    marginBottom: "5px",
  },
  button_pressed: {
    backgroundColor: button_grey_press,
  },
  title: {
    textAlign: "center",
    paddingTop: "5px",
    paddingBottom: "5px",
  },
  user_item: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "2px",
  },
  ready_box: {
    width: "30px",
  },
  ready: {
    backgroundColor: "green",
  },
  not_ready: {
    backgroundColor: "red",
  },
});

export default GameView;

import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Board from "../board/board";
import ButtonLast from "../button-last/button-last.component";
import GameCreation from "../game-creation/game-creation.component";
import GameJoin from "../game-join/game-join.component";
import GameMenu from "../game-menu/game-menu.component";
import GameView from "../game/game.component";
import { getGame } from "../game/game.service";
import { Game } from "../games/games.type";
import UserInput from "../user-input/user-input.component";
import { User } from "../users/users.type";

interface ViewData {
  index: number;
  props?: ViewProperties;
}

interface ViewProperties {
  idGame?: string;
}

interface MainViewArguments {
  viewData: ViewData;
  user: User;
  setUser: any;
  setViewData: Function;
  idGame?: string;
  ws: WebSocket;
}

const MainView = ({ viewData, user, setUser, setViewData, ws }: MainViewArguments) => {
  const [game, setGame] = useState<Game>();

  useEffect(() => {
    if (viewData?.props?.idGame)
      getGame(viewData?.props?.idGame)
        .then((game) => setGame(game))
        .catch((error) => console.log(error));
  }, [viewData?.props?.idGame]);
  switch (viewData.index) {
    case 0:
      return <ButtonLast ws={ws} user={user} game={game} />;
    case 1:
      return <Board />;
    case 2:
      return <UserInput name={user.name} setUser={setUser} />;
    case 3:
      return <GameMenu games={user.games} setViewData={setViewData}></GameMenu>;
    case 4:
      return <GameCreation setViewData={setViewData}></GameCreation>;
    case 5:
      return isReady([user, game]) ? (
        <GameView ws={ws} user={user} game={game} setGame={setGame} setViewData={setViewData}></GameView>
      ) : (
        <View>
          <Text>LOADER</Text>
        </View>
      );
    case 6:
      return <GameJoin setViewData={setViewData}></GameJoin>;
    default:
      return <GameJoin setViewData={setViewData}></GameJoin>;
  }
};

function isReady(params: unknown[]) {
  return params.every((param) => param !== undefined);
}
export default MainView;

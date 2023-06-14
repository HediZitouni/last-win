import { getNavigation } from "../../App";
import {
  lastChanged as lastChangedSlice,
  nameChanged,
  setGame as setGameSlice,
  startGame,
  upsertUser,
} from "../../components/game/game.slice";
import { connectWebsocket } from "./websocket";
import store from "../../store/store";
import { getGame } from "../../components/game/game.service";
import { addGame } from "../../components/users/users.slice";

export const websocketMiddleware = (url) => {
  let websocket = null;

  return ({ dispatch, getState }) =>
    (next) =>
    async (action) => {
      const navigation = getNavigation();
      switch (action.type) {
        case "WS_CONNECT":
          const { id: idUser } = getState().user;
          websocket = connectWebsocket(url, idUser);

          websocket.onmessage = (event) => {
            const { message, type, content } = JSON.parse(event.data);
            console.log("received message", message);
            // Dispatch a new action with the received message
            dispatch({ type: type, payload: content });
          };
          break;
        case "WELCOME":
          console.log("WELCOME");
          break;
        case "userReady":
          const { idGame: userReadyIdGame, userInGame } = action.payload;
          await fetchGame(userReadyIdGame, dispatch);
          dispatch(upsertUser([userReadyIdGame, userInGame]));
          break;
        case "nameChanged":
          await fetchGame(action.payload.idGame, dispatch);
          dispatch(nameChanged([action.payload.idGame, action.payload.idUser, action.payload.name]));
          break;
        case "gameStarted":
          const { idGame, startedAt, endedAt } = action.payload;
          await fetchGame(idGame, dispatch);
          dispatch(startGame([idGame, startedAt, endedAt]));
          navigation.navigate("ButtonLast", { idGame: idGame });
          break;

        case "lastChanged":
          await fetchGame(action.payload.idGame, dispatch);
          dispatch(lastChangedSlice(action.payload));
          break;
        case "addGameToUser":
          dispatch(addGame(action.payload.game));
          break;
        // Handle other actions as needed

        default:
          return next(action);
      }
    };
};

async function fetchGame(idGame, dispatch) {
  if (!store.getState().game[idGame]) {
    const dbGame = await getGame(idGame);
    dispatch(setGameSlice(dbGame));
  }
}

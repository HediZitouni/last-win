import { getNavigation } from "../../App";
import { upsertUser } from "../../components/game/game.slice";
import { connectWebsocket } from "./websocket";

export const websocketMiddleware = (url) => {
  let websocket = null;

  return ({ dispatch, getState }) =>
    (next) =>
    (action) => {
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
          const { idGame: userReadyIdGame, ...content } = action.payload;

          dispatch(upsertUser([userReadyIdGame, { ...content, credit: 0, score: 0 }]));
          break;
        case "gameStarted":
          const { idGame } = action.payload;
          navigation.navigate("ButtonLast", { idGame: idGame });
          break;
        // Handle other actions as needed
        default:
          return next(action);
      }
    };
};

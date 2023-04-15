import { connectWebsocket } from "./websocket";

export const websocketMiddleware = (url) => {
  let websocket = null;

  return ({ dispatch, getState }) =>
    (next) =>
    (action) => {
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
        // Handle other actions as needed
        default:
          return next(action);
      }
    };
};

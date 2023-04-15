import { configureStore } from "@reduxjs/toolkit";
import { User } from "../components/users/users.type";
import { WebSocket } from "ws";
import usersSlice from "../components/users/users.slice";
import websocketSlice from "../utils/websocket/websocket.slice";

export interface RootState {
  webSocket: WebSocket;
  user: User;
}

export default configureStore({
  reducer: {
    user: usersSlice,
    websocket: websocketSlice,
  },
});

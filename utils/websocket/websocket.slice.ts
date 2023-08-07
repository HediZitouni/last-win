import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { connectWebsocket } from "./websocket";

export const websocketSlice = createSlice({
  name: "websocket",
  initialState: new WebSocket("wss://otrom.fr/back:3000/"),
  reducers: {
    initWebsocket: (state: WebSocket, { payload }: PayloadAction<WebSocket>) => {
      //      state = { ...connectWebsocket("ws://localhost:3000/", payload) };
      return state;
    },
  },
});

export const { initWebsocket } = websocketSlice.actions;
export default websocketSlice.reducer;

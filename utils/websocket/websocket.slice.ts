import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { connectWebsocket } from "./websocket";

export const websocketSlice = createSlice({
  name: "websocket",
  initialState: new WebSocket("ws://localhost:3000/"),
  reducers: {
    initWebsocket: (state: WebSocket, { payload }: PayloadAction<string>) =>
      Object.assign(state, connectWebsocket("ws://localhost:3000/", payload)),
  },
});

export const { initWebsocket } = websocketSlice.actions;
export default websocketSlice.reducer;

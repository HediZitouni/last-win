import { applyMiddleware, configureStore } from "@reduxjs/toolkit";
import { User } from "../components/users/users.type";
import usersSlice from "../components/users/users.slice";
import { websocketMiddleware } from "../utils/websocket/websocket.middleware";
import { Game, UserInGame } from "../components/games/games.type";
import gameSlice from "../components/game/game.slice";

export interface RootState {
  game: Game;
  user: User;
}
export default configureStore({
  reducer: {
    user: usersSlice,
    game: gameSlice,
  },
  enhancers: [applyMiddleware(websocketMiddleware("ws://otrom.fr/back:3000/"))],
});

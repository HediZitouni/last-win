import { NavigationContainer } from "@react-navigation/native";
import AppWrapped from "./AppWrapped";
import store from "./store/store";
import { Provider } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ButtonLast from "./components/button-last/button-last.component";
import UserInput from "./components/user-input/user-input.component";
import GameMenu from "./components/game-menu/game-menu.component";
import GameCreation from "./components/game-creation/game-creation.component";
import GameJoin from "./components/game-join/game-join.component";
import GameView from "./components/game/game.component";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="GameMenu" component={GameMenu} />
          <Stack.Screen name="GameCreation" component={GameCreation} />
          <Stack.Screen name="Home" component={AppWrapped} />
          <Stack.Screen name="ButtonLast" component={ButtonLast} />
          <Stack.Screen name="UserInput" component={UserInput} />
          <Stack.Screen name="GameJoin" component={GameJoin} />
          <Stack.Screen name="GameView" component={GameView} />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
}

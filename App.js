import { NavigationContainer } from "@react-navigation/native";
import AppWrapped from "./AppWrapped";
import store from "./store/store";
import { Provider } from "react-redux";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Footer from "./components/footer/footer.component";
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
          <Stack.Screen name="Home" component={AppWrapped} />
          <Stack.Screen name="Footer" component={Footer} />
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
}

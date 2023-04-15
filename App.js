import AppWrapped from "./AppWrapped";
import store from "./store/store";
import { Provider } from "react-redux";
export default function App() {
  return (
    <Provider store={store}>
      <AppWrapped />
    </Provider>
  );
}

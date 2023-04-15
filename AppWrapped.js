import { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import Header from "./components/header/header.component";
import { setupUser } from "./components/init/init.lib";
import MainView from "./components/main-view/main-view.component";
import { __retrieveDeviceId, __retrieveUserId, __storeUserId } from "./components/users/users.store";
import { useDispatch, useSelector } from "react-redux";
import store from "./store/store";
import { Provider } from "react-redux";
import { connectWebsocket } from "./utils/websocket/websocket";
import { initUser } from "./components/users/users.slice";
import { initWebsocket } from "./utils/websocket/websocket.slice";

export default function AppWrapped() {
  const dispatch = useDispatch();
  const [viewData, setViewData] = useState({ index: 3 });
  const [user, setUser] = useState(null);
  const [ws, setWebSocket] = useState(null);

  useEffect(() => {
    setupUser()
      .then((user) => {
        dispatch(initUser(user));
        dispatch(initWebsocket(user.id));
        //setUser(user);
        //setWebSocket(connectWebsocket("ws://localhost:3000/", user.id));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(useSelector((state) => state.user));
  return user && user.id && ws ? (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <Header setViewData={setViewData}></Header>
        <MainView ws={ws} viewData={viewData} user={user} setUser={setUser} setViewData={setViewData}></MainView>
      </SafeAreaView>
    </Provider>
  ) : (
    <Provider store={store}>
      <View>
        <Text>LOADING APP</Text>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});

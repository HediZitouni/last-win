import { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import Header from "./components/header/header.component";
import { setupUser } from "./components/init/init.lib";
import MainView from "./components/main-view/main-view.component";
import { __retrieveDeviceId, __retrieveUserId, __storeUserId } from "./components/users/users.store";
import { useDispatch, useSelector } from "react-redux";

import { initUser } from "./components/users/users.slice";

export default function AppWrapped({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const idUser = useSelector((state) => state.user.id);
  const [viewData, setViewData] = useState({ index: 3 });

  useEffect(() => {
    setupUser()
      .then((user) => {
        dispatch(initUser(user));
        dispatch({ type: "WS_CONNECT" });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [idUser]);

  return user && user.id ? (
    <SafeAreaView style={styles.container}>
      <Header setViewData={setViewData} navigation={navigation}></Header>
      <MainView viewData={viewData} setViewData={setViewData}></MainView>
    </SafeAreaView>
  ) : (
    <View>
      <Text>LOADING APP</Text>
    </View>
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

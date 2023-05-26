import { useEffect, useState } from "react";
import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import Header from "./components/header/header.component";
import { setupUser } from "./components/init/init.lib";
import MainView from "./components/main-view/main-view.component";
import { __retrieveDeviceId, __retrieveUserId, __storeUserId } from "./components/users/users.store";
import { useDispatch, useSelector } from "react-redux";

import { initUser } from "./components/users/users.slice";
import GameJoin from "./components/game-join/game-join.component";
import GameMenu from "./components/game-menu/game-menu.component";

export default function AppWrapped({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const idUser = useSelector((state) => state.user.id);

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
    <GameMenu navigation={navigation}></GameMenu>
  ) : (
    <View>
      <Text>LOADING APP</Text>
    </View>
  );
}

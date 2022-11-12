import { useEffect, useRef, useState } from "react";
import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import Footer from "./components/footer/footer.component";
import { setupUser } from "./components/init/init.lib";
import MainView from "./components/main-view/main-view.component";
import { __retrieveDeviceId, __retrieveUserId, __storeUserId } from "./components/users/users.store";

export default function App() {
  const [viewData, setViewData] = useState({ index: 3 });
  const [user, setUser] = useState(null);
  const [ws, setWebSocket] = useState(null);

  useEffect(() => {
    setupUser()
      .then((user) => {
        setUser(user);
        setWebSocket(() => {
          const ws = new WebSocket("ws://localhost:3000/");
          ws.onopen = () => {
            console.log("open", user.id);
            ws.send(JSON.stringify({ message: "setupUser", content: { idUser: user.id } }));
          };
          ws.onclose = (e) => {
            console.log("close");
          };
          ws.onerror = (e) => {
            console.log("error", e);
          };
          return ws;
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return user && ws ? (
    <SafeAreaView style={styles.container}>
      <MainView ws={ws} viewData={viewData} user={user} setUser={setUser} setViewData={setViewData}></MainView>
      <Footer setViewData={setViewData} />
    </SafeAreaView>
  ) : (
    <View>
      <Text>LOADING</Text>
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

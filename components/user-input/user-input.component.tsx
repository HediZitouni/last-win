import { useState } from "react";
import { View, StyleSheet, TextInput, Button } from "react-native";
import { background_grey, button_grey } from "../../utils/common-styles";
import { updateUser } from "../users/users.service";
import { UserData } from "./user-input.type";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { updateName } from "../users/users.slice";

interface UserInputProps {
  navigation: any;
  route: any;
}
const UserInput = ({ navigation, route }: UserInputProps) => {
  const dispatch = useDispatch();
  const { name } = useSelector((state: RootState) => state.user);
  const [userData, setUserData] = useState<UserData>({
    name: name || "",
  });

  function changeText(text: string) {
    setUserData({ ...userData, name: text });
  }

  async function sendUserData() {
    try {
      await updateUser(userData, route.params.idGame);
      dispatch(updateName(userData.name));
      navigation.navigate("ButtonLast", { idGame: route.params.idGame });
    } catch (error) {
      setUserData({ ...userData, name: name || "" });
    }
  }
  return (
    <View style={styles.user_input_container}>
      <TextInput
        style={styles.text_input}
        placeholder="Enter your name"
        value={userData.name}
        onChangeText={changeText}
      />
      <Button title="Confirm" color={button_grey} onPress={sendUserData}></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  user_input_container: {
    flex: 9,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: background_grey,
  },
  text_input: {
    marginBottom: "20px",
    textAlign: "center",
    fontSize: 35,
    borderWidth: 1,
    borderColor: button_grey,
  },
});

export default UserInput;

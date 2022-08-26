import React from "react";
import { Button, View, StyleSheet } from "react-native";
import { background_grey, button_grey } from "../../utils/common-styles";
import { setLast } from "../users/users.service";
import { __retrieveUserId, __storeUserId } from "../users/users.store";

const ButtonLast = ({ userId }) => {
  async function addCount() {
    await setLast(userId);
  }

  return (
    <View style={styles.last_button_container}>
      <Button title="Be the last one" color={button_grey} onPress={addCount} />
    </View>
  );
};

const styles = StyleSheet.create({
  last_button_container: {
    flex: 9,
    backgroundColor: background_grey,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ButtonLast;

import React from "react";
import { StyleSheet, View, Button } from "react-native";
import { button_grey, footer_grey } from "../../utils/common-styles";
import { useNavigation } from "@react-navigation/native";
const Header = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.footer}>
      <View style={styles.footer_item_1}>
        <Button
          title="LASTWIN LOGO"
          color={button_grey}
          onPress={() => navigation.navigate("GameMenu" as never)}
        ></Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: footer_grey,
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: "5px",
    paddingBottom: "5px",
  },
  footer_item_1: {
    justifyContent: "center",
    alignItems: "center",
  },
});
export default Header;

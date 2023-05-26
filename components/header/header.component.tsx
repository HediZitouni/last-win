import React from "react";
import { StyleSheet, View, Button } from "react-native";
import { button_grey, footer_grey } from "../../utils/common-styles";
import { useNavigationContainerRef } from "@react-navigation/native";

const Header = () => {
  const navigationRef = useNavigationContainerRef();
  return (
    <View style={styles.footer}>
      <View style={styles.footer_item_1}>
        <Button title="LASTWIN LOGO" color={button_grey} onPress={() => navigationRef.navigate()}></Button>
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

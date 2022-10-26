import { Pressable, Text, StyleSheet } from "react-native";

interface StyledPressableProperties {
  onPressFunction;
  defaultStyle;
  pressedStyle;
  text;
  disabled?;
}
const StyledPressable = ({
  onPressFunction,
  defaultStyle,
  pressedStyle,
  text,
  disabled,
}: StyledPressableProperties) => {
  const styleOnPress = (pressed) => ({
    ...defaultStyle,
    ...(pressed ? pressedStyle : {}),
  });

  return (
    <Pressable
      style={({ pressed }) => [defaultStyle, styleOnPress(pressed)]}
      onPress={onPressFunction}
      disabled={disabled}
    >
      <Text style={styles.button_text}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button_text: { color: "white", fontWeight: "500" },
});

export default StyledPressable;

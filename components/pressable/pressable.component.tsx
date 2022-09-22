import { Pressable, Text, StyleSheet } from 'react-native';
const StyledPressable = ({ onPressFunction, defaultStyle, pressedStyle, text }) => {
	const styleOnPress = (pressed) => ({
		...defaultStyle,
		...(pressed ? pressedStyle : {}),
	});

	return (
		<Pressable style={({ pressed }) => [defaultStyle, styleOnPress(pressed)]} onPress={onPressFunction}>
			<Text style={styles.button_text}>{text}</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	button_text: { color: 'white', fontWeight: '500' },
});

export default StyledPressable;

import { Pressable, Text, StyleSheet, View } from 'react-native';
const GameCreation = () => {
	return <View style={styles.game_creation_view_container}></View>;
};

const styles = StyleSheet.create({
	game_creation_view_container: {
		flex: 9,
		backgroundColor: 'blue',
		flexDirection: 'row',
	},
});

export default GameCreation;

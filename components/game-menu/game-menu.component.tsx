import React from 'react';
import { StyleSheet, View, Button, Text, Pressable } from 'react-native';
import { button_grey, footer_grey } from '../../utils/common-styles';
import { Game } from '../games/games.type';
import StyledPressable from '../pressable/pressable.component';

interface GameMenuProps {
	games: Game[];
	setIndexView: Function;
}
const GameMenu = ({ games, setIndexView }: GameMenuProps) => {
	return (
		<View style={styles.game_menu_view_container}>
			<View style={styles.game_menu_left_container}>
				{games.map((game, index) => {
					return (
						<View style={styles.game_menu_left_item} key={index}>
							<Text>{game.name}</Text>
						</View>
					);
				})}
			</View>
			<View style={styles.game_menu_middle_container}></View>
			<View style={styles.game_menu_right_container}>
				<StyledPressable
					onPressFunction={() => {
						setIndexView(4);
					}}
					defaultStyle={styles.game_menu_right_item}
					pressedStyle={styles.pressed_game_menu_right_item}
					text={'Create a game'}
				></StyledPressable>
				<View style={styles.game_menu_right_item}>
					<Text>Join a game</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	game_menu_view_container: {
		flex: 9,
		backgroundColor: 'blue',
		flexDirection: 'row',
	},
	game_menu_left_container: {
		flex: 99,
		backgroundColor: 'cyan',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	game_menu_right_container: {
		flex: 99,
		backgroundColor: 'red',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	game_menu_middle_container: {
		flex: 2,
		backgroundColor: 'black',
	},
	game_menu_left_item: {
		backgroundColor: 'green',
		width: '30%',
		marginBottom: '10px',
		textAlign: 'center',
	},
	game_menu_right_item: {
		backgroundColor: 'grey',
		width: '30%',
		marginBottom: '20px',
		textAlign: 'center',
	},
	pressed_game_menu_right_item: {
		backgroundColor: 'blue',
	},
});
export default GameMenu;

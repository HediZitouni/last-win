import { useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';

import { Game } from '../games/games.type';
import StyledPressable from '../pressable/pressable.component';
import { button_grey, button_grey_press } from '../../utils/common-styles';
import { __retrieveUserId } from '../users/users.store';
import { launchGame } from './game.service';
import { setUserReady } from '../users/users.service';

interface GameProps {
	setViewData: Function;
	game: Game;
}

const GameView = ({ setViewData, game }: GameProps) => {
	const [idUser, setIdUser] = useState<string>();

	useEffect(() => {
		__retrieveUserId()
			.then((id) => {
				setIdUser(id);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	function onLaunchClick() {
		launchGame(game.id);
	}

	function onUserReadyClick() {
		setUserReady(idUser, game.id);
	}

	return game ? (
		<View style={styles.game_container}>
			<View style={styles.game_name_container}>
				<Text>{game.name}</Text>
			</View>
			<View style={styles.game_content_container}>
				<View style={styles.players_container}>
					<Text>Players</Text>
					{game.users.map((user, index) => {
						return (
							<View key={index}>
								<Text>{user.idUser}</Text>
							</View>
						);
					})}
				</View>
				<View style={styles.rules_container}>
					<Text>Rules</Text>
					<View style={styles.rule}>
						<Text></Text>
					</View>
				</View>
			</View>

			<StyledPressable
				defaultStyle={styles.button_default}
				pressedStyle={styles.button_pressed}
				text={game.idOwner === idUser ? 'Ready' : 'Launch Game'}
				onPressFunction={game.idOwner === idUser ? onLaunchClick : onUserReadyClick}
			></StyledPressable>
		</View>
	) : (
		<></>
	);
};

const styles = StyleSheet.create({
	game_container: {
		flex: 9,
		backgroundColor: 'blue',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	game_name_container: {
		flex: 2,
	},
	game_content_container: {
		flex: 8,
		display: 'flex',
		flexDirection: 'row',
	},
	players_container: {
		flex: 1,
	},
	rules_container: {
		flex: 1,
	},
	rule: {
		backgroundColor: 'yellow',
	},
	button_default: {
		backgroundColor: button_grey,
		color: 'white',
		padding: '8px',
		textTransform: 'uppercase',
		borderRadius: 2,
		textAlign: 'center',
	},
	button_pressed: {
		backgroundColor: button_grey_press,
	},
});

export default GameView;
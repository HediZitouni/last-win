import { useState } from 'react';
import { Pressable, Text, StyleSheet, View, TextInput } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Game, GameInput } from '../games/games.type';
import StyledPressable from '../pressable/pressable.component';
import { button_grey, button_grey_press } from '../../utils/common-styles';
import { createGame } from './game-creation.service';
import { getIdGameByHashtag, joinGame } from './game-join.service';

interface GameJoinProps {
	setViewData: Function;
}

const GameJoin = ({ setViewData }: GameJoinProps) => {
	const [hashtag, setHashtag] = useState<string>('');
	const [gameNotFound, setGameNotFound] = useState<boolean>(false);

	function changeValue(newHash: string) {
		setHashtag(newHash);
	}

	async function onJoinClick() {
		const idGame = await getIdGameByHashtag(hashtag);
		if (idGame) {
			await joinGame(idGame);
			setViewData({ index: 5, props: { idGame } });
			setGameNotFound(false);
		} else {
			setGameNotFound(true);
		}
	}

	return (
		<View style={styles.game_join_view_container}>
			<View style={styles.input_container}>
				<Text>Game Hashtag {gameNotFound ? 'Game has not been found, try again' : ''}</Text>
				<TextInput placeholder="name" value={hashtag} onChangeText={(value) => changeValue(value)}></TextInput>
			</View>

			<StyledPressable
				defaultStyle={styles.button_default}
				pressedStyle={styles.button_pressed}
				text={'Join the game'}
				onPressFunction={onJoinClick}
			></StyledPressable>
		</View>
	);
};

const styles = StyleSheet.create({
	game_join_view_container: {
		flex: 9,
		backgroundColor: 'blue',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},

	input_container: {
		width: '70%',
		marginBottom: 5,
		backgroundColor: 'red',
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

const defaultGameInput: GameInput = {
	name: '',
	blind: false,
	credits: '5',
	time: '5',
	maxPlayers: '5',
	idOwner: '',
};

export default GameJoin;

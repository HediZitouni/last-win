import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { background_grey, button_grey, last_green } from '../../utils/common-styles';
import { getPlayersApi } from '../games/games.service';
import { Player } from '../games/games.type';

const Board = ({ gameId }: { gameId: string }) => {
	const [players, setPlayers] = React.useState<Player[]>([]);
	const [triggerRefresh, setTriggerRefresh] = React.useState<boolean>(false);

	useEffect(() => {
		getPlayersApi(gameId)
			.then((players) => {
				players.sort((a, b) => b.score - a.score);
				setPlayers(players);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [triggerRefresh]);

	return (
		<>
			<View style={styles.board_container}>
				<ScrollView>
					{players.map((player, index) => {
						return (
							<View style={[styles.board_item, player.isLast ? styles.board_item_last : null]} key={index}>
								<View style={styles.board_item_name}>
									<Text>{player.name}</Text>
								</View>
								<View style={styles.board_item_score}>
									<Text>{player.score}</Text>
								</View>
							</View>
						);
					})}
				</ScrollView>
			</View>
			<View style={styles.refresh_button_container}>
				<Button title="Refresh board" color={button_grey} onPress={() => setTriggerRefresh((prev) => !prev)} />
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	board_container: {
		flex: 8,
		backgroundColor: background_grey,
	},
	board_item: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		marginBottom: 5,
		borderBottomWidth: 1,
		borderTopWidth: 1,
	},
	board_item_last: {
		backgroundColor: last_green,
	},
	board_item_name: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderRightWidth: 1,
	},
	board_item_score: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	refresh_button_container: {
		flex: 1,
		backgroundColor: background_grey,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default Board;

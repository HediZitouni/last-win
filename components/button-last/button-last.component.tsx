import React, { useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import { background_grey, button_grey, button_grey_press, last_green } from '../../utils/common-styles';
import { getPlayersApi, setLastApi } from '../games/games.service';
import { Player } from '../games/games.type';
import { getSocket } from '../../utils/socket';

const ButtonLast = ({ userId, gameId }: { userId: string; gameId: string }) => {
	const [player, setPlayer] = React.useState<Player | null>(null);
	const [players, setPlayers] = React.useState<Player[]>([]);
	const [elapsed, setElapsed] = React.useState(0);
	const elapsedRef = useRef(0);

	const applyPlayers = useCallback((allPlayers: Player[]) => {
		setElapsed(0);
		elapsedRef.current = 0;
		const sorted = [...allPlayers].sort((a, b) => b.score - a.score);
		setPlayers(sorted);
		const me = sorted.find((p) => p.userId === userId);
		if (me) setPlayer(me);
	}, [userId]);

	useEffect(() => {
		getPlayersApi(gameId)
			.then((p) => applyPlayers(p))
			.catch((error) => console.log(error));
	}, [gameId, applyPlayers]);

	useEffect(() => {
		const socket = getSocket();
		socket.emit('join-game', gameId);

		socket.on('last-updated', (updatedPlayers: Player[]) => {
			applyPlayers(updatedPlayers);
		});

		return () => {
			socket.off('last-updated');
		};
	}, [gameId, applyPlayers]);

	useEffect(() => {
		const id = setInterval(() => {
			elapsedRef.current += 1;
			setElapsed(elapsedRef.current);
		}, 1000);
		return () => clearInterval(id);
	}, []);

	async function addCount() {
		if (player && player.credit < 1) return;
		await setLastApi(userId, gameId);
	}

	function displayScore(p: Player): number {
		return p.isLast ? p.score + elapsed : p.score;
	}

	if (!player) return null;

	return (
		<View style={styles.container}>
			<View style={styles.top_section}>
				<View style={styles.name_container}>
					<Text style={styles.name_text}>{player.name}</Text>
				</View>
				<View style={styles.score_container}>
					<Text style={styles.score_text}>{displayScore(player)} Pts</Text>
				</View>
				<View style={styles.button_row}>
					<Pressable style={({ pressed }) => [styles.button, styleOnPress(pressed)]} onPress={addCount}>
						<Text style={styles.button_text}>{player.isLast ? 'You are last' : 'Be the last'}</Text>
					</Pressable>
					<View style={styles.credit_container}>
						<Text style={styles.credit_text}>{player.credit} Credits</Text>
					</View>
				</View>
			</View>
			<View style={styles.board_section}>
				<ScrollView>
					{players.map((p, index) => (
						<View style={[styles.board_item, p.isLast ? styles.board_item_last : null]} key={index}>
							<View style={styles.board_item_name}>
								<Text style={styles.board_item_text}>{p.name}</Text>
							</View>
							<View style={styles.board_item_score}>
								<Text style={styles.board_item_text}>{displayScore(p)}</Text>
							</View>
						</View>
					))}
				</ScrollView>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 9,
		backgroundColor: background_grey,
	},
	top_section: {
		paddingTop: 20,
		paddingBottom: 10,
		alignItems: 'center',
	},
	name_container: {
		marginBottom: 4,
	},
	name_text: {
		fontSize: 32,
		color: 'white',
	},
	score_container: {
		marginBottom: 10,
	},
	score_text: {
		fontSize: 18,
		color: 'white',
	},
	button_row: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		paddingHorizontal: 16,
	},
	button: {
		backgroundColor: button_grey,
		padding: 10,
		borderRadius: 4,
		flex: 2,
		alignItems: 'center',
	},
	button_text: {
		color: 'white',
		fontWeight: '500',
		fontSize: 16,
	},
	credit_container: {
		flex: 1,
		alignItems: 'center',
	},
	credit_text: {
		color: 'white',
	},
	board_section: {
		flex: 1,
		marginTop: 10,
	},
	board_item: {
		width: '100%',
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(255,255,255,0.15)',
		paddingVertical: 8,
	},
	board_item_last: {
		backgroundColor: last_green,
	},
	board_item_name: {
		flex: 1,
		alignItems: 'center',
	},
	board_item_score: {
		flex: 1,
		alignItems: 'center',
	},
	board_item_text: {
		color: 'white',
		fontSize: 16,
	},
});

const styleOnPress = (pressed: boolean) => ({
	backgroundColor: pressed ? button_grey_press : button_grey,
});

export default ButtonLast;

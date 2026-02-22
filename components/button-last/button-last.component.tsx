import React, { useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import { background_grey, button_grey, button_grey_press, footer_grey, last_green } from '../../utils/common-styles';
import { getPlayersApi, setLastApi } from '../games/games.service';
import { Player } from '../games/games.type';
import { getSocket } from '../../utils/socket';

interface ButtonLastProps {
	userId: string;
	gameId: string;
	gameName: string;
	onLeaveGame: () => void;
}

const ButtonLast = ({ userId, gameId, gameName, onLeaveGame }: ButtonLastProps) => {
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
		return () => { socket.off('last-updated'); };
	}, [gameId, applyPlayers]);

	useEffect(() => {
		const id = setInterval(() => {
			elapsedRef.current += 1;
			setElapsed(elapsedRef.current);
		}, 1000);
		return () => clearInterval(id);
	}, []);

	async function addCount() {
		if (!player || player.credit < 1 || player.isLast) return;
		await setLastApi(userId, gameId);
	}

	function displayScore(p: Player): number {
		return p.isLast ? p.score + elapsed : p.score;
	}

	function formatScore(score: number): string {
		return score.toLocaleString('fr-FR');
	}

	if (!player) return null;

	const isLast = !!player.isLast;
	const lastPlayer = players.find((p) => p.isLast);
	const canAct = !isLast && player.credit >= 1;

	return (
		<View style={styles.container}>
			<View style={styles.top_bar}>
				<Pressable style={({ pressed }) => [styles.back_button, pressed && styles.back_pressed]} onPress={onLeaveGame}>
					<Text style={styles.back_text}>Parties</Text>
				</Pressable>
			</View>

			<View style={styles.hero}>
				<Text style={styles.game_name}>{gameName}</Text>
				<View style={[styles.stats_card, isLast && styles.stats_card_last]}>
					<View style={styles.stat_block}>
						<Text style={[styles.stat_value, isLast && styles.stat_value_dark]}>
							{formatScore(displayScore(player))}
						</Text>
						<Text style={[styles.stat_label, isLast && styles.stat_label_dark]}>points</Text>
					</View>
					<View style={[styles.stat_divider, isLast && styles.stat_divider_dark]} />
					<View style={styles.stat_block}>
						<Text style={[styles.stat_value, isLast && styles.stat_value_dark]}>
							{player.credit}
						</Text>
						<Text style={[styles.stat_label, isLast && styles.stat_label_dark]}>crédits</Text>
					</View>
				</View>
			</View>

			<View style={styles.status_area}>
				{lastPlayer ? (
					<Text style={[styles.status_text, isLast && styles.status_text_last]}>
						{isLast ? 'C\'est toi le dernier !' : `${lastPlayer.name} est le dernier`}
					</Text>
				) : (
					<Text style={styles.status_text}>Personne n'est le dernier</Text>
				)}
			</View>

			<View style={styles.action_area}>
				<Pressable
					style={({ pressed }) => [
						styles.action_button,
						!canAct && styles.action_button_disabled,
						pressed && canAct && styles.action_button_pressed,
					]}
					onPress={addCount}
					disabled={!canAct}
				>
					<Text style={styles.action_text}>LAST !</Text>
				</Pressable>
				{!canAct && !isLast && player.credit < 1 && (
					<Text style={styles.no_credit_hint}>Plus de crédits</Text>
				)}
			</View>

			<View style={styles.board_section}>
				<View style={styles.board_header_row}>
					<Text style={[styles.board_header_cell, styles.rank_col]}>#</Text>
					<Text style={[styles.board_header_cell, styles.name_col]}>Joueur</Text>
					<Text style={[styles.board_header_cell, styles.credit_col]}>Crédits</Text>
					<Text style={[styles.board_header_cell, styles.score_col]}>Score</Text>
				</View>
				<ScrollView style={styles.board_scroll}>
					{players.map((p, index) => {
						const isMe = p.userId === userId;
						const pIsLast = !!p.isLast;
						return (
							<View
								key={p.userId}
								style={[
									styles.board_row,
									pIsLast && styles.board_row_last,
									isMe && !pIsLast && styles.board_row_me,
								]}
							>
								<Text style={[styles.board_cell, styles.rank_col, styles.rank_text, pIsLast && styles.board_cell_dark]}>
									{index + 1}
								</Text>
								<View style={[styles.name_col, styles.name_cell_inner]}>
									<Text style={[styles.board_cell, pIsLast && styles.board_cell_dark]} numberOfLines={1}>
										{p.name}
									</Text>
									{isMe && <View style={[styles.me_dot, pIsLast && styles.me_dot_dark]} />}
								</View>
								<Text style={[styles.board_cell, styles.credit_col, styles.credit_cell_text, pIsLast && styles.board_cell_dark]}>
									{p.credit}
								</Text>
								<Text style={[styles.board_cell, styles.score_col, styles.score_cell_text, pIsLast && styles.board_cell_dark]}>
									{formatScore(displayScore(p))}
								</Text>
							</View>
						);
					})}
				</ScrollView>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: background_grey,
	},

	top_bar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingTop: 8,
		paddingBottom: 4,
	},
	back_button: {
		paddingVertical: 6,
		paddingRight: 12,
	},
	back_pressed: {
		opacity: 0.5,
	},
	back_text: {
		color: last_green,
		fontSize: 16,
		fontWeight: '500',
	},

	hero: {
		alignItems: 'center',
		paddingTop: 8,
		paddingBottom: 4,
	},
	game_name: {
		fontSize: 15,
		color: '#bbb',
		fontWeight: '500',
		marginBottom: 10,
		textTransform: 'uppercase',
		letterSpacing: 2,
	},
	stats_card: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: footer_grey,
		paddingHorizontal: 24,
		paddingVertical: 14,
		borderRadius: 12,
		gap: 20,
	},
	stats_card_last: {
		backgroundColor: last_green,
	},
	stat_block: {
		alignItems: 'center',
	},
	stat_value: {
		fontSize: 36,
		fontWeight: '800',
		color: 'white',
		fontVariant: ['tabular-nums'],
	},
	stat_value_dark: {
		color: '#1a1a1a',
	},
	stat_label: {
		fontSize: 13,
		fontWeight: '500',
		color: '#999',
		marginTop: -2,
	},
	stat_label_dark: {
		color: '#333',
	},
	stat_divider: {
		width: 1,
		height: 36,
		backgroundColor: 'rgba(255,255,255,0.15)',
	},
	stat_divider_dark: {
		backgroundColor: 'rgba(0,0,0,0.15)',
	},

	status_area: {
		alignItems: 'center',
		paddingVertical: 12,
	},
	status_text: {
		fontSize: 15,
		color: '#888',
		fontWeight: '500',
	},
	status_text_last: {
		color: last_green,
		fontWeight: '700',
	},

	action_area: {
		paddingHorizontal: 24,
		paddingBottom: 16,
		alignItems: 'center',
	},
	action_button: {
		backgroundColor: button_grey,
		paddingVertical: 18,
		borderRadius: 10,
		alignItems: 'center',
		width: '100%',
	},
	action_button_disabled: {
		opacity: 0.3,
	},
	action_button_pressed: {
		backgroundColor: button_grey_press,
	},
	action_text: {
		color: 'white',
		fontSize: 22,
		fontWeight: '800',
		letterSpacing: 3,
	},
	no_credit_hint: {
		color: '#666',
		fontSize: 13,
		marginTop: 6,
	},

	board_section: {
		flex: 1,
		marginHorizontal: 16,
		backgroundColor: footer_grey,
		borderTopLeftRadius: 12,
		borderTopRightRadius: 12,
		overflow: 'hidden',
	},
	board_header_row: {
		flexDirection: 'row',
		paddingVertical: 10,
		paddingHorizontal: 14,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(255,255,255,0.1)',
	},
	board_header_cell: {
		color: '#888',
		fontSize: 12,
		fontWeight: '600',
		textTransform: 'uppercase',
		letterSpacing: 1,
	},
	board_scroll: {
		flex: 1,
	},
	board_row: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 14,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(255,255,255,0.06)',
	},
	board_row_last: {
		backgroundColor: last_green,
	},
	board_row_me: {
		backgroundColor: 'rgba(255,255,255,0.06)',
	},
	board_cell: {
		color: 'white',
		fontSize: 15,
	},
	board_cell_dark: {
		color: '#1a1a1a',
	},
	rank_col: {
		width: 30,
	},
	rank_text: {
		fontWeight: '700',
		fontSize: 16,
	},
	name_col: {
		flex: 1,
	},
	name_cell_inner: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 6,
	},
	me_dot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: last_green,
	},
	me_dot_dark: {
		backgroundColor: '#1a1a1a',
	},
	credit_col: {
		width: 70,
		textAlign: 'center',
	},
	credit_cell_text: {
		textAlign: 'center',
		fontVariant: ['tabular-nums'],
	},
	score_col: {
		width: 80,
		textAlign: 'right',
	},
	score_cell_text: {
		fontWeight: '600',
		fontVariant: ['tabular-nums'],
		textAlign: 'right',
	},
});

export default ButtonLast;

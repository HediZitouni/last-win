import React, { useEffect, useCallback, useRef, useState } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import { background_grey, button_grey, button_grey_press, footer_grey, last_green } from '../../utils/common-styles';
import { getPlayersApi, setLastApi } from '../games/games.service';
import { Game, GameSettings, Player } from '../games/games.type';
import { getSocket } from '../../utils/socket';

interface ButtonLastProps {
	userId: string;
	gameId: string;
	game: Game;
	onLeaveGame: () => void;
}

function formatCountdown(totalSeconds: number): string {
	if (totalSeconds <= 0) return '00:00';
	const h = Math.floor(totalSeconds / 3600);
	const m = Math.floor((totalSeconds % 3600) / 60);
	const s = totalSeconds % 60;
	const pad = (n: number) => String(n).padStart(2, '0');
	return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

const ButtonLast = ({ userId, gameId, game, onLeaveGame }: ButtonLastProps) => {
	const settings: GameSettings = game.settings;
	const gameName = game.name;

	const [player, setPlayer] = useState<Player | null>(null);
	const [players, setPlayers] = useState<Player[]>([]);
	const [elapsed, setElapsed] = useState(0);
	const elapsedRef = useRef(0);
	const [timeExpired, setTimeExpired] = useState(false);

	const hasTimeLimit = settings.timeLimitMinutes !== null && game.startedAt !== null;

	const applyPlayers = useCallback((allPlayers: Player[]) => {
		setElapsed(0);
		elapsedRef.current = 0;
		const sorted = settings.showOtherScores
			? [...allPlayers].sort((a, b) => b.score - a.score)
			: allPlayers;
		setPlayers(sorted);
		const me = sorted.find((p) => p.userId === userId);
		if (me) setPlayer(me);
	}, [userId, settings.showOtherScores]);

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

			if (hasTimeLimit) {
				const now = Math.round(Date.now() / 1000);
				const endTime = game.startedAt! + settings.timeLimitMinutes! * 60;
				if (now >= endTime) setTimeExpired(true);
			}
		}, 1000);
		return () => clearInterval(id);
	}, [hasTimeLimit, game.startedAt, settings.timeLimitMinutes]);

	function getRemainingSeconds(): number {
		if (!hasTimeLimit) return 0;
		const now = Math.round(Date.now() / 1000);
		const endTime = game.startedAt! + settings.timeLimitMinutes! * 60;
		return Math.max(0, endTime - now);
	}

	async function addCount() {
		if (!player || player.credit < 1 || player.isLast || timeExpired) return;
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
	const canAct = !isLast && player.credit >= 1 && !timeExpired;

	function renderStatusText() {
		if (timeExpired) {
			return <Text style={styles.status_text_expired}>Partie terminée !</Text>;
		}
		if (!lastPlayer) {
			return <Text style={styles.status_text}>Personne n'est le dernier</Text>;
		}
		if (isLast) {
			return <Text style={[styles.status_text, styles.status_text_last]}>C'est toi le dernier !</Text>;
		}
		if (settings.showOtherIsLast) {
			return <Text style={styles.status_text}>{lastPlayer.name} est le dernier</Text>;
		}
		return <Text style={styles.status_text}>Un joueur est le dernier</Text>;
	}

	return (
		<View style={styles.container}>
			<View style={styles.top_bar}>
				<Pressable style={({ pressed }) => [styles.back_button, pressed && styles.back_pressed]} onPress={onLeaveGame}>
					<Text style={styles.back_text}>Parties</Text>
				</Pressable>
				{hasTimeLimit && (
					<Text style={[styles.timer_text, timeExpired && styles.timer_text_expired]}>
						{formatCountdown(getRemainingSeconds())}
					</Text>
				)}
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
				{renderStatusText()}
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
				{!canAct && !isLast && !timeExpired && player.credit < 1 && (
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
						const showLast = isMe ? pIsLast : pIsLast && settings.showOtherIsLast;

						return (
							<View
								key={p.userId}
								style={[
									styles.board_row,
									showLast && styles.board_row_last,
									isMe && !showLast && styles.board_row_me,
								]}
							>
								<Text style={[styles.board_cell, styles.rank_col, styles.rank_text, showLast && styles.board_cell_dark]}>
									{index + 1}
								</Text>
								<View style={[styles.name_col, styles.name_cell_inner]}>
									<Text style={[styles.board_cell, showLast && styles.board_cell_dark]} numberOfLines={1}>
										{p.name}
									</Text>
									{isMe && <View style={[styles.me_dot, showLast && styles.me_dot_dark]} />}
								</View>
								<Text style={[styles.board_cell, styles.credit_col, styles.credit_cell_text, showLast && styles.board_cell_dark]}>
									{isMe || settings.showOtherCredits ? p.credit : '--'}
								</Text>
								<Text style={[styles.board_cell, styles.score_col, styles.score_cell_text, showLast && styles.board_cell_dark]}>
									{isMe || settings.showOtherScores ? formatScore(displayScore(p)) : '--'}
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
	timer_text: {
		color: '#ccc',
		fontSize: 16,
		fontWeight: '700',
		fontVariant: ['tabular-nums'] as any,
	},
	timer_text_expired: {
		color: '#ff4444',
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
		fontVariant: ['tabular-nums'] as any,
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
	status_text_expired: {
		fontSize: 15,
		color: '#ff4444',
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
		fontVariant: ['tabular-nums'] as any,
	},
	score_col: {
		width: 80,
		textAlign: 'right',
	},
	score_cell_text: {
		fontWeight: '600',
		fontVariant: ['tabular-nums'] as any,
		textAlign: 'right',
	},
});

export default ButtonLast;

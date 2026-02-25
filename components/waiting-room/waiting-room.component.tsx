import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { background_grey, button_grey, button_grey_press, footer_grey, last_green } from '../../utils/common-styles';
import { startGameApi, updatePlayerNameApi } from '../games/games.service';
import { Game } from '../games/games.type';
import { getSocket } from '../../utils/socket';

interface WaitingRoomProps {
	game: Game;
	userId: string;
	onGameStarted: (game: Game) => void;
	onLeave: () => void;
}

function formatTimeLimit(seconds: number | null): string {
	if (seconds === null) return 'Illimitée';
	if (seconds < 60) return `${seconds}s`;
	if (seconds < 3600) return `${Math.floor(seconds / 60)} min ${seconds % 60 > 0 ? `${seconds % 60}s` : ''}`.trim();
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

function settingsLine(label: string, value: string): React.ReactNode {
	return (
		<View key={label} style={settingsStyles.row}>
			<Text style={settingsStyles.label}>{label}</Text>
			<Text style={settingsStyles.value}>{value}</Text>
		</View>
	);
}

const WaitingRoom = ({ game, userId, onGameStarted, onLeave }: WaitingRoomProps) => {
	const [currentGame, setCurrentGame] = useState<Game>(game);
	const isCreator = currentGame.createdBy === userId;

	const currentPlayer = currentGame.players.find((p) => p.userId === userId);
	const [playerName, setPlayerName] = useState(currentPlayer?.name ?? '');
	const [nameEditing, setNameEditing] = useState(false);

	useEffect(() => {
		const socket = getSocket();
		socket.emit('join-game', currentGame.id);
		socket.on('game-updated', (updated: Game) => {
			setCurrentGame(updated);
			if (updated.status === 'started') {
				onGameStarted(updated);
			}
		});
		return () => { socket.off('game-updated'); };
	}, [currentGame.id]);

	async function handleStart() {
		try {
			const updated = await startGameApi(currentGame.id, userId);
			setCurrentGame(updated);
			onGameStarted(updated);
		} catch (e) {
			console.log(e);
		}
	}

	async function handleSaveName() {
		const trimmed = playerName.trim();
		if (!trimmed || trimmed === currentPlayer?.name) {
			setNameEditing(false);
			return;
		}
		try {
			const updated = await updatePlayerNameApi(currentGame.id, userId, trimmed);
			setCurrentGame(updated);
			setNameEditing(false);
		} catch (e) {
			console.log(e);
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>{currentGame.name}</Text>
				<Text style={styles.code}>{currentGame.code}</Text>
				<Text style={styles.subtitle}>Partagez ce code pour inviter des joueurs</Text>
			</View>

			<View style={styles.nameSection}>
				<Text style={styles.nameLabel}>Votre pseudo</Text>
				{nameEditing ? (
					<View style={styles.nameEditRow}>
						<TextInput
							style={styles.nameInput}
							value={playerName}
							onChangeText={setPlayerName}
							onSubmitEditing={handleSaveName}
							autoFocus
							maxLength={20}
						/>
						<Pressable
							style={({ pressed }) => [styles.nameSaveButton, pressed && styles.nameSaveButtonPressed]}
							onPress={handleSaveName}
						>
							<Text style={styles.nameSaveText}>OK</Text>
						</Pressable>
					</View>
				) : (
					<Pressable onPress={() => setNameEditing(true)}>
						<Text style={styles.nameDisplay}>{currentPlayer?.name ?? '...'}</Text>
					</Pressable>
				)}
			</View>

			<View style={settingsStyles.container}>
				<Text style={settingsStyles.title}>Règles</Text>
				{settingsLine('Joueurs max', String(currentGame.settings?.maxPlayers ?? '?'))}
				{settingsLine('Crédits', String(currentGame.settings?.maxCredits ?? '?'))}
				{settingsLine('Durée', formatTimeLimit(currentGame.settings?.timeLimitSeconds ?? null))}
				{settingsLine('Voir crédits des autres', currentGame.settings?.showOtherCredits ? 'Oui' : 'Non')}
				{settingsLine('Voir scores des autres', currentGame.settings?.showOtherScores ? 'Oui' : 'Non')}
				{settingsLine('Voir qui est Last', currentGame.settings?.showOtherIsLast ? 'Oui' : 'Non')}
			</View>

			<View style={styles.playersSection}>
				<Text style={styles.playersTitle}>
					Joueurs ({currentGame.players.length}/{currentGame.settings?.maxPlayers ?? '?'})
				</Text>
				<ScrollView style={styles.playersList}>
					{currentGame.players.map((player) => (
						<View key={player.userId} style={styles.playerItem}>
							<Text style={styles.playerName}>
								{player.name}
								{player.userId === currentGame.createdBy ? ' (créateur)' : ''}
							</Text>
							{player.userId === userId && (
								<Text style={styles.youBadge}>Vous</Text>
							)}
						</View>
					))}
				</ScrollView>
			</View>

			<View style={styles.actions}>
				{isCreator && (
					<Pressable
						style={({ pressed }) => [styles.startButton, pressed && styles.startButtonPressed]}
						onPress={handleStart}
					>
						<Text style={styles.startButtonText}>Lancer la partie</Text>
					</Pressable>
				)}
				<Pressable
					style={({ pressed }) => [styles.leaveButton, pressed && styles.leaveButtonPressed]}
					onPress={onLeave}
				>
					<Text style={styles.leaveButtonText}>Quitter</Text>
				</Pressable>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 9,
		backgroundColor: background_grey,
	},
	header: {
		paddingVertical: 24,
		alignItems: 'center',
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: 'white',
		marginBottom: 8,
	},
	code: {
		fontSize: 32,
		fontWeight: '700',
		color: last_green,
		letterSpacing: 6,
		marginBottom: 8,
	},
	subtitle: {
		fontSize: 14,
		color: '#aaa',
	},
	nameSection: {
		paddingHorizontal: 16,
		marginBottom: 16,
	},
	nameLabel: {
		fontSize: 14,
		color: '#aaa',
		marginBottom: 6,
	},
	nameDisplay: {
		fontSize: 22,
		fontWeight: '600',
		color: last_green,
		paddingVertical: 8,
	},
	nameEditRow: {
		flexDirection: 'row',
		gap: 8,
	},
	nameInput: {
		flex: 1,
		backgroundColor: footer_grey,
		color: 'white',
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderRadius: 4,
		fontSize: 18,
	},
	nameSaveButton: {
		backgroundColor: last_green,
		paddingHorizontal: 20,
		borderRadius: 4,
		justifyContent: 'center',
	},
	nameSaveButtonPressed: {
		opacity: 0.8,
	},
	nameSaveText: {
		color: '#222',
		fontWeight: '600',
		fontSize: 16,
	},
	playersSection: {
		flex: 1,
		paddingHorizontal: 16,
	},
	playersTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: 'white',
		marginBottom: 12,
	},
	playersList: {
		flex: 1,
	},
	playerItem: {
		backgroundColor: footer_grey,
		borderRadius: 4,
		padding: 14,
		marginBottom: 6,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	playerName: {
		color: 'white',
		fontSize: 16,
	},
	youBadge: {
		color: last_green,
		fontSize: 14,
		fontWeight: '600',
	},
	actions: {
		padding: 16,
		gap: 10,
	},
	startButton: {
		backgroundColor: last_green,
		padding: 14,
		borderRadius: 4,
		alignItems: 'center',
	},
	startButtonPressed: {
		opacity: 0.8,
	},
	startButtonText: {
		color: '#222',
		fontSize: 18,
		fontWeight: '600',
	},
	leaveButton: {
		backgroundColor: button_grey,
		padding: 12,
		borderRadius: 4,
		alignItems: 'center',
	},
	leaveButtonPressed: {
		backgroundColor: button_grey_press,
	},
	leaveButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '500',
	},
});

const settingsStyles = StyleSheet.create({
	container: {
		marginHorizontal: 16,
		marginBottom: 16,
		backgroundColor: footer_grey,
		borderRadius: 8,
		paddingVertical: 10,
		paddingHorizontal: 14,
	},
	title: {
		fontSize: 14,
		fontWeight: '600',
		color: '#999',
		textTransform: 'uppercase',
		letterSpacing: 1,
		marginBottom: 8,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingVertical: 4,
	},
	label: {
		fontSize: 14,
		color: '#bbb',
	},
	value: {
		fontSize: 14,
		color: 'white',
		fontWeight: '600',
	},
});

export default WaitingRoom;

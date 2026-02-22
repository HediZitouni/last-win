import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { background_grey, button_grey, button_grey_press, footer_grey, last_green } from '../../utils/common-styles';
import { getGameByIdApi, startGameApi } from '../games/games.service';
import { Game } from '../games/games.type';

interface WaitingRoomProps {
	game: Game;
	userId: string;
	onGameStarted: (game: Game) => void;
	onLeave: () => void;
}

const POLL_INTERVAL = 3000;

const WaitingRoom = ({ game, userId, onGameStarted, onLeave }: WaitingRoomProps) => {
	const [currentGame, setCurrentGame] = useState<Game>(game);
	const isCreator = currentGame.createdBy === userId;
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		intervalRef.current = setInterval(async () => {
			try {
				const updated = await getGameByIdApi(currentGame.id);
				setCurrentGame(updated);
				if (updated.status === 'started') {
					if (intervalRef.current) clearInterval(intervalRef.current);
					onGameStarted(updated);
				}
			} catch (e) {
				console.log(e);
			}
		}, POLL_INTERVAL);

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
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

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>{currentGame.name}</Text>
				<Text style={styles.subtitle}>En attente des joueurs...</Text>
			</View>

			<View style={styles.playersSection}>
				<Text style={styles.playersTitle}>
					Joueurs ({currentGame.players.length})
				</Text>
				<ScrollView style={styles.playersList}>
					{currentGame.players.map((playerId, index) => (
						<View key={playerId} style={styles.playerItem}>
							<Text style={styles.playerName}>
								Joueur {index + 1}
								{playerId === currentGame.createdBy ? ' (créateur)' : ''}
							</Text>
							{playerId === userId && (
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
	subtitle: {
		fontSize: 16,
		color: '#aaa',
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

export default WaitingRoom;

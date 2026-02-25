import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { background_grey, button_grey, button_grey_press, footer_grey, last_green } from '../../utils/common-styles';
import { getMyGames, createGameApi, joinGameByCodeApi, rejoinGameApi } from '../games/games.service';
import { Game } from '../games/games.type';
import { getSocket } from '../../utils/socket';

interface LobbyProps {
	userId: string;
	onSelectGame: (game: Game) => void;
}

const Lobby = ({ userId, onSelectGame }: LobbyProps) => {
	const [games, setGames] = useState<Game[]>([]);
	const [newGameName, setNewGameName] = useState('');
	const [joinCode, setJoinCode] = useState('');
	const [loading, setLoading] = useState(true);
	const [joinError, setJoinError] = useState('');

	const [, forceRender] = useState(0);
	const expirationTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

	const scheduleExpirationTimers = useCallback((gameList: Game[]) => {
		expirationTimers.current.forEach(clearTimeout);
		expirationTimers.current = [];
		const now = Math.round(Date.now() / 1000);
		for (const g of gameList) {
			if (g.status !== 'started' || !g.startedAt || !g.settings?.timeLimitSeconds) continue;
			const remaining = (g.startedAt + g.settings.timeLimitSeconds) - now;
			if (remaining > 0) {
				const timer = setTimeout(() => forceRender((n) => n + 1), remaining * 1000);
				expirationTimers.current.push(timer);
			}
		}
	}, []);

	useEffect(() => {
		loadGames();
		return () => expirationTimers.current.forEach(clearTimeout);
	}, []);

	async function loadGames() {
		try {
			const gameList = await getMyGames(userId);
			setGames(gameList);
			scheduleExpirationTimers(gameList);
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		const socket = getSocket();
		for (const g of games) {
			socket.emit('join-game', g.id);
		}
		socket.on('game-updated', (updated: Game) => {
			setGames((prev) => {
				const next = prev.map((g) => (g.id === updated.id ? updated : g));
				scheduleExpirationTimers(next);
				return next;
			});
		});
		return () => { socket.off('game-updated'); };
	}, [games.length, scheduleExpirationTimers]);

	async function handleCreateGame() {
		const name = newGameName.trim();
		if (!name) return;
		try {
			const game = await createGameApi(name, userId);
			setNewGameName('');
			onSelectGame(game);
		} catch (e) {
			console.log(e);
		}
	}

	async function handleJoinByCode() {
		const code = joinCode.trim().toUpperCase();
		if (code.length !== 6) {
			setJoinError('Le code doit faire 6 caractères');
			return;
		}
		setJoinError('');
		try {
			const game = await joinGameByCodeApi(code, userId);
			setJoinCode('');
			onSelectGame(game);
		} catch (e) {
			setJoinError('Code invalide ou partie déjà lancée');
			console.log(e);
		}
	}

	async function handleSelectGame(game: Game) {
		try {
			const updated = await rejoinGameApi(game.id, userId);
			onSelectGame(updated);
		} catch (e) {
			console.log(e);
		}
	}

	function formatDate(timestamp: number): string {
		return new Date(timestamp * 1000).toLocaleDateString();
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Parties</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Rejoindre avec un code</Text>
				<View style={styles.row}>
					<TextInput
						style={styles.codeInput}
						placeholder="ABC123"
						placeholderTextColor="#666"
						value={joinCode}
						onChangeText={(text) => {
							setJoinCode(text.toUpperCase());
							setJoinError('');
						}}
						onSubmitEditing={handleJoinByCode}
						maxLength={6}
						autoCapitalize="characters"
					/>
					<Pressable
						style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
						onPress={handleJoinByCode}
					>
						<Text style={styles.actionButtonText}>Rejoindre</Text>
					</Pressable>
				</View>
				{joinError !== '' && <Text style={styles.errorText}>{joinError}</Text>}
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Créer une partie</Text>
				<View style={styles.row}>
					<TextInput
						style={styles.input}
						placeholder="Nom de la partie"
						placeholderTextColor="#666"
						value={newGameName}
						onChangeText={setNewGameName}
						onSubmitEditing={handleCreateGame}
					/>
					<Pressable
						style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
						onPress={handleCreateGame}
					>
						<Text style={styles.actionButtonText}>Créer</Text>
					</Pressable>
				</View>
			</View>

			<View style={styles.listSection}>
				<Text style={styles.sectionTitle}>Mes parties</Text>
				<ScrollView style={styles.list}>
					{loading && <Text style={styles.emptyText}>Chargement...</Text>}
					{!loading && games.length === 0 && (
						<Text style={styles.emptyText}>Aucune partie pour le moment</Text>
					)}
					{games.map((game) => {
						const isStarted = game.status === 'started';
					const isExpired = isStarted
						&& game.startedAt !== null
						&& game.settings?.timeLimitSeconds != null
						&& Math.round(Date.now() / 1000) >= game.startedAt + game.settings.timeLimitSeconds;
						const playerCount = game.players?.length ?? 0;
						return (
							<Pressable
								key={game.id}
								style={({ pressed }) => [
									styles.gameItem,
									isStarted && !isExpired && styles.gameItemStarted,
									pressed && styles.gameItemPressed,
								]}
								onPress={() => handleSelectGame(game)}
							>
								<View>
									<Text style={styles.gameName}>{game.name}</Text>
									<Text style={styles.gameMeta}>
										{playerCount} joueur{playerCount > 1 ? 's' : ''}
									</Text>
								</View>
								<View style={styles.gameRight}>
									<View style={[
										styles.statusBadge,
										isExpired ? styles.statusFinished : isStarted ? styles.statusStarted : styles.statusWaiting,
									]}>
										<Text style={[styles.statusText, isExpired && styles.statusTextFinished]}>
											{isExpired ? 'Partie terminée' : isStarted ? 'Rejoindre' : 'En attente'}
										</Text>
									</View>
									<Text style={styles.gameMeta}>{formatDate(game.createdAt)}</Text>
								</View>
							</Pressable>
						);
					})}
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
	header: {
		paddingVertical: 20,
		alignItems: 'center',
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: 'white',
	},
	section: {
		paddingHorizontal: 16,
		marginBottom: 16,
	},
	listSection: {
		flex: 1,
		paddingHorizontal: 16,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		color: '#ccc',
		marginBottom: 8,
	},
	row: {
		flexDirection: 'row',
		gap: 8,
	},
	input: {
		flex: 1,
		backgroundColor: footer_grey,
		color: 'white',
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderRadius: 4,
		fontSize: 16,
	},
	codeInput: {
		flex: 1,
		backgroundColor: footer_grey,
		color: 'white',
		paddingHorizontal: 12,
		paddingVertical: 10,
		borderRadius: 4,
		fontSize: 20,
		fontWeight: '700',
		letterSpacing: 4,
		textAlign: 'center',
	},
	actionButton: {
		backgroundColor: button_grey,
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 4,
		justifyContent: 'center',
	},
	actionButtonPressed: {
		backgroundColor: button_grey_press,
	},
	actionButtonText: {
		color: 'white',
		fontWeight: '500',
		fontSize: 16,
	},
	errorText: {
		color: '#ff6b6b',
		fontSize: 13,
		marginTop: 6,
	},
	list: {
		flex: 1,
	},
	emptyText: {
		color: '#999',
		textAlign: 'center',
		marginTop: 40,
		fontSize: 16,
	},
	gameItem: {
		backgroundColor: footer_grey,
		borderRadius: 4,
		padding: 16,
		marginBottom: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	gameItemStarted: {
		borderColor: last_green,
		borderWidth: 1,
	},
	gameItemPressed: {
		backgroundColor: button_grey_press,
	},
	gameName: {
		color: 'white',
		fontSize: 18,
		fontWeight: '500',
	},
	gameMeta: {
		color: '#aaa',
		fontSize: 13,
		marginTop: 2,
	},
	gameRight: {
		alignItems: 'flex-end',
		gap: 4,
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 3,
		borderRadius: 3,
	},
	statusWaiting: {
		backgroundColor: '#FF9500',
	},
	statusStarted: {
		backgroundColor: last_green,
	},
	statusFinished: {
		backgroundColor: '#ff4444',
	},
	statusText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#222',
	},
	statusTextFinished: {
		color: 'white',
	},
});

export default Lobby;

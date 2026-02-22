import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { background_grey, button_grey, button_grey_press, footer_grey, last_green } from '../../utils/common-styles';
import { getGames, createGameApi, joinGameApi } from '../games/games.service';
import { Game } from '../games/games.type';

interface LobbyProps {
	userId: string;
	onSelectGame: (game: Game) => void;
}

const Lobby = ({ userId, onSelectGame }: LobbyProps) => {
	const [games, setGames] = useState<Game[]>([]);
	const [newGameName, setNewGameName] = useState('');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadGames();
	}, []);

	async function loadGames() {
		try {
			const games = await getGames();
			setGames(games);
		} catch (e) {
			console.log(e);
		} finally {
			setLoading(false);
		}
	}

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

	async function handleJoinGame(game: Game) {
		const canRejoin = game.status === 'started' && game.players?.includes(userId);
		if (game.status === 'started' && !canRejoin) return;
		try {
			const updated = await joinGameApi(game.id, userId);
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

			<View style={styles.createSection}>
				<TextInput
					style={styles.input}
					placeholder="Nom de la partie"
					placeholderTextColor="#999"
					value={newGameName}
					onChangeText={setNewGameName}
					onSubmitEditing={handleCreateGame}
				/>
				<Pressable
					style={({ pressed }) => [styles.createButton, pressed && styles.createButtonPressed]}
					onPress={handleCreateGame}
				>
					<Text style={styles.createButtonText}>Créer</Text>
				</Pressable>
			</View>

			<ScrollView style={styles.list}>
				{loading && <Text style={styles.loadingText}>Chargement...</Text>}
				{!loading && games.length === 0 && (
					<Text style={styles.emptyText}>Aucune partie. Créez-en une !</Text>
				)}
				{games.map((game) => {
					const isStarted = game.status === 'started';
					const canRejoin = isStarted && game.players?.includes(userId);
					const isDisabled = isStarted && !canRejoin;
					const playerCount = game.players?.length ?? 0;
					return (
						<Pressable
							key={game.id}
							style={({ pressed }) => [
								styles.gameItem,
								isDisabled && styles.gameItemStarted,
								canRejoin && styles.gameItemRejoin,
								!isDisabled && pressed && styles.gameItemPressed,
							]}
							onPress={() => handleJoinGame(game)}
							disabled={isDisabled}
						>
							<View>
								<Text style={styles.gameName}>{game.name}</Text>
								<Text style={styles.gamePlayers}>
									{playerCount} joueur{playerCount > 1 ? 's' : ''}
								</Text>
							</View>
							<View style={styles.gameRight}>
								<View style={[styles.statusBadge, canRejoin ? styles.statusRejoin : isStarted ? styles.statusStarted : styles.statusWaiting]}>
									<Text style={styles.statusText}>
										{canRejoin ? 'Rejoindre' : isStarted ? 'En cours' : 'En attente'}
									</Text>
								</View>
								<Text style={styles.gameDate}>{formatDate(game.createdAt)}</Text>
							</View>
						</Pressable>
					);
				})}
			</ScrollView>
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
	createSection: {
		flexDirection: 'row',
		paddingHorizontal: 16,
		marginBottom: 16,
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
	createButton: {
		backgroundColor: button_grey,
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 4,
		justifyContent: 'center',
	},
	createButtonPressed: {
		backgroundColor: button_grey_press,
	},
	createButtonText: {
		color: 'white',
		fontWeight: '500',
		fontSize: 16,
	},
	list: {
		flex: 1,
		paddingHorizontal: 16,
	},
	loadingText: {
		color: '#999',
		textAlign: 'center',
		marginTop: 40,
		fontSize: 16,
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
		opacity: 0.5,
	},
	gameItemRejoin: {
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
	gamePlayers: {
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
		backgroundColor: last_green,
	},
	statusStarted: {
		backgroundColor: button_grey,
	},
	statusRejoin: {
		backgroundColor: last_green,
	},
	statusText: {
		fontSize: 12,
		fontWeight: '600',
		color: '#222',
	},
	gameDate: {
		color: '#aaa',
		fontSize: 12,
	},
});

export default Lobby;

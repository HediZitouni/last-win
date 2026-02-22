import { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import Footer from './components/footer/footer.component';
import { setupUser } from './components/init/init.lib';
import MainView from './components/main-view/main-view.component';

export default function App() {
	const [userId, setUserId] = useState(null);
	const [currentGame, setCurrentGame] = useState(null);

	useEffect(() => {
		setupUser()
			.then((user) => {
				setUserId(user.id);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	function handleSelectGame(game) {
		setCurrentGame(game);
	}

	function handleGameStarted(game) {
		setCurrentGame(game);
	}

	function handleLeaveGame() {
		setCurrentGame(null);
	}

	const showFooter = currentGame && currentGame.status === 'started';

	return (
		userId && (
			<SafeAreaView style={styles.container}>
				<MainView
					userId={userId}
					currentGame={currentGame}
					onSelectGame={handleSelectGame}
					onGameStarted={handleGameStarted}
					onLeaveGame={handleLeaveGame}
				/>
				{showFooter && (
					<Footer onLeaveGame={handleLeaveGame} />
				)}
			</SafeAreaView>
		)
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
	},
});

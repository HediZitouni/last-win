import { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import Footer from './components/footer/footer.component';
import { setupUser } from './components/init/init.lib';
import MainView from './components/main-view/main-view.component';

export default function App() {
	const [indexView, setIndexView] = useState(0);
	const [user, setUser] = useState(null);
	const [currentGame, setCurrentGame] = useState(null);

	useEffect(() => {
		setupUser()
			.then((user) => {
				setUser(user);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	function handleSelectGame(game) {
		setCurrentGame(game);
		setIndexView(0);
	}

	function handleGameStarted(game) {
		setCurrentGame(game);
		setIndexView(0);
	}

	function handleLeaveGame() {
		setCurrentGame(null);
		setIndexView(0);
	}

	const showFooter = currentGame && currentGame.status === 'started';

	return (
		user && (
			<SafeAreaView style={styles.container}>
				<MainView
					indexView={indexView}
					user={user}
					setUser={setUser}
					currentGame={currentGame}
					onSelectGame={handleSelectGame}
					onGameStarted={handleGameStarted}
					onLeaveGame={handleLeaveGame}
				/>
				{showFooter && (
					<Footer setIndexView={setIndexView} onLeaveGame={handleLeaveGame} />
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

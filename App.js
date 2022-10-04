import { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import Footer from './components/footer/footer.component';
import { setupUser } from './components/init/init.lib';
import MainView from './components/main-view/main-view.component';
import { __retrieveDeviceId, __retrieveUserId, __storeUserId } from './components/users/users.store';

export default function App() {
	const [viewData, setViewData] = useState({ index: 6 });
	const [user, setUser] = useState(null);

	useEffect(() => {
		setupUser()
			.then((user) => {
				setUser(user);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		user && (
			<SafeAreaView style={styles.container}>
				<MainView viewData={viewData} user={user} setUser={setUser} setViewData={setViewData}></MainView>
				<Footer setViewData={setViewData} />
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

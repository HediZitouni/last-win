import { useState } from 'react';
import { View, StyleSheet, TextInput, Button } from 'react-native';
import { background_grey, button_grey } from '../../utils/common-styles';
import { updateUser } from '../users/users.service';
import { UserData } from './user-input.type';

const UserInput = ({ name, setUser }) => {
	const [userData, setUserData] = useState<UserData>({
		name: name || '',
	});

	function changeText(text: string) {
		setUserData({ ...userData, name: text });
	}

	async function sendUserData() {
		try {
			await updateUser(userData);
			setUser((prevState) => ({ ...prevState, name: userData.name }));
		} catch (error) {
			setUserData({ ...userData, name: name || '' });
		}
	}
	return (
		<View style={styles.user_input_container}>
			<TextInput style={styles.text_input} placeholder="Enter your name" value={userData.name} onChangeText={changeText} />
			<Button title="Confirm" color={button_grey} onPress={sendUserData}></Button>
		</View>
	);
};

const styles = StyleSheet.create({
	user_input_container: {
		flex: 9,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: background_grey,
	},
	text_input: {
		marginBottom: '20px',
		textAlign: 'center',
		fontSize: 35,
	},
});

export default UserInput;

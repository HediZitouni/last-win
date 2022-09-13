import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { background_grey, button_grey, last_green } from '../../utils/common-styles';
import { getUsers } from '../users/users.service';
import { User } from '../users/users.type';

const Board = () => {
	const [users, setUsers] = React.useState<User[]>([]);
	const [triggerRefresh, setTriggerRefresh] = React.useState<boolean>(false);

	useEffect(() => {
		getUsers()
			.then((users) => {
				users.sort((a, b) => b.score - a.score);
				setUsers(users);
			})
			.catch((error) => {
				console.log(error);
			});
	}, [triggerRefresh]);

	return (
		<>
			<View style={styles.board_container}>
				<ScrollView>
					{users.map((user, index) => {
						return (
							<View style={[styles.board_item, user.isLast ? styles.board_item_last : null]} key={index}>
								<View style={styles.board_item_name}>
									<Text>{user.name}</Text>
								</View>
								<View style={styles.board_item_score}>
									<Text>{user.score}</Text>
								</View>
							</View>
						);
					})}
				</ScrollView>
			</View>
			<View style={styles.refresh_button_container}>
				<Button title="Refresh board" color={button_grey} onPress={() => setTriggerRefresh((prev) => !prev)} />
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	board_container: {
		flex: 8,
		backgroundColor: background_grey,
	},
	board_item: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
		marginBottom: 5,
		borderBottomWidth: 1,
		borderTopWidth: 1,
	},
	board_item_last: {
		backgroundColor: last_green,
	},
	board_item_name: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderRightWidth: 1,
	},
	board_item_score: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	refresh_button_container: {
		flex: 1,
		backgroundColor: background_grey,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default Board;

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { background_grey } from '../../utils/common-styles';
import { getUsers } from '../users/users.service';
import { User } from '../users/users.type';

const Board = () => {
	const [users, setUsers] = React.useState<User[]>([]);
	useEffect(() => {
		getUsers()
			.then((users) => {
				users.sort((a, b) => b.score - a.score);
				setUsers(users);
			})
			.catch((error) => {
				console.log(error);
			});
	}, []);
	return (
		<View style={styles.board_container}>
			<ScrollView>
				{users.map((user, index) => {
					return (
						<View style={styles.board_item} key={index}>
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
	);
};

const styles = StyleSheet.create({
	board_container: {
		flex: 9,
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
});

export default Board;

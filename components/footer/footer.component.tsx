import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { button_grey, footer_grey } from '../../utils/common-styles';

const Footer = ({ onLeaveGame }) => {
	return (
		<View style={styles.footer}>
			<View style={styles.footer_item}>
				<Button title="Parties" color={button_grey} onPress={onLeaveGame}></Button>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	footer: {
		flex: 1,
		backgroundColor: footer_grey,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	footer_item: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
export default Footer;

import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { button_grey, footer_grey } from '../../utils/common-styles';

const Footer = ({ setIndexView, onLeaveGame }) => {
	function handleClick(indexView) {
		setIndexView(indexView);
	}

	return (
		<View style={styles.footer}>
			<View style={styles.footer_item}>
				<Button title="Parties" color={button_grey} onPress={onLeaveGame}></Button>
			</View>
			<View style={styles.footer_item_middle}>
				<Button title="Last" color={button_grey} onPress={() => handleClick(0)}></Button>
			</View>
			<View style={styles.footer_item}>
				<Button title="Board" color={button_grey} onPress={() => handleClick(1)}></Button>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	footer: {
		flex: 1,
		backgroundColor: footer_grey,
		flexDirection: 'row',
	},
	footer_item: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	footer_item_middle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		borderRightWidth: 1,
		borderLeftWidth: 1,
	},
});
export default Footer;

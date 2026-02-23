import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, TextInput } from 'react-native';
import { background_grey, button_grey, footer_grey, last_green } from '../../utils/common-styles';
import { updateGameSettingsApi } from '../games/games.service';
import { Game, GameSettings } from '../games/games.type';

interface GameConfigProps {
	game: Game;
	userId: string;
	onConfigured: (game: Game) => void;
	onLeave: () => void;
}

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

const GameConfig = ({ game, userId, onConfigured, onLeave }: GameConfigProps) => {
	const [settings, setSettings] = useState<GameSettings>({ ...game.settings });
	const [timeLimitEnabled, setTimeLimitEnabled] = useState(settings.timeLimitSeconds !== null);
	const [saving, setSaving] = useState(false);

	const [maxPlayersText, setMaxPlayersText] = useState(String(settings.maxPlayers));
	const [maxCreditsText, setMaxCreditsText] = useState(String(settings.maxCredits));
	const [timeLimitText, setTimeLimitText] = useState(String(settings.timeLimitSeconds ?? ''));

	function updateSetting<K extends keyof GameSettings>(key: K, value: GameSettings[K]) {
		setSettings((prev) => ({ ...prev, [key]: value }));
	}

	function handleTimeLimitToggle(enabled: boolean) {
		setTimeLimitEnabled(enabled);
		if (enabled) {
			const defaultSeconds = 60;
			setTimeLimitText(String(defaultSeconds));
			updateSetting('timeLimitSeconds', defaultSeconds);
		} else {
			setTimeLimitText('');
			updateSetting('timeLimitSeconds', null);
		}
	}

	function handleBlurNumeric(text: string, min: number, max: number, setter: (v: string) => void, settingKey: keyof GameSettings) {
		const parsed = parseInt(text, 10);
		if (isNaN(parsed) || text.trim() === '') {
			const val = min;
			setter(String(val));
			updateSetting(settingKey, val as any);
		} else {
			const clamped = clamp(parsed, min, max);
			setter(String(clamped));
			updateSetting(settingKey, clamped as any);
		}
	}

	function handleChangeNumeric(text: string, setter: (v: string) => void, settingKey: keyof GameSettings) {
		const cleaned = text.replace(/[^0-9]/g, '');
		setter(cleaned);
		const parsed = parseInt(cleaned, 10);
		if (!isNaN(parsed)) {
			updateSetting(settingKey, parsed as any);
		}
	}

	function handleTimeLimitChange(text: string) {
		const cleaned = text.replace(/[^0-9]/g, '');
		setTimeLimitText(cleaned);
		const parsed = parseInt(cleaned, 10);
		updateSetting('timeLimitSeconds', isNaN(parsed) ? null : parsed);
	}

	function handleTimeLimitBlur() {
		const parsed = parseInt(timeLimitText, 10);
		if (isNaN(parsed) || timeLimitText.trim() === '') {
			const val = 1;
			setTimeLimitText(String(val));
			updateSetting('timeLimitSeconds', val);
		} else {
			const clamped = Math.max(1, parsed);
			setTimeLimitText(String(clamped));
			updateSetting('timeLimitSeconds', clamped);
		}
	}

	async function handleConfirm() {
		setSaving(true);
		try {
			const updated = await updateGameSettingsApi(game.id, userId, settings);
			onConfigured(updated);
		} catch (e) {
			console.log(e);
			setSaving(false);
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Pressable style={({ pressed }) => [styles.backButton, pressed && styles.backPressed]} onPress={onLeave}>
					<Text style={styles.backText}>Retour</Text>
				</Pressable>
				<Text style={styles.title}>Configuration</Text>
				<View style={styles.backButton} />
			</View>

			<ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
				<Text style={styles.gameName}>{game.name}</Text>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Joueurs & Crédits</Text>

					<View style={styles.row}>
						<View style={styles.rowLabel}>
							<Text style={styles.rowTitle}>Joueurs max</Text>
							<Text style={styles.rowHint}>Nombre maximum de joueurs dans la partie</Text>
						</View>
						<TextInput
							style={styles.numericInput}
							keyboardType="number-pad"
							value={maxPlayersText}
							onChangeText={(t) => handleChangeNumeric(t, setMaxPlayersText, 'maxPlayers')}
							onBlur={() => handleBlurNumeric(maxPlayersText, 2, 50, setMaxPlayersText, 'maxPlayers')}
							maxLength={2}
						/>
					</View>

					<View style={styles.row}>
						<View style={styles.rowLabel}>
							<Text style={styles.rowTitle}>Crédits</Text>
							<Text style={styles.rowHint}>Nombre de crédits par joueur (se réinitialise toutes les heures)</Text>
						</View>
						<TextInput
							style={styles.numericInput}
							keyboardType="number-pad"
							value={maxCreditsText}
							onChangeText={(t) => handleChangeNumeric(t, setMaxCreditsText, 'maxCredits')}
							onBlur={() => handleBlurNumeric(maxCreditsText, 1, 100, setMaxCreditsText, 'maxCredits')}
							maxLength={3}
						/>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Temps</Text>

					<View style={styles.row}>
						<View style={styles.rowLabel}>
							<Text style={styles.rowTitle}>Durée limitée</Text>
							<Text style={styles.rowHint}>La partie s'arrête automatiquement après le temps choisi</Text>
						</View>
						<Switch
							value={timeLimitEnabled}
							onValueChange={handleTimeLimitToggle}
							trackColor={{ false: button_grey, true: last_green }}
							thumbColor="white"
						/>
					</View>

					{timeLimitEnabled && (
						<View style={styles.row}>
							<View style={styles.rowLabel}>
								<Text style={styles.rowTitle}>Durée (secondes)</Text>
							</View>
							<TextInput
								style={styles.numericInput}
								keyboardType="number-pad"
								value={timeLimitText}
								onChangeText={handleTimeLimitChange}
								onBlur={handleTimeLimitBlur}
								maxLength={7}
							/>
						</View>
					)}
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Visibilité</Text>

					<View style={styles.row}>
						<View style={styles.rowLabel}>
							<Text style={styles.rowTitle}>Crédits des autres</Text>
							<Text style={styles.rowHint}>Voir combien de crédits ont les autres joueurs</Text>
						</View>
						<Switch
							value={settings.showOtherCredits}
							onValueChange={(v) => updateSetting('showOtherCredits', v)}
							trackColor={{ false: button_grey, true: last_green }}
							thumbColor="white"
						/>
					</View>

					<View style={styles.row}>
						<View style={styles.rowLabel}>
							<Text style={styles.rowTitle}>Scores des autres</Text>
							<Text style={styles.rowHint}>Voir les scores des autres joueurs dans le classement</Text>
						</View>
						<Switch
							value={settings.showOtherScores}
							onValueChange={(v) => updateSetting('showOtherScores', v)}
							trackColor={{ false: button_grey, true: last_green }}
							thumbColor="white"
						/>
					</View>

					<View style={styles.row}>
						<View style={styles.rowLabel}>
							<Text style={styles.rowTitle}>Qui est Last</Text>
							<Text style={styles.rowHint}>
								Voir quel joueur est actuellement le dernier.{'\n'}
								Chaque joueur verra toujours s'il est lui-même last.
							</Text>
						</View>
						<Switch
							value={settings.showOtherIsLast}
							onValueChange={(v) => updateSetting('showOtherIsLast', v)}
							trackColor={{ false: button_grey, true: last_green }}
							thumbColor="white"
						/>
					</View>
				</View>
			</ScrollView>

			<View style={styles.actions}>
				<Pressable
					style={({ pressed }) => [styles.confirmButton, pressed && styles.confirmButtonPressed, saving && styles.confirmButtonDisabled]}
					onPress={handleConfirm}
					disabled={saving}
				>
					<Text style={styles.confirmButtonText}>{saving ? 'Enregistrement...' : 'Confirmer'}</Text>
				</Pressable>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: background_grey,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
		paddingTop: 8,
		paddingBottom: 4,
	},
	backButton: {
		paddingVertical: 6,
		width: 70,
	},
	backPressed: {
		opacity: 0.5,
	},
	backText: {
		color: last_green,
		fontSize: 16,
		fontWeight: '500',
	},
	title: {
		fontSize: 18,
		fontWeight: '700',
		color: 'white',
	},
	scroll: {
		flex: 1,
	},
	scrollContent: {
		paddingBottom: 20,
	},
	gameName: {
		fontSize: 15,
		color: '#bbb',
		fontWeight: '500',
		textTransform: 'uppercase',
		letterSpacing: 2,
		textAlign: 'center',
		paddingVertical: 12,
	},
	section: {
		marginHorizontal: 16,
		marginBottom: 20,
		backgroundColor: footer_grey,
		borderRadius: 12,
		overflow: 'hidden',
	},
	sectionTitle: {
		fontSize: 13,
		fontWeight: '600',
		color: '#999',
		textTransform: 'uppercase',
		letterSpacing: 1,
		paddingHorizontal: 16,
		paddingTop: 14,
		paddingBottom: 6,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 14,
		borderTopWidth: 1,
		borderTopColor: 'rgba(255,255,255,0.06)',
	},
	rowLabel: {
		flex: 1,
		marginRight: 12,
	},
	rowTitle: {
		fontSize: 16,
		color: 'white',
		fontWeight: '500',
	},
	rowHint: {
		fontSize: 12,
		color: '#999',
		marginTop: 2,
	},
	numericInput: {
		backgroundColor: background_grey,
		color: 'white',
		fontSize: 18,
		fontWeight: '600',
		textAlign: 'center',
		width: 80,
		paddingVertical: 8,
		borderRadius: 8,
	},
	actions: {
		padding: 16,
	},
	confirmButton: {
		backgroundColor: last_green,
		padding: 16,
		borderRadius: 8,
		alignItems: 'center',
	},
	confirmButtonPressed: {
		opacity: 0.8,
	},
	confirmButtonDisabled: {
		opacity: 0.5,
	},
	confirmButtonText: {
		color: '#1a1a1a',
		fontSize: 18,
		fontWeight: '700',
	},
});

export default GameConfig;

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, TextInput } from 'react-native';
import { background_grey, button_grey, button_grey_press, footer_grey, last_green } from '../../utils/common-styles';
import { updateGameSettingsApi } from '../games/games.service';
import { Game, GameSettings } from '../games/games.type';

interface GameConfigProps {
	game: Game;
	userId: string;
	onConfigured: (game: Game) => void;
	onLeave: () => void;
}

const TIME_PRESETS = [5, 10, 15, 30, 60, 120, 360, 720, 1440];

function formatTimePreset(minutes: number): string {
	if (minutes < 60) return `${minutes} min`;
	const h = minutes / 60;
	return h === 1 ? '1 heure' : `${h} heures`;
}

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

const GameConfig = ({ game, userId, onConfigured, onLeave }: GameConfigProps) => {
	const [settings, setSettings] = useState<GameSettings>({ ...game.settings });
	const [timeLimitEnabled, setTimeLimitEnabled] = useState(settings.timeLimitMinutes !== null);
	const [saving, setSaving] = useState(false);

	function updateSetting<K extends keyof GameSettings>(key: K, value: GameSettings[K]) {
		setSettings((prev) => ({ ...prev, [key]: value }));
	}

	function handleTimeLimitToggle(enabled: boolean) {
		setTimeLimitEnabled(enabled);
		updateSetting('timeLimitMinutes', enabled ? 30 : null);
	}

	function parseNumericInput(text: string, min: number, max: number, fallback: number): number {
		const parsed = parseInt(text, 10);
		if (isNaN(parsed)) return fallback;
		return clamp(parsed, min, max);
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
							value={String(settings.maxPlayers)}
							onChangeText={(t) => updateSetting('maxPlayers', parseNumericInput(t, 2, 50, settings.maxPlayers))}
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
							value={String(settings.maxCredits)}
							onChangeText={(t) => updateSetting('maxCredits', parseNumericInput(t, 1, 100, settings.maxCredits))}
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
						<View style={styles.presetsContainer}>
							{TIME_PRESETS.map((minutes) => (
								<Pressable
									key={minutes}
									style={[
										styles.presetChip,
										settings.timeLimitMinutes === minutes && styles.presetChipActive,
									]}
									onPress={() => updateSetting('timeLimitMinutes', minutes)}
								>
									<Text
										style={[
											styles.presetChipText,
											settings.timeLimitMinutes === minutes && styles.presetChipTextActive,
										]}
									>
										{formatTimePreset(minutes)}
									</Text>
								</Pressable>
							))}
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
		width: 60,
		paddingVertical: 8,
		borderRadius: 8,
	},
	presetsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingHorizontal: 12,
		paddingBottom: 14,
		gap: 8,
	},
	presetChip: {
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 20,
		backgroundColor: background_grey,
	},
	presetChipActive: {
		backgroundColor: last_green,
	},
	presetChipText: {
		color: '#ccc',
		fontSize: 14,
		fontWeight: '500',
	},
	presetChipTextActive: {
		color: '#1a1a1a',
		fontWeight: '700',
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

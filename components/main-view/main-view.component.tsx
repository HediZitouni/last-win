import React from 'react';
import ButtonLast from '../button-last/button-last.component';
import GameConfig from '../game-config/game-config.component';
import Lobby from '../lobby/lobby.component';
import WaitingRoom from '../waiting-room/waiting-room.component';
import { Game } from '../games/games.type';

interface MainViewArguments {
	userId: string;
	currentGame: Game | null;
	onSelectGame: (game: Game) => void;
	onGameStarted: (game: Game) => void;
	onLeaveGame: () => void;
}

const MainView = ({ userId, currentGame, onSelectGame, onGameStarted, onLeaveGame }: MainViewArguments) => {
	if (!currentGame) {
		return <Lobby userId={userId} onSelectGame={onSelectGame} />;
	}

	if (currentGame.status === 'waiting' && !currentGame.configured && currentGame.createdBy === userId) {
		return <GameConfig game={currentGame} userId={userId} onConfigured={onSelectGame} onLeave={onLeaveGame} />;
	}

	if (currentGame.status === 'waiting') {
		return (
			<WaitingRoom
				game={currentGame}
				userId={userId}
				onGameStarted={onGameStarted}
				onLeave={onLeaveGame}
			/>
		);
	}

	return <ButtonLast userId={userId} gameId={currentGame.id} game={currentGame} onLeaveGame={onLeaveGame} />;
};
export default MainView;

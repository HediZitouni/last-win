import React from 'react';
import Board from '../board/board';
import ButtonLast from '../button-last/button-last.component';
import Lobby from '../lobby/lobby.component';
import WaitingRoom from '../waiting-room/waiting-room.component';
import { Game } from '../games/games.type';

interface MainViewArguments {
	indexView: number;
	userId: string;
	currentGame: Game | null;
	onSelectGame: (game: Game) => void;
	onGameStarted: (game: Game) => void;
	onLeaveGame: () => void;
}

const MainView = ({ indexView, userId, currentGame, onSelectGame, onGameStarted, onLeaveGame }: MainViewArguments) => {
	if (!currentGame) {
		return <Lobby userId={userId} onSelectGame={onSelectGame} />;
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

	switch (indexView) {
		case 0:
			return <ButtonLast userId={userId} gameId={currentGame.id} />;
		case 1:
			return <Board gameId={currentGame.id} />;
		default:
			return <ButtonLast userId={userId} gameId={currentGame.id} />;
	}
};
export default MainView;

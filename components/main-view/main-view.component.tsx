import React from 'react';
import Board from '../board/board';
import ButtonLast from '../button-last/button-last.component';
import Lobby from '../lobby/lobby.component';
import WaitingRoom from '../waiting-room/waiting-room.component';
import UserInput from '../user-input/user-input.component';
import { User } from '../users/users.type';
import { Game } from '../games/games.type';

interface MainViewArguments {
	indexView: number;
	user: User;
	setUser: any;
	currentGame: Game | null;
	onSelectGame: (game: Game) => void;
	onGameStarted: (game: Game) => void;
	onLeaveGame: () => void;
}

const MainView = ({ indexView, user, setUser, currentGame, onSelectGame, onGameStarted, onLeaveGame }: MainViewArguments) => {
	if (!currentGame) {
		return <Lobby userId={user.id} onSelectGame={onSelectGame} />;
	}

	if (currentGame.status === 'waiting') {
		return (
			<WaitingRoom
				game={currentGame}
				userId={user.id}
				onGameStarted={onGameStarted}
				onLeave={onLeaveGame}
			/>
		);
	}

	switch (indexView) {
		case 0:
			return <ButtonLast user={user} gameId={currentGame.id} />;
		case 1:
			return <Board gameId={currentGame.id} />;
		case 2:
			return <UserInput name={user.name} setUser={setUser} />;
		default:
			return <ButtonLast user={user} gameId={currentGame.id} />;
	}
};
export default MainView;

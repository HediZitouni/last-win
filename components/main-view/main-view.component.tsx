import React from 'react';
import Board from '../board/board';
import ButtonLast from '../button-last/button-last.component';
import GameCreation from '../game-creation/game-creation.component';
import GameMenu from '../game-menu/game-menu.component';
import { gamesMock } from '../games/games.type';
import UserInput from '../user-input/user-input.component';
import { User } from '../users/users.type';

interface MainViewArguments {
	indexView: number;
	user: User;
	setUser: any;
	setIndexView: Function;
}

const MainView = ({ indexView, user, setUser, setIndexView }: MainViewArguments) => {
	switch (indexView) {
		case 0:
			return <ButtonLast user={user} />;
		case 1:
			return <Board />;
		case 2:
			return <UserInput name={user.name} setUser={setUser} />;
		case 3:
			return <GameMenu games={gamesMock} setIndexView={setIndexView}></GameMenu>;
		case 4:
			return <GameCreation></GameCreation>;
		default:
			return <GameCreation></GameCreation>;
	}
};
export default MainView;

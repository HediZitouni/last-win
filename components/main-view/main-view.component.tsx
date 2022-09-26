import React, { useEffect, useState } from 'react';
import Board from '../board/board';
import ButtonLast from '../button-last/button-last.component';
import GameCreation from '../game-creation/game-creation.component';
import GameMenu from '../game-menu/game-menu.component';
import GameView from '../game/game.component';
import { getGame } from '../game/game.service';
import { Game, gamesMock } from '../games/games.type';
import UserInput from '../user-input/user-input.component';
import { User } from '../users/users.type';

interface ViewData {
	index: number;
	props?: ViewProperties;
}

interface ViewProperties {
	idGame?: string;
}

interface MainViewArguments {
	viewData: ViewData;
	user: User;
	setUser: any;
	setViewData: Function;
	idGame?: string;
}

const MainView = ({ viewData, user, setUser, setViewData }: MainViewArguments) => {
	const [game, setGame] = useState<Game>();

	useEffect(() => {
		if (viewData?.props?.idGame)
			getGame(viewData?.props?.idGame)
				.then((game) => setGame(game))
				.catch((error) => console.log(error));
	}, [viewData?.props?.idGame]);
	switch (viewData.index) {
		case 0:
			return <ButtonLast user={user} />;
		case 1:
			return <Board />;
		case 2:
			return <UserInput name={user.name} setUser={setUser} />;
		case 3:
			return <GameMenu games={gamesMock} setViewData={setViewData}></GameMenu>;
		case 4:
			return <GameCreation setViewData={setViewData}></GameCreation>;
		case 5:
			return <GameView game={game} setViewData={setViewData}></GameView>;
		default:
			return <GameCreation setViewData={setViewData}></GameCreation>;
	}
};
export default MainView;

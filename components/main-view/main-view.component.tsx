import React from 'react';
import Board from '../board/board';
import ButtonLast from '../button-last/button-last.component';
import UserInput from '../user-input/user-input.component';
import { User } from '../users/users.type';

interface MainViewArguments {
	indexView: number;
	user: User;
	setUser: any;
}

const MainView = ({ indexView, user, setUser }: MainViewArguments) => {
	switch (indexView) {
		case 0:
			return <ButtonLast user={user} />;
		case 1:
			return <Board />;
		case 2:
			return <UserInput name={user.name} setUser={setUser} />;
		default:
			return <ButtonLast user={user} />;
	}
};
export default MainView;

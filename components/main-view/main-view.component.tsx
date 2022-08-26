import React from "react";
import Board from "../board/board";
import ButtonLast from "../button-last/button-last.component";
import UserInput from "../user-input/user-input.component";

const MainView = ({ indexView, user: { id, name }, setUser }) => {
  switch (indexView) {
    case 0:
      return <ButtonLast userId={id} />;
    case 1:
      return <Board />;
    case 2:
      return <UserInput name={name} setUser={setUser} />;
    default:
      return <ButtonLast userId={id} />;
  }
};
export default MainView;

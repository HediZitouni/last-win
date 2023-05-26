import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { getTimeLeft } from "./clock.helper";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { addScoreToLast } from "../game/game.slice";

interface ClockProperties {
  idGame: string;
  setTriggerRefresh: Function;
}

const Clock = ({ idGame, setTriggerRefresh }: ClockProperties) => {
  const dispatch = useDispatch();
  const game = useSelector((state: RootState) => state.game[idGame]);
  const { startedAt, time: minutes } = game;
  if (!startedAt || !minutes) return <Text>CLOCK NOT AVAILABLE</Text>;
  const endedAt = startedAt + minutes * 60;
  if (Math.ceil(Date.now() / 1000) < startedAt) return <Text>Game not started yet</Text>;
  if (Math.ceil(Date.now() / 1000) >= endedAt) return <Text>Game finished</Text>;
  const [secondesLeft, setSecondesLeft] = useState(getTimeLeft(endedAt));

  useEffect(() => {
    const interval = setInterval(() => {
      // dispatch(addScoreToLast([idGame, 1]));
      setTriggerRefresh();
      setSecondesLeft(getTimeLeft(endedAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondesLeft]);

  return <Text>{secondesLeft}s</Text>;
};

export default Clock;

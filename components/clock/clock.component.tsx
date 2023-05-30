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
  const game = useSelector((state: RootState) => state.game[idGame]);
  const { startedAt, time: minutes } = game;
  const endedAt = startedAt + minutes * 60;
  const [secondesLeft, setSecondesLeft] = useState(getTimeLeft(endedAt));
  if (!startedAt || !minutes) return <Text>CLOCK NOT AVAILABLE</Text>;
  if (Math.ceil(Date.now() / 1000) < startedAt) return <Text>Game not started yet</Text>;

  useEffect(() => {
    const interval = setInterval(() => {
      setTriggerRefresh();
      setSecondesLeft(getTimeLeft(endedAt));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return Math.ceil(Date.now() / 1000) > endedAt ? <Text>Game finished</Text> : <Text>{secondesLeft}s</Text>;
};

export default Clock;

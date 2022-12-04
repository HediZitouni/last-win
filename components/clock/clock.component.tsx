import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { getTimeLeft } from "./clock.helper";

interface ClockProperties {
  startedAt: number;
  minutes: number;
  setTriggerScoreRefresh: Function;
}

const Clock = ({ startedAt, minutes, setTriggerScoreRefresh }: ClockProperties) => {
  if (!startedAt || !minutes) return <Text>CLOCK NOT AVAILABLE</Text>;
  const endedAt = startedAt + minutes * 60;
  if (Math.ceil(Date.now() / 1000) < startedAt) return <Text>Game not started yet</Text>;
  if (Math.ceil(Date.now() / 1000) >= endedAt) return <Text>Game finished</Text>;
  const [secondesLeft, setSecondesLeft] = useState(getTimeLeft(endedAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTriggerScoreRefresh((prev) => !prev);
      setSecondesLeft(getTimeLeft(endedAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondesLeft]);

  return <Text>{secondesLeft}s</Text>;
};

export default Clock;

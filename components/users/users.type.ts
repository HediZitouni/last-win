interface User {
  id: string;
  deviceId: string;
  name: string;
  score: number;
}

export const initUser: User = {
  id: "",
  deviceId: "",
  name: "",
  score: 0,
};
export { User };

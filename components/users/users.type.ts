interface User {
	id: string;
	deviceId: string;
	name: string;
	score: number;
	isLast?: boolean;
}

export const initUser: User = {
	id: '',
	deviceId: '',
	name: '',
	score: 0,
	isLast: false,
};
export { User };

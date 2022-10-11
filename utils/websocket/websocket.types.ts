export interface WebSocketMessage {
	message: string;
	content: UserReadyContent | string;
}

export interface UserReadyContent {
	idUser: string;
	ready: boolean;
}

import { Socket } from "net";
import User from "../../DB/models/User";

export class UserSocket {
    private readonly socket: Socket;
    private readonly user: User;

    constructor(user: User, socket: Socket) {
        this.user = user;
        this.socket = socket;
    }

    getSocket(): Socket {
        return this.socket;
    }

    getUser(): User {
        return this.user;
    }
}
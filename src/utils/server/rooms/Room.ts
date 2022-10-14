// import { UserSocket } from "./UserSocket";
// import { v4 } from 'uuid';

// enum Events {
//     NewUser,
//     UserLeft,
//     Message
// }

// interface IObserverMeneger {
//     notifyAll(envent: Events): void
// }

// export class Room implements IObserverMeneger {
//     private users: Map<stirng, stirng> = new Map();
//     readonly id: string;

//     constructor() {
//         this.id = v4();
//     }

//     deleteUser(id: string): boolean {
//         if(!this.users) {
//             return false;
//         }

//         return this.users.delete(id);
//     }

//     addUser(id: string, socket: UserSocket): void {
//         this.users.set(id, socket);

//         if(this.users.size < 1) {
//             return
//         }
//         else{
//             this.notifyAll()
//         }

//         return;
//     }

//     getUsers(): UserSocket[] {
//         let userArray: UserSocket[] = [];

//         this.users.forEach((user) => {
//             userArray.push(user);
//         })

//         return userArray;
//     }

//     notifyAll(event: Events): void {
//         switch(event) {
//             case Events.NewUser:
//                 this.users.forEach((user: UserSocket) => {
//                     user.newUserNotify();
//                 })
//         }
//     }
// }
import { register } from "./register/registerRoutes";
import { login } from "./login/loginRoutes";
import { createRoomChat } from "./room/roomRoutes";
import * as authentication from "./token/authValidate";

export default { register, login , createRoomChat, authentication};
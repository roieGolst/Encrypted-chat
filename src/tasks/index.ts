import { register } from "./register/registerRoutes";
import { login } from "./login/loginRoutes";
import { createRoomChat } from "./room/roomRoutes";
import authentication from "./token/authValidate";

export default { register, login , createRoomChat, authentication};
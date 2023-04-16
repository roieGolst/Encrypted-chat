import { TcpServer } from "../../server/types";
import Packet from "../encryptedChatProtocol/Packet";

export type HandlerCb<T extends Packet> = (req: T, res: TcpServer.IResponse) => void;
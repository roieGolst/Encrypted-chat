import { TcpServer } from "../../server/types";
import Packet from "../utils/parser/Packet";

export type HandlerCb<T extends Packet> = (req: T, res: TcpServer.IResponse) => void;
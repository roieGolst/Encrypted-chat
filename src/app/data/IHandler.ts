import { TcpServer } from "../../server/types";
import Packet from "../utils/parser/Packet";

export type HandlerCb = (req: Packet, res: TcpServer.IResponse) => void;
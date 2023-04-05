import Packet from "./Packet";

export type Handler<T> = (req: T, res: unknown/*IResponse*/) => void;
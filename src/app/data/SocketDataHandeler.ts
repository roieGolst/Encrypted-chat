import { PacketType, Status } from "../encryptedChatProtocol/common/commonTypes";
import parser, { ParserErrorResult } from "../utils/parser";
import { TcpServer } from "../../server/types";
import * as ResponsePackets from "../encryptedChatProtocol/responsePackets";
import { HandlerCb } from "./IHandler";
import Packet from "../encryptedChatProtocol/Packet";
import * as routers from "../routers/index";

class SocketDataHandeler implements TcpServer.IDataHandler {
    private readonly handlerMap: Map<PacketType, HandlerCb<any>> = new Map();

    setHandler<T extends Packet>(type: PacketType, cb: HandlerCb<T>): void {
        this.handlerMap.set(type, cb);
    }
    
    private runCb<T extends Packet>(callback: HandlerCb<T>, req: T, res: TcpServer.IResponse) {
        callback(req, res);
    }


    async handleOnData(data: Buffer, res: TcpServer.IResponse): Promise<void> {
        try {
            const packet = parser.parse(data);
            const handler = this.handlerMap.get(packet.type);

            if(!handler) {
                return;
            }

            this.runCb(handler, packet, res)
        }
        catch(err: unknown) {
            if(err instanceof ParserErrorResult) {
                await this.sendError(err, res);
                return;
            }

            await this.sendError(new ParserErrorResult({
                type: PacketType.GeneralFailure,
                status: Status.GeneralFailure
            }), res);
            return;
        }
    }

    private async sendError(exception: ParserErrorResult, res: TcpServer.IResponse): Promise<boolean> {
        const packet = new ResponsePackets.GeneralFailure.Builder()
            .setPacketId(exception.packetId)
            .setStatus(exception.status)
            .setType(PacketType.GeneralFailure)
            .build();

        return await res.send(packet.toString());
    }
}

const app = new SocketDataHandeler();

app.setHandler(PacketType.Login, routers.Login.login);
app.setHandler(PacketType.Register, routers.Register.register);
app.setHandler(PacketType.CreateChat, routers.Room.createRoom);
app.setHandler(PacketType.JoinChat, routers.Room.joinChat);
app.setHandler(PacketType.ChatMessage, routers.Room.sendMessage);
app.setHandler(PacketType.NewToken, routers.Token.sendNewToken);
app.setHandler(PacketType.Polling, routers.Room.roomPolling);

export default app;
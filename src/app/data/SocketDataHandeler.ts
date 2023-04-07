import { PacketType, Status } from "../encryptedChatProtocol/commonTypes";
import parser, { ParserErrorResult } from "../utils/parser";
import { TcpServer } from "../../server/types";
import * as ResponsePackets from "../encryptedChatProtocol/responsePackets";
import LoginUseCase from "../routers/login";
import RegisterUseCase from "../routers/register";
import { HandlerCb } from "./IHandler";

class SocketDataHandeler implements TcpServer.IDataHandler {
    private readonly handlerMap: Map<PacketType, HandlerCb> = new Map();

    setHandler(type: PacketType, cb: HandlerCb): void {
        this.handlerMap.set(type, cb);
    }

    async handleOnData(data: Buffer, res: TcpServer.IResponse): Promise<void> {
        try {
            const packet = parser.parse(data);
            const handler = this.handlerMap.get(packet.type);

            if(!handler) {
                return;
            }

            handler(packet, res);
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

        // try {
        //     return await this.handelByType(parseResult);
        // }
        // catch(err) {
        //     await this.sendError(new ParserErrorResult({
        //         packetId: parseResult.packetId,
        //         type: parseResult.type,
        //         status: Status.GeneralFailure
        //     }));
        //     return;
        // }
    }

    // private async handelByType(packet: RequestPacket): Promise<void> {
    //     switch(packet.constructor) {
    //         case RequestPackets.RegisterRequest: {
    //             await useCases.Register.registerLogic(
    //                 packet as RequestPackets.RegisterRequest, 
    //                 this.socketId, 
    //                 this.connectedUserMap
    //             );

    //             return;
    //         }
                

    //         case RequestPackets.LoginRequest: {
    //             await useCases.Login.loginLogic(
    //                 packet as RequestPackets.LoginRequest,
    //                 this.socketId,
    //                 this.connectedUserMap
    //             );

    //             return;
    //         }
            
    //         case RequestPackets.CreateChatRequest: {
    //             await useCases.Room.createRoom(
    //                 packet as RequestPackets.CreateChatRequest,
    //                 this.socketId,
    //                 this.connectedUserMap
    //             );

    //             return;
    //         }

    //         case RequestPackets.JoinChatRequest: {
    //             await useCases.Room.joinChat(
    //                 packet as RequestPackets.JoinChatRequest,
    //                 this.socketId,
    //                 this.connectedUserMap
    //             );

    //             return;
    //         }

    //         case RequestPackets.ChatMessageRequest: {
    //             await useCases.Room.chatLogic(
    //                 packet as RequestPackets.ChatMessageRequest,
    //                 this.socketId,
    //                 this.connectedUserMap
    //             );

    //             return;
    //         }

    //         case RequestPackets.NewTokenRequest: {
    //             await useCases.Token.sendNewToken(
    //                 packet as RequestPackets.NewTokenRequest,
    //                 this.socketId,
    //                 this.connectedUserMap
    //             );

    //             return;
    //         }

    //         default : 
    //             await this.sendError(new ParserErrorResult({
    //                 packetId: packet.packetId,
    //                 type: PacketType.GeneralFailure,
    //                 status: Status.GeneralFailure
    //             }));
    //             return;;
    //     }
    // }


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

app.setHandler(PacketType.Login, LoginUseCase.loginLogic);
app.setHandler(PacketType.Register, RegisterUseCase.registerLogic);

export default app;
import { PacketType, Status } from "../utils/encryptedChatProtocol/commonTypes";
import * as useCases from "../tasks";
import parser, { ParserErrorResult } from "../utils/encryptedChatProtocol/parser";
import { TcpServer } from "../../server/types";
import RequestPacket from "../utils/encryptedChatProtocol/requestPackets/RequsetPacket";
import * as RequestPackets from "../utils/encryptedChatProtocol/requestPackets";
import * as ResponsePackets from "../utils/encryptedChatProtocol/responsePackets";
import ResponsePacket from "../utils/encryptedChatProtocol/responsePackets/ResponsePacket";
import { IConnectedUserManeger } from "./IConnectedUserMeneger";

 export class SocketDataHandeler implements TcpServer.IDataHandler {

    private readonly connectedUserMap: IConnectedUserManeger;
    private socketId: string;

    constructor(socketId: string, connectedUserMeneger: IConnectedUserManeger) {
        this.socketId = socketId;
        this.connectedUserMap = connectedUserMeneger;
    }

    async handleOnData(data: Buffer): Promise<void> {

        const parseResult = parser.parse(data);

        if(!parseResult.isSuccess) {
            await this.sendError(parseResult.error);
            return;
        }

        try {
            return await this.handelByType(parseResult.value);
        }
        catch(err) {
            this.sendError({
                packetId: parseResult.value.packetId,
                type: parseResult.value.type,
                statuse: Status.GeneralFailure,
            })
        }
    }

    private async handelByType(packet: RequestPacket): Promise<void> {
        switch(packet.constructor) {
            case RequestPackets.RegisterRequest: {
                await useCases.Register.registerLogic(
                    packet as RequestPackets.RegisterRequest, 
                    this.socketId, 
                    this.connectedUserMap
                );

                return;
            }
                

            case RequestPackets.LoginRequest: {
                await useCases.Login.loginLogic(
                    packet as RequestPackets.LoginRequest,
                    this.socketId,
                    this.connectedUserMap
                );

                return;
            }
            
            case RequestPackets.CreateChatRequest: {
                await useCases.Room.createRoom(
                    packet as RequestPackets.CreateChatRequest,
                    this.socketId,
                    this.connectedUserMap
                );

                return;
            }

            case RequestPackets.JoinChatRequest: {
                await useCases.Room.joinChat(
                    packet as RequestPackets.JoinChatRequest,
                    this.socketId,
                    this.connectedUserMap
                );

                return;
            }

            case RequestPackets.ChatMessageRequest: {
                await useCases.Room.chatLogic(
                    packet as RequestPackets.ChatMessageRequest,
                    this.socketId,
                    this.connectedUserMap
                );

                return;
            }

            case RequestPackets.NewTokenRequest: {
                await useCases.Token.sendNewToken(
                    packet as RequestPackets.NewTokenRequest,
                    this.socketId,
                    this.connectedUserMap
                );

                return;
            }

            default : 
                await this.sendError({
                    packetId: packet.packetId,
                    type: PacketType.GeneralFailure,
                    statuse: Status.GeneralFailure
                })
                return;;
        }
    }

    private async send(packet: ResponsePacket, socketId: string = this.socketId): Promise<boolean> {
        return await this.connectedUserMap.sendMessageBySocketId(socketId, packet.toString());
    }


    private async sendError(exception: ParserErrorResult): Promise<boolean> {
        const packet = new ResponsePackets.GeneralFailure.Builder()
            .setPacketId(exception.packetId)
            .setStatus(exception.statuse)
            .setType(PacketType.GeneralFailure)
            .build();

        return await this.send(packet)
    }

    static factory(socketId: string, ConnectedUserMeneger: IConnectedUserManeger) {
        return new SocketDataHandeler(socketId, ConnectedUserMeneger);
    }
}
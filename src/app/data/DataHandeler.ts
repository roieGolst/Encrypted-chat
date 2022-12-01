import { PacketType, Status } from "../utils/encryptedChatProtocol/commonTypes";
import * as useCases from "../tasks";
import parser, { ParserErrorResult } from "../utils/encryptedChatProtocol/parser";
import { TcpServer } from "../../server/types";
import RequestPacket from "../utils/encryptedChatProtocol/requestPackets/RequsetPacket";
import * as RequestPackets from "../utils/encryptedChatProtocol/requestPackets";
import * as ResponsePackets from "../utils/encryptedChatProtocol/responsePackets";
import ResponsePacket from "../utils/encryptedChatProtocol/responsePackets/ResponsePacket";
import { IConnectedUserManeger } from "./IConnectedUserMeneger";

 export class DataHandeler implements TcpServer.IDataHandler {

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

        this.handelByType(parseResult.value);
    }

    private async handelByType(packet: RequestPacket): Promise<boolean> {
        
        switch(packet.type) {
            case PacketType.Register: {
                return await useCases.Register.registerLogic(
                    packet as RequestPackets.RegisterRequest, 
                    this.socketId, 
                    this.connectedUserMap
                );
            }
                

            case PacketType.Login: {
                return await useCases.Login.loginLogic(
                    packet as RequestPackets.LoginRequest,
                    this.socketId,
                    this.connectedUserMap
                );
            }
            
            case PacketType.CreateChat: {
                return await useCases.Room.createRoom(
                    packet as RequestPackets.CreateChatRequest,
                    this.socketId,
                    this.connectedUserMap
                );
            }

            case PacketType.JoinChat: {
                return await useCases.Room.joinChat(
                    packet as RequestPackets.JoinChatRequest,
                    this.socketId,
                    this.connectedUserMap
                );
            }

            case PacketType.ChatMessage: {
                return await useCases.Room.chatLogic(
                    packet as RequestPackets.ChatMessageRequest,
                    this.socketId,
                    this.connectedUserMap
                );
            }

            case PacketType.NewToken: {
                return await useCases.Token.sendNewToken(
                    packet as RequestPackets.NewTokenRequest,
                    this.socketId,
                    this.connectedUserMap
                );
            }

            default : 
                return this.sendError({
                    packetId: packet.packetId,
                    type: PacketType.GeneralFailure,
                    statuse: Status.GeneralFailure
                });
        }
    }

    private async sendBySocketId(packet: ResponsePacket, socketId: string = this.socketId): Promise<boolean> {
        return await this.connectedUserMap.sendMessageBySocketId(socketId, packet.toString());
    }


    private async sendError(exception: ParserErrorResult): Promise<boolean> {
        if(!exception.type) {
            const packet = new ResponsePackets.GeneralFailure.Builder()
            .setPacketId(exception.packetId)
            .setType(PacketType.GeneralFailure)
            .setStatus(exception.statuse)
            .build();

            return await this.sendBySocketId(packet);
        }

        const packet = new ResponsePackets.GeneralFailure.Builder()
            .setPacketId(exception.packetId)
            .setType(exception.type)
            .setStatus(exception.statuse)
            .build();

        return await this.sendBySocketId(packet)
    }

    static factory(socketId: string, ConnectedUserMeneger: IConnectedUserManeger) {
        return new DataHandeler(socketId, ConnectedUserMeneger);
    }
}
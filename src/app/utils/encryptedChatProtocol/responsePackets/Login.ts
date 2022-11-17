import { UserDetails, PacketType, Statuses, Tokens } from "../commonTypes";
import { IBuilder } from "../../../common/IBuilder";
import ResponsePacket from "./ResponsePacket";

export default class LoginResponsePacket extends ResponsePacket {
    readonly userAttributs: UserDetails;
    readonly tokens: Tokens;

    constructor(packetId: string, status: Statuses, type: PacketType, userAttributs: UserDetails, tokens: Tokens) {
        super(type, status, packetId)
        this.userAttributs = userAttributs;
        this.tokens = tokens;
    }

    static Builder = class implements IBuilder<LoginResponsePacket> {
        private packetId: string;
        private status: Statuses;
        private type: PacketType;
        private userAttributs: UserDetails;
        private tokens: Tokens;

        setPacketId(packetId: string): this {
            this.packetId = packetId;
            return this;
        }

        setStatus(status: Statuses): this {
            this.status = status;
            return this;
        }

        setType(type: PacketType): this {
            this.type = type;
            return this;
        }

        setUserAttributs(userAttributs: UserDetails): this {
            this.userAttributs = userAttributs;
            return this;
        }

        setTokens(tokens: Tokens): this {
            this.tokens = tokens;
            return this;
        }

        build(): LoginResponsePacket {
            if(this.status == Statuses.Failed) {
                if(!this.packetId) {
                    throw new Error("'PacketId' is required");
                }
    
                else if(!this.status) {
                    throw new Error("'Status' is required");
                }
    
                else if(!this.type) {
                    throw new Error("'Type' is required");
                }
                
            } else {
                if(!this.packetId) {
                    throw new Error("'Packet' id is required");
                }
    
                else if(!this.status) {
                    throw new Error("'Status' is required");
                }
    
                else if(!this.type) {
                    throw new Error("'Type' is required");
                }
    
                else if(!this.userAttributs) {
                    throw new Error("'UserAttributs' is required");
                }
    
                else if(!this.tokens) {
                    throw new Error("'Tokens' is required");
                }
            }

            return new LoginResponsePacket(requireNotNull(this.packetId), this.status, this.type, this.userAttributs, this.tokens);
        }
    }
}

function requireNotNull<T>(arg?: T): T {
    if(!arg) {
        throw new Error("null is not allowed");
    }

    return arg;
}
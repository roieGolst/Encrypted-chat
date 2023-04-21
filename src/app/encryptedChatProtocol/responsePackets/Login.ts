import { UserDetails, PacketType, Status, Tokens } from "../common/commonTypes";
import { IBuilder } from "../../common/IBuilder";
import ResponsePacket from "./ResponsePacket";

export default class LoginResponsePacket extends ResponsePacket {
    readonly userDetails: UserDetails;

    constructor(packetId: string, status: Status, userDetails: UserDetails) {
        super(PacketType.Login, status, packetId)
        this.userDetails = userDetails;
    }

    static Builder = class implements IBuilder<LoginResponsePacket> {
        private packetId: string;
        private status: Status;
        private userDetails: UserDetails;

        setPacketId(packetId: string): this {
            this.packetId = packetId;
            return this;
        }

        setStatus(status: Status): this {
            this.status = status;
            return this;
        }

        setUserDetails(userDetails: UserDetails): this {
            this.userDetails = userDetails;
            return this;
        }

        build(): LoginResponsePacket {
            if(this.status != Status.Succeeded) {
                if(!this.packetId) {
                    throw new Error("'PacketId' is required");
                }
    
                else if(!this.status) {
                    throw new Error("'Status' is required");
                }
                
            } else {
                if(!this.packetId) {
                    throw new Error("'Packet' id is required");
                }
    
                else if(!this.status) {
                    throw new Error("'Status' is required");
                }
    
                else if(!this.userDetails) {
                    throw new Error("'UserDetails' is required");
                }
            }

            return new LoginResponsePacket(requireNotNull(this.packetId), this.status, this.userDetails);
        }
    }
}

function requireNotNull<T>(arg?: T): T {
    if(!arg) {
        throw new Error("null is not allowed");
    }

    return arg;
}
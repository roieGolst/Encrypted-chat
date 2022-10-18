import { IResponse } from "../../common/IResponse";

export interface IHandler {
    handleOnData(data: Buffer): Promise<IResponse<string>>;
}

export type HandlerFactory = (socketId: string) => IHandler;
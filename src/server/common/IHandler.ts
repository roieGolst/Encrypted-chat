import { IResult } from "../../common/IResult";

export interface IHandler {
    handleOnData(data: Buffer): Promise<IResult<string>>;
}

export type HandlerFactory = (socketId: string) => IHandler;
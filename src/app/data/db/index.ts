import dbInstance from "./dbInstance";
export * as utils from "./utils";

export default async function sync(): Promise<boolean> {
    await dbInstance.sync();

    return true;
};

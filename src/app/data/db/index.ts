import dbInstance from "./dbInstance";

export default async function sync(): Promise<boolean> {
    await dbInstance.sync();

    return true;
};

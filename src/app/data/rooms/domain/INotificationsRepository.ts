export interface INotificationsRepository {
    registerNotification(toUser: string, conntent: string/*RoomNotification*/): void;
    fetchDataByUserId(userId: string): string[];
}
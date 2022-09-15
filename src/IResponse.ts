export interface IResponse<T> {
    result?: T;
    isError?: Error | string;
}
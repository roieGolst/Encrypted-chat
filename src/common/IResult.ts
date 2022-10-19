export interface IResult<T> {
    result?: T;
    isError?: Error | string;
}
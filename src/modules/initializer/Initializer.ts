export interface Initializer<T = unknown> {
    readonly name: string;
    run(): Promise<T>
    dependencies(): Array<Initializer>
}
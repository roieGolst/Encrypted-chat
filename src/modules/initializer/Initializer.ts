export abstract class Initializer<T = unknown> {
    
    public name: string;
    abstract run(): Promise<T>
    
    abstract dependencies(): Array<Initializer>
    
}
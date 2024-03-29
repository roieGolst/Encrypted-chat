import { Initializer } from "./Initializer";

export default class Initializator {

    private static alreadyBuild: Set<string> = new Set<string>();
    
    static async run(initializers: Array<Initializer>) {
        const tasksQueue: Array<Initializer> = Initializator.buildTasksQueue(initializers);
        
        let task = tasksQueue.pop()
        
        while(task) {
            await task.run();
            task = tasksQueue.pop();
        }
    }
    
    private static buildTasksQueue(initializers: Array<Initializer>, queue: Array<Initializer> = []): Array<Initializer> {
        for(const initializer of initializers) {
            if(queue.includes(initializer)) {
                console.error(`Duplicate/Circular dependency is found! ${initializer.name}`);
                continue;
            }
            
            if(!Initializator.alreadyBuild.has(initializer.name)) {
                Initializator.alreadyBuild.add(initializer.name);
                queue.push(initializer);
            }
            
            const requiredDependencies = initializer.dependencies().filter((item) => {
                return !queue.includes(item);
            })
            
            if(requiredDependencies.length) {
                queue = Initializator.buildTasksQueue(requiredDependencies, queue);
            }
        }
        
        return queue;
    }
    
};
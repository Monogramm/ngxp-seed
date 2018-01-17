export abstract class WorkerService {
    abstract run(task: () => any): any;
}

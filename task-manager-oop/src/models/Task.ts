/**
 * Domain Model for Task
 * Why classes? To encapsulate the state and behavior of a task.
 * It provides a clear blueprint for what a Task is in our business logic,
 * completely independent of the database implementation.
 */
export class Task {
    private id?: string;
    private title: string;
    private description: string;
    private completed: boolean;
    private createdAt: Date;

    constructor(
        title: string, 
        description: string, 
        completed: boolean = false, 
        id?: string, 
        createdAt?: Date
    ) {
        this.title = title;
        this.description = description;
        this.completed = completed;
        if (id) this.id = id;
        this.createdAt = createdAt || new Date();
    }

    // Getters
    public getId(): string | undefined { return this.id; }
    public getTitle(): string { return this.title; }
    public getDescription(): string { return this.description; }
    public isCompleted(): boolean { return this.completed; }
    public getCreatedAt(): Date { return this.createdAt; }

    // Setters / Behaviours
    public setTitle(title: string): void { this.title = title; }
    public setDescription(description: string): void { this.description = description; }
    public markAsCompleted(): void { this.completed = true; }
    public markAsPending(): void { this.completed = false; }
}

/**
 * LIFO data structure
 */
export class Stack<T> {
    stack: T[];
    length: number; // number of elements currently in the stacl
    private readonly maxSize: number; // maximum number of elements queue can contain

    public constructor(maxSize: number) {
        // Make sure maxSize is at least 1
        this.maxSize = maxSize > 0 ? maxSize : 10;
        this.length = 0;
        this.stack = new Array<T>(this.maxSize);
    }

    public isEmpty(): boolean {
        return this.length === 0;
    }

    public isFull(): boolean {
        return this.length === this.maxSize;
    }
    
    public push(newItem: T): void {
        if (this.isFull()) {
            throw new Error('Queue overflow');
        } else {
            this.stack[this.length++] = newItem; // post-increment adds 1 to length after insertion
        }
    }

    public pop(): T {
        if (this.isEmpty()) {
            throw new Error('Queue underflow');
        }

        const retVal = this.stack[this.length-1];

        this.length--; // we need to decrease length by 1
        this.stack.splice(this.length, 1);
        return retVal;
    }

    public getFirst(): T {
        if (this.isEmpty()) {
            throw new Error('Stack underflow');
        }

        return this.stack[0];
    }

    public getLast(): T {
        if (this.isEmpty()) {
            throw new Error('Stack underflow');
        }

        return this.stack[this.length - 1];
    }

    public clear(): void {
        while (this.stack.length > 0) {
            this.stack.pop();
        }

        this.length = 0;
    }

    public peek(): T {
        if (this.isEmpty()) {
            throw new Error('Queue is empty');
        }
        return this.stack[0];
    }
    
    public stackContents(): void {
        console.log('Stack Contents');
        for (let i = 0; i < this.length; ++i) {
            console.log(`stack[${i}]: ${this.stack[i]}`);
        }
    }

    public getStack(): Array<T> {
        return this.stack;
    }

    public getStackLength(): number {
        return this.length;
    }
}
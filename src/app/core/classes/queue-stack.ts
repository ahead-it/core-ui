import { Queue } from './queue';

/***
 * A queue with some stack functionalities like pop.
 */
export class QueueStack<T> extends Queue<T> {

    public pop(): T {
        if (this.isEmpty()) {
            throw new Error('Queue underflow');
        }

        const retVal = this.getQueue()[this.getQueueLength()-1];

        this.setQueueLength(this.getQueueLength()-1); // we need to decrease length by 1
        this.getQueue().splice(this.getQueueLength(), 1);
        return retVal;
    }

}
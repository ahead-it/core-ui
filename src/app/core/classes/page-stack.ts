import { Stack } from './stack';

/**
 * LIFO data structure for browser navigation pages
 */
export class PageStack extends Stack<any> {

    public constructor(maxSize: number) {
        super(maxSize);
    }

    public get(navigationid: any): any {

        if (this.isEmpty())
            return undefined;

        return this.stack.find((el) => {
            if (el && el.navigationid)
                return el.navigationid === navigationid;

            return false;
            });

    }

    public getByClassName(classname: any): any {

        if (this.isEmpty())
            return undefined;

        return this.stack.find((el) => {
            if (el && el.classname)
                return el.classname === classname;

            return false;
            });
    }

    public getByPageId(pageid: any): any {

        if (this.isEmpty())
            return undefined;

        return this.stack.find((el) => {
            if (el && el.id)
                return el.id === pageid;

            return false;
            });
    }

    getPrevious(id: number): any {
        if (this.isEmpty() || this.getFirst()?.navigationid > id) {
            return undefined; // throw new Error('Queue underflow');
        }

        return this.stack.find((el) => { return el.navigationid === id-1; });
    }

    public override pop(): any {
        if (this.isEmpty()) {
            throw new Error('Queue underflow');
        }

        // Return the page to load (the first page in the stack before the visible page)
        const retVal = this.stack[this.length-2];

        this.length--; // we need to decrease length by 1
        this.stack.splice(this.length, 1); // Remove the visible page from page stack
        return retVal;
    }

    public print(): void {
        console.log('Page Stack Contents');
        for (let i = 0; i < this.length; ++i) {
            console.log('stack[' + i + ']: ' + this.stack[i]?.classname + ' - ' + this.stack[i]?.id);
        }
    }
}
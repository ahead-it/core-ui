
export class WsMessage {

    type: string | undefined;
    classname: string | undefined;
    method: string | undefined;
    arguments?: any;
    objectid: string | undefined;
    relid: string | undefined;
    value: any;

    constructor(values: object = {}) {
        Object.assign(this, values);
    }
}

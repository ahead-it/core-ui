import { MessageTypeEnum } from '../enumerations/message-type.enum';
import { Queue } from '../classes/queue';
import { WsMessage } from '../classes/ws-message';
import { QueueStack } from '../classes/queue-stack';
import { WebSocketService } from './websocket.service';
import { Injectable } from '@angular/core';

@Injectable()
export class MessageService {

    /***
     * Queue of invoke messages.
     */
    invokeQueue = new Queue<any>(100);

    /***
     * Queue of send messages (page type only).
     * Used to check the opened page during the close process of a page.
     */
    sendPageQueue = new QueueStack<any>(100);

    constructor(private webSocket: WebSocketService) {
    }

    createWsMessage(type: string, classname?: string, method?: string, parameters?: any, objectid?: string) {

        const message = new WsMessage();
        message.type = type;
        message.classname = classname;
        message.method = method;
        message.objectid = objectid;

        if (parameters !== undefined) {
            message.arguments = parameters;
        }

        this.manageInvokeQueue(message);
    }

    createWsAnswerMessage(value: any, relid?: string): WsMessage {

        const message = new WsMessage();
        message.type = MessageTypeEnum.Answer;
        message.value = value;

        if (relid)
            message.relid = relid;

        return message;
    }

    manageInvokeQueue(msg: any) {

        if (this.invokeQueue.isEmpty()) {
            this.invokeQueue.enqueue(msg);
            this.webSocket.send(msg);

        } else {
            this.invokeQueue.enqueue(msg);
        }
    }

    /**
     * Clear all behaviour subject properties
     */
    public clearAll() {

        // Clear messages queues
        this.invokeQueue.clear();
        this.sendPageQueue.clear();
    }
}

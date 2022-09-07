import { MessageMethodEnum, MessageService, MessageTypeEnum } from '..';
import { DataService } from './data.service';

export class BaseService {

    constructor(public dataService: DataService,
        public messageService: MessageService) {

    }

    getData(pageId: string, offset: number, limit: number, sorting?: any, filters?: string) {

        this.dataService.repeatersCurrentPage[pageId] = offset / limit;
        const data: any = { offset, limit };

        if (sorting && sorting !== {})
            data.sorting = sorting;

        if (filters && filters !== '')
            data.filters = filters;

        this.messageService.createWsMessage(MessageTypeEnum.Invoke, undefined, MessageMethodEnum.GetData, data, pageId);
    }

    /**
     * Update data into the page and all its subpages
     * @param pageId Page id
     */
    update(pageId: string) {
        this.messageService.createWsMessage(MessageTypeEnum.Invoke, undefined,
            MessageMethodEnum.Update, { }, pageId);
    }
}
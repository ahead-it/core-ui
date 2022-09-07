export class Data {

    public schema: any = {};
    public dataSet: any = {};
    public formattedDataSet: any = {};

    /**
     * Total amount of elements in the dataset not considering offset
     */
    public dataSetLength: number = 0;

    /**
     * True if this is a new dataset and needs to be overridden at the next data receive.
     * False if this is not a new dataset and next data will be added to previous ones.
     */
    public newDataSet: boolean = false;

    Data() {
        this.newDataSet = true;
    }

    set(dataSet: any, formattedDataSet: any, schema: any, dataSetLength: number) {
        this.dataSet = dataSet;
        this.formattedDataSet = formattedDataSet;
        this.schema = schema;
        this.dataSetLength = dataSetLength;
    }
}
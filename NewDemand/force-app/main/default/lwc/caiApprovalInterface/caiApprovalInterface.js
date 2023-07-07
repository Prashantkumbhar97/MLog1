import { LightningElement, track, wire, api } from 'lwc';
import getSobjects from '@salesforce/apex/ApprovalInterface.getSobjects';
import getStage from '@salesforce/apex/ApprovalInterface.getStage';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Child_Level_1__c from '@salesforce/schema/Approval_Interface_Configuration__c.Child_Level_1__c';
import getConfiguration from '@salesforce/apex/ApprovalInterface.getConfiguration';
import getApprovalConfiguration from '@salesforce/apex/ApprovalInterface.getApprovalConfiguration';
import getStageRecords from '@salesforce/apex/ApprovalInterface.getStageRecords';
import getDefaultStage from '@salesforce/apex/ApprovalInterface.getDefaultStage';
import processRecord from '@salesforce/apex/ApprovalInterface.processRecord';
import { NavigationMixin } from 'lightning/navigation';


export default class CaiApprovalInterface extends NavigationMixin(LightningElement) {
    @track isModalOpen = false;
    isUpdateSubStatus = false;
    isUpdateStatus = false;
    comment = '';
    currentPage = 0;
    @track enable_app_rej = true;
    @track count = 0;
    value = '';
    isSearchable = true;
    sObject = '';
    _sObject = [];
    _options = [];
    records = [];
    gridDataPagination = [];
    formulaField = [];
    gridData = [];
    getRecords = [];
    allSelectedRecords = [];
    showLoading = false;
    childItem = '';
    status = '';
    defaultStage = '';
    virtualGriddata = [];
    selectedIds = []; //currently visible selected checkbox
    lstSelectedRecords = [];
    bypassrowselection = false;
    selectedRows = [];
    selectedRecordEditId='';
    userUGDN = '';
    @track demandId ;
    @track filters = {
        sobject: '',
        stage: ''
    }
 
    @wire(getSobjects) getObject({ data, error }) {
        if (data) {
            console.log('data ', data);
            let array = [];
            for (let property in data) {
                array.push({ label: data[property], value: property });
            }
            this._sObject = array;
        }
        if (error) {
            console.log('error ', error);
        }
    };

    @wire(getApprovalConfiguration, { selectedObject: '$sObject', selectedStage: '$defaultStage' }) getObjectApprovalConfiguration({ data, error }) {
        if (data) {
            // console.log('data column',data);
            this.gridColumns = JSON.parse(data);
        }
        if (error) {
            console.log('error ', error);
        }
    };


    get options() {
        return this._options;
    }

    get optionSobject() {
        return this._sObject;

    }

    gridColumns = [];


    handleChangeSobject(event) {
        let objectApiName = event.target.value;
        this.sObject = objectApiName;
        this.filters = { sobject: objectApiName, stage: this.defaultStage };
        getStage({ selectedObject: objectApiName }).then(stages => {
            let stageOptions = stages.map(ele => ({ label: ele, value: ele.replaceAll(' ', '_') }))
            this._options = stageOptions;
            getDefaultStage({ selectedObject: objectApiName }).then(defaultStage => {
                this.getGridData(objectApiName, defaultStage);
                defaultStage = defaultStage.replaceAll(' ', '_');
                let selectedValue = this.template.querySelector(`[data-name='${defaultStage}']`)?.value;
                this.defaultStage = selectedValue;
                this.template.querySelector(`[data-name=${defaultStage}]`).checked = true;
                let obj = { sobject: this.sObject, stage: defaultStage };
                this.filters = obj;
                getConfiguration({ selectedObject: objectApiName }).then(fetchingChild => {
                    console.log(' Records fetchingChild', fetchingChild.Child_Level_1__c);
                    this.childItem = fetchingChild.Child_Level_1__c;
                    this.status = fetchingChild.Approve_Reject_By_Status__c;
                    this.userUGDN = fetchingChild.UGDN_Number__c;
                    console.log('this.userUGDN', this.userUGDN);
                    console.log('this.statuss', this.status);
                    if (this.status?.split(';').includes(this.defaultStage) && this.defaultStage) {
                        this.enable_app_rej = false;
                    }
                    else {
                        this.enable_app_rej = true;
                    }
                })
                    .catch(error => {
                        console.log('error fetching Default stages', error);
                    });
                    
             
            }).catch(error => {
                console.log('error fetching Default stages', error);
            });
        }).catch(error => {
            console.log('error fetching stages', error);
        })

    }

    getGridData(sObject, stageValue) {
        this.showLoading = true;
        this.gridData = [];
        console.log('sObject records', sObject);
        console.log('stageValue records', stageValue);
        getStageRecords({ selectedObject: sObject, selectedStage: stageValue.replaceAll(' ', '_') }).then(gridRecord => {
            //let paramField1 = getFieldValue(gridRecord.Child_Level_1__c, Child_Level_1__c);
            console.log('GridData records', gridRecord);
            let lineitem = this.childItem;
            let parseData = JSON.parse(JSON.stringify(gridRecord));
            for (let i = 0; i < parseData.length; i++) {
                parseData[i]._children = parseData[i][lineitem];
                parseData[i].link = "/"+parseData[i].Id;
                delete parseData[i][lineitem];
            }
            parseData = parseData.map(ele => {
                for (let [key, value] of Object.entries(ele)) {
                    if (key.match('__r') && key != (this.childItem) && value) {
                        for (let [keyo, valueo] of Object.entries(value)) {
                            ele[key + '_' + keyo] = valueo;
                        }
                    }
                }
                return ele;
            })
            // console.log('parse Data',JSON.stringify(parseData) );


            console.log('parseData', parseData)
            this.gridData = parseData;
            this.gridDataPagination = parseData;
            this.virtualGriddata = parseData
            setTimeout(() => {

                this.showLoading = false;
            }, 200);


        }).catch(error => {
            console.log('error fetching records', error);
            this.showLoading = false;
        })

    }


    handleStageSelected(event) {
        this.showLoading = true;
        console.log('Stages This object', this.sObject);
        let obj = { sobject: this.sObject, stage: event.target.value };
        this.filters = obj;
        let stageValue = event.target.value.replaceAll('_', ' ');
        this.defaultStage = event.target.value;
        
        this.getGridData(this.sObject, stageValue);
        console.log('this.status?.split Handle ', this.status?.split(';'), ' ', this.defaultStage);
        if (this.status?.split(';').includes(this.defaultStage)) {
            this.enable_app_rej = false;
        }
        else {
            this.enable_app_rej = true;
        }

    }

    handlePaginationAction(event) {
        setTimeout(() => {
            console.log('curret Page ', event.detail.currentPage);
            this.currentPage = event.detail.currentPage;
            this.gridDataPagination = event.detail.values;
            let selectedRowstemp = this.lstSelectedRecords[this.lstSelectedRecords.findIndex(ele => ele.pageNumber == this.currentPage)]?.selectedRows;
            this.selectedRows = selectedRowstemp ? selectedRowstemp : [];
            console.log('this.selectedRows pagination', this.selectedRows);

        }, 200);
    }
    handleEdit(event){
        console.log('JSON.stringify(event.detail)' , JSON.stringify(event.detail.row.Id));
      this.selectedRecordEditId=  JSON.stringify(event.detail.row.Id);
      
      this.demandId =event.detail.row.Id;

     if(this.sObject == 'Demand_Generation__c'){
        this.isUpdateStatus = true;
        if(this.demandId !=null)
        {
          this.handleNavigation(this.demandId);
        }
      }
      else if (this.sObject == 'Return_Sales_Order__c') {
        this.isUpdateSubStatus = true;
      }	
      this.isModalOpen = false;
     
    }


    setSelectedRows(event) {
        let selectRows = this.template.querySelector('lightning-tree-grid').getSelectedRows();
        console.log('selectRows', selectRows);
        let ids = '';
        if (selectRows.length > 0) {
            selectRows.forEach(currentItem => {
                ids = ids + ',' + currentItem.Id;
            });
            this.selectedIds = ids.replace(/^,/, '')?.split(',');
        } else {
            this.selectedIds = [];
        }

        let index = this.lstSelectedRecords.findIndex(ele => ele.pageNumber == this.currentPage);
        let obj = { pageNumber: this.currentPage, selectedRows: this.selectedIds };
        if (index == -1) {
            this.lstSelectedRecords.push(obj);
        } else {
            this.lstSelectedRecords[index].selectedRows = obj.selectedRows;
        }
        console.log('Hello objevt', this.lstSelectedRecords);
    }


    handleSearch(event) {
        let input = event.detail.input;
        let fieldName = event.detail.fieldName;
        console.log('input:', input);
        console.log('fieldName', fieldName);
        this.virtualGriddata = JSON.parse(JSON.stringify(this.virtualGriddata));
        console.log('Data ',this.virtualGriddata);

        if (input) {
            this.gridData = this.virtualGriddata.filter(ele => {
                console.log('fieldName 1 ',ele[fieldName]);
                return (ele[fieldName].toString())?.includes(input);
            });
        } else {
            this.gridData = this.virtualGriddata;
        }

    }

    openModal() {
        // to open modal set isModalOpen tarck value as true
       
        this.getRecords = this.lstSelectedRecords.map((item) => item.selectedRows);
        this.getRecords = this.getRecords.flat(1);
        this.count = this.getRecords.length;
        if(this.count > 0){
            this.isModalOpen = true;
        }
        else{
            this.showToast('Warning', 'Please select atleast one record.', 'warning');
        }
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
        this.comment = ''; 
    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
    }

    connectedCallback() {
        console.log('this.status?.split ', this.status?.split(';'), ' ', this.defaultStage);
        if (this.status?.split(';').includes(this.defaultStage) && this.defaultStage) {
            this.enable_app_rej = false;
        }
        else {
            this.enable_app_rej = true;
        }

    }

    handleChangeComment(event) {
        this.comment = event.target.value;
    }


    handleconformClick(event) {
        if (event.target.label === 'Approve') {
            this.showLoading = true;
            console.log('label' + event.target.label);
            this.originalMessage = event.target.label;
            this.processRecords('Approve', this.comment);
            this.isModalOpen = false;
            this.comment = ''; 
        }
        else if (event.target.label === 'Reject') {
            this.showLoading = true;
            console.log('label' + event.target.label);
            this.originalMessage = event.target.label;
            this.processRecords('Reject', this.comment);
            this.isModalOpen = false;
            this.comment = ''; 
        }
    }

    processRecords(status, comment) {
        processRecord({ records: JSON.stringify(this.getRecords), status: status, comment: comment }).then(result => {
            console.log('result', result);
            this.showToast('Success', 'Successfully Saved', 'success');
            this.showLoading = false;
            this.getGridData(this.sObject,this.defaultStage);
        }).catch(error => {
                console.log('error fetching Default stages', error);
                this.showToast('Error', 'Error' + error, 'error');
                this.showLoading = false;
        })
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant
            })
        );
    }

    handleClose(){
        this.getGridData(this.sObject,this.defaultStage);
        this.isUpdateSubStatus=false;
        this.isUpdateStatus = false;
    }


    
    handleNavigation(demandId){
        console.log('Demand Generation ID is:'+demandId);
        let compDetails = {
            componentDef: "c:demandGeneration",
            attributes: {
              newdgid:null,
              newdgname:null,
              newdgdata:demandId
        
        
            }
        };
        let encodedComponentDef = btoa(JSON.stringify(compDetails));
        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: '/one/one.app#' + encodedComponentDef
            }
          })
        }
        



}
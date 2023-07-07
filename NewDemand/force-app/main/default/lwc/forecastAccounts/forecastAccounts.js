import { LightningElement, track,wire} from 'lwc';

import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import uId from '@salesforce/user/Id';
import getForecastAccounts from '@salesforce/apex/ForecastAccountsController.getForecastAccounts';
import saveMapping from '@salesforce/apex/ForecastAccountsController.saveMapping';
import PleaseWait from '@salesforce/label/c.Please_wait';
import ErrorT from '@salesforce/label/c.Error';
import Success from '@salesforce/label/c.Success';
import Warning from '@salesforce/label/c.Warning';
import FailToCreateRecord from '@salesforce/label/c.Failed_To_Create_Record';
import ProcessInitiated from '@salesforce/label/c.Process_Has_Been_Initiated';
import None from '@salesforce/label/c.None';
import AccountNotFound from '@salesforce/label/c.Accounts_Not_Found';
import SelectForForecast from '@salesforce/label/c.Select_for_Forecasting';
import SAPCode from '@salesforce/label/c.SAP_Code';
import MappingSaved from '@salesforce/label/c.Mapping_Saved_Successfully';
import PleaseSelectCustomer from '@salesforce/label/c.Please_Select_the_Customers_for_Forecasting';
import AccountName from '@salesforce/label/c.Account_Name';
import NoRecordsFound from '@salesforce/label/c.No_Records_Found';
import Savemapping from '@salesforce/label/c.Save_the_mapping';
import SearchFields from '@salesforce/label/c.Search_Fields'; // new
import SearchAccount from '@salesforce/label/c.Search_Account';
import Status from '@salesforce/label/c.Status';
import All from '@salesforce/label/c.All';
import Active from '@salesforce/label/c.Active';
import Inactive from '@salesforce/label/c.Inactive';  // new..
import City from '@salesforce/label/c.City';
import Territory_Code from '@salesforce/label/c.Territory_Code';
import getterritory from '@salesforce/apex/ForecastAccountsController.getterritory';
import Id from '@salesforce/user/Id';
import { getRecord } from 'lightning/uiRecordApi';
import Userprofile from '@salesforce/schema/User.Profile.Name';


export default class ForecastAccounts extends LightningElement {
    
    @track userId = uId;
    @track isShowModal = false;
    @track mapOfAccounts = [];
    @track isChecked = false;
    @track isAccountRecords = false;
    @track checkedBoxesIds = [];
    @track unCheckedBoxesIds = [];
    @track accountMap = new Map();
    @track showSpinner = false;
    @track serarchField = 'CustomerName_Formula_Field__c';  // default....
    @track filter = 'Customer_Name__r.RecordType.Name=\'Distributor\' AND Customer_Name__r.Sales_Org__r.Sales_Org_Code__c = \'5191\' AND CustomerRegion__r.TerritoryManager__c = \''+this.userId+'\' ORDER BY CustomerName_Formula_Field__c ASC ';
    @track filter1; 
    
    @track Mainfilter=this.filter;
 
    
    @track accountName = '';
    @track accountId = '';
    @track flag = 'None'; // default...
    @track territoryId;
    @track territoryName='';
    @track profileName=false;
    @track documentCount=fatse;
    label = {
        PleaseWait,
        ErrorT,
        Success,
        Warning,
        FailToCreateRecord,
        ProcessInitiated,
        None,
        AccountNotFound,
        MappingSaved,
        PleaseSelectCustomer,
        SelectForForecast,
        SAPCode,
        AccountName,
        NoRecordsFound,
        Savemapping,
        SearchFields,
        SearchAccount,
        Status,
        All,
        Active,
        Inactive,
        City,
        Territory_Code
    };
    //@track searchValue = 'CustomerName_Formula_Field__c';
    get options() {
        return [
            { label: AccountName, value: 'CustomerName_Formula_Field__c' },
            { label: SAPCode, value: 'CustomerCode__c'}
        ];
    }

    get statusOptions() {
        return [
            { label: All, value: 'None' },
            { label: Active, value: 'true' },
            { label: Inactive, value: 'false' },
        ];
    }

    @track
    selectOptions = [
        {label: 'None', value:''}
    ];
    
    userId = Id;
    Userprofile;
    error;
    @wire(getRecord, { recordId: Id, fields: [Userprofile]}) 
    userDetails({error, data}) {
        if (data) {
           // console.log('profile in wire',data.fields.Profile.displayValue);
           if(data.fields.Profile.displayValue=='Brazil Demand Planning Administrator')
           {
            this.profileName=true;
           }
            
        } else if (error) {
            this.error = error ;
        }
    }


    connectedCallback(){       
        this.fetchAccounts();
        this.getterritoryData();
    }

    handleRadioChange(event) {
        this.serarchField = event.detail.value;
    }
    handleSelectChange(event) {
        this.mapOfAccounts = [];
        this.isAccountRecords = false;
        this.flag = event.detail.value;
        
        //console.log('flag val - ', this.flag);
        if(this.flag == 'true' || this.flag == 'false'){
            if(this.flag == 'true'){
                this.flag = true;
            }
            if(this.flag == 'false'){
                this.flag = false;
            }
            for(let key in this.accountMap) {
                // Preventing unexcepted data
                if (this.accountMap.hasOwnProperty(key)) { // Filtering the data in the loop
                    if(this.accountMap[key].isSelected == this.flag){
                        this.mapOfAccounts.push({value:this.accountMap[key], key:key});
                    }
                }
            }
            this.isAccountRecords = true;
        }
        else{
            for(let key in this.accountMap) {
                // Preventing unexcepted data
                if (this.accountMap.hasOwnProperty(key)) { // Filtering the data in the loop
                    this.mapOfAccounts.push({value:this.accountMap[key], key:key});
                }
            }
            this.isAccountRecords = true;
        }
    }

    handleTerrirtoySelect(event) {
        
        this.territoryName=event.detail.value;
        this.filter1= 'Customer_Name__r.RecordType.Name=\'Distributor\' AND Customer_Name__r.Sales_Org__r.Sales_Org_Code__c = \'5191\' AND CustomerRegion__c = \''+this.territoryName+'\' ORDER BY CustomerName_Formula_Field__c ASC ';
        if(this.territoryName =='')
        {
          this.Mainfilter=this.filter;
          console.log('the main filter',this.Mainfilter)
        }
        else{
            this.Mainfilter=this.filter1;
        }
        //console.log('territory name',this.territoryName);
        this.fetchAccounts();
        
        
    
    }


    handleAccountSelected(event){
        this.flag = 'None';
        this.accountName = event.detail.recName;
        this.accountId = event.detail.recId;
    
        this.fetchAccounts();
    }

    handleRemoveAccount(event){
        this.flag = 'None';
        this.accountName = '';
        this.accountId = '';
        this.fetchAccounts();
    }

    fetchAccounts(){
        this.showSpinner = true;
        //console.log('Selected account id :- ', this.accountId);
        getForecastAccounts({accId : this.accountId, terrId:this.territoryName})                     
        .then(result => { 
            //console.log('getReportID result.length - ', result.length);
            //console.log('fetchAccounts result - ', result);
            console.log('result of terrirtoty',result.terrId)
            this.accountMap = new Map(); 
            this.mapOfAccounts = [];
            this.isAccountRecords = false;
            if(result != null){              
                this.isAccountRecords = true;
                this.accountMap = result;
                for(let key in result) {
                    // Preventing unexcepted data
                    if (result.hasOwnProperty(key)) { // Filtering the data in the loop
                        this.mapOfAccounts.push({value:result[key], key:key});
                        //console.log('Check map value - ', result[key].isSelected);
                    }
                }
            }
            else{
                this.isAccountRecords = false;
                this.showToastmessage(ErrorT,AccountNotFound,'Error');
            }
            this.showSpinner = false;
        })
        .catch(error => {
            console.log('js method catch fetchAccounts');
            console.log(error);
            this.error = error;          
            //this.showToastmessage(ErrorT,error.body.message,'error');
            this.showSpinner = false;
        })

        
       
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                console.log('Finally');
            })



    }
    getterritoryData()
    {
    getterritory()
            .then((data) => {
                console.log('data is',data)
                
                if (data) {
                    for(const list of data){
                        const option = {
                            label: list.TerritoryCode__c +'-'+list.Name,
                            value: list.Id
                        };
                        
                        this.selectOptions = [ ...this.selectOptions, option ];
                      
                    }
                   // console.log('length of select option',this.selectOptions.length);
                } else if (error) {
                    console.error(error);
                }


            });
        }
    showToastmessage(title,message,varient){
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: varient,
            }),
        );
    }  

    handleSaveMapping(event) {
        this.showSpinner = true;
        //this.checkedBoxesIds = [...this.template.querySelectorAll('lightning-input')].filter(element => element.checked).map(element => element.dataset.id);
        this.checkedBoxesIds = [...this.template.querySelectorAll('lightning-input')]
                                .filter(element => element.checked)
                                .filter(element => element.disabled == false)
                                .map(element => element.dataset.id);
        //console.log('*** checkedBoxesIds: ' + this.checkedBoxesIds);

        this.unCheckedBoxesIds = [...this.template.querySelectorAll('lightning-input')]
                                .filter(element => element.checked == false)
                                .filter(element => element.disabled == false)
                                .map(element => element.dataset.id);
        //console.log('*** unCheckedBoxesIds: ' + this.unCheckedBoxesIds);

        saveMapping({checkedIds : JSON.stringify(this.checkedBoxesIds),
                     unCheckedIds : JSON.stringify(this.unCheckedBoxesIds),
                     forecastAccountMap : JSON.stringify(this.accountMap)})
            .then(result => {
                //console.log('saveMapping result', result);
                if(result.length>0){
                    if(result == 'success'){
                        this.showToastmessage(Success,MappingSaved,'Success');
                        setTimeout(function() {
                            window.location.reload();
                        }, 1000);
                        
                    }
                    else{
                        this.showToastmessage(ErrorT,FailToCreateRecord,'Error');
                    }
                    this.showSpinner = false;
                }                
                    
            })
            .catch(error => {
                this.showSpinner = false;
                console.log('saveMapping js method catch');
                this.showToastmessage(ErrorT,FailToCreateRecord,'Error');
            })
    }

    
}
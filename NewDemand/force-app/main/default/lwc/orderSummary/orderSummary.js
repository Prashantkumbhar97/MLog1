/* eslint-disable getter-return */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable no-useless-concat */
/* eslint-disable no-else-return */
/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable vars-on-top */
/* eslint-disable no-console */
import { LightningElement, wire, track, api } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import fetchLineItem from '@salesforce/apex/OrderSummary.fetchLineItem';
import searchOrder from '@salesforce/apex/OrderSummary.searchOrder';
import fetchAccountSummary from '@salesforce/apex/OrderSummary.fetchAccountSummary';
import findChildAccounts from '@salesforce/apex/OrderSummary.findChildAccounts';
import fetchSalesOrder from '@salesforce/apex/OrderSummary.fetchSalesOrder';
import searchProduct from '@salesforce/apex/OrderSummary.searchProduct';
import fetchUser from '@salesforce/apex/OrderSummary.fetchUser';
import getCommunityConfiguration from '@salesforce/apex/OrderSummary.getCommunityConfiguration';
import getCummunityURL from '@salesforce/apex/OrderSummary.getCummunityURL';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import strUserId from '@salesforce/user/Id';
import Order_Summary from '@salesforce/label/c.Order_Summary';
import Sales_Order_No_SFDC from '@salesforce/label/c.Sales_Order_No_SFDC';
import Search_Order from '@salesforce/label/c.Search_Order';
import Search_Result from '@salesforce/label/c.Search_Result';
import Sales_Order_No_SAP from '@salesforce/label/c.Sales_Order_No_SAP';
import PO_No from '@salesforce/label/c.PO_No';
import Order_Date from '@salesforce/label/c.Order_Date';
import Order_Date_From from '@salesforce/label/c.Order_Date_From';
import Order_Date_To from '@salesforce/label/c.Order_Date_To';
import Currency from '@salesforce/label/c.Currency';
import Total_Amount from '@salesforce/label/c.Total_Amount';
import Status from '@salesforce/label/c.Status';
import select_Product_Line_Item from '@salesforce/label/c.select_Product_Line_Item';
import Search from '@salesforce/label/c.Search';
import Close from '@salesforce/label/c.Close';
import Sales_Order from '@salesforce/label/c.Sales_Order';
import Sales_Order_Line_Item from '@salesforce/label/c.Sales_Order_Line_Item';
import Download from '@salesforce/label/c.Download';
import First from '@salesforce/label/c.First';
import Previous from '@salesforce/label/c.Previous';
import Next from '@salesforce/label/c.Next';
import Last from '@salesforce/label/c.Last';
import Page from '@salesforce/label/c.Page';
import ORDER_DETAILS from '@salesforce/label/c.ORDER_DETAILS';
import View from '@salesforce/label/c.View';
import Approval_History from '@salesforce/label/c.Approval_History';
import SKU_Code from '@salesforce/label/c.SKU_Code';
import Description from '@salesforce/label/c.Description';
import UOM from '@salesforce/label/c.UOM';
import Price from '@salesforce/label/c.Price';
import Quantity from '@salesforce/label/c.Quantity';
import Net_Value from '@salesforce/label/c.Net_Value';
import Edit_Order from '@salesforce/label/c.Edit_Order';
import None from '@salesforce/label/c.None';
import Warning from '@salesforce/label/c.Warning';
import information from '@salesforce/label/c.information';
import No_Result_Found from '@salesforce/label/c.No_Result_Found';
import Please_select_atleast_one_filter_criteria from '@salesforce/label/c.Please_select_atleast_one_filter_criteria';
import Order_Date_To_Should_be_Greater_Than_Order_Date_From from '@salesforce/label/c.Order_Date_To_Should_be_Greater_Than_Order_Date_From';
import Partially_processed from '@salesforce/label/c.Partially_processed';
import Completely_processed from '@salesforce/label/c.Completely_processed';
import Not_yet_processed from '@salesforce/label/c.Not_yet_processed';
import Rejected from '@salesforce/label/c.Rejected';
import Pending from '@salesforce/label/c.Pending';
import Clone_Order from '@salesforce/label/c.Clone_Order';
import Account_summary from '@salesforce/label/c.Account_summary';
import Customer_Name from '@salesforce/label/c.Customer_Name';
import SAP_Code from '@salesforce/label/c.SAP_Code';
import Credit_Limit from '@salesforce/label/c.Credit_Limit';
import Credit_Limit_Balance from '@salesforce/label/c.Credit_Limit_Balance';
import Credit_Limit_Used from '@salesforce/label/c.Credit_Limit_Used';
import Internal_Credit_Limit from '@salesforce/label/c.Internal_Credit_Limit';
import Outstanding from '@salesforce/label/c.Outstanding';
import Completed from '@salesforce/label/c.Completed';
import Not_Delivered from '@salesforce/label/c.Not_Delivered';
import Select_Branch from '@salesforce/label/c.Select_Branch';
import Headquarter_Name from '@salesforce/label/c.Headquarter_Name';
import All from '@salesforce/label/c.All';
import Shipping_Location from '@salesforce/label/c.Shipping_Location';
import Ship_To_Code from '@salesforce/label/c.Ship_To_Code';
export default class OrderSummary extends LightningElement {
    @api Name;
    @track columns1 = [];
    @track columns2 = [];
    @track columns3 = [];
    @track showTable=false;
    @track showError=false;
    @track showError2=false;
    @track showError3=false;
    @track showSONumber=false;
    @track showPONumber=false;
    @track showSAPNumber=false;
    @track showAS=false;
    @track record;
    @track records;
    @track recordId;
    @track LineItems;
    @track ASDetails;
    @track searchResult;
    @track bShowModal = false;
    @track aShowModal = false;
    @track ShowModal = false;
    @track orders;
    @track row;
    @track userAccountId='';
    @track sortBy;
    @track sortDirection;
    @track showEditOrderButton = false;
    @track showCloneOrderButton = false;
    @track OrderOwnerid;
    @track CreatedFrom;
    @track url='';
    @track isPoland=false;
    @track isOtherCountry = false;
    @track isDataSorted = false;
    @track showProgressBar = false;
    @track parseData;
    @track rowNumberOffset;
    @track rowNumber;
    @track isRendered = false;
    @track isParent = false;
    @track currentAccount = '';
    @track allAccountList = [];
    @track allAccountString = '';
    returnProductOptions = [];
    returnOptions = [];
    returnChildAccounts = [];
    returnChilds = [];
    userId=strUserId;
    sonumber = '';
    salesOrderNumber = '';
    purchaseOrderNumber = '';
    orderDateFrom = '';
    orderDateTo = '';
    status = '';
    orderValueFrom = '';
    orderValueTo = '';
    product = '';
    child = '';
    value = '';
    salesorg='';
    country='';
    @track orderStatus='';
    @track Payment_Term__rPayterms_Desc__c='';
    //@track pagesize;
    //@track pageNumber = 1;
    //@track currentpage;
    //@track totalpages;
    //@track totalrecords;
    //@track offset=0;
    @track page = 1; //this is initialize for 1st page
    @track data = []; //data to be display in the table
    @track startingRecord = 1; //start record position per page
    @track pageSize = '10'; //default value we are assigning
    @track totalRecountCount=0; //total record count received from all retrieved records
    @track totalPage = 0; //total number of page is needed to display all records
    @track endingRecord = 0; //end record position per page
    @track showSpinner = false;
    ccQuery='';
    query='';

    @track label = {
        Order_Summary,
        Search,
        Close,
        Sales_Order,
        Sales_Order_Line_Item,
        Search_Order,
        Search_Result,
        Sales_Order_No_SAP,
        PO_No,
        Order_Date_From,
        Order_Date_To,
        Status,
        Download,
        First,
        Previous,
        Next,
        Last,
        Page,
        ORDER_DETAILS,
        View,
        Approval_History,
        select_Product_Line_Item,
        Edit_Order,
        Please_select_atleast_one_filter_criteria,
        Sales_Order_No_SFDC,
        Clone_Order,
        Account_summary,
        SAP_Code,
        Customer_Name,
        Credit_Limit,
        Credit_Limit_Balance,
        Credit_Limit_Used,
        Internal_Credit_Limit,
        Outstanding,
        Not_yet_processed,
        Not_Delivered,
        Completed,
        Select_Branch,
        Headquarter_Name,
        All,
        Shipping_Location,
        Ship_To_Code
    };
    @track labels = {
        Sales_Order_No_SAP : Sales_Order_No_SAP,
        Order_Date : Order_Date,
        PO_No : PO_No,
        Currency : Currency,
        Total_Amount : Total_Amount,
        Status : Status,
        View : View,
        Approval_History : Approval_History,
        SKU_Code : SKU_Code,
        Description : Description,
        UOM : UOM,
        Price : Price,
        Quantity : Quantity,
        Net_Value : Net_Value,
        None : None,
        Warning : Warning,
        information : information,
        No_Result_Found : No_Result_Found,
        Order_Date_To_Should_be_Greater_Than_Order_Date_From : Order_Date_To_Should_be_Greater_Than_Order_Date_From,
        Please_select_atleast_one_filter_criteria : Please_select_atleast_one_filter_criteria,
        Partially_processed : Partially_processed,
        Completely_processed : Completely_processed,
        Not_yet_processed : Not_yet_processed,
        Rejected : Rejected,
        Pending : Pending,
        Not_Delivered : Not_Delivered,
        Completed : Completed,
        Headquarter_Name : Headquarter_Name,
        All : All,
        Shipping_Location : Shipping_Location,
        Ship_To_Code : Ship_To_Code
    }

    @track steps=[];
    @track orderSteps = [    
        { label: this.labels.Not_Delivered, value: this.labels.Not_Delivered },
        { label: this.labels.Completed, value: this.labels.Completed }
    ];

    @track ASColumns = [
        { label: this.label.Customer_Name, fieldName: 'CustomerName', type: 'text' , hideDefaultActions:true },
        { label: this.label.SAP_Code, fieldName: 'SAPCode', type: 'text' , hideDefaultActions:true },
        { label: this.label.Shipping_Location, fieldName: 'ShippingLocationName', type: 'text' , hideDefaultActions:true },
        { label: this.label.Ship_To_Code, fieldName: 'ShippingLocationCode', type: 'text' , hideDefaultActions:true }
    ];



    showDateWarningToast() {
        const evt = new ShowToastEvent({
            title: this.labels.Warning,
            message: this.labels.Order_Date_To_Should_be_Greater_Than_Order_Date_From,
            variant: 'warning',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    showFilterWarningToast() {
        const evt = new ShowToastEvent({
            title: this.labels.Warning,
            message: this.label.Please_select_atleast_one_filter_criteria,
            variant: 'warning',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    showValueWarningToast() {
        const evt = new ShowToastEvent({
            title: this.labels.Warning,
            message: 'Order Value(From) Should be Less Than Order Date(To)',
            variant: 'warning',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }
    
    showNoDataWarningToast() {
        const evt = new ShowToastEvent({
            title: this.labels.information,
            message: this.labels.No_Result_Found,
            variant: 'info',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    connectedCallback() {        

        getCummunityURL()
        .then(result=>{
            this.url=result.URL__c;
        });
        
        
        getCommunityConfiguration()
        .then(result=>{
            
            var column=JSON.parse(result.SO_Header_Column__c);
            this.columns1=JSON.parse(result.SO_Header_Column__c);
            this.columns2=JSON.parse(result.SOLI_Column__c);
            this.ccQuery=result.Sales_Order_Line_Item_SOQL__c;
            
            this.salesorg=result.Sales_Org__c;
            this.country=result.Country__c;
            
            if(this.salesorg=='2941'){
                
                this.showEditOrderButton=true;
                this.isPoland = true;
                this.showPONumber = true;
            }else{
                
                this.showEditOrderButton=false;
                this.isOtherCountry = true;
            }
            if(this.country=='Poland' || this.country=='Turkey'){
                this.showSONumber=true;
            }else{
                this.showSONumber=false;
            }
            if(this.country!='Japan'){            
             this.showSAPNumber=true;                
            }
            else{
                this.showPONumber=true;
                this.showAS=true;
                this.showProgressBar=true;
            }
            this.query=this.ccQuery;
            
            this.columns3=column;
            if(this.salesorg=='2941' || this.country=='Turkey'){
                this.columns3.pop();
                this.columns3.pop();
            }else{
                this.columns3.pop();                
            }

            if(this.country=='Turkey'){
                this.showAS=true;
                this.ASColumns.pop();
                this.ASColumns.pop();
                this.ASColumns.push({ label: this.label.Credit_Limit, fieldName: 'CreditLimit', type: 'currency' , typeAttributes: {currencyDisplayAs: "symbol"},cellAttributes: { alignment: 'left' },hideDefaultActions:true });
                this.ASColumns.push({ label: this.label.Credit_Limit_Used, fieldName: 'UsedLimit', type: 'currency' ,typeAttributes: {currencyDisplayAs: "symbol"},cellAttributes: { alignment: 'left' }, hideDefaultActions:true });
                this.ASColumns.push({ label: this.label.Credit_Limit_Balance, fieldName: 'BalanceLimit', type: 'currency' ,typeAttributes: {currencyDisplayAs: "symbol"},cellAttributes: { alignment: 'left' }, hideDefaultActions:true });
                this.ASColumns.push({ label: this.label.Internal_Credit_Limit, fieldName: 'InternalLimit', type: 'currency' , typeAttributes: {currencyDisplayAs: "symbol"},cellAttributes: { alignment: 'left' },hideDefaultActions:true });
                this.ASColumns.push({ label: this.label.Outstanding, fieldName: 'Outstanding', type: 'currency' ,typeAttributes: {currencyDisplayAs: "symbol"}, cellAttributes: { alignment: 'left' },hideDefaultActions:true });
            }
        });
        
        fetchUser().then(result => { 
               this.userAccountId=result[0].AccountId;
                if(this.userAccountId==undefined){
                    this.userAccountId='';
                }               
                this.value='10';
                this.query+= ' where Sale_Order__r.Sold_To_Party__c='+'\''+this.userAccountId+'\'';
                this.countquery= 'select count(Id) from Sales_Order_line_item__c where Sale_Order__r.Sold_To_Party__c='+'\''+this.userAccountId+'\''+' group by Sale_Order__c';                
                this.currentAccount=this.userAccountId; 
                                                    
                if(this.country=='Japan' && result[0].Account.SAP_Code__c=='0001083269'){
                    this.showSAPNumber=true;
                    this.columns3.unshift({label: this.label.Sales_Order_No_SAP, fieldName: 'SAP_Order_Number__c', type: 'text' , cellAttributes: { alignment: 'left' },hideDefaultActions:true });
                    this.columns1.unshift({label: this.label.Sales_Order_No_SAP, fieldName: 'SAP_Order_Number__c', type: 'text' , cellAttributes: { alignment: 'left' },hideDefaultActions:true });   
                    this.columns3[0].initialWidth=200;
                    this.columns3[1].initialWidth=100;
                    this.columns3[2].initialWidth=130;
                    this.columns3[3].initialWidth=450;
                    this.columns3[4].initialWidth=50;
                    this.columns3[4].initialWidth=80;
                    this.columns3[4].initialWidth=80;
                }else if(this.country=='Japan'){
                    this.columns3[0].initialWidth=180;
                    this.columns3[1].initialWidth=220;
                    this.columns3[2].initialWidth=480;
                    this.columns1[2].initialWidth=450;
                    this.columns1[1].initialWidth=180;
                    this.columns1[3].initialWidth=100;     
                }


            });
    }
    
    get options1() {
        if(this.country=='Japan'){
            return [
                { label: this.labels.None, value: '' },                
                { label: this.labels.Completed, value: 'Completely Processed' },
                { label: this.labels.Not_Delivered, value: 'Not Yet Processed' },
                { label: this.labels.Rejected, value: 'Rejected' }            
            ];
        }else{
            return [
                { label: this.labels.None, value: '' },
                { label: this.labels.Partially_processed, value: 'Partially Processed' },
                { label: this.labels.Completely_processed, value: 'Completely Processed' },
                { label: this.labels.Not_yet_processed, value: 'Not Yet Processed' },
                { label: this.labels.Rejected, value: 'Rejected' },
                { label: this.labels.Pending, value: 'Pending' }           
            ];
        }
    }

    handleSaleOrderNoChange(event){
        this.sonumber=event.target.value;
    }

    handleSONChange(event){
        this.salesOrderNumber=event.target.value;
    }

    handlePONChange(event){
        this.purchaseOrderNumber=event.target.value;
    }
    handleODFromChange(event){
        this.orderDateFrom=event.target.value;
        if(this.orderDateTo!=''){
            if(this.orderDateFrom>this.orderDateTo){
                this.showDateWarningToast();
            }
        }
    }
    handleODToChange(event){
        this.orderDateTo=event.target.value;
        if(this.orderDateFrom>this.orderDateTo){
            this.showDateWarningToast();
        }
    }
    handleStatusChange(event){
        this.status=event.target.value;
    }
    handleOVFromChange(event){
        this.orderValueFrom=event.target.value;
        if(this.orderValueTo!=''){
            if(this.orderValueFrom>this.orderValueTo){
                this.showValueWarningToast();
            }
        }
    }
    handleOVToChange(event){
        this.orderValueTo=event.target.value;
        if(this.orderValueFrom>this.orderValueTo){
            this.showValueWarningToast();
        }
    }
    handleProductChange(event){
        this.product=event.target.value;
    }

    handleChildChange(event){
        this.showSpinner = true;
        this.purchaseOrderNumber='';
        this.orderDateFrom='';
        this.orderDateTo='';
        this.status='';
        this.child=event.target.value;
        if(this.child==''){
            this.currentAccount=this.userAccountId;
        }else if(this.child=='All'){
            this.currentAccount=this.allAccountString;
        }else{
            this.currentAccount=this.child;
        }
        this.product = '';
        this.returnProductOptions = [];
        this.returnOptions = [];
        refreshApex(this.prodducts);
    }

    handleFirst(event) {
        if (this.page > 1) {
            this.page = 1;
            this.displayRecordPerPage(this.page);
        }          
    }

    handleLast(event) {
        if ((this.page < this.totalPage) && this.page !== this.totalPage) {
            this.page = this.totalPage;
            this.displayRecordPerPage(this.page);
        }         
    }

    handleNext(event) {
        if ((this.page < this.totalPage) && this.page !== this.totalPage) {
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);
        }        
    }

    handlePrevious(event) {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
    }

    get showFirstButton() {
        if (this.page == 1 || this.page == 0) {
            return true;
        }else if(this.totalRecountCount===0){
            return true;
        }else{
            return false;
        }
    }
     
    get showLastButton() {
       if(this.totalRecountCount===undefined || this.totalRecountCount === 0){
            return true;
       }
        if (Math.ceil(this.totalRecountCount / this.pageSize) === this.page || Math.ceil(this.totalRecountCount / this.pageSize)===0) {
            return true;
        }
        return false;
    }

    getData(){
        searchOrder({query : this.query})
        .then(result => {
            console.log('result==>',result);
                this.totalRecountCount = result.length;               
                if(this.totalRecountCount==0){
                    this.page=0;                   
                    this.showSpinner = false;                                    
                    this.showTable=false;
                    this.showNoDataWarningToast();               
                }else{
                    //Change by Grazitti team for Community adoption RITM0429236 12Oct22
                    this.orders = result.map(row=>{
                        if(row.Payment_Term__r || row.Sold_to_Party__r){
                            if(row.Payment_Term__r && row.Sold_to_Party__r) {
                                return{...row,  Payterms_Desc__c: row.Payment_Term__r.Payterms_Desc__c,Sold_To_Party__c: row.Sold_to_Party__r.Name}
                            }
                             else if(row.Payment_Term__r) {
                                return{...row,  Payterms_Desc__c: row.Payment_Term__r.Payterms_Desc__c}
                             } 
                             else if(row.Sold_to_Party__r){
                                return{...row,  Sold_To_Party__c: row.Sold_to_Party__r.Name}
                             }
                        }else{
                            return{...row}
                        }                        
                    })
                    this.page=1;   
                    console.log('this.orders==>',this.orders);
                    this.data = this.orders.slice(0, this.pageSize);
                this.rowNumberOffset = 0;
                this.endingRecord = this.pageSize;
                this.endingRecord = ((this.pageSize * this.page) > this.totalRecountCount)
                    ? this.totalRecountCount : (this.pageSize * this.page);
                    this.showTable=true;  
                    this.showSpinner = false;
                                      
                }
                this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
                //this.HandleButton();
                
                this.error = undefined;                                                     
        })
        .catch(error => {
            this.error = error;
            this.orders = undefined;
        });
    }

    displayRecordPerPage(page) {

        /*let's say for 2nd page, it will be => "Displaying 6 to 10 of 23 records. Page 2 of 5"
        page = 2; pageSize = 5; startingRecord = 5, endingRecord = 10
        so, slice(5,10) will give 5th to 9th records.
        */
        //this.HandleButton();
        this.startingRecord = ((page - 1) * this.pageSize);
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = ((this.pageSize * page) > this.totalRecountCount)
            ? this.totalRecountCount : (this.pageSize * page);
        if(this.isDataSorted===true){
            this.data = this.parseData.slice(this.startingRecord, this.endingRecord);
            this.rowNumberOffset = this.startingRecord;
        }else{
            this.data = this.orders.slice(this.startingRecord, this.endingRecord);
            this.rowNumberOffset = this.startingRecord;
        }
        

        //increment by 1 to display the startingRecord count, 
        //so for 2nd page, it will show "Displaying 6 to 10 of 23 records. Page 2 of 5"
        this.startingRecord = this.startingRecord + 1;
    }


    handleSearch(){
        if(this.purchaseOrderNumber=='' && this.orderDateFrom=='' && this.orderDateTo=='' && this.status=='' && this.orderValueFrom=='' && this.orderValueTo=='' && this.product=='' && this.salesOrderNumber=='' && this.sonumber=='' && this.child==''){
            this.showFilterWarningToast();
            this.showTable=false;                      
            this.showSpinner = false;            
        }else{
            this.showSpinner = true;
            this.isDataSorted=false;
            if(this.child=='All'){
                this.query=this.ccQuery+' where Sale_Order__r.Sold_To_Party__c IN ('+this.allAccountString+')';
            }else if(this.child!=''){               
                this.query=this.ccQuery+' where Sale_Order__r.Sold_To_Party__c='+'\''+this.child+'\'';
            }else{
                this.query=this.ccQuery+' where Sale_Order__r.Sold_To_Party__c='+'\''+this.userAccountId+'\'';
            }
            if(this.country=='Japan'){
                this.query+=' AND Sale_Order__r.Order_Type_lk__r.Name='+'\''+'ZJWH'+'\'';
            }
            this.countquery= 'select count(Id) from Sales_Order_line_item__c where Sale_Order__r.Sold_To_Party__c='+'\''+this.userAccountId+'\''+' group by Sale_Order__c';
            var filter = '';
            if(this.sonumber!='' && this.sonumber!=null){
                filter=' AND Sale_Order__r.Name='+'\''+this.sonumber+'\'';
                this.query+=filter;
                this.countquery+=filter;                
            }
            if(this.salesOrderNumber!='' && this.salesOrderNumber!=null){
                if(this.country=='Japan')
                {
                    filter=' AND Invoice_Reflection_Code__c ='+'\''+this.salesOrderNumber+'\'';
                }
                else
                {
                    filter=' AND Sale_Order__r.SAP_Order_Number__c='+'\''+this.salesOrderNumber+'\'';    
                }
               
                this.query+=filter;
                this.countquery+=filter;
               
            }
            if(this.purchaseOrderNumber!='' && this.purchaseOrderNumber!=null){
                filter=' AND Sale_Order__r.PONumber__c='+'\''+this.purchaseOrderNumber+'\'';
                this.query+=filter;
                this.countquery+=filter;
            }
            if(this.orderDateFrom!='' && this.orderDateFrom!=null && this.orderDateTo!='' && this.orderDateTo!=null){    
                if(this.orderDateFrom<=this.orderDateTo){
                    this.showError2=false;
                    filter=' AND Sale_Order__r.Order_Date__c >= '+this.orderDateFrom+' AND Sale_Order__r.Order_Date__c <= '+this.orderDateTo;
                    this.query+=filter;
                    this.countquery+=filter;
                }                   
            }
            if(this.orderDateFrom!='' && this.orderDateTo!=null){
                    filter=' AND Sale_Order__r.Order_Date__c >= '+this.orderDateFrom;
                    this.query+=filter;
                    this.countquery+=filter;
            }
            if(this.orderDateTo!='' && this.orderDateFrom!=null){
                    filter=' AND Sale_Order__r.Order_Date__c <= '+this.orderDateTo;
                    this.query+=filter;
                    this.countquery+=filter;
            }
            if(this.status!='' && this.status=='Partially Processed'){
                    filter=' AND Sale_Order__r.Order_Status__c='+'\''+'Partially processed'+'\'';
                    this.query+=filter;
                    this.countquery+=filter;
            }
            if(this.status!='' && this.status=='Completely Processed'){
                    filter=' AND Sale_Order__r.Order_Status__c='+'\''+'Completely processed'+'\'';
                    this.query+=filter;
                    this.countquery+=filter;
            }
            if(this.status!='' && this.status=='Not Yet Processed'){
                    filter=' AND Sale_Order__r.Order_Status__c='+'\''+'Not yet processed'+'\'';
                    this.query+=filter;
                    this.countquery+=filter;
            }
            if(this.status!='' && this.status=='Rejected'){
                    filter=' AND Sale_Order__r.Order_Status__c='+'\''+'Rejected'+'\'';
                    this.query+=filter;
                    this.countquery+=filter;
            }
            if(this.status!='' && this.status=='Pending'){
                    filter=' AND Sale_Order__r.Order_Status__c='+'\''+'Pending'+'\'';
                    this.query+=filter;
                    this.countquery+=filter;
            }
            if(this.orderValueFrom!='' && this.orderValueTo!=''){
                if(this.orderValueFrom<this.orderValueTo){
                    filter=' AND Sale_Order__r.Total_Amount__c>='+this.orderValueFrom+' AND Sale_Order__r.Total_Amount__c<='+this.orderValueTo;
                    this.query+=filter;
                    this.countquery+=filter;
                }else{
                    this.orderValueFrom='';
                    this.orderValueTo='';
                }
            }
            if(this.orderValueFrom!='' && this.orderValueTo==''){
                    filter=' AND Sale_Order__r.Total_Amount__c>='+this.orderValueFrom;
                    this.query+=filter;
                    this.countquery+=filter;
            }
            if(this.orderValueTo!='' && this.orderValueFrom==''){
                    filter=' AND Sale_Order__r.Total_Amount__c<='+this.orderValueTo;
                    this.query+=filter;
                    this.countquery+=filter;
            }
            
            if(this.product!=''){
                filter=' AND SKU_Name__r.SKU_Description__c='+'\''+this.product+'\'';
                this.query+=filter;
                this.countquery+=filter;
            }
            
            
            
            console.log(this.query);
            
            this.getData();
                       

        }
               
    }

    handleRowAction(event){
        this.steps=[];
        const row = event.detail.row;        
        this.record = row;        
        this.recordId = row.Id;
        var actionName = event.detail.action.name;
        if(actionName=='View'){
            this.bShowModal = true;
        }
        if(actionName=='ApprovalHistory'){
            this.aShowModal = true;
        }
        if(actionName=='View Order'){
            this.ShowModal = true;
        }
        console.log('this.ccQuery==>',this.ccQuery);
        //Change by Grazitti team for Community adoption RITM0429236 12Oct22
        fetchSalesOrder({SOLIquery : this.ccQuery , recordId  : this.recordId})
        .then(result => {
            this.records = result.map(row=>{
                if(row.Payment_Term__r || row.Sold_to_Party__r){
                    if(row.Payment_Term__r && row.Sold_to_Party__r) {
                        return{...row,  Payterms_Desc__c: row.Payment_Term__r.Payterms_Desc__c,Sold_To_Party__c: row.Sold_to_Party__r.Name}
                    }
                     else if(row.Payment_Term__r) {
                        return{...row,  Payterms_Desc__c: row.Payment_Term__r.Payterms_Desc__c}
                     } 
                     else if(row.Sold_to_Party__r){
                        return{...row,  Sold_To_Party__c: row.Sold_to_Party__r.Name}
                     }
                }else{
                    return{...row}
                }
                
            })
            console.log('this.records==>',this.records);
            console.log('this.columns3==>',this.columns3);
            this.orderStatus=result[0].Order_Status__c;
            if(this.orderStatus==this.labels.Rejected){
                this.steps.push({ label: this.labels.Rejected, value: this.labels.Rejected });
            }else{
                for(let i=0;i<this.orderSteps.length;i++){
                    this.steps.push(this.orderSteps[i]);
                }
            }
            this.OrderOwnerid=result[0].OwnerId;
            this.CreatedFrom=result[0].CreatedFrom__c;
            if(this.CreatedFrom=='SFDC' && this.country!='Japan' && this.country!='Turkey'){
                this.showCloneOrderButton=true;
            }else{
                this.showCloneOrderButton=false;
            }
            if((this.orderStatus=='Odrzucone' || this.orderStatus=='Rejected') && this.OrderOwnerid==this.userId && this.CreatedFrom=='SFDC'){
                this.showEditOrderButton=true;
            }else{
                this.showEditOrderButton=false;
            } 
            this.error = undefined;
        })
        .catch(error => {
            this.error = error;
        });
             
        fetchAccountSummary({ recordId  : this.recordId})
        .then(result => {
            this.ASDetails = result;;
        })
        .catch(error => {
            this.error = error;
        });

        fetchLineItem({SOLIquery : this.ccQuery , recordId  : this.recordId})
        .then(result => {

            if (result) {
                this.LineItems = result.map(row=>{
                    if(row.Payment_Term__r){
                        return{...row,  Payterms_Desc__c: row.Payment_Term__r.Payterms_Desc__c}
                    }else{
                        return{...row}
                    }
                    
                })
            }      
            this.error = undefined;
        })
        .catch(error => {
            this.error = error;
        });
    }
   
    
    @wire(searchProduct,{ accountId: '$currentAccount'})
    prodducts({data,error})
    {
        if(data){
            if(data.length>0){
                data.forEach(element => {
                    if (!this.returnProductOptions.includes(element)) {
                        this.returnProductOptions.push(element);
                    }
                });
                this.returnOptions.push({ label: this.labels.None, value: '' });
                for(let i=0;i<this.returnProductOptions.length; i++){
                    this.returnOptions=[...this.returnOptions,{label:this.returnProductOptions[i],value:this.returnProductOptions[i]}];
                }
                this.showSpinner = false;
            }         
        }else if (error) {
            this.error = error;
        }
    }

 /*   get Option(){
        setTimeout(()=>{
            this.showSpinner = false;
            console.log('wire 1');
        },2000)  
        return this.returnOptions;
    } */
 
    
        @wire(findChildAccounts)
        childs({data,error}){
        if(data){   
            if(data.length>0){
                data.forEach(element => {
                    if (!this.returnChildAccounts.includes(element)) {
                        this.returnChildAccounts.push(element);
                    }
                });
                this.returnChilds.push({ label: this.labels.Headquarter_Name, value: '' });
                this.returnChilds.push({ label: this.labels.All, value: 'All'});
                this.allAccountList.push(this.returnChildAccounts[0].Parent_Account__c);
                for(let i=0;i<this.returnChildAccounts.length; i++){
                    this.allAccountList = [...this.allAccountList,this.returnChildAccounts[i].Child_Account__r.Id];
                    this.returnChilds=[...this.returnChilds,{label:this.returnChildAccounts[i].Child_Account__r.Name,value:this.returnChildAccounts[i].Child_Account__r.Id}];
                }
                this.allAccountString = "'" + this.allAccountList.join("','") + "'";
                if(this.returnChilds.length>0){
                    this.isParent = true;
                }
            }                    
        }else if (error) {
            this.error = error;
        }
        }

   /* get Option2(){
        console.log('wire 2');
        return this.returnChilds;
    } */

    
    
    handleEditOrder(){
        var url = this.url+"/VFPageToOpenCompPolandSalesOrder?recordId="+this.recordId;         
        window.open(url,"_self");
    }

    handleCloneOrder(){
        var url = this.url+"/VFPageToOpenCompPolandSalesOrder?recordId="+this.recordId+"&clone=cloneOrder";
        window.open(url,"_self");
    }


    closeModal() {
        this.bShowModal = false;
        this.aShowModal = false;
        this.ShowModal = false;
    }

    doSorting(event) {
        this.isDataSorted = true;
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldname, direction) {
        this.parseData = JSON.parse(JSON.stringify(this.orders));
        // Return the value stored in the field
        let keyValue = (a) => {
        return a[fieldname];
        };
        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1: -1;
        // sorting data
        this.parseData.sort((x, y) => {
        x = keyValue(x) ? keyValue(x) : ''; // handling null values
        y = keyValue(y) ? keyValue(y) : '';
        // sorting values based on direction
        return isReverse * ((x > y) - (y > x));
        });
        this.data = this.parseData.slice(0, this.pageSize);
        }


        downloadCSVFile() { 
            var downloadURI=this.url+'/apex/OrderSummaryExcel?PONo='+this.purchaseOrderNumber+'&DateFrom='+this.orderDateFrom+'&DateTo='+this.orderDateTo+'&AccId='+this.currentAccount+'&Status='+this.status+'&Product='+this.product+'&SKUDesc='+this.product+'&SONo='+this.salesOrderNumber+'&SalesOrg='+this.salesorg+'&Country='+this.country+'&SON='+this.sonumber;            
            console.log('downloadURI==>'+downloadURI);
            var res = encodeURI(downloadURI);
            window.open(res);
        }
        
    get showDownload(){
        if(this.totalRecountCount===undefined || this.totalRecountCount === 0){
            return true;
           }
    }

}
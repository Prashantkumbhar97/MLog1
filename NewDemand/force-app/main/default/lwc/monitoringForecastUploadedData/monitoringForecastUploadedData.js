import { api, LightningElement,track, wire } from 'lwc';
import Monitoring_Forecast_Uploaded_Data from '@salesforce/label/c.Monitoring_Forecast_Uploaded_Data'
import Search from '@salesforce/label/c.Search'
import You_are_viewing_the_information_for from '@salesforce/label/c.You_are_viewing_the_information_for'
import indicator from '@salesforce/label/c.indicator'
import select_indicator from '@salesforce/label/c.select_indicator'
import District from '@salesforce/label/c.District'
import Sales_Rep from '@salesforce/label/c.Sales_Rep'
import Cancel from '@salesforce/label/c.Close'
import Search_Result from '@salesforce/label/c.Search_Result'
import Page_size from '@salesforce/label/c.Page_size'
import select_Page_size from '@salesforce/label/c.select_Page_size'
import Month from '@salesforce/label/c.Month'
import Year from '@salesforce/label/c.Year'
import Action from '@salesforce/label/c.Action'
import Mark_Forecast_as_Closed from '@salesforce/label/c.Mark_Forecast_as_Closed'
import Send_Reminder_Email from '@salesforce/label/c.Send_Reminder_Email'
import Page from '@salesforce/label/c.Page'
import of1 from '@salesforce/label/c.of'
import First from '@salesforce/label/c.First'
import Previous from '@salesforce/label/c.Previous'
import Next from '@salesforce/label/c.Next'
import Last from '@salesforce/label/c.Last'
import No_data_available from '@salesforce/label/c.No_data_available';
import It_may_take_some_time_to_approve_all_records from '@salesforce/label/c.It_may_take_some_time_to_approve_all_records'
import monitorforecast_helptext from '@salesforce/label/c.monitorforecast_helptext'
import getAllSaleAgreements from '@salesforce/apex/MonitoringForecast.getAllSaleAgreements';
import asyncCloseForecast from '@salesforce/apex/MonitoringForecast.asyncCloseForecast';
import sendRemainder from '@salesforce/apex/MonitoringForecast.sendRemainder';
import closeForecast from '@salesforce/apex/MonitoringForecast.closeForecast';
import Warning from '@salesforce/label/c.Warning';
import error from '@salesforce/label/c.Error';
import Success from '@salesforce/label/c.Success';
import All from '@salesforce/label/c.All';
import Red from '@salesforce/label/c.Red';
import Blue from '@salesforce/label/c.Blue';
import Green from '@salesforce/label/c.Green';
import Yellow from '@salesforce/label/c.Yellow';
import Email_Reminder_send_succesfully from '@salesforce/label/c.Email_Reminder_send_succesfully';
import Sales_Agreement_successfully_Approved from '@salesforce/label/c.Sales_Agreement_successfully_Approved';
import unable_to_activate_salesagrements from '@salesforce/label/c.unable_to_activate_salesagrements'
import Region_Code from "@salesforce/label/c.Region_Code";
import Sales_District_Manager from '@salesforce/label/c.Sales_District_Manager';
import getSalesAgreementsBySalesRep from '@salesforce/apex/MonitoringForecast.getSalesAgreementsBySalesRep';
import recallSalesAgreements from '@salesforce/apex/MonitoringForecast.recallSalesAgreements';

const SALESORG = '5191';
const months = new Map();
months.set('January','Janeiro');
months.set('February','Fevereiro');
months.set('March','Março');
months.set('April','Abril');
months.set('May','Maio');
months.set('June','Junho');
months.set('July','Julho');
months.set('August','Agosto');
months.set('September','Setembro');
months.set('October','Outubro');
months.set('November','Novembro');
months.set('December','Dezembro');

const colors = new Map();
colors.set('Red','Vermelho');
colors.set('Yellow','Amarelo');
colors.set('Blue','Azul');
colors.set('Green','verde');

const salesArgreemntsColumns = [
    { label: 'Customers', fieldName: 'AccountName',type:'text' },
    { label: 'Start Date', fieldName: 'StartDate',type:'text' },
    { label: 'End Date', fieldName: 'EndDate',type:'text' },
]

const fakeData = [
    {
        Id:1,
        StartDate:'2021-08-01',
        EndDate:'2022-07-31',
        Account:{Id:'a1',Name:'ABC'},
        AccountName:'ABC'
    },
    {
        Id:2,
        StartDate:'2021-09-01',
        EndDate:'2022-07-31',
        Account:{Id:'x1',Name:'XYZ'},
        AccountName:'XYZ'
    },
    {
        Id:3,
        StartDate:'2021-10-01',
        EndDate:'2022-07-31',
        Account:{Id:'p1',Name:'PQR'},
        AccountName:'PQR'
    },
    {
        Id:4,
        StartDate:'2021-10-01',
        EndDate:'2022-07-31',
        Account:{Id:'p1',Name:'PQR'},
        AccountName:'PQS'
    }
];

import {ShowToastEvent} from 'lightning/platformShowToastEvent';
export default class MonitoringForecastUploadedData extends LightningElement {
    value = 'All';
    @track district_filter = '';
    @track salesRep_filter = '';
    @track district = {id:'',name:'',disable:false};
    @track salesRep ={id:'',name:'',disable : false};
    @track data = [];
    @track items = [];
    @track page = 1;
    @track startingRecord = 1; 
    @track endingRecord = 0;
    @track pageSize = '5'; 
    @track totalRecountCount = 0; 
    @track totalPage = 0; 
    @track disable_btn = {
        first:false,
        previous:false,
        next:false,
        last:false
    }
    monthLabel = '';
    @api month='';
    @api year = '';
    @track data_found = false;
    @track show_spinner = false;
    hasRendered = false;
    @track labels = {
        Monitoring_Forecast_Uploaded_Data:Monitoring_Forecast_Uploaded_Data,
        Search:Search,
        You_are_viewing_the_information_for:You_are_viewing_the_information_for,
        indicator:indicator,
        select_indicator:select_indicator,
        District:District,
        Sales_Rep:Sales_Rep,
        Cancel:Cancel,
        Search_Result:Search_Result,
        Page_size:Page_size,
        select_Page_size:select_Page_size,
        Month:Month,
        Year:Year,
        Action:Action,
        Mark_Forecast_as_Closed:Mark_Forecast_as_Closed,
        Send_Reminder_Email:Send_Reminder_Email,
        Page:Page,
        of:of1,
        First:First,
        Previous,Previous,
        Next:Next,
        Last:Last,
        No_data_available:No_data_available,
        Success:Success,
        Warning:Warning,
        Email_Reminder_send_succesfully:Email_Reminder_send_succesfully,
        Sales_Agreement_successfully_Approved:Sales_Agreement_successfully_Approved,
        error:error,
        unable_to_activate_salesagrements:unable_to_activate_salesagrements,
        Region_Code:Region_Code,
        Sales_District_Manager:Sales_District_Manager,
        monitorforecast_helptext:monitorforecast_helptext,
        Red:Red,
        Blue:Blue,
        Green:Green,
        Yellow:Yellow,
        All:All,
        It_may_take_some_time_to_approve_all_records:It_may_take_some_time_to_approve_all_records
    }
    helptext = this.labels.monitorforecast_helptext;
    showModel = false;
    salesRepSalesAgreements = [];
    salesArgreemntsColumns = salesArgreemntsColumns;
    searchAgreements = '';
    paginatedsalesAgreemnts = [];
    salesRepSalesAgreementsData = []; // To store original Data of Sales Rep SalesAgreement
    countRecalls = 0;
    showModelRecall = false;

    get indicator() {
        return [
            { label: this.labels.All, value: 'All' },
            { label: this.labels.Blue, value: 'Blue' },
            { label: this.labels.Green, value: 'Green' },
            { label: this.labels.Red, value: 'Red' },
            { label: this.labels.Yellow, value: 'Yellow' }
        ];
    }
    get page_size_Option() {
        return [
            { label: '5', value: '5' },
            { label: '10', value: '10' },
            { label: '50', value: '50' },
            { label: '100', value: '100' },
            { label: '150', value: '150' },
            { label: '200', value: '200' },
        ];
    }

    connectedCallback(){
        let res_data = this.items;
        this.district_filter = `Sales_Org_Code__c = '${SALESORG}' ORDER BY Name ASC NULLS LAST limit 10`;
        this.salesRep_filter = `CustomerRegion__r.Sales_Org_Code__c = '${SALESORG}' and TerritoryManager__c !='' ORDER BY Territory_Manager_Name__c ASC NULLS LAST limit 500`;
        
        this.refreshData(res_data);
    }

    @track filter1 = JSON.stringify({
        indicator:'All',
        salesDistrict:'',
        salesRep:'',
        salesorg:SALESORG,
        month:this.month,
        year:this.year,
        territory_id:''
    });
    // month:months[new Date().getMonth()],
    // year:new Date().getFullYear().toString(),
    // @wire(getAllSaleAgreements,{filters:'$filter1'}) getSalesAgreements({error,data}){
    //     if(data){
    //         this.items = data;
    //         this.refreshData(data);
    //         this.data_found = data.length>0?true:false;
    //     }else{
    //         console.log('Err getAllSaleAgreements ',error);
    //     }
    // }

    getMonthLabels(month){
        if(months.get(month)){
          return months.get(month);
        }
    }

    getMonthLables(month){
        
    }

    refreshData(data){
        this.show_spinner = true;
        let res_data = data;
        this.totalRecountCount = res_data.length;
        this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
        this.data = this.items.slice(0,this.pageSize); 
        this.endingRecord = this.pageSize;
        this.disable_btn.first = true;
        this.disable_btn.previous = true;
        setTimeout(() => {
            this.show_spinner = false;
        }, 600);
    }

    renderedCallback(){
        let pillsclass = this.template.querySelector('.slds-form-element__control');
        // console.log('pills class ',pillsclass);
        // console.log('Month ',this.month,'Year ',this.year);
        if(this.hasRendered==false){
            this.handleChangeSalesAggreement();
            this.monthLabel = this.getMonthLabels(this.month);
            this.hasRendered = true;
        }
        this.checkNextPreviousbtn(this.page,this.totalPage);
    }

    handleChangeIndicator(event) {
        this.value = event.detail.value;
    }
    handleChangePageSize(event){
        this.pageSize = event.detail.value;
        this.firstHandler();
        this.refreshData(this.items);
    }
    handleCancel(){
        window.close();
    }
    handleChangeSalesAggreement(){
        let filter = {
            indicator:this.value,
            salesDistrict:this.district.id,
            salesRep:this.salesRep.id,
            salesorg:SALESORG,
            month:this.month,
            year:this.year,
            territory_id:''
        }
        console.log('Refresh table filter',filter);
        getAllSaleAgreements({filters:JSON.stringify(filter)}).then(data=>{
            let cloneData = [...data];
            cloneData.sort( this.sortBy( 'salesRep', 1) ); // 1=ASC,-1=DSC
            data = cloneData;
            
            this.data_found = data.length>0?true:false;
            this.items = [];
            let data1 = data; 
            data1.forEach(item => {
                console.log('item ',item);
                let obj = item;
                if(colors.get(item.indicator)){
                    obj.colorText = colors.get(item.indicator);
                }
                if(this.getMonthLabels(item.month)){
                    obj.monthLabel = this.getMonthLabels(item.month);
                }
                this.items.push(obj);
                console.log('items pushed',this.items);
            });
            console.log('response ',this.items);
            this.firstHandler();
            this.refreshData(data);
            if(!this.data_found){
                this.showToastmessage(this.labels.Warning,this.labels.No_data_available,'warning');
            }
        }).catch(err=>{
            console.log('ERR',err);
        });
    }
    sortBy( field, reverse, primer ) {
        const key = primer? function( x ) {return primer(x[field]);}: function( x ) {return x[field];};
        return function( a, b ) {
            a = key(a);
            b = key(b);
            return reverse * ( ( a > b ) - ( b > a ) );
        };
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

    handleSendRemainder(event){
        let color = event.target.dataset.color;
        let saleRep = event.target.dataset.salerep;
        let territory = event.target.dataset.territory
        let filter = {
            indicator:color,
            salesDistrict:'',
            salesRep:saleRep,
            salesorg:SALESORG,
            month:this.month,
            year:this.year,
            territory_id:territory
        }
        console.log('filtes ',filter);
        this.show_spinner = true;
        setTimeout(() => {
            sendRemainder({filter:JSON.stringify(filter)}).then(data=>{
                console.log('Res ',data);
                this.show_spinner = false;
                this.showToastmessage(this.labels.Success,this.labels.Email_Reminder_send_succesfully,'success')
            }).catch(err=>{console.log('Err ',err);this.show_spinner=false});
        }, 500);
    }

    handleRecall(event){
        let color = event.target.dataset.color;
        let saleRep = event.target.dataset.salerep;
        let territory = event.target.dataset.territory;
        let indicatorCount = event.target.dataset.indicatorcount;
        let filter = {
            indicator:color,
            salesDistrict:'',
            salesRep:saleRep,
            salesorg:SALESORG,
            month:this.month,
            year:this.year,
            territory_id:territory
        }
        console.log('filtes ',filter,'indicateCount ',indicatorCount);
        this.showModel = true;

        getSalesAgreementsBySalesRep({filter:JSON.stringify(filter)}).then(data=>{
            console.log('salesRepSalesAgreements ',data);
            this.salesRepSalesAgreements = data.map(ele=>{
                let obj = {
                    'Id':ele.Id,
                    'AccountName':ele.Account.Name,
                    'StartDate':ele.StartDate,
                    'EndDate':ele.EndDate,
                    'AccountId':ele.Account.Id
                }
                return obj;
            })
            // this.salesRepSalesAgreements = fakeData;
            // this.paginatedsalesAgreemnts = fakeData;
            this.paginatedsalesAgreemnts = this.salesRepSalesAgreements;
            this.salesRepSalesAgreementsData = this.salesRepSalesAgreements; // storing original data
        }).catch(error=>{
            console.log('Error ',error);
        });

    }

    handleRecallSalesAgreements(){
        let selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();
        let salesArgreemntsIds = [];
        if(selectedRecords.length > 0){
            console.log('selectedRecords are ', selectedRecords);
            let ids = '';
            selectedRecords.forEach(currentItem => {
                ids = ids + ',' + currentItem.Id;
                salesArgreemntsIds.push(currentItem.Id);
            });
            // this.selectedIds = ids.replace(/^,/, '');
            // this.lstSelectedRecords = selectedRecords;
            console.log('selectedRecords ',selectedRecords,' selectedIds ',salesArgreemntsIds);
            this.countRecalls = salesArgreemntsIds.length;
            if(this.countRecalls > 0){
                this.recallAgreements(salesArgreemntsIds);
            }
        } 
    }

    handlesearchKeyword(event){
        let value = event.target.value;
        if(value){
            let searchStr = value.toLowerCase();
            this.salesRepSalesAgreements = this.salesRepSalesAgreementsData.filter(ele=>ele.AccountName.toLowerCase().includes(searchStr));
        }else{
            this.salesRepSalesAgreements = this.salesRepSalesAgreementsData; // Assiginig Already stored  Data
            this.paginatedsalesAgreemnts = this.salesRepSalesAgreements;
        }
    }

    getSelectedRec() {
        let selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();
        let salesArgreemntsIds = [];
        if(selectedRecords.length > 0){
            console.log('selectedRecords are ', selectedRecords);
            salesArgreemntsIds
            let ids = '';
            selectedRecords.forEach(currentItem => {
                ids = ids + ',' + currentItem.Id;
                salesArgreemntsIds.push(currentItem.Id);
            });
            // this.selectedIds = ids.replace(/^,/, '');
            // this.lstSelectedRecords = selectedRecords;
            console.log('selectedRecords ',selectedRecords,' selectedIds ',salesArgreemntsIds);
            this.countRecalls = salesArgreemntsIds.length;
            if(this.countRecalls > 0){
                this.showModelRecall = true;
            }
        }   
      }

    handleCloseForecast(event){
        let color = event.target.dataset.color;
        let saleRep = event.target.dataset.salerep;
        let territory = event.target.dataset.territory;
        let indicatorCount = event.target.dataset.indicatorcount;
        let filter = {
            indicator:color,
            salesDistrict:'',
            salesRep:saleRep,
            salesorg:SALESORG,
            month:this.month,
            year:this.year,
            territory_id:territory
        }
        console.log('filtes ',filter,'indicateCount ',indicatorCount);
        this.show_spinner = true;
        setTimeout(() => {
            if(indicatorCount<70){
            closeForecast({filter:JSON.stringify(filter)}).then(data=>{
                console.log('Res ',data);
                this.handleChangeSalesAggreement();
                if(data.length>0){
                this.show_spinner = false;
                this.showToastmessage(this.labels.Success,this.labels.Sales_Agreement_successfully_Approved,'success')
                }else{
                this.showToastmessage(this.labels.error,this.labels.unable_to_activate_salesagrements,'error');
                this.show_spinner = false;
                }
            }).catch(err=>{console.log('Err ',err);this.show_spinner=false});
            }else{
                
                asyncCloseForecast({filter:JSON.stringify(filter)}).then(data=>{
                    this.showToastmessage(this.labels.Success,this.labels.It_may_take_some_time_to_approve_all_records,'success');  
                    this.show_spinner = false;  
                }).catch(err=>{
                    console.log('asyncCloseForecast ',err);
                    this.showToastmessage(this.labels.error,'Mass approval fail','error');
                    this.show_spinner = false;
                })
            }
        }, 500);
    }

    closeModalActionRecall(){
        this.showModelRecall = false;
        this.countRecalls = 0;
    }

    handleDistrictSelected(event){
        this.district.id = event.detail.recId;
        this.district.name = event.detail.recName;
        console.log(`Id ${this.district.id} name ${this.district.name}`);
        
    }
    handleRemoveDistrict(){
        console.log('Remove called')
        this.district.id = '';
        this.district.name = '';
    }
    handleSalesRepSelected(event){
        this.salesRep.id = event.detail.recId;
        this.salesRep.name = event.detail.recName;
        console.log(`Id ${this.salesRep.id} name ${this.salesRep.name}`);
    }
    handleRemoveSalesRep(){
        console.log('Remove called')
        this.salesRep.id = '';
        this.salesRep.name = '';
    }

    displayRecordPerPage(page){
        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);
        this.endingRecord = (this.endingRecord > this.totalRecountCount)?this.totalRecountCount : this.endingRecord;
        this.data = this.items.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
    }
    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
    }
    nextHandler() {
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);            
        }             
    }
    firstHandler(){
        this.page = 1
        this.displayRecordPerPage(this.page);
    }
    lastHandler(){
        this.page = this.totalPage;
        this.displayRecordPerPage(this.page);
    }
    checkNextPreviousbtn(page,totalpage){
        if(totalpage>=page+1){
          this.disable_btn.next = false;
        }else{
          this.disable_btn.next = true;
        }
        if(page>1){
          this.disable_btn.previous = false;
        }else{
          this.disable_btn.previous = true;
        }
      
        if(page==1||page==0){
            this.disable_btn.first = true;
        }else{
          this.disable_btn.first = false;
        }
      
        if(page==totalpage){
          this.disable_btn.last = true;
        }else{
          this.disable_btn.last = false;
        }
      }
      closeModalAction(event){
        this.showModel = false;
        this.salesRepSalesAgreements = [];
      }
      handlePaginationAction(event){
        setTimeout(() => {
            // console.log('curret Page ', event.detail.currentPage);
            this.paginatedsalesAgreemnts = event.detail.values;
        }, 200);
      }

      recallAgreements(salesAgreementsIds){
        recallSalesAgreements({salesAgreementIds:JSON.stringify(salesAgreementsIds)}).then(data=>{
            this.showToastmessage(this.labels.Success,'recalled Sales Agreements succesfully','success');
            this.showModelRecall = false;
        }).catch(err=>{
            this.showModelRecall = false;
            this.showModel = false;
            this.showToastmessage(this.labels.error,`Unable to recall Sales Agreements ${err}`,'error');
            console.log('error recall Sales Agreements ',err);
        })
      }
}
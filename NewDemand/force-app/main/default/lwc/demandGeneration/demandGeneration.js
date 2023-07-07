import { LightningElement, track, api, wire } from 'lwc';
import getDemandGeneration from '@salesforce/apex/DemandGeneration.getDemandGeneration';
import getdistributour from '@salesforce/apex/DGCustomers.getdistributour';

import updateDemandGeneration from '@salesforce/apex/DemandGeneration.updateDemandGeneration';
import updateActualBudget from '@salesforce/apex/DGUpdateActualBudget.updateActualBudget';
import dgCancelDemand from '@salesforce/apex/DGCancelDemandStatus.dgCancelDemand';
import getAuthentication from '@salesforce/apex/ServiceHelper.getAuthentication';
import fetchAvailableBudget from '@salesforce/apex/ServiceHelper.fetchAvailableBudget';
import fetchandCreateDG from '@salesforce/apex/DGFetchCreate.fetchandCreateDG';

import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import Type__c from '@salesforce/schema/Demand_Generation__c.Type__c';
import Event_Type__c from '@salesforce/schema/Demand_Generation__c.Event_Type__c';
import Status__c from '@salesforce/schema/Demand_Generation__c.Status__c';
import Sub_Status__c from '@salesforce/schema/Demand_Generation__c.Sub_Status__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Demand_Generation from '@salesforce/label/c.Demand_Generation';
import Contract_Number from '@salesforce/label/c.Contract_Number';
import Document_Number_SFDC from '@salesforce/label/c.Document_Number_SFDC';
import Document_Number_SAP from '@salesforce/label/c.Document_Number_SAP';
import Distributor_Name from '@salesforce/label/c.Distributor_Name';
import Type from '@salesforce/label/c.Type';
import Event_Name from '@salesforce/label/c.Event_Name';
import Event_Type from '@salesforce/label/c.Event_Type';
import Status from '@salesforce/label/c.Status';
import Sub_Status from '@salesforce/label/c.Sub_Status';
import Error_Message from '@salesforce/label/c.Error_Message';
import Participate_Profile from '@salesforce/label/c.Participate_Profile';
import Total_Value_R from '@salesforce/label/c.Total_Value_R';
import Planned_Value_R from '@salesforce/label/c.Planned_Value_R';
import Budget_Available_R from '@salesforce/label/c.Budget_Available_R';
import Actual_Budget_R from '@salesforce/label/c.Actual_Budget_R';
import Balance_new from '@salesforce/label/c.Balance_new';
import Important_Information from '@salesforce/label/c.Important_Information';
import Credit_Letter from '@salesforce/label/c.Credit_Letter';
import Payment_to_Supplier from '@salesforce/label/c.Payment_to_Supplier';
import Submit from '@salesforce/label/c.Submit';
import Cancel from '@salesforce/label/c.Cancel';
import Approval_History from '@salesforce/label/c.Approval_History';
import Customer_Name from '@salesforce/label/c.Customer_Name';
import Select from '@salesforce/label/c.Select';
import Event_Type_Other_Remark from '@salesforce/label/c.Event_Type_Other_Remark';
import Success from '@salesforce/label/c.Success';
import Error1 from '@salesforce/label/c.Error1';
import Demand_Generation_Updated_Successfully from '@salesforce/label/c.Demand_Generation_Updated_Successfully';
import Demand_Generation_Created_Successfully from '@salesforce/label/c.Demand_Generation_Created_Successfully';
import Please_Enter_Valid_Value from '@salesforce/label/c.Please_Enter_Valid_Value';
import Yes from '@salesforce/label/c.Yes';
import No from '@salesforce/label/c.No';
import Fill_SAPDocument_Number from '@salesforce/label/c.Fill_SAPDocument_Number';
import Select_Customer from '@salesforce/label/c.Select_Customer';
import Select_Type from '@salesforce/label/c.Select_Type';
import Fill_Event_Name from '@salesforce/label/c.Fill_Event_Name';
import Select_Event_Type from '@salesforce/label/c.Select_Event_Type';
import Fill_Event_Type_Other_Remark from '@salesforce/label/c.Fill_Event_Type_Other_Remark';
import Fill_Participate_Profile from '@salesforce/label/c.Fill_Participate_Profile';
import Fill_Planned_Value from '@salesforce/label/c.Fill_Planned_Value';
import Fill_Important_Information from '@salesforce/label/c.Fill_Important_Information';
import Select_CreditLetter_Value from '@salesforce/label/c.Select_CreditLetter_Value';
import Select_Payment_to_Supplier_Value from '@salesforce/label/c.Select_Payment_to_Supplier_Value';
import Planned_Value_Should_be_less_then_Budget_Available from '@salesforce/label/c.Planned_Value_Should_be_less_then_Budget_Available';
import Please_Enter_Actual_Budget from '@salesforce/label/c.Please_Enter_Actual_Budget';
import Demand_Status_Changed_Successfully from '@salesforce/label/c.Demand_Status_Changed_Successfully';
import Cancel_Demand_Status from '@salesforce/label/c.Cancel_Demand_Status';
import Select_event_Date from '@salesforce/label/c.Select_event_Date';
import Their_is_a_problem_In_Integration from '@salesforce/label/c.Their_is_a_problem_In_Integration';
import Budget_is_Available from '@salesforce/label/c.Budget_is_Available';
import Are_you_sure_want_to_Cancel_Demand_Generation from '@salesforce/label/c.Are_you_sure_want_to_Cancel_Demand_Generation';
import Cancel_a_record from '@salesforce/label/c.Cancel_a_record';
import Sub_Status_is_not_equal_to_Awaiting_Realization from '@salesforce/label/c.Sub_Status_is_not_equal_to_Awaiting_Realization';
import Event_Date from '@salesforce/label/c.Event_Date';
import Budget_is_not_available_please_try_again_later from '@salesforce/label/c.Budget_is_not_available_please_try_again_later';
import General_Information from '@salesforce/label/c.General_Information';
import Event_Information from '@salesforce/label/c.Event_Information';
import Finance_Information from '@salesforce/label/c.Finance_Information';
import Other_Information from '@salesforce/label/c.Other_Information';
import Year from '@salesforce/label/c.Year';
import Select_payment_method from '@salesforce/label/c.Select_payment_method';
import Actual_Budget_should_be_less_then_or_equal_to_planned_value from '@salesforce/label/c.Actual_Budget_should_be_less_then_or_equal_to_planned_value';
import Actual_Budget_should_be_equal_to_planned_value from '@salesforce/label/c.Actual_Budget_should_be_equal_to_planned_value';
import Payment_Method from '@salesforce/label/c.Payment_Method';





import LightningConfirm from "lightning/confirm";
import LightningAlert from "lightning/alert";


import uId from '@salesforce/user/Id';
import { NavigationMixin } from 'lightning/navigation';
import Userprofile from '@salesforce/schema/User.Profile.Name'
import UserNameFld from '@salesforce/schema/User.Name';
import { getRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
export default class DemandGeneration extends NavigationMixin(LightningElement) {

  @track creditOption = [];
  @track type = [];
  @track eventType = [];
  @track eventMaster = [];
  @track status = [];
  @track subStatus = [];
  @track paymentToSuplier = [];
  @track filter1 = '';
  @track acc = { id: '', name: '', disable: false };
  @track acc1 = { id: '', name: '', disable: true };
  @track _newdgid;
  @track _newdgname;
  @track _newdgdata;
  @track _newtype;
  @track newtype11='';
  @track _newstartdate='';
  @track _newenddate='';
  @track newstartdate1='';
  @track newenddate1='';
  startdateformated='';
  enddateformated='';
  @track finalyear='';
  

  @track actualbudget1 = false;
  @track documentCount = false;
  @track SapWithRebate;
  allpicklistvalue = [];
  @track allcustomer = [];
  @track recordId;
  @track plannedValue = false;
  @track otherEventType = false;
  @track removeButton = false;
  @track userId = uId;
  @track profileName = false;
  @track profileName1 = false;
  @track profileName2;
  @track methodOnOf=false;
  @track demandbalnce='';
  showLoading = false;
   createfetch='' ;
   sapdocument='';
  @track labels = {
    Demand_Generation: Demand_Generation,
    Contract_Number: Contract_Number,
    Document_Number_SFDC: Document_Number_SFDC,
    Document_Number_SAP: Document_Number_SAP,
    Distributor_Name: Distributor_Name,
    Type: Type,
    Event_Name: Event_Name,
    Event_Type: Event_Type,
    Status: Status,
    Sub_Status: Sub_Status,
    Error_Message: Error_Message,
    Participate_Profile: Participate_Profile,
    Total_Value_R: Total_Value_R,
    Planned_Value_R: Planned_Value_R,
    Budget_Available_R: Budget_Available_R,
    Actual_Budget_R: Actual_Budget_R,
    Balance_new: Balance_new,
    Important_Information: Important_Information,
    Credit_Letter: Credit_Letter,
    Payment_to_Supplier: Payment_to_Supplier,
    Submit: Submit,
    Cancel: Cancel,
    Approval_History: Approval_History,
    Customer_Name: Customer_Name,
    Select: Select,
    Event_Type_Other_Remark: Event_Type_Other_Remark,
    Success: Success,
    Error1: Error1,
    Demand_Generation_Updated_Successfully: Demand_Generation_Updated_Successfully,
    Demand_Generation_Created_Successfully: Demand_Generation_Created_Successfully,
    Please_Enter_Valid_Value: Please_Enter_Valid_Value,
    Yes: Yes,
    No: No,
    Fill_SAPDocument_Number: Fill_SAPDocument_Number,
    Select_Customer: Select_Customer,
    Select_Type: Select_Type,
    Fill_Event_Name: Fill_Event_Name,
    Select_Event_Type: Select_Event_Type,
    Fill_Event_Type_Other_Remark: Fill_Event_Type_Other_Remark,
    Fill_Participate_Profile: Fill_Participate_Profile,
    Fill_Planned_Value: Fill_Planned_Value,
    Fill_Important_Information: Fill_Important_Information,
    Select_CreditLetter_Value: Select_CreditLetter_Value,
    Select_Payment_to_Supplier_Value: Select_Payment_to_Supplier_Value,
    Planned_Value_Should_be_less_then_Budget_Available: Planned_Value_Should_be_less_then_Budget_Available,
    Please_Enter_Actual_Budget: Please_Enter_Actual_Budget,
    Demand_Status_Changed_Successfully: Demand_Status_Changed_Successfully,
    Cancel_Demand_Status: Cancel_Demand_Status,
    Select_event_Date:Select_event_Date,
    Budget_is_Available:Budget_is_Available,
    Are_you_sure_want_to_Cancel_Demand_Generation:Are_you_sure_want_to_Cancel_Demand_Generation,
    Cancel_a_record:Cancel_a_record,
    Their_is_a_problem_In_Integration:Their_is_a_problem_In_Integration,
    Sub_Status_is_not_equal_to_Awaiting_Realization:Sub_Status_is_not_equal_to_Awaiting_Realization,
    Event_Date:Event_Date,
    Budget_is_not_available_please_try_again_later:Budget_is_not_available_please_try_again_later,
    General_Information:General_Information,
    Event_Information:Event_Information,
    Finance_Information:Finance_Information,
    Other_Information:Other_Information,
    Year:Year,
    Select_payment_method:Select_payment_method,
    Actual_Budget_should_be_less_then_or_equal_to_planned_value:Actual_Budget_should_be_less_then_or_equal_to_planned_value,
    Actual_Budget_should_be_equal_to_planned_value:Actual_Budget_should_be_equal_to_planned_value,
    Payment_Method:Payment_Method
  }



  @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: Type__c })
  propertyOrFunction1({ error, data }) {
    if (data) {
      this.type = data.values;
    }

  };

  @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: Event_Type__c })
  propertyOrFunction2({ error, data }) {
    if (data) {
      this.eventType = data.values;


    }

  };

 /* @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: Event_Type__c })
  propertyOrFunction7({ error, data }) {
    if (data) {
      this.eventMaster = data.values;


    }

  };

*/
  @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: Status__c })
  propertyOrFunction3({ error, data }) {
    if (data) {
      this.status = data.values;
    }

  };

  @wire(getPicklistValues, { recordTypeId: '012000000000000AAA', fieldApiName: Sub_Status__c })
  propertyOrFunction4({ error, data }) {
    if (data) {
      this.subStatus = data.values;
    }

  };

  @wire(getRecord, { recordId: uId, fields: [Userprofile] })
  userDetails3({ error, data }) {
    if (data) {
      //console.log('profile in wire', data.fields.Profile.displayValue);
     // console.log('in', data.fields.Profile.displayValue);
      if (data.fields.Profile.displayValue == 'Brazil Rebate Admin') {
        this.profileName = true;
        console.log('in profile name 1');
      }

    } else if (error) {
      this.error = error;
    }
  }

  @wire(getRecord, { recordId: uId, fields: [Userprofile] })
  userDetails({ error, data }) {
    if (data) {
      console.log('profile in wire', data.fields.Profile.displayValue);
      if (data.fields.Profile.displayValue == 'Brazil Sales Person') {
        this.profileName2 = data.fields.Profile.displayValue;
        this.profileName = true;
      }

    } else if (error) {
      this.error = error;
    }
  }

  @wire(getRecord, { recordId: uId, fields: [Userprofile] })
  userDetails5({ error, data }) {
    if (data) {
      console.log('profile in wire', data.fields.Profile.displayValue);
      if (data.fields.Profile.displayValue == 'Brazil Trade Marketing') {
        
        this.profileName = true;
      }

    } else if (error) {
      this.error = error;
    }
  }



  @wire(getRecord, { recordId: uId, fields: [UserNameFld] })
  userDetails1({ error, data }) {
    if (data) {
      console.log('User data is', data);
      console.log('User name in New ', data.fields.Name.value);
      if (data.fields.Name.value == 'Daniel Ferreira' || data.fields.Name.value == 'Daniela Mello') {
        this.profileName1 = true;

      }

    } else if (error) {
      this.error = error;
    }
  }

  




  @track demand = {};
  @track recordId1 = '';
  @track demandname = '';
  @track demandname1 = '';
  @track demandname2 = false;
  @track  typename=false;
  @track thisyear=false;
  @track year11='';
  custoption='';
  connectedCallback() {
    setTimeout(() => {
      this.showLoading = true;
    this.recordId1 = this._newdgid;
    this.demandname = this._newdgname;
        if(this.demandname ==null)
        {
          this.demandname2=true;
        }
    
    this.recordId = this._newdgdata;
    this.newtype11=this._newtype;
    this.newstartdate1=this._newstartdate;
    this.newenddate1=this._newenddate;

     this.startdateformated=this.newstartdate1.substring(8,10) +'-'+this.newstartdate1.substring(5,7) +'-'+this.newstartdate1.substring(0,4);
    this.enddateformated=this.newenddate1.substring(8,10) +'-'+this.newenddate1.substring(5,7) +'-'+this.newenddate1.substring(0,4);

    this.finalyear=this.startdateformated +' '+'a'+' '+this.enddateformated;
    
    const actualstart = new Date(this.newstartdate1);
    const givenstart=new Date(this.demand.startdatem);

    if(actualstart >=givenstart)
    {
      this.methodOnOf=true;
    }  
    
    else
    {
      
      this.methodOnOf=false;
    }

    if(this.newtype11==null)
    {
      this.typename=true;
    }

    if(this.recordId !=null)
    {
    this.thisyear=true;
    this.demandbalnce=Number(this.demand.balance).toLocaleString('pt-BR');
    console.log('Balanceis',this.demandbalnce);
     }
    if(this.demand.year !=null)
    {
    this.year11=this.demand.year;
    }
    console.log('Year is',this.demand.year);
   // console.log('New type in connected', this.newtype11);
   // console.log('demand generration id in connected', this.recordId);
    this.getDemand();
    this.getDistributor();

    this.filter1 = 'Customer_Name__r.RecordType.Name=\'Distributor\' AND Customer_Name__r.Sales_Org__r.Sales_Org_Code__c = \'5191\' AND CustomerRegion__r.TerritoryManager__c = \'' + this.userId + '\' ORDER BY CustomerName_Formula_Field__c ASC ';
    if (this.recordId != null)
      {
         this.showLoading=false;
      }
    if (this.recordId == null  && this.profileName2 == 'Brazil Sales Person') {

      this.getauthentication();
 
    }
  }, 500);
  
  }
  
  renderedCallback() {
    //this.showLoading = true;
    this.recordId1 = this._newdgid;
    this.demandname = this._newdgname;
    if(this.demandname ==null)
        {
          this.demandname2=true;
        }
    this.recordId = this._newdgdata;
    this.newtype11=this._newtype;
    this.newstartdate1=this._newstartdate;
    this.newenddate1=this._newenddate;
    console.log('Start date is'+this.newstartdate1);  
    if(this.demand.year !=null)
    {
    this.year11=this.demand.year;
    }   
    this.startdateformated=this.newstartdate1.substring(8,10) +'-'+this.newstartdate1.substring(5,7) +'-'+this.newstartdate1.substring(0,4);
    this.enddateformated=this.newenddate1.substring(8,10) +'-'+this.newenddate1.substring(5,7) +'-'+this.newenddate1.substring(0,4);

    this.finalyear=this.startdateformated +' '+'a'+' '+this.enddateformated;
    
    console.log('Start date is Con new1',this.finalyear);
    console.log('Year is',this.demand.year);
    const actualstart = new Date(this.newstartdate1);
    const givenstart=new Date(this.demand.startdatem);

    if(actualstart >=givenstart)
    {
      this.methodOnOf=true;
    }  
    
    else
    {
      
      this.methodOnOf=false;
    }
    if(this.newtype11==null)
    {
      this.typename=true;
    }
    if(this.recordId !=null) 
    {
    this.thisyear=true;
    this.demandbalnce=Number(this.demand.balance).toLocaleString('pt-BR');
    console.log('Balanceis',this.demandbalnce);
    
    }
    console.log('Type in DG Auto populated is render',this.newtype11);
     if (this.recordId == null) {
     this.getauthentication();
      //this.getFetchBalance();
    }
    console.log('demand generration id in rendered', this.recordId);
   // this.showLoading = false;
  }

  get newdgid() {
    return this._newdgid;
  }
  @api set newdgid(value) {
    this._newdgid = value;

  }
  get newdgname() {
    return this._newdgname;
  }
  @api set newdgname(value) {
    this._newdgname = value;

  }

  get newdgdata() {
    return this._newdgdata;
  }
  @api set newdgdata(value) {
    this._newdgdata = value;
  }

  get newtype() {
    return this._newtype;
  }
  @api set newtype(value) {
    this._newtype = value;
    console.log('in api value is',this._newtype);
  }
  
  get newstartdate() {
    return this._newstartdate;
  }
  @api set newstartdate(value) {
    this._newstartdate = value;
    }

  get newenddate() {
    return this._newenddate;
  }
  @api set newenddate(value) {
    this._newenddate = value;
    }

  newdgdata

  countryLocale = 'pt-BR'


  blankarray = [];
  getDemand() {
    console.log('rebate id is', this.recordId1);
    console.log('Demand id in get is', this.recordId);
    getDemandGeneration({ recordId: this.recordId, rebateId: this.recordId1 })
      .then((data) => {
        this.demand = data;
        this.custoption=this.demand.distributorName;
          console.log('Cption Customer',this.custoption);
          console.log('Cption Customer',this.demand.distributorName);
   
       // console.log('Contract number in get is',this.demand.contractNumber);
        

        let obj = JSON.parse(JSON.stringify(this.demand.eventType.split(';')));
        this.allpicklistvalue = obj;
        if (obj.includes('')) {
          this.allValues = this.blankarray;
        }
        else {
          this.allValues = obj;

        }

        this.acc.name = this.demand.distributorName;
        this.demand.zonalId1 = this.demand.zonalId;
        this.demand.regionalId1 = this.demand.regionalId;
        this.demand.marketingId1 = this.demand.marketingId;
        this.demand.marketingAcessManager1 = this.demand.marketingAcessManager;
        if (this.demand.id == '') {
          //console.log('demand id in blank', this.demand.id);
          this.documentCount = true;
          this.countDocumentNumber = this.demandname + '-'+'E'+ this.demand.countDocumentNumber;
          this.demand.status = 'Draft';
        }
        if (this.demand.subStatus == 'Awaiting Realization') {
          this.actualbudget1 = true;
        }
        if (this.demand.status == 'Draft' || this.demand.status == 'Rejected') {
          this.plannedValue = true;
          //console.log('Demand Status for checking', this.demand.status);
        }

        if (this.demand.eventType == 'Other') {
          this.otherEventType = true;
        }
        if (this.recordId != null) {
          //console.log('record id is for rebateadmin', this.recordId);
          this.removeButton = true;
        }
        console.log('Demnad data is', data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        console.log('Finally');
      })
  }
 
  @track Cutomer=[];
  statusOptions=[];
  @track newoption=[];
  getDistributor() {
    getdistributour({rebateId: this.recordId1 })
      .then((data) => {
        this.Cutomer =(data);
        console.log('Customer data is',this.Cutomer);
         
        this.Cutomer.forEach(element => {
           console.log('element', element);
          let obj = { label:element.Distributor__r.Name , value: element.Distributor__c };
          this.statusOptions.push(obj);
          this.newoption=this.statusOptions;
          console.log('Data is',obj);
          console.log('Status Option is',this.statusOptions);
      });
        
        
       
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        console.log('Finally');
      })
  }


  @track fetchdata = {};
  @track value;
  allValues = [];

 /* handleChange(event) {
    this.value = event.target.value;


    if (!this.allValues.includes(this.value))
      this.allValues.push(this.value);

    this.modifyOptions();
  }  */

/*  handleRemove(event) {
    this.value = '';
    const valueRemoved = event.target.name;
    if (valueRemoved == 'Other') {
      this.otherEventType = false;
    }

    this.allValues.splice(this.allValues.indexOf(valueRemoved), 1);


    this.modifyOptions();
    if (this.allValues.length < 1) {
      this.allpicklistvalue = [];
    }    
    //console.log('all picklist value', this.allpicklistvalue);
   // console.log('all  values', this.allValues);

  }*/
  /*
  modifyOptions() {
    //console.log('after remove', this.eventMaster);
    this.eventType = this.eventMaster.filter(elem => {
      if (!this.allValues.includes(elem.value))
        this.demand.eventType = this.allValues.join(';').toString();
      if (this.demand.eventType == 'Other') {
        this.otherEventType = true;
      }
      return elem;
    })
  }
 */
  @track plan;
   mainvalue='';
   newmainvalue='';
   newmainvalue1='';
  updatevalue(event) {

    let value = event.target.value;
    let field = event.target.name;
    this.demand.contractName = this.recordId1;
    //console.log('contract id is', this.demand.contractName);
    if (field == 'Document Number(SAP)') {
      this.demand.SapDocumentNumber = value;
    }


    if (field == 'Type') {
      this.demand.type = value;
    }
    if (field == 'Event Name') {
      this.demand.eventName = value;
    }

    if (field == 'Status') {
      this.demand.status = value;
    }
    if (field == 'Sub Status') {
      this.demand.subStatus = value;

      if (this.demand.subStatus = 'Awaiting Realization') {
        this.actualbudget1 = true;
        console.log('Sub Status is', this.demand.subStatus);
      }

    }
    if (field == 'Error Message') {
      this.demand.errorMessage = value;
    }
    if (field == 'Participate Profile') {
      this.demand.participateProfile = value;
    }
    if (field == 'Total Value R$') {
      this.demand.totalValue = value;
      console.log('total value is', this.TotalValueR$);
    }
    if (field == 'Planned Value R$') {

      this.demand.plannedValue = value;
      this.mainvalue=this.demand.budgetAvailable - this.demand.plannedValue;

      this.demand.balance = this.mainvalue.toFixed(2);
     // console.log('Demand balance is',this.demand.balance);
      this.newmainvalue=this.demand.balance;
      this.newmainvalue1=Number(this.newmainvalue).toLocaleString('pt-BR');
      console.log('Demand balance is',this.newmainvalue1);
      
    }
    if (field == 'Budget Available R$') {
      this.demand.budgetAvailable = value;

    }
    if (field == 'Actual Budget R$') {
      this.demand.actualBudget = value;
    }
    if (field == 'Balance $') {

    }
    if (field == 'Important Information') {
      this.demand.importantInformation = value;
    }
    if (field == 'Credit Letter') {
      this.demand.creditLetter = value;
    }
    if (field == 'Payment to Supplier') {
      this.demand.paymenttoSupplier = value;
    }
    if (field == 'Event Type Other Remark') {
      this.demand.otherRemarks = value;
    }
    if (field == 'EventDate') {
      this.demand.eventdate = value;
    }
    if (field == 'Payment Method') {
      this.demand.paymentMethod = value;
    }
    if (field == 'Event Type') {
      this.demand.eventType = value;
      if(this.demand.eventType=='Other')
      {
        this.otherEventType=true;
      }
      else
      {
        this.otherEventType=false;
      }

    }
    if (field == 'Customer') {
      this.demand.distributorId = value;
      console.log('Distributor id is',this.demand.distributorId);

    }
  }

  handleSave(event) {
    if (this.demand.id == null || this.demand.id == '') {
      this.demand.documentNumber = this.countDocumentNumber;
      this.demand.newtype=this.newtype11;
      this.demand.year=this.finalyear;
    }
    //console.log('Demand data in handle save', this.demand);

    let flag = true;
    let volFlag = true;
    let afterftech = true;
    let actualtrue=true;
    
    if (this.demand.distributorId == '' || this.demand.distributorId == null) {
      flag = false;
      this.showToastmessage(this.labels.Error1, this.labels.Select_Customer, 'Error');
    }
    
    else if (this.demand.eventName == '' || this.demand.eventName == null) {
      flag = false;
      this.showToastmessage(this.labels.Error1, this.labels.Fill_Event_Name, 'Error');
    }
    else if (this.demand.eventdate == '' || this.demand.eventdate == null) {
      flag = false;
      this.showToastmessage(this.labels.Error1,this.labels.Select_event_Date, 'Error');
    }
    else if (this.demand.eventType == '' || this.demand.eventType == null) {
      flag = false;
      this.showToastmessage(this.labels.Error1, this.labels.Select_Event_Type, 'Error');
    }
   
    else if (this.demand.eventType == 'Other' && (this.demand.otherRemarks == '' || this.demand.otherRemarks == null)) {
        flag = false;
        this.showToastmessage(this.labels.Error1, this.labels.Fill_Event_Type_Other_Remark, 'Error');
      
    }


    else if (this.demand.participateProfile == '' || this.demand.participateProfile == null) {
      flag = false;
      this.showToastmessage(this.labels.Error1, this.labels.Fill_Participate_Profile, 'Error');
    }
    else if (this.demand.importantInformation == '' || this.demand.importantInformation == null) {
      flag = false;
      this.showToastmessage(this.labels.Error1, this.labels.Fill_Important_Information, 'Error');
    }

    else if (this.demand.plannedValue == '' || this.demand.plannedValue == null || this.demand.plannedValue == 0) {
      flag = false;
      this.showToastmessage(this.labels.Error1, this.labels.Fill_Planned_Value, 'Error');
    }
    
    
    else if (this.demand.paymentMethod !='Credit Letter' && this.demand.paymentMethod !='Payment to Supplier') {
      flag = false;
      this.showToastmessage(this.labels.Error1, this.labels.Select_payment_method, 'Error');
    }
    console.log('payment method is'+this.demand.paymentMethod);
  

    if (flag) {
      if (this.demand.balance < 0) {
        volFlag = false;
        this.showToastmessage(this.labels.Error1, this.labels.Planned_Value_Should_be_less_then_Budget_Available, 'Error');
      }
      if (this.demand.subStatus == 'Awaiting Realization' && ((this.demand.actualBudget) == 0 || (this.demand.actualBudget) < 0)) {
        volFlag = false;
        this.showToastmessage(this.labels.Error1, this.labels.Please_Enter_Actual_Budget, 'Error');

      }
      if (volFlag) {
        //console.log('planned ', Number(this.demand.plannedValue));
      //  console.log('res', (Number(this.fetchdata.resBudgetAvailable)));

        if (Number(this.demand.plannedValue) > (Number(this.fetchdata.resBudgetAvailable))) {
          afterftech = false;
          this.showToastmessage(this.labels.Error1, this.labels.Planned_Value_Should_be_less_then_Budget_Available, 'Error');
        }

        if(Number(this.demand.actualBudget) > (Number(this.demand.plannedValue)))
        {
          afterftech = false;
          this.showToastmessage(this.labels.Error1,this.labels.Actual_Budget_should_be_less_then_or_equal_to_planned_value
            , 'Error');
        }
        
 
        if (afterftech) {
        
          if (this.demand.actualBudget > 0) {
            

           if(this.demand.paymentMethod =='Credit Letter'&&(Number(this.demand.actualBudget) !=(Number(this.demand.plannedValue))))
           {
            actualtrue=false;
             this.showToastmessage(this.labels.Error1,this.labels.Actual_Budget_should_be_equal_to_planned_value
              , 'Error');
           }

           if(actualtrue)
           {
            this.showLoading = true;
            updateActualBudget({ contractNumber:this.demand.contractNumber, documentNumberSAP: this.demand.SapDocumentNumber, actualBudget: this.demand.actualBudget, demandId: this.demand.id })

              .then(newresult => {
                //console.log('data length11', newresult.length);
                if (newresult.length > 0) {
                 // console.log('New result value is' + newresult);

                  if (newresult == 'Success') {
                    this.showLoading = false;
                    this.showToastmessage(this.labels.Success, this.labels.Demand_Generation_Updated_Successfully, 'Success');

                    this[NavigationMixin.Navigate]({
                      type: 'standard__recordPage',
                      attributes: {
                        recordId: this.demand.id,
                        objectApiName: 'Demand_Generation__c',
                        actionName: 'view'
                      },
                    });
                    
                  }
                  else {
                    if (newresult == 'Error') {
                      this.showLoading = false;
                      this.showToastmessage(this.labels.Error1,this.labels.Their_is_a_problem_In_Integration, 'Error');
                      
                    }
                  }



                }
              })
              .catch(error => console.log('Error ', error))

            } 
          }

          else {
            this.showLoading = true;
            this.demand.contractNumber=this.demandname;
            fetchandCreateDG({ wrapperdata: JSON.stringify(this.demand) })
            .then((data) => {
              //console.log('create data is', data);

              this.createfetch = data.errormessage;
              this.sapdocument = data.documentNumberSAP;
             // console.log('create data in variable', this.createfetch)
            
             if(this.createfetch=='Successcreate')
             {   
              this.demand.SapDocumentNumber=this.sapdocument;
              this.showToastmessage(this.labels.Success,this.labels.Budget_is_Available, 'Success');

                     
             updateDemandGeneration({ wrapperdata: JSON.stringify(this.demand) })
              .then(result => {
                //console.log('data length', result.length);
                if (result.length > 0) {
                  if (result == 'success') {
                    //console.log('in Success');

                    this.showToastmessage(this.labels.Success, this.labels.Demand_Generation_Updated_Successfully, 'Success');

                    this[NavigationMixin.Navigate]({
                      type: 'standard__recordPage',
                      attributes: {
                        recordId: this.demand.id,
                        objectApiName: 'Demand_Generation__c',
                        actionName: 'view'
                      },
                    });
                    this.showLoading = false;

                  }
                  else if (result != 'success' && result != 'error') {
                   // console.log('result in create case1', result);
                    this.showToastmessage(this.labels.Success, this.labels.Demand_Generation_Created_Successfully, 'Success');
                   // console.log('result in create case1', result);

                    this[NavigationMixin.Navigate]({
                      type: 'standard__recordPage',
                      attributes: {
                        recordId: result,
                        objectApiName: 'Demand_Generation__c',
                        actionName: 'view'
                      },
                    });

                    this.showLoading = false;
                  }
                  else {
                    if (result == 'error') {
                      this.showToastmessage(this.labels.Error1, this.labels.Please_Enter_Valid_Value, 'Error');
                      this.showLoading = false;
                    }
                  }

                }

              })

             
              .catch(error => {

                console.log('in Catch BLock');

              })
            }  
            else if(this.createfetch=='ErrorInetgration')
            {
              this.showLoading = false;
              this.showToastmessage(this.labels.Error1,this.labels.Their_is_a_problem_In_Integration, 'Error');
            }
            else if(this.createfetch=='budgetnotavailable')
            {
              this.showLoading = false;
              this.showToastmessage(this.labels.Error1,this.labels.Budget_is_not_available_please_try_again_later, 'Error');
            
            }
            })
          

          }
        }
      }
    }
  }

  showToastmessage(title, message, varient) {
    this.dispatchEvent(
      new ShowToastEvent({
        title: title,
        message: message,
        variant: varient,
      }),
    );
  }

  @track accountdata;
  handleAccountSelected(event) {
    this.accountdata = event.detail.values;
    this.flag = 'None';
    this.accountName = event.detail.recName;
    this.accountId = event.detail.recId;
    //console.log('account name and id is', this.accountName);
   // console.log('account id is', this.accountId);
   // console.log('whole account details', this.accountdata);

  }

  handleRemoveAccount(event) {
    this.flag = 'None';
    this.accountName = '';
    this.accountId = '';
  }


  handleAccount(event) {
    this.acc.id = event.detail.recId;
    this.acc.name = event.detail.recName;
    //this.demand.distributorId = this.acc.id;

    //console.log('the account id is', this.acc.name);
    //console.log(`Id ${this.acc.id} name ${this.acc.name}`);
  }



  handleRemoveSalesRep() {
    console.log('Remove called')
    this.acc.id = '';
    this.acc.name = '';
  }

  @track customFormModal = false;

  customShowModalPopup() {
    this.customFormModal = true;
  }

  customHideModalPopup() {

    this.customFormModal = false;
  }


  value = '';

  //get options() {
 //   return [
 //     { label: this.labels.Yes, value: 'Yes' },
  //    { label: this.labels.No, value: 'No' },
  //  ];
 // }

  get options1() {
    return [
      { label: this.labels.Payment_to_Supplier, value:'Payment to Supplier' },
      { label: this.labels.Credit_Letter, value:'Credit Letter' },
    ];
  }
  
  get options2() {
    return [
      { label: this.labels.Credit_Letter, value:'Credit Letter' },
    ];
  }

  
  


  handleDelete(event) {
    console.log('in Cancel 1');
    var url = window.location.href;
    var value = url.substr(0, url.lastIndexOf('/') + 1);
    window.history.back();
    return false;
  }



  async handleConfirmClick() {
    const result = await LightningConfirm.open({
        message: this.labels.Are_you_sure_want_to_Cancel_Demand_Generation,
        variant: "default", // headerless
        label: this.labels.Cancel_a_record
    });

    //Confirm has been closed

    //result is true if OK was clicked
    if (result) {
        this.handleSuccessAlertClick();
    } else {
        //and false if cancel was clicked
        this.handleErrorAlertClick();
    }
}

async handleSuccessAlertClick() {
   /* await LightningAlert.open({
        message: `You clicked "Ok"`,
        theme: "success",
        label: "Success!"
    }); */
    this.handleDelete1();
}

async handleErrorAlertClick() {
   /* await LightningAlert.open({
        message: `You clicked "Cancel"`,
        theme: "error",
        label: "Error!"
    });
    */
}





  handleDelete1(event) {
    console.log('in Cancel 2');
    this.showLoading = true;
    if (this.demand.subStatus == 'Awaiting Realization') {
      //console.log('demand id in realization',this.demand.id);
      dgCancelDemand({ contractNumber: this.demand.contractNumber, documentNumberSAP: this.demand.SapDocumentNumber, demandId: this.demand.id })
        .then(newresult => {
          console.log('data length11', newresult.length);
          if (newresult.length > 0) {
            console.log('New result value is' + newresult);

            if (newresult == 'success') {
              this.demand.status = 'Cancelled';
              this.demand.subStatus = '';
              this.showLoading = false;
              this.showToastmessage(this.labels.Success, this.labels.Demand_Status_Changed_Successfully, 'Success');

              this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                  recordId: this.demand.id,
                  objectApiName: 'Demand_Generation__c',
                  actionName: 'view'
                },
              });
              updateDemandGeneration({ wrapperdata: JSON.stringify(this.demand) })


            }
            else {
              if (newresult == 'error') {
                this.showLoading = false;
                this.showToastmessage(this.labels.Error1,this.labels.Their_is_a_problem_In_Integration, 'Error');
                
              }
            }



          }
        })
        .catch(error => console.log('Error ', error))
         }
    else if (this.demand.subStatus != 'Awaiting Realization') {
      this.showLoading = false;
     this.showToastmessage(this.labels.Error1,this.labels.Sub_Status_is_not_equal_to_Awaiting_Realization, 'Error');
              
    }
 
 

  }


  getauthentication() {
   
    getAuthentication({ racId: this.demandname }).then((data) => {
      console.log('secret key in Dg', data);
      this.secretkey = data;
      
      fetchAvailableBudget({ authentication: this.secretkey, newRebate: this.demandname }).then((data) => {
        console.log('fetch data is', data);
  
        this.demand.totalValue = data.resTotalValue;
        this.demand.budgetAvailable = data.resBudgetAvailable
        this.demand.errorMessage = data.resErrorMessage;
        this.fetchdata = data;
        console.log('fetch data in variable', this.fetchdata);
        this.showLoading = false;

  
      })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          console.log('In Final Block of fetch Balance Method');
        })
        

    })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        console.log('In Final Block of fetch Balance Method');
      })
      
  }



}






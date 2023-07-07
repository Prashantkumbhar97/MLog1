import { LightningElement, api, track, wire} from 'lwc';
import { CloseActionScreenEvent } from 'lightning/actions';
import { NavigationMixin } from 'lightning/navigation';

//Style Load For Popup Size
import modal from "@salesforce/resourceUrl/Loadstyle";
import { loadStyle } from "lightning/platformResourceLoader";

// Apex Methods
import getSearchDemandGeneration from '@salesforce/apex/SearchDemandGenerationCls.getSearchDemandGeneration';
import fetchAvailableBudget from '@salesforce/apex/ServiceHelper.fetchAvailableBudget';
import getAuthentication from '@salesforce/apex/ServiceHelper.getAuthentication';


import uId from '@salesforce/user/Id';
import Userprofile from '@salesforce/schema/User.Profile.Name'
import { getRecord } from 'lightning/uiRecordApi';


//Custom Labels
import Demand_Generation from '@salesforce/label/c.Demand_Generation';
import Contract_Number from '@salesforce/label/c.Contract_Number';
import Total_Value_R from '@salesforce/label/c.Total_Value_R';
import Budget_Balance from '@salesforce/label/c.Budget_Balance';
import New from '@salesforce/label/c.New';
import close from '@salesforce/label/c.Close';
import Document_Number_SAP from '@salesforce/label/c.Document_Number_SAP';
import Customer_Name from '@salesforce/label/c.Customer_Name';
import Event_Type from '@salesforce/label/c.Event_Type';
import Planned_Value_R from '@salesforce/label/c.Planned_Value_R';
import Actual_Budget_R from '@salesforce/label/c.Actual_Budget_R';
import Status from '@salesforce/label/c.Status';
import Edit from '@salesforce/label/c.Edit';
import View from '@salesforce/label/c.View';



const VALUE = [      
  {label:Document_Number_SAP,fieldName:'SAP_Document_Number__c'},
  {label:Customer_Name,fieldName:'DistributorName'}, 
  {label:Event_Type,fieldName:'Event_Type__c'},
  {label:Planned_Value_R,fieldName:'Planned_Value__c'},
  {label:Actual_Budget_R,fieldName:'Actual_Budget__c'},
  {label:Status,fieldName:'Status__c'},
  {label:View,type: 'button', typeAttributes:{label:View,name:'View',target:'_blank',variant: 'base'}},
  {label:Edit,type: 'button', typeAttributes:{label:Edit,name:'Edit',target:'_blank',variant: 'base'},
  cellAttributes:{class:{fieldName:'buttonCss'}}}
  ];  

export default class SearchDemandGeneration extends NavigationMixin(LightningElement){

@track balance;
@track totalbalance;
show=false;    
showComponent = false;
columns = VALUE;
@track recordId;
@track data = [];
accSet=[];
recId;
@track DGData=[];
@track dgId;
@track dgname;
@track demandId;
@track disableButton = true;
@track ShowDGComponent;
@track rebateId;
@track profileName = false;
@track secretkey;
@track type;
@track startdate;
@track enddate;
showLoading = false;
DGSpinner = false;

//Custom Labels
label = {
  Demand_Generation,
  Contract_Number,
  Total_Value_R,
  Budget_Balance,
  New,
  close,
  Document_Number_SAP,
  Customer_Name,
  Event_Type,
  Planned_Value_R,
  Actual_Budget_R,
  Status,
  Edit,
  View
};

 @api lWCFunction(isTrueDgCmp,dgrecId)
 {
  //added for Shownig Null Data when Loaded

    this.DGData=[];
    this.dgname = null;
      //console.log('variables are ==>',isTrueDgCmp,dgrecId);
    this.ShowDGComponent = isTrueDgCmp;
    this.DGSpinner = true;
   // console.log('DGSpinner:', this.DGSpinner);
    this.recordId = dgrecId;
    this.dgId=this.recordId;
    //console.log('recordid is amol',this.recordId);

 getSearchDemandGeneration({racId:this.recordId}).then(result=>{
  
   // console.log("Data=",result);
    this.data = result;
    
    this.dgname=this.data.Name;
    this.rebateId=this.data.Id;
    this.type=this.data.Type__c;
    this.startdate=this.data.Start_Date__c;
    this.enddate=this.data.End_Date__c;
    //console.log('type is prashant',this.type);

    // console.log('data name',this.dgname);
     
    if(this.data.Demand_Generations__r != null){
      console.log('inside IF:',JSON.parse(JSON.stringify(this.data.Demand_Generations__r)))

      this.DGData=(JSON.parse(JSON.stringify(this.data.Demand_Generations__r))).map(item=>{
        let hideEditButton = (item.Sub_Status__c != 'Awaiting Realization' ) ? 'hideEditButton' : '';
        return {...item,
                'buttonCss':hideEditButton,
                'DistributorName':item.Distributor__c ? item.Distributor__r.Name:null
        }
      })
   
      console.log('DGDATA IS :',this.DGData );
      // this.DGData = this.DGData.map(row=>{
      //   if(row.Status__c == 'Approved'){
      //     return {...row,Status__c:Approved}
      //   }else if(row.Status__c == 'Rejected'){
      //     return {...row,Status__c:Rejected}
      //   }else if(row.Status__c == 'Pending'){
      //     return {...row,Status__c:Pending}
      //   }
      // })
   
      }
      else{
        this.DGData = [];
      }
      this.DGSpinner = false;
      //console.log('DGSpinner123:', this.DGSpinner);
 })
 }

connectedCallback() {
  // eslint-disable-next-line @lwc/lwc/no-async-operation
  setTimeout(() => {
    this.showLoading = true;
 // console.log('when is loaded:');
  loadStyle(this, modal);
  this.getauthenticationInfo();
  
}, 500);
}

renderedCallback()
{

this.getauthenticationInfo();

}

@wire(getRecord, { recordId: uId, fields: [Userprofile] })
userDetails({ error, data }) {
  if (data) {
   // console.log('profile in wire', data.fields.Profile.displayValue);
    if (data.fields.Profile.displayValue === 'Brazil Sales Person') {
      this.profileName = true;
    }

  } else if (error) {
    this.error = error;
  }
}


/*@wire(fetchAvailableBudget)
AvailableBudget({data, error}){
  if(data){
    console.log('inside AvailableBudget If:',data);
    //Prashant
    this.balance=data.resBudgetAvailable;
    //this.balance='500';
    console.log('inside this.balance==:',this.balance);
    // eslint-disable-next-line radix
    if(parseInt(this.balance) > 0){
      console.log('Inside Budget IF');
      this.disableButton = false;
    }
    else{
      console.log('Inside Budget ELSE ');
      this.disableButton = true;
    }
   
  }
  if(error){
    console.log('inside Error',error);
  }
}*

// (item.Status__c === 'Open' || item.Status__c ==='Pending' || item.Status__c ==='Cancelled' || item.Status__c === 'Rejected' || item.Status__c === 'Draft') ? 'hideEditButton' : '';

//Added By Prashant on 3/8/2023
/*getFetchBalance() {
  fetchAvailableBudget({ authentication: this.secretkey, newRebate: this.recordId }).then((data) => {
    console.log('fetch data is', data);

    this.balance=data.resBudgetAvailable;
     if(parseInt(this.balance) > 0){
      console.log('Inside Budget IF');
      this.disableButton = false;
    }
    else{
      console.log('Inside Budget ELSE ');
      this.disableButton = true;
    }
    
    
  })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      console.log('In Final Block of fetch Balance Method');
    })
}
*/

closeModal(){
this.dispatchEvent(new CloseActionScreenEvent());
this.ShowDGComponent = false;
}

handleClick(){
this.showComponent = true;
}

handleRowAction(event){
const actionName = event.detail.action.name;
const row = event.detail.row;
if(actionName==='View'){
  // console.log('Inside Row Action ',JSON.stringify(row));
  this[NavigationMixin.Navigate]({
    type: 'standard__recordPage',
    attributes: {
        recordId: row.Id,
        actionName: 'view'  
    }
  });
} else if(actionName==='Edit'){
  event.preventDefault();
    this.demandId = row.Id;
    this.handleNavigation(this.rebateId,this.dgname,this.demandId,this.type,this.startdate,this.enddate);
}

}

navigateToEditTab(event) {
event.preventDefault();
this.handleNavigation(this.rebateId,this.dgname,null,this.type,this.startdate,this.enddate);
}

handleNavigation(rebateId,dgName,demandId,type,startdate,enddate){
// console.log('Demand Generation ID is:'+demandId);
// console.log('Type innavigaton',type);
let compDetails = {
    componentDef: "c:demandGeneration",
    attributes: {
      newdgid:rebateId,
      newdgname:dgName,
      newdgdata:demandId,
      newtype:type,
      newstartdate:startdate,
      newenddate:enddate


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

//Integration method Added by Prashant
getauthenticationInfo() {
  getAuthentication({racId:this.recordId}).then((data) => {
    // console.log('secret key is',data);
    this.secretkey=data;
    fetchAvailableBudget({authentication:this.secretkey,newRebate:this.recordId})
    .then(res=>{
      if(res){
        // console.log('inside AvailableBudget If:',res);
        //Prashant
        this.balance=Number(res.resBudgetAvailable).toLocaleString('pt-BR');
        this.totalbalance=Number(res.resTotalValue).toLocaleString('pt-BR');;
        this.showLoading = true;
        // console.log('inside this.balance==:',this.balance);
        // eslint-disable-next-line radix
        if(parseInt(this.balance) > 0){
          // console.log('Inside Budget IF');
          this.disableButton = false;
        }
        else{
          // console.log('Inside Budget ELSE ');
          this.disableButton = true;
        }
       
      }
    })
     
  })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      // console.log('In Final Block of fetch Balance Method');
    })
}


}
/*******************************************************************************************
* @Name         DemandGeneration
* @Author       Prashant Kumbhar <prashant.kumbhar@skinternational.com>
* @Date         13/02/2023
* @Group        SKI
* @Description  This class contains all  methods related to Demand Generation.
*******************************************************************************************/
/* MODIFICATION LOG
* Version          Developer          Date               Description
*-------------------------------------------------------------------------------------------
*  1.0              Prashant         13/02/2023           Initial Creation                                                      
*******************************************************************************************/

public with sharing class DemandGeneration {
   	  public static Integer value=0;
     @AuraEnabled
     public static DemandWrapper getDemandGeneration(String recordId,String rebateId)
     {    
     	     Id userId = userInfo.getUserId();
        	 Profile p = [Select Name from Profile where Id =: userinfo.getProfileid()];       
          	 Territory_Distributor__c  territory =new Territory_Distributor__c ();
         		if(p.Name =='Brazil Sales Person') {
                    System.debug('Profile in Brazil'+p.Name);
         			territory=[SELECT Id, Name, Region__c, TerritoryManager__c,SalesOrg__c, Regional_Manager__c, Regional_Manager_Id__c, Zonal_Manager_Id__c, Zonal_Head__c,Region__r.Marketing_Manager__c FROM Territory_Distributor__c WHERE TerritoryManager__c =:userId
                    AND Sales_org_code__c='5191' limit 1];
                 }
         			else 	{
         			territory=[SELECT Id, Name, Region__c, TerritoryManager__c, SalesOrg__c, Regional_Manager__c, Regional_Manager_Id__c, Zonal_Manager_Id__c, Zonal_Head__c,Region__r.Marketing_Manager__c FROM Territory_Distributor__c
           			where Sales_org_code__c='5191' limit 1];
                 }
        
          	  System.debug('User id is'+territory);
         		String ZonalManager=territory.Zonal_Manager_Id__c;
         	  System.debug('Zonal id is'+ZonalManager);
         		String RegionalManager=territory.Regional_Manager_Id__c;
              System.debug('Regional id is'+RegionalManager);
         		String MarketingUser=territory.Region__r.Marketing_Manager__c;
              System.debug('Marketing User is'+MarketingUser);
         		String MKTAccessUser;
              Rebate_Contract__c rebatedata=new Rebate_Contract__c();
         	  if(rebateId !=null)
              {
              
         		rebatedata=[select id,Name,Type__c from Rebate_Contract__c	 where id=:rebateId];
              }
         	  System.debug('rebatedata is'+rebatedata);
         		User danielFerreira=[Select Id,name from User where name=:'Daniel Ferreira'];
                User danielaMello=[Select Id,name from User where name=:'Daniela Mello'];
         
         

         		if(rebatedata.Type__c=='Up Líder')  {
             		MKTAccessUser=danielFerreira.Id;
                 }
         			else if(rebatedata.Type__c=='Cooper Up') {
             		MKTAccessUser=danielaMello.Id;
                 }
         			else {
             		MKTAccessUser=null;
                 }
         
           
         	 Demand_Generation__c getDemand = new Demand_Generation__c();
          	 DemandWrapper demandwrap=new DemandWrapper();
         
          		if(recordId !=null && recordId !=''){
         			getDemand=[Select id,name,Actual_Budget__c,Balance__c,Budget_Available__c,Contract_Number__c,Credit_Letter__c,Distributor__c,Distributor__r.Name,Document_Number__c,Event_Name__c,Event_Type__c,
                    Important_Information__c,Participate_Profile__c,Payment_to_Supplier__c,Planned_Value__c,SAP_Document_Number__c,Status__c,Sub_Status__c,Total_Value__c,Type__c,Contract_Number__r.Name,Error_Message__c,Zonal_Manager__c,Regional_Manager__c,EventTypeOtherRemark__c,Marketing_Manager__c,Marketing_Access_Manager__c,Event_Date__c,Type1__c from Demand_Generation__c where id=:recordId];
                  
       		 		 System.debug('Reocrd id is'+getDemand.id);
         		 demandwrap.actualBudget=Integer.valueOf(getDemand.Actual_Budget__c);
         		 demandwrap.balance=Integer.valueOf(getDemand.Balance__c);
                 demandwrap.budgetAvailable=Integer.valueOf(getDemand.Budget_Available__c);
                 demandwrap.documentNumber=getDemand.Document_Number__c;
                 demandwrap.eventName=getDemand.Event_Name__c;
                 demandwrap.importantInformation=getDemand.Important_Information__c;
                 demandwrap.participateProfile=getDemand.Participate_Profile__c;
                 demandwrap.SapDocumentNumber=getDemand.SAP_Document_Number__c;
                 demandwrap.totalValue=Integer.valueOf(getDemand.Total_Value__c);
                 demandwrap.creditLetter=getDemand.Credit_Letter__c;
                 demandwrap.eventType=getDemand.Event_Type__c;
                 demandwrap.paymenttoSupplier=getDemand.Payment_to_Supplier__c;
                 demandwrap.status=getDemand.Status__c;     
                 demandwrap.subStatus=getDemand.Sub_Status__c;
                 demandwrap.type=getDemand.Type__c;
                 demandwrap.contractNumber=getDemand.Contract_Number__r.Name;    
                 demandwrap.distributorName=getDemand.Distributor__r.Name;
                 demandwrap.plannedValue=Integer.valueOf(getDemand.Planned_Value__c);
                 demandwrap.id=getDemand.id;
                 demandwrap.contractName=getDemand.Contract_Number__c;
                 demandwrap.distributorId=getDemand.Distributor__c;
                 demandwrap.errorMessage=getDemand.Error_Message__c;
                 demandwrap.otherRemarks=getDemand.EventTypeOtherRemark__c;   
                 demandwrap.eventdate=getDemand.Event_Date__c;
                 demandwrap.newtype=getDemand.Type1__c;
                              
                }  
         			else {
           
         		Integer val=[Select Count()  from Demand_Generation__c where Contract_Number__c=:rebateId]; 
                 demandWrap.countDocumentNumber=val+1;
                 demandwrap.zonalId1=getDemand.Zonal_Manager__c;  
                 demandwrap.regionalId1=getDemand.Regional_Manager__c;
                 demandwrap.marketingId1=getDemand.Marketing_Manager__c;  
                 demandwrap.marketingAcessManager1=getDemand.Marketing_Access_Manager__c;
                    
                    if(ZonalManager !=null || ZonalManager !='') {
              				demandwrap.zonalId=ZonalManager;
                     }
          	 			else {
               				demandwrap.zonalId=null;
                     }
              
          	 		if(RegionalManager !=null || RegionalManager!='') {
             			   demandwrap.regionalId=RegionalManager;
                     }
              			else {
                  		   demandwrap.regionalId=null;
                     }
            
              		if(MarketingUser !=null || MarketingUser!='') {
               				demandwrap.marketingId=MarketingUser;
           			 }
              			else {
                  			demandwrap.marketingId=null;
                     }
             
             		if(MKTAccessUser !=null || MKTAccessUser!='') {
           				    demandwrap.marketingAcessManager=MKTAccessUser;
          			 }
              			else {
                  			demandwrap.marketingAcessManager=null;
              		 }
         			System.debug('Demand value is'+val);
                        
         }
         return demandwrap;
              
     }
    
    /*
    * @Description - This method create and Update Demand Generation Records.
    * @Param - input paramters are wrapper data for updating records.
    * @return  -  result of operation
    */
    
    
     @AuraEnabled
    public static String updateDemandGeneration(String wrapperdata ){
      String result='';
         try{    
             DemandWrapper demandwrap1 =new DemandWrapper();
             demandwrap1=(DemandWrapper)JSON.deserialize(wrapperdata,DemandWrapper.Class);
              	 System.debug('demandwrap1 data is '+JSON.serializePretty(demandwrap1));
             Demand_Generation__c updateDemand = new Demand_Generation__c();
                 updateDemand.Actual_Budget__c=Decimal.valueOf(!String.isEmpty(String.valueof(demandwrap1.actualBudget))  ? demandwrap1.actualBudget :0);
                 updateDemand.Balance__c=Decimal.valueOf(!String.isEmpty(String.valueof(demandwrap1.balance))  ? demandwrap1.balance :0);
                 updateDemand.Budget_Available__c=Decimal.valueOf(!String.isEmpty(String.valueof(demandwrap1.budgetAvailable))  ? demandwrap1.budgetAvailable :0);
                 updateDemand.Document_Number__c=demandwrap1.documentNumber;
                 updateDemand.Event_Name__c=demandwrap1.eventName;
             	 updateDemand.Important_Information__c=demandwrap1.importantInformation;
             	 updateDemand.Participate_Profile__c=demandwrap1.participateProfile;
             	 updateDemand.SAP_Document_Number__c=demandwrap1.SapDocumentNumber;
             	 updateDemand.Total_Value__c=Decimal.valueOf(!String.isEmpty(String.valueof(demandwrap1.totalValue))  ? demandwrap1.totalValue :0);
             	 updateDemand.Credit_Letter__c=demandwrap1.creditLetter;
             	 updateDemand.Event_Type__c=demandwrap1.eventType;
             	 updateDemand.Payment_to_Supplier__c=demandwrap1.paymenttoSupplier;
                 updateDemand.Event_Date__c=demandwrap1.eventdate;
                 updateDemand.Type1__c=demandwrap1.newtype;
                 if(demandwrap1.status=='Rejected')
                 {
                   updateDemand.Status__c='Pending';  
                 }
                 else
                 {
                 updateDemand.Status__c=demandwrap1.status;
                 }
                 updateDemand.Sub_Status__c=demandwrap1.subStatus;
                 updateDemand.Type__c=demandwrap1.type;    
                 updateDemand.Distributor__c=demandwrap1.distributorId;
                 updateDemand.Planned_Value__c=Decimal.valueOf(!String.isEmpty(String.valueof(demandwrap1.plannedValue))  ? demandwrap1.plannedValue :0);   
                 updateDemand.Contract_Number__c=demandwrap1.contractName;
                 updateDemand.Error_Message__c =demandwrap1.errorMessage;
                 updateDemand.EventTypeOtherRemark__c=demandwrap1.otherRemarks;
                    
              		if(demandwrap1.id !=null && demandwrap1.id !='') {
               	 updateDemand.id= demandwrap1.id;
             		System.debug('demand object is'+updateDemand);
             		System.debug('Wrapper id is'+demandwrap1);
            	 update updateDemand; 
                	result = 'success';
                	}
                   	  else {
                 updateDemand.Regional_Manager__c=demandwrap1.regionalId1;
                 updateDemand.Zonal_Manager__c=demandwrap1.zonalId1;
                 updateDemand.Marketing_Manager__c=demandwrap1.marketingId1;
                 updateDemand.Marketing_Access_Manager__c=demandwrap1.marketingAcessManager1;  
                 updateDemand.Status__c=demandwrap1.status;
                 
              insert updateDemand;
                 updateDemand.Status__c='Pending';
              update    updateDemand;
                 result=updateDemand.id;
                 String recordId=updateDemand.id;
                	System.debug('record id in Create case'+recordId);
         }
            }
        	catch(Exception e) {
            System.debug('Exception'+e.getMessage());
            System.debug('Exception val'+e.getCause());
            System.debug('Exception '+e.getLineNumber());
             	result = 'error';
        }
        return result;
    }
    
    
    public class DemandWrapper {
     @AuraEnabled
    public  Integer actualBudget;
     @AuraEnabled
    public  Integer balance;
    @AuraEnabled
    public  Integer budgetAvailable;
    @AuraEnabled
    public  String documentNumber;
    @AuraEnabled
    public  String eventName;
    @AuraEnabled
    public  String importantInformation;
    @AuraEnabled
    public  String participateProfile;
    @AuraEnabled
    public  Integer plannedValue;
    @AuraEnabled
    public  String SapDocumentNumber;
    @AuraEnabled
    public  Integer totalValue; 
    @AuraEnabled
    public  String creditLetter;
    @AuraEnabled
    public  String eventType;
    @AuraEnabled
    public  String paymenttoSupplier;
    @AuraEnabled
    public  String status;
    @AuraEnabled
    public  String subStatus;
    @AuraEnabled
    public  String type;
    @AuraEnabled
    public  String contractNumber;      
    @AuraEnabled
    public  String contractName;      
    @AuraEnabled    
    public  String distributorName;
    @AuraEnabled    
    public  String distributorId;
    @AuraEnabled
    public  String id;
    @AuraEnabled    
    public  String errorMessage;
    @AuraEnabled    
    public  Integer countDocumentNumber;    
    @AuraEnabled    
    public  String regionalId;
    @AuraEnabled    
    public  String zonalId;
    @AuraEnabled    
    public  String regionalId1;
    @AuraEnabled    
    public  String zonalId1;
    @AuraEnabled    
    public  String otherRemarks;
    @AuraEnabled    
    public  String marketingId;
    @AuraEnabled    
    public  String marketingId1;
    @AuraEnabled    
    public  String marketingAcessManager;
    @AuraEnabled    
    public  String marketingAcessManager1;
    @AuraEnabled    
    public  date eventdate;
    @AuraEnabled    
    public  String newtype;
        
        
        
        
        public  DemandWrapper()
        {
           actualBudget=0;                      
           balance= 0;
           budgetAvailable=0;
           documentNumber='';
           eventName='';                     
           importantInformation='';                                 
           participateProfile='';    
           plannedValue=0;
           SapDocumentNumber='';
           totalValue=0;
           creditLetter='';
           eventType='';
           paymenttoSupplier='';
           status='';
           subStatus='';
           type='';
           contractNumber='';
           distributorName='';
            distributorId='';
            errorMessage='';
            countDocumentNumber=0;
            id='';
            regionalId='';
            zonalId='';
            regionalId1='';
            zonalId1='';
            otherRemarks='';
            marketingId='';
            marketingId1='';
            marketingAcessManager='';
            marketingAcessManager1='';
            newtype='';
            
        }
        
                
    }
    
}
@isTest
private class DGTestIntegration {

    @isTest static void testCallout() {
         
        Test.setMock(HttpCalloutMock.class, new DGMockHttpResponseGenerator());
       
        RSOAndDGEndPoint__c endurl =new RSOAndDGEndPoint__c();
        endurl.Name='NamedCredentialUrl';
        endurl.EndPointUrl__c='https://example.com/example/test';
        insert endurl;
        
        RSOAndDGEndPoint__c  endPointurl=new RSOAndDGEndPoint__c();
        endPointurl.Name ='fetchbalanceurl';
        endPointurl.EndPointUrl__c='https://l4097-iflmap.hcisbp.eu1.hana.ondemand.com/http/Fetch_Balance_Budget_Brazil';
        insert endPointurl;
        
        RSOAndDGEndPoint__c  endPointurl1=new RSOAndDGEndPoint__c();
        endPointurl1.Name ='AwaitingRealization';
        endPointurl1.EndPointUrl__c='https://l4097-iflmap.hcisbp.eu1.hana.ondemand.com/http/Awaiting_Realization_Brazil';
        insert endPointurl1;
        
        RSOAndDGEndPoint__c  endPointurl2=new RSOAndDGEndPoint__c();
        endPointurl2.Name ='CreateDemand';
        endPointurl2.EndPointUrl__c='https://l4097-iflmap.hcisbp.eu1.hana.ondemand.com/http/Create_New_Demand_Brazil';
        insert endPointurl2;
        
        RSOAndDGEndPoint__c  endPointurl3=new RSOAndDGEndPoint__c();
        endPointurl3.Name ='RejectCancel';
        endPointurl3.EndPointUrl__c='https://l4097-iflmap.hcisbp.eu1.hana.ondemand.com/http/Reject_Or_Cancel_Demand_Brazil';
        insert endPointurl3;
        
        RSOAndDGEndPoint__c  endPointurl4=new RSOAndDGEndPoint__c();
        endPointurl4.Name ='UpdateActualBudget';
        endPointurl4.EndPointUrl__c='https://l4097-iflmap.hcisbp.eu1.hana.ondemand.com/http/Update_Actual_Budget_Brazil';
        insert endPointurl4;
        
        
        
        User brazil=new User();
        String  ProfileId = [SELECT Id FROM Profile WHERE Name = 'Brazil Sales Person'].Id;
            brazil.LastName = 'ABCD';
            brazil.Email = 'prashant.kumbhar@skinternational.com';
            brazil.Username = 'test@test1.com' + System.currentTimeMillis();
            brazil.CompanyName = 'SK international';
            brazil.Title = 'title';
            brazil.Alias = 'alias';
            brazil.TimeZoneSidKey = 'America/Sao_Paulo';
            brazil.EmailEncodingKey = 'UTF-8';
            brazil.LanguageLocaleKey = 'pt_BR';
            brazil.LocaleSidKey = 'pt_BR';
            brazil.Country = 'Brazil';
            brazil.ProfileId=ProfileId;
            insert brazil;
        
         Sales_Org__c salesOrgObj = new Sales_Org__c();
            salesOrgObj.Name = 'Brazil';            
            salesOrgObj.Company_Code__c = '5190';        
            salesOrgObj.Sales_Org_Code__c = '5191';      
            salesOrgObj.Country_Code__c = 'BR';     
            insert salesOrgObj;
        
          Account accObj = new Account();
            accObj.Name='Prashant Kumbhar';
            accObj.SAP_Code__c = '0001013292';              
            accObj.Last_Name__c = 'ADECO AGROPECUARIA S.A.';     
            accObj.Order_Block__c = false;                       
            accObj.Mobile__c = '9619335445';  
            accObj.Phone='5454545454'; // Mobile
            accObj.Email__c = 'pkumbhar128@gmail.com';       
            accObj.Account_Type__c = 'Sold To Party';           
            accObj.Raise_Order_Type__c = 'Factura';                 
            accObj.Billing_Street_2__c = 'CATAMARCA 3454';      
            accObj.Sales_Org__c = salesOrgObj.id;             
                
            insert accObj;
 
        Rebate_Contract__c reb=new Rebate_Contract__c();
            reb.Name='150';
            reb.Actual_Value__c=15;
            reb.Category_Code__c='1500';
            reb.Sales_Org__c=salesOrgObj.id;
            reb.Type__c='Up Líder';
            insert reb;
       
        Region__c reg=new Region__c();
            reg.Marketing_Manager__c =brazil.id;
            reg.Neglected__c=true;
            reg.SalesOrg__c=salesOrgObj.id;
            insert reg;
        
        Territory_Distributor__c  territory =new Territory_Distributor__c ();
            territory.SalesOrg__c=salesOrgObj.id;
            territory.Region__c=reg.id;
            territory.TerritoryManager__c=brazil.id;    
            insert  territory;
            
        Demand_Generation__c dem=new Demand_Generation__c();
        	dem.Actual_Budget__c=151;
        	dem.Balance__c=692;
        	dem.Budget_Available__c=150;
        	dem.Contract_Number__c=reb.id;
        	dem.Credit_Letter__c='Yes';
            dem.Distributor__c=accObj.id;
            dem.Document_Number__c='12345';
        	dem.Error_Message__c='yes';
        	dem.Event_Name__c='Yes';
        	dem.Event_Type__c='other';
            dem.EventTypeOtherRemark__c='college';
            dem.Important_Information__c='Yes';
        	dem.Marketing_Access_Manager__c=brazil.id;
            dem.Marketing_Manager__c=brazil.id;
            dem.Participate_Profile__c='Sales Person';
            dem.Payment_to_Supplier__c='No';
        	dem.Planned_Value__c=86;
        	dem.Regional_Manager__c=brazil.id;
        	dem.SAP_Document_Number__c='13654';
        	dem.Status__c='Pending';
        	dem.Sub_Status__c='Awaiting MKT Approval';
        	dem.Total_Value__c=158;
        	dem.Type__c='Cooper Up';
        	dem.Zonal_Manager__c=brazil.id;
            dem.Error_Message__c='not';
        	insert dem;
            update dem;
        
      
        List<DGUpdateStatusRealization.UpdateStatusReal> strList = new List<DGUpdateStatusRealization.UpdateStatusReal>();
        DGUpdateStatusRealization.UpdateStatusReal x=new DGUpdateStatusRealization.UpdateStatusReal();
        x.actualBudget='2500';
        x.accesstokan='1234';
        x.contractNumber=reb.id;
        x.demandId=dem.id;
        x.documentNumberSAP='1505';
        x.resErrorMessage='any';
        x.statusAwaitingMKTAccessApproval='A060';
        x.substatus='Awaiting MKT Access Approval';
        strList.add(x);

       List<DGUpdateRejectStatusSap.UpdateStatusRej> updatereject=new List<DGUpdateRejectStatusSap.UpdateStatusRej>();
        DGUpdateRejectStatusSap.UpdateStatusRej ss=new DGUpdateRejectStatusSap.UpdateStatusRej();
        ss.contractNumber=reb.id;
        ss.demandId=dem.id;
        ss.documentNumberSAP='1505';
        ss.status='pending';
        ss.demandId=dem.id;
        updatereject.add(ss);
            
        DGUpdateActualBudget.UpdateActualBudget actual=new DGUpdateActualBudget.UpdateActualBudget();
        actual.actualBudget='2500';
        actual.contractNumber='1505';
        actual.documentNumberSAP='15055';
        
        DGCancelDemandStatus.UpdateStatusRej cancel=new DGCancelDemandStatus.UpdateStatusRej(); 
        cancel.contractNumber='1505';
        cancel.documentNumberSAP='15055';
        cancel.demandId=dem.id;
        
        DemandGeneration.DemandWrapper demwrap=new DemandGeneration.DemandWrapper();
        demwrap.actualBudget=150;
        demwrap.balance=50;
        demwrap.budgetAvailable=25;
        demwrap.contractName='1013';
        demwrap.documentNumber='1013';
        demwrap.eventName='Yes';
        demwrap.importantInformation='Yes';
        demwrap.participateProfile='New';
        demwrap.plannedValue=50;
        demwrap.SapDocumentNumber='150';
        demwrap.totalValue=150;
        demwrap.creditLetter='No';
        demwrap.eventType='Other';
        demwrap.paymenttoSupplier='No';         
        demwrap.status='Pending';
        demwrap.subStatus='Awaiting MKT Approval';
        demwrap.type='Credit';
        demwrap.distributorName='Prashant';
        demwrap.contractNumber='150';
        demwrap.distributorId='150';
        demwrap.errorMessage='Not any';
        demwrap.countDocumentNumber=15031;
        demwrap.regionalId='1501';
        demwrap.zonalId='150';
        demwrap.regionalId1='150';
        demwrap.zonalId1='150';
        demwrap.otherRemarks='150';
        demwrap.marketingId='150';
        demwrap.marketingId1='150';
        demwrap.marketingAcessManager='150';
        demwrap.marketingAcessManager1='150';
        demwrap.eventdate=Date.valueOf('2022-05-05');
        demwrap.newtype='150';
        
        String js=JSON.serializePretty(demwrap);
        
        
        DGUpdateStatusRealization.updateStatusRealization(strList);
        
        DGUpdateRejectStatusSap.updateStatusRejected(updatereject);
        
        DGUpdateActualBudget.updateActualBudget(actual.contractNumber,actual.documentNumberSAP,actual.actualBudget,dem.id);
        DGCancelDemandStatus.dgCancelDemand(cancel.contractNumber,cancel.documentNumberSAP,cancel.demandId);
        ServiceHelper.getAuthentication('1013');
        DGFetchCreate.fetchandCreateDG(js);
        }
     

    
    
    
    
    
}
public class DGUpdateStatusRealization {
    
    @invocableMethod(label='getStatus')
    public static void  updateStatusRealization(List<UpdateStatusReal> wrapper1){
        
	    String wrapper=JSON.serialize(wrapper1);
        UpdateStatus(wrapper);
         
	}
	
    
     public class UpdateStatusReal {
      @InvocableVariable
      public String contractNumber ;
      @InvocableVariable
      public String documentNumberSAP ;
      @InvocableVariable
      public String statusAwaitingMKTAccessApproval ;
       @InvocableVariable
      public String substatus ;  
         @InvocableVariable
      public String resErrorMessage ;
         @InvocableVariable
      public String actualBudget ;
      @InvocableVariable
      public String accesstokan ;
      @InvocableVariable
      public String demandId ;
                    
         
     
     }
    
    @future(callout=true)
    public static void UpdateStatus(String paramter)
    {
        List<UpdateStatusReal> wrapper1=(List<UpdateStatusReal>)JSON.deserialize(paramter, List<UpdateStatusReal>.class);
        UpdateStatusReal  wrapper= wrapper1[0];
        
        System.debug('wrapper data is'+wrapper);
        String authentication='';
        RSOAndDGEndPoint__c  endPointurl=new RSOAndDGEndPoint__c();
        endPointurl=[select EndPointUrl__c from RSOAndDGEndPoint__c where Name=:'NamedCredentialUrl'];
        String endurl=endPointurl.EndPointUrl__c;
        System.debug('End Point URl is'+endPointurl.EndPointUrl__c);
             
      List<Rebate_Contract__c> rebate1=[select Name from Rebate_Contract__c where id=:wrapper.contractNumber];
        Rebate_Contract__c  rebate=rebate1[0];    
        
        System.debug('recid is'+rebate.Name);
        String record=rebate.Name;
        String newRebate=record.leftPad(10, '0');
        System.debug('newRebate value is'+newRebate);
        
        IF(newRebate !=null)
        {
      	HttpRequest req = new HttpRequest();
		req.setEndpoint(endurl);
		req.setMethod('POST');
		Http http = new Http();
		HTTPResponse res = http.send(req);
			System.debug(res.getBody());  
        	System.debug('response is'+res.getBody());
        	System.debug('Status Code'+res.getStatusCode());
        Map<String, Object> result = (Map<String, Object>)JSON.deserializeUntyped(res.getBody());
        String accessToken=''; 
        System.debug('Access tokan is'+accessToken);
        
        if(res.getStatusCode()==200)
        {
            System.debug('Authenticaation Successfull');
            accessToken=(String)result.get('access_token');
            if(accessToken !=null || accessToken !='')
            {
            authentication=accessToken;
            System.debug('access tokan is'+authentication);
            }
            else
            {
            authentication='ErrorAccessTokan';
            }   
        }
        else
        { 
          	System.debug('Authentication fail');  
            authentication='Error';
        }
        
     
        String accesstokan=authentication;
         UpdateStatusReal x1=new UpdateStatusReal();
         x1.contractNumber=newRebate;
         x1.statusAwaitingMKTAccessApproval='A050';
         x1.documentNumberSAP=wrapper.documentNumberSAP;   
        System.debug('wrapperinupate1'+x1);
            
        String str=JSON.serialize(x1);
        System.debug('wrapperinupate2'+str);
        RSOAndDGEndPoint__c  endPointurl1=new RSOAndDGEndPoint__c();
        endPointurl1=[select EndPointUrl__c from RSOAndDGEndPoint__c where Name=:'AwaitingRealization'];
        String endurl1=endPointurl1.EndPointUrl__c;
        
            
        Http http1 = new Http();    
        HttpRequest req1 = new HttpRequest();
        req1.setEndpoint(endurl1);
        req1.setMethod('GET');
        req1.setHeader('Content-Type', 'application/json;charset=UTF-8');
        req1.setHeader('Authorization','Bearer '+accesstokan); 
        req1.setBody(str);
     
        HttpResponse res1 =  http.send(req1);
        
        System.debug('result in update status is111'+res1.getBody());
      String   userId=userInfo.getUserId();
        //ApexLog x=new ApexLog();
        ApexLog.webServiceLogDGSOR(req1.getBody(),res1.getBody(),res1.getStatusCode(),'DGUpdateStatusRealization','UpdateStatus',wrapper.demandId,userId);
            
            
        Map<String, Object> result2 = (Map<String, Object>)JSON.deserializeUntyped(res1.getBody());
        
        String contractNumber1 =(String)result2.get('contractNumber');
        String documentNumberSAP1 =(String)result2.get('documentNumberSAP');
        String error =(String)result2.get('errorMessage');
        String Status=(String)result2.get('statusAwaitingRealization');
        System.debug('Status is'+Status);
        List<UpdateStatusReal> wrapafterres1=new  List<UpdateStatusReal>();   
        UpdateStatusReal wrapafterres=new  UpdateStatusReal();
        if(status=='A060')
        {
        wrapafterres.substatus='Awaiting Realization';    
        }
        else
        {
            System.debug('In Else PArt');
            wrapafterres.resErrorMessage=error;
        
        }
     
         wrapafterres1.add(wrapafterres);
        System.debug('After end wrapper is'+wrapafterres1);
            
        Demand_Generation__c demand=new Demand_Generation__c();
        demand.Id=wrapper.demandId;
        demand.Sub_Status__c=wrapafterres.substatus;
        update  demand;
        System.debug('Demand status changed by Code');
            
        
    }
    }
    
}
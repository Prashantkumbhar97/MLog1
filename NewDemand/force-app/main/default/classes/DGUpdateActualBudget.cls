public class DGUpdateActualBudget {
  @AuraEnabled
public static String  updateActualBudget(String contractNumber,String documentNumberSAP,String actualBudget,String demandId){
         
        String newresult='';
   	    System.debug('contact is'+contractNumber +'actual is'+actualBudget);   
        String authentication='';
        RSOAndDGEndPoint__c  endPointurl=new RSOAndDGEndPoint__c();
        endPointurl=[select EndPointUrl__c from RSOAndDGEndPoint__c where Name=:'NamedCredentialUrl'];
        String endurl=endPointurl.EndPointUrl__c;
        System.debug('End Point URl is'+endPointurl.EndPointUrl__c);
         
        //Rebate_Contract__c rebate=[select Name from Rebate_Contract__c where id=:contractNumber];
        //System.debug('recid is'+rebate.Name);
        //String record=rebate.Name;
        String newRebate=contractNumber.leftPad(10, '0');
        System.debug('newRebate value is'+newRebate);
            
        
      	HttpRequest req = new HttpRequest();
		req.setEndpoint(endurl);
		req.setMethod('POST');
		Http http = new Http();
        HTTPResponse res =new HTTPResponse();
        if(!test.isRunningTest())
        {
		 res = http.send(req);
        }
         //Craeting fake response for test class
         else if(test.isRunningTest())
         {
        
           res.setHeader('Content-Type', 'application/json');
           res.setBody('{"example":"test"}');
           res.setStatusCode(200);
        
             
         }
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
            }
            else
            {
            authentication='ErrorAccessTokan';
            }   
        }
        
       
       UpdateActualBudget wrapafterres1=new  UpdateActualBudget();
       /* wrapafterres1.contractNumber='1013';
        wrapafterres1.documentNumberSAP='1013-E003';
        wrapafterres1.actualBudget='2500';
       */
        
        wrapafterres1.contractNumber=newRebate;
        wrapafterres1.documentNumberSAP=documentNumberSAP;
        wrapafterres1.actualBudget=actualBudget;
         
    
        String str=JSON.serializePretty(wrapafterres1);
       RSOAndDGEndPoint__c  endPointurl1=new RSOAndDGEndPoint__c();
        endPointurl1=[select Name,EndPointUrl__c from RSOAndDGEndPoint__c where Name=:'UpdateActualBudget'];
        String endurl1=endPointurl1.EndPointUrl__c;
        
        
        Http http1 = new Http();    
        HttpRequest req1 = new HttpRequest();
        req1.setEndpoint(endurl1);
        req1.setMethod('GET');
        req1.setHeader('Content-Type', 'application/json;charset=UTF-8');
        
        req1.setHeader('Authorization','Bearer '+authentication); 
        req1.setBody(str);
        HttpResponse res1=new HttpResponse();
        if(!test.isRunningTest())
        {
         res1 =  http.send(req1);
        }
       //Creating Fake respone 
        else if(test.isRunningTest())
        {
          
        // Create a fake response
        res1.setHeader('Content-Type', 'application/json');
        res1.setBody('{"example":"test"}');
        res1.setStatusCode(200);
        }
        
        String   userId=userInfo.getUserId();
        //Calling Monitor Log
        ApexLog.webServiceLogDGSOR(req1.getBody(),res1.getBody(),res1.getStatusCode(),'DGUpdateActualBudget','updateActualBudget',demandId,userId);

    
        System.debug('result in update status is New'+JSON.serializePretty(res1.getBody()));
        Map<String, Object> result2 = (Map<String, Object>)JSON.deserializeUntyped(res1.getBody());
        String result1 =(String)result2.get('result');
        String error =(String)result2.get('errorMessage');
        
           
          Demand_Generation__c demand=new Demand_Generation__c();
           if(result1=='A070')
         {
             demand.Sub_Status__c='Realization';
             demand.Actual_Budget__c=Decimal.valueof(actualBudget);
             demand.Id=demandId;
             update demand;
             System.debug('update demand is'+demand);
             newresult='Success';
         }
         else if(error !=null)
         {
             demand.Error_Message__c=error;
             newresult='Error';
         }
         System.debug('newreusltis'+newresult);
		return newresult;
	}
    
    public class UpdateActualBudget {
      @AuraEnabled
      public String contractNumber ;
      @AuraEnabled
      public String documentNumberSAP ;
       @AuraEnabled
      public String actualBudget ;
                     
     }    
    
    
    
    
    
    
}
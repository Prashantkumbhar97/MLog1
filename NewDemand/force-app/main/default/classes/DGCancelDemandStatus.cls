public class DGCancelDemandStatus {
  @AuraEnabled
public static String  dgCancelDemand(String contractNumber,String documentNumberSAP,String demandId){
      	String result1='';
     	String authentication='';
        RSOAndDGEndPoint__c  endPointurl=new RSOAndDGEndPoint__c();
        endPointurl=[select EndPointUrl__c from RSOAndDGEndPoint__c where Name=:'NamedCredentialUrl'];
        String endurl=endPointurl.EndPointUrl__c;
        System.debug('End Point URl is'+endPointurl.EndPointUrl__c);
             
        System.debug('recid is'+contractNumber);
        String record=contractNumber;
        String newRebate=record.leftPad(10, '0');
        System.debug('newRebate value is'+newRebate);
        
        IF(newRebate !=null)
        {
      	HttpRequest req = new HttpRequest();
		req.setEndpoint(endurl);
		req.setMethod('POST');
		Http http = new Http();
        HTTPResponse res =new HTTPResponse();
        if(!test.isRunningTest())
        {
		 res = http.send(req);
        }
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
         UpdateStatusRej x1=new UpdateStatusRej();
       /*  x1.contractNumber='1013';
         x1.documentNumberSAP='1013-E002'; 
         x1.status='A090';
         */   
         x1.contractNumber=newRebate;
         x1.documentNumberSAP=documentNumberSAP; 
         x1.status='A090';
            
            
        System.debug('wrapperinupate1'+x1);
            
        String str=JSON.serialize(x1);
        System.debug('wrapperinupate2'+str);
        
         RSOAndDGEndPoint__c  endPointurl1=new RSOAndDGEndPoint__c();
        endPointurl1=[select EndPointUrl__c from RSOAndDGEndPoint__c where Name=:'RejectCancel'];
        String endurl1=endPointurl1.EndPointUrl__c;
           
            
        Http http1 = new Http();    
        HttpRequest req1 = new HttpRequest();
        req1.setEndpoint(endurl1);
        req1.setMethod('GET');
        req1.setHeader('Content-Type', 'application/json;charset=UTF-8');
        req1.setHeader('Authorization','Bearer '+accesstokan); 
        req1.setBody(str);
        HttpResponse res1=new HttpResponse();
            if(!test.isRunningTest())
            {
         res1 =  http.send(req1);
            }
        else if(test.isRunningTest())
        {
           res1.setHeader('Content-Type', 'application/json');
           res1.setBody('{"example":"test"}');
           res1.setStatusCode(200);
        
        }
         String   userId=userInfo.getUserId();
        //Calling Monitor Log
        ApexLog.webServiceLogDGSOR(req1.getBody(),res1.getBody(),res1.getStatusCode(),'DGCancelDemandStatus','dgCancelDemand',demandId,userId);

        System.debug('result in update status is111'+res1.getBody());
        Map<String, Object> result2 = (Map<String, Object>)JSON.deserializeUntyped(res1.getBody());
        
        String contractNumber1 =(String)result2.get('contractNumber');
        String documentNumberSAP1 =(String)result2.get('documentNumberSAP');
        String error =(String)result2.get('errorMessage');
        System.debug('error is'+error);
            
         if(error ==null || error =='')
         {
             result1='success';
         }
            else
            {
                Demand_Generation__c demand=new Demand_Generation__c();
                demand.Id=demandId;
                demand.Error_Message__c=error;
                update demand;
                result1='error';
                System.debug('Demand status changed by Code');
        
            }
        
    }
    return result1;
    }
    
    public class UpdateStatusRej {
      @AuraEnabled
      public String contractNumber ;
      @AuraEnabled
      public String documentNumberSAP ;
       @AuraEnabled
      public String status ;
      @AuraEnabled
      public String demandId ;
      @AuraEnabled
      public String contractId ;
                     
     }    
    
    
}
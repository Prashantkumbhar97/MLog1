public class DGUpdateRejectStatusSap {
    
    @invocableMethod(label='getrejectStatus')
    public static void  updateStatusRejected(List<UpdateStatusRej> wrapper1){
    String wrapper=JSON.serialize(wrapper1);
        UpdateStatus(wrapper);
        
    
    }
    public class UpdateStatusRej {
      @InvocableVariable
      public String contractNumber ;
      @InvocableVariable
      public String documentNumberSAP ;
       @InvocableVariable
      public String status ;
      @InvocableVariable
      public String demandId ;
      @InvocableVariable
      public String contractId ;
                     
     }    
    
     @future(callout=true)
    public static void UpdateStatus(String paramter)
    {
        List<UpdateStatusRej> wrapper1=(List<UpdateStatusRej>)JSON.deserialize(paramter, List<UpdateStatusRej>.class);
        UpdateStatusRej  wrapper= wrapper1[0];
        
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
            
         
        String   userId=userInfo.getUserId();
        
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
      /*   x1.contractNumber='1013';
         x1.documentNumberSAP='1013-E002'; 
         x1.status='A090';
        */ 
            
         x1.contractNumber=newRebate;
         x1.documentNumberSAP=wrapper.documentNumberSAP; 
         x1.status='A090';
            
            
            
        System.debug('wrapperinupate1'+x1);
            
        String str=JSON.serialize(x1);
        System.debug('wrapperinupate2'+str);
        RSOAndDGEndPoint__c  endPointurl1=new RSOAndDGEndPoint__c();
        endPointurl1=[select Name,EndPointUrl__c from RSOAndDGEndPoint__c where Name=:'RejectCancel'];
        String endurl1=endPointurl1.EndPointUrl__c;
        System.debug('endurl is'+endurl1);
              
        Http http1 = new Http();    
        HttpRequest req1 = new HttpRequest();
        req1.setEndpoint(endurl1);
        req1.setMethod('GET');
        req1.setHeader('Content-Type', 'application/json;charset=UTF-8');
        req1.setHeader('Authorization','Bearer '+accesstokan); 
        req1.setBody(str);
     
        HttpResponse res1 =  http.send(req1);
        
        System.debug('result in update status is111'+res1.getBody());
         //Calling Monitor Log
        ApexLog.webServiceLogDGSOR(req1.getBody(),res1.getBody(),res1.getStatusCode(),'DGUpdateRejectStatusSap','UpdateStatus',wrapper.demandId,userId);
        
        Map<String, Object> result2 = (Map<String, Object>)JSON.deserializeUntyped(res1.getBody());
        
        String contractNumber1 =(String)result2.get('contractNumber');
        String documentNumberSAP1 =(String)result2.get('documentNumberSAP');
        String error =(String)result2.get('errorMessage');
        System.debug('error is'+error);
            
        Demand_Generation__c demand=new Demand_Generation__c();
        demand.Id=wrapper.demandId;
        demand.Error_Message__c=error;
        update  demand;
        System.debug('Demand status changed by Code');
            
        
    }
    }
    
}
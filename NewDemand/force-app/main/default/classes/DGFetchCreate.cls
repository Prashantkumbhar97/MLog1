public class DGFetchCreate {
    @AuraEnabled
    public static fetchbudgetandCreate fetchandCreateDG(String wrapperdata)
    { 
             DemandGeneration.DemandWrapper demandwrap1 =new DemandGeneration.DemandWrapper();
             demandwrap1=(DemandGeneration.DemandWrapper)JSON.deserialize(wrapperdata,DemandGeneration.DemandWrapper.Class);
               System.debug('demandwrap1 data is '+JSON.serializePretty(demandwrap1));           
        
         String eventcode='';
        if(demandwrap1.eventType=='Campaigns (demand generation, sell-out, exclusive PTC)')
        {
            eventcode='E010';
        }
        else if(demandwrap1.eventType=='Events (Fairs, Conventions, Field Day, etc.)')
        {
            eventcode='E020';
        }
        else if(demandwrap1.eventType=='Frontage')
        {
            eventcode='E030';
        }
        else if(demandwrap1.eventType=='Internal Materials')
        {
            eventcode='E040';
        }
        else if(demandwrap1.eventType=='Work material (rain gauges, weather stations, shirts, hats, etc.)')
        {
            eventcode='E050';
        }
        else if(demandwrap1.eventType=='Plotting')
        {
            eventcode='E060';
        }
        else if(demandwrap1.eventType=='Training (lectures, consultations)')
        {
            eventcode='E070';
        }
        else if(demandwrap1.eventType=='Others')
        {
            eventcode='E080';
        }
        string dateStr1='';
        if(demandwrap1.eventdate !=null)
        {
        Date d = demandwrap1.eventdate;
        dateStr1 = DateTime.newInstance(d.year(),d.month(),d.day()).format('yyyy-MM-dd'); 
        system.debug('//dateStr1' + dateStr1);
        }
         String authentication='';
        RSOAndDGEndPoint__c  endPointurl=new RSOAndDGEndPoint__c();
        endPointurl=[select EndPointUrl__c from RSOAndDGEndPoint__c where Name=:'NamedCredentialUrl'];
        String endurl=endPointurl.EndPointUrl__c;
        System.debug('End Point URl is'+endPointurl.EndPointUrl__c);
             
        Rebate_Contract__c rebate=[select Name from Rebate_Contract__c where Name=:demandwrap1.contractNumber];
        System.debug('recid is'+rebate.Name);
        String record=rebate.Name;
        String newRebate=record.leftPad(10, '0');
        System.debug('newRebate value is'+newRebate);
        
        
      	HttpRequest req = new HttpRequest();
		req.setEndpoint(endurl);
		req.setMethod('POST');
		Http http = new Http();
        
        HTTPResponse res=new HTTPResponse();
         if(!test.isRunningTest())
        {
         res =  http.send(req);
            System.debug('in ftch');
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
            }
            else
            {
            authentication='ErrorAccessTokan';
            }   
        }
        
        //Check for budget available
        
        
        fetchbudgetandCreate wrap11=new  fetchbudgetandCreate();
        wrap11.contractNumber=newRebate;
        wrap11.distributorSAPCode='5190';
        String str=JSON.serializePretty(wrap11);
        
        System.debug('wrapper serialze11 string is after' +JSON.serializePretty(wrap11));
        
        RSOAndDGEndPoint__c  endPointurl1=new RSOAndDGEndPoint__c();
        endPointurl1=[select EndPointUrl__c from RSOAndDGEndPoint__c where Name=:'fetchbalanceurl'];
        String endurl1=endPointurl1.EndPointUrl__c;
        
        Http http1 = new Http();    
        HttpRequest req1 = new HttpRequest();
        req1.setEndpoint(endurl1);
        req1.setMethod('GET');
        req1.setHeader('Content-Type', 'application/json;charset=UTF-8');
        req1.setHeader('Authorization','Bearer '+authentication); 
        req1.setBody(str);
        
        
        
        HTTPResponse res1=new HTTPResponse();
         if(!test.isRunningTest())
        {
         res1 =  http.send(req1);
            System.debug('in ftch');
        }
        else if(test.isRunningTest())
        {
           res1.setHeader('Content-Type', 'application/json');
           res1.setBody('{"example":"test"}');
           res1.setStatusCode(200);
        
        }
        System.debug('result is'+res1.getBody());
   		Map<String, Object> result1 = (Map<String, Object>)JSON.deserializeUntyped(res1.getBody());
        String totalValue =(String)result1.get('totalValue');
        String budgetAvailable =(String)result1.get('budgetAvailable');
        String errorMessage =(String)result1.get('errorMessage');
        
        System.debug('budgetAvailable value is'+budgetAvailable);
         if(test.isRunningTest())
        {
            budgetAvailable='500';
        }
        //Creatin Demand Generation
        fetchbudgetandCreate retuntype=new fetchbudgetandCreate();
        
        if(budgetAvailable !=null)
        {    
            Date dToday = Date.today();
			String month=String.valueof(dToday.month());
			String date11=String.valueof(dToday.day());
			String dateStr = dToday.year() + '-' + month.leftPad(2,'0') + '-' +date11.leftPad(2,'0') ; 
           String   userId=userInfo.getUserId();
            
           User username=[SELECT Username FROM User where Id=:userId limit 1];
           System.debug('Username is'+username.Username);    
            
           DateTime x=System.now();
           System.debug('x is'+x);
           String dgtime=x.format('HH:mm:ss');
 
            
            fetchbudgetandCreate fetch=new fetchbudgetandCreate();
           
            fetch.companyCode='5190';
            fetch.contractNumber=newRebate;
            fetch.documentNumberSFDC=demandwrap1.documentNumber;
            fetch.eventName=demandwrap1.eventName;
            fetch.eventDate=dateStr1;
            fetch.eventType=eventcode;
            fetch.plannedValue=String.valueof(demandwrap1.plannedValue);
           // fetch.creditLetter=demandwrap1.creditLetter;
            //fetch.paymentToSupplier=demandwrap1.paymenttoSupplier;
            fetch.creditLetter='';
            fetch.paymentToSupplier='';
            fetch.createdBy=username.Username;
            fetch.createdDate=dateStr;
            fetch.createdTime=dgtime;
            fetch.typeOfEvent=demandwrap1.eventType;
             
            System.debug('fetch is'+fetch);
            
            RSOAndDGEndPoint__c  endPointurl2=new RSOAndDGEndPoint__c();
            endPointurl2=[select EndPointUrl__c from RSOAndDGEndPoint__c where Name=:'CreateDemand'];
        	String endurl2=endPointurl2.EndPointUrl__c;
        
            
            
           String fetchdata=JSON.serializePretty(fetch);
           Http http2 = new Http();    
          	HttpRequest req2 = new HttpRequest();
          	req2.setEndpoint(endurl2);
        	req2.setMethod('GET');
        	req2.setHeader('Content-Type', 'application/json;charset=UTF-8');
        	req2.setHeader('Authorization','Bearer '+authentication); 
        	req2.setBody(fetchdata);
            
        HTTPResponse res2=new HTTPResponse();
         if(!test.isRunningTest())
        {
         res2 =  http.send(req2);
            System.debug('in ftch');
        }
        else if(test.isRunningTest())
        {
           res2.setHeader('Content-Type', 'application/json');
           res2.setBody('{"example":"test"}');
           res2.setStatusCode(200);
        
        }	
            System.debug('result is'+res2.getBody());
            
         
        //Calling Monitor Log
        ApexLog.webServiceLogDGSOR(req2.getBody(),res2.getBody(),res2.getStatusCode(),'DGFetchCreate','fetchandCreateDG',null,userId);
      
   		Map<String, Object> result2 = (Map<String, Object>)JSON.deserializeUntyped(res2.getBody());
        String companyCode =(String)result2.get('companyCode');
        String contactnumber =(String)result2.get('contactnumber');
        String documentNumberSFDC =(String)result2.get('documentNumberSFDC');
        String documentNumberSAP =(String)result2.get('documentNumberSAP'); 
       // String documentNumberSAP='10135';    
        String errorMessage1 =(String)result2.get('errorMessage');
        System.debug('error message in create'+errorMessage1);
        System.debug('documentNumberSAP in create is'+documentNumberSAP);    
            if(documentNumberSAP !=null && documentNumberSAP !='')
            {
                retuntype.documentNumberSAP=documentNumberSAP;
                retuntype.errormessage='Successcreate';
                
            }
            else
            {
                retuntype.errormessage='ErrorInetgration';
                retuntype.errorresponse=errorMessage1;
            }
            
        }
        else
        {
            retuntype.errormessage='budgetnotavailable';
        }
        System.debug('return type is'+retuntype);
        
        System.debug('return type is2'+retuntype);
        
        return retuntype;
        
        
       
        
    }
    
 public class fetchbudgetandCreate {
      @AuraEnabled
      public String contractNumber ;
      @AuraEnabled
      public String distributorSAPCode ;
      @AuraEnabled
      public String companyCode ;
      @AuraEnabled
      public String documentNumberSFDC ;  
     @AuraEnabled
      public String eventName ;
      @AuraEnabled
      public String eventDate ;
      @AuraEnabled
      public String plannedValue ;
      @AuraEnabled
      public String creditLetter ;
      @AuraEnabled
      public String paymentToSupplier ;
      @AuraEnabled
      public String createdBy ;
      @AuraEnabled
      public String createdDate ;
      @AuraEnabled
      public String createdTime ;
     @AuraEnabled
      public String typeOfEvent ;
      @AuraEnabled
      public String resTotalValue ;
       @AuraEnabled
      public String resBudgetAvailable ;
       @AuraEnabled
      public String errormessage ;
     @AuraEnabled
      public String errorresponse ;
     @AuraEnabled
      public String documentNumberSAP ;
     @AuraEnabled
      public String eventType ;
     
     
     
                     
     }	 	
	   
    

}
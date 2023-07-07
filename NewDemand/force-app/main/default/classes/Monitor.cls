/**
 * @description       : The Monitor class is used to store data in Monitor Log object.
 *                      As well as used to reload data from file.                     
 * @author            : prashant.kumbhar@skinternational.com
 * @group             : 
 * @last modified on  : 06-23-2023
 * @last modified by  :  prashant.kumbhar@skinternational.com
**/



global without Sharing class Monitor {
    
  /** 
     * @description: Create Monitor record for Integration class. 
     * @param request: Used to store http request in Monitor log.
     * @param response: Used to  store http response in Monitor log.
     * @param statusCode: Used to store status code in Monitor log.
     * @param apexClass: Used to store apex class name in Monitor Log.
     * @param recordId: Used to store recordId in Monitor Log.
     * @param module: Used to store module name on which we are working like Account, Sales order etc.
     * @param userId: Used to store logged in user information.
     * @param message: Used to store error or success message in Monitor Log.
     * @param typeOfIntegration: Used to store Type of Integration Inboun or outbound in Monitor Log.
     * @param method: Used to store method in Monitor Log.
     * @param requestURL: Used to store request url in Monitor Log.
     * @param remoteAddress: Used to store remote address in Monitor Log.
     * @param headers: Used to store headers in Monitor Log.
     * @param dataSource: Used to store data source in Monitor Log.
     * @param externalSystemName: Used to store external System name in Monitor Log.
     * @return void.
     * @throws Exception if an error occurs during the execution.
     */
   
    global static void requestResponseLog(String request, String response,String statusCode,String apexClass,String recordId,String module,String userId,
                                          String message,String typeOfIntegration,String method,String requestURL,String remoteAddress,String headers,
                                         String dataSource,String externalSystemName)
    {
        String recordtypeId= Schema.SObjectType.Monitor_Log__c.getRecordTypeInfosByName().get('Log').getRecordTypeId();
        DateTime todayDate=DateTime.now();
        Monitor_Log__c monObj = new Monitor_Log__c();
        monObj.Request_JSON__c=request;
        monObj.Response_JSON__c=response;
        monObj.Status_Code__c=statusCode;
        monObj.Apex_Class__c=apexClass;
        monObj.RecordId__c=recordtypeId;
        monObj.Module__c=module;
        monObj.Loggin_User__c=userId;
      //  monObj.Notification__c=notification;
        monObj.Error_Message__c=message;
        //monObj.Notification_Email__c=emailId;
        monObj.Date_Time__c=todayDate;
        monObj.RecordTypeId=recordtypeId;
        monObj.Record_Type__c='Log';
        monObj.Type_Of_Integration__c=typeOfIntegration;
        monObj.Method__c=method;
        monObj.Request_URL__c=requestURL;
        monObj.Remote_Address__c=remoteAddress;
        monObj.Headers__c=headers;
        monObj.Data_Source__c=dataSource;
        monObj.External_System_Name__c=externalSystemName;
            
        insert monObj;
        
        DateTime d = DateTime.Now() ;
        String dateString =  d.format('dd/MM/yyyy hh:mm a') ;
        System.debug(dateString);
        
        Attachment attObj = new Attachment();
        attObj.Name = 'Request '+dateString+'.csv';
        attObj.Body = Blob.valueOf(request);
        attObj.ParentId = monObj.Id;
        insert attObj;
        System.debug('Attachet is'+attObj);        
        Attachment attObj2 = new Attachment();
        attObj2.Name = 'Response '+dateString+'.csv';
        attObj2.Body = Blob.valueOf(response);
        attObj2.ParentId = monObj.Id;
        insert attObj2;
    }
    
  /**
     * @description: Create Monitor record for Normal class.
     * @param apexClass: Used to store apex class name in Monitor Log.
     * @param recordId: Used to store recordId in Monitor Log.
     * @param module: Used to store module name on which we are working like Account, Sales order etc.
     * @param userId: Used to store logged in user information.
     * @param message: Used to store error or success message in Monitor Log.
     * @param method: Used to store method in Monitor Log.
     * @param headers: Used to store headers in Monitor Log.
     * @return void.
     */
  
    
    global static void log(String apexClass,String recordId,String module,String userId,String message,String method,String headers)
    {
        Monitor_Log__c monObj = new Monitor_Log__c();
        monObj.Apex_Class__c=apexClass;
        monObj.RecordId__c=recordId;
        monObj.Module__c=module;
        monObj.Loggin_User__c=userId;
      //  monObj.Notification__c=notification;
        monObj.Error_Message__c=message;
        //monObj.Notification_Email__c=emailId;
        monObj.Record_Type__c='Log';
        monObj.Method__c=method;
        monObj.Headers__c=headers;
        insert monObj;    
    }
    
    
    
    /**
     * @description: This method is used to create record in MonitorLog for Exception Handling 
     * @param exObj: Used to store exception error in Monitor log.
     * @param recordId: Used to store recordId in Monitor Log.
     * @param request: Used to store http request in Monitor log.
     * @param response: Used to  store http response in Monitor log.
     * @param apexClass: Used to store apex class name in Monitor Log.
     * @param method: Used to store module name on which we are working like Account, Sales order etc.
     * @return: void.
     */
  
    
    
    global static void exceptionHandler(Exception exObj,String recordId, String request,String response,String apexClass,String method,String headers){
        
        Monitor_Log__c monObj = new Monitor_Log__c(); 
        if(exObj!=null){
            monObj.Error_Message__c = exObj.getMessage();
            String trace = exObj.getStackTraceString().substringAfter('\n');
            monObj.Module__c = getClassName(trace);
            monObj.Request_JSON__c=request;
            monObj.Response_JSON__c=response;
            monObj.RecordId__c=recordId; 
            monObj.Loggin_User__c = UserInfo.getUserId();
           // monObj.Notification_Email__c=emailId;
            monObj.Record_Type__c='Log';
            monObj.Apex_Class__c=apexClass;
            monObj.Method__c=method;
            monObj.Headers__c=headers;
        
            insert monObj;              
        }     
    }
    
    /**
* @description - This method is used to reload records in MonitorLog from File. 
* @param String -monitorId
* @return  -    void
*/         
    global static void reloadRecords(String monitorId){    
        try{
            //Getting Content Document link based on Object Id. 
            ContentDocumentLink link=[select Id, LinkedEntityId, ContentDocumentId FROM ContentDocumentLink where LinkedEntityId=:monitorId];
            //Getting Content Version based on Content Document Id.
            ContentVersion con=[select Title, ContentDocumentId,VersionData from ContentVersion where ContentDocumentId=:link.ContentDocumentId];
            String stringBody = con.VersionData.tostring();
            list<String> filelines = stringBody.split('\n');
            list<Monitor_Log__c> monitorInsert = new list<Monitor_Log__c>();
            for (Integer i=1;i<filelines.size();i++)
            {
                list<String> columnValues = new list<String>();
                columnValues = filelines[i].split(',');
                system.debug('->'+columnValues);
                Monitor_Log__c a = new Monitor_Log__c();
                a.Name = columnValues[1];
                a.Apex_Class__c = columnValues[2];
                a.Concern__c=boolean.valueOf(columnValues[3]);   
                a.Concern_Person__c=(!String.isEmpty(String.valueof(columnValues[4]))  ? columnValues[4] :null);
                System.debug('coulmn 5 is'+columnValues[5]);
                a.Date_Time__c=dateTime.valueOf(columnValues[5]);
                
                a.Error_Message__c=(!String.isEmpty(String.valueof(columnValues[6]))  ? columnValues[6] :null);
                a.Except_Module_Log__c=columnValues[7];
                a.Keep_log_for_last_X_days__c=Decimal.valueof((!String.isEmpty(String.valueof(columnValues[8]))  ? columnValues[8] :'0'));
                a.Loggin_User__c=(!String.isEmpty(String.valueof(columnValues[9]))  ? columnValues[9] :null);        
                a.Logging_Type__c=columnValues[10];
                a.Module__c=columnValues[11];
                a.Notification__c=boolean.valueOf(columnValues[12]);
                a.Notification_Email__c=columnValues[13];
                a.Purged_file_Name__c=columnValues[14];
                a.Purged_Status__c=columnValues[15];
                a.Purging_Mode__c=columnValues[16];
                a.Purging_Schedule__c=columnValues[17];
                a.Record_Type__c=columnValues[18];
                a.RecordId__c=columnValues[19];
                a.Request_JSON__c=columnValues[20];
                a.Response_JSON__c=columnValues[21];
                a.Schedule_Job_Id__c=columnValues[22];
                a.Status_Code__c=columnValues[23];
                a.Type_Of_Integration__c=columnValues[24];
                a.Method__c=columnValues[25];
                a.Request_URL__c=columnValues[26];
                a.Remote_Address__c=columnValues[27];
                a.Headers__c=columnValues[28];
                a.Data_Source__c=columnValues[29];
                a.External_System_Name__c=columnValues[30];
                a.Status__c=boolean.valueOf(columnValues[31]);
                
                //a.Terms_Condition__c=columnValues[25];    
                monitorInsert.add(a);
            }
            if(monitorInsert.size()>0){
                insert monitorInsert;              
                //delete link;            
                updateRecords(monitorId,'try');
            }
        }
        catch(Exception e)
        {
            System.debug('Message is'+e.getMessage());
            System.debug('Cause of Error is'+e.getCause());
            System.debug('Line Number'+e.getLineNumber());
            updateRecords(monitorId,'catch');
        }
    }
    
    /**
* @description - This method is used to update records in MonitorLog during Reloading of File. 
* @param String -monitorId,trycatch
* @return  -    void
*/     
    @future
    global static void updateRecords(String monitorId,String trycatch)
    {
        Monitor_Log__c monitor=new Monitor_Log__c();
        if(trycatch=='try'){
            monitor.id=monitorId;
            monitor.ReloadStatus__c='Completed';
            update monitor;
           
            Monitor__mdt emailIds=[select MasterLabel,Email__c from Monitor__mdt where MasterLabel=:'EmailIds'];
            Monitor_Log__c getSchedularRecords=[select Id,Notification_Email__c,Notification__c from Monitor_Log__c where Id =:monitorId];
            
            String userEmailIds='';
            if(getSchedularRecords.Notification_Email__c !=null && getSchedularRecords.Notification__c==true)
            {
                userEmailIds=getSchedularRecords.Notification_Email__c;
            }
            else
            {
                userEmailIds=emailIds.Email__c;   
            }
            
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();                   
            mail.setUseSignature(false);
            mail.setToAddresses(new String[] {userEmailIds});
            mail.setSubject('Monitor Log Records Reloaded Successfully');
            mail.setHtmlBody('Dear User,<br /><br />Your Monitor Log Records are Reloaded Successfully.<br /><br />Regards,<br/>Salesforce Administrator<br />');
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });   
        }
        else {
            monitor.id=monitorId;
            monitor.ReloadStatus__c='Failed';
            update monitor;
            Monitor__mdt emailIds=[select MasterLabel,Email__c from Monitor__mdt where MasterLabel=:'EmailIds'];
            String userEmailIds=emailIds.Email__c;
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();                   
            mail.setUseSignature(false);
            mail.setToAddresses(new String[] {userEmailIds});
            mail.setSubject('Monitor Log Records Reloaded Failed');
            mail.setHtmlBody('Dear User,<br /><br />Your Monitor Log Records are not Reloaded Successfully.<br /><br />Regards,<br/>Salesforce Administrator<br />');
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });   
            
        }
    }
    
    
    global static String getClassName(String line){
        if (line.startsWith('Class.')){
            line = line.substringAfter('Class.');
        }
        return line.substringBefore(':').substringBeforeLast('.');
        
    }
    global static String getMethod(String line){
        return line.substringBefore(':').substringAfterLast('.');
    }
}
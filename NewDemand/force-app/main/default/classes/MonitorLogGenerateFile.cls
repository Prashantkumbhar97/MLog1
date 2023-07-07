/**
 * @description       : This class is used to create CSV files and delete logs records. 
 *                      As well as sending emails to users.                                         
 * @author            : prashant.kumbhar@skinternational.com
 * @last modified on  : 06-23-2023
 * @last modified by  :  prashant.kumbhar@skinternational.com
**/



global without Sharing class MonitorLogGenerateFile implements Schedulable  {
    
    /** 
* @Description - This Schedular is Used to Create CSV Files and Delete Records of Monitor Log Object. 
* @param  -JobId.
* @return  -    void
*/    
    global void execute(SchedulableContext sc) {
        System.debug('Start Schedular');
        Monitor_Log__c monitor=new Monitor_Log__c();
        sc.getTriggerId();
        String jobid = String.valueOf(sc.getTriggerId()).substring(0, 15); 
        System.debug('JobId is'+jobid);
        /** 
         * To get Log Record Type.
         */
        String recordtypeId= Schema.SObjectType.Monitor_Log__c.getRecordTypeInfosByName().get('Log').getRecordTypeId();
        Monitor_Log__c getSchedularRecords=new Monitor_Log__c();
        if(Test.isRunningTest()==false)
        {
            getSchedularRecords=[Select id,Purging_Schedule__c,Schedule_Job_Id__c,Except_Module_Log__c,Keep_log_for_last_X_days__c,Notification_Email__c,Notification__c from Monitor_Log__c where Schedule_Job_Id__c=:jobid limit 1];
        }
        else
        {
            getSchedularRecords=[Select id,Purging_Schedule__c,Schedule_Job_Id__c,Except_Module_Log__c,Keep_log_for_last_X_days__c	 from Monitor_Log__c limit 1];
            
        }
        System.debug('Cron Expression is'+getSchedularRecords.Purging_Schedule__c);
        String exceptmoduleString='';
        List<String> excepValues = new List<String>();
        /**
         * To get Log Records based on Modules.
        */ 
        if(getSchedularRecords.Except_Module_Log__c !='' &&  getSchedularRecords.Except_Module_Log__c !=null){
            exceptmoduleString=getSchedularRecords.Except_Module_Log__c;
            List<String> newList = exceptmoduleString.split(',');
            for (String value : newList) {
                excepValues.add(value.trim());
            }
        }
        
        DateTime newdate;        
        DateTime dt = DateTime.now();
        Integer lastXdays=Integer.valueOf(getSchedularRecords.Keep_log_for_last_X_days__c);
        if(lastXdays !=null)  //To get data with respect to dates.
        {
            newdate=dt.addDays(-lastXdays);
            System.debug('New Date is' +newdate);
        }            
        try{     
            List<Monitor_Log__c> getRecordsLog=new list<Monitor_Log__c>();
            /**
            *Creating Query for multiple Conditons.
            */
            String query='Select Id,Name,Apex_Class__c,Concern__c,Concern_Person__c,Date_Time__c,Error_Message__c,Except_Module_Log__c,Keep_log_for_last_X_days__c,'+
                +' Loggin_User__c,Logging_Type__c,Module__c,Notification__c,Notification_Email__c,Purged_file_Name__c,Purged_Status__c,Purging_Mode__c,Purging_Schedule__c,'+
                +' Record_Type__c,RecordId__c,Request_JSON__c,Response_JSON__c,Schedule_Job_Id__c,Status__c,Type_Of_Integration__c,Method__c,Request_URL__c,Remote_Address__c,Headers__c,Data_Source__c,External_System_Name__c,Status_Code__c,Terms_Condition__c from Monitor_Log__c where RecordTypeId=:recordtypeId';
            
            if(getSchedularRecords.Except_Module_Log__c ==null && getSchedularRecords.Keep_log_for_last_X_days__c==null){  
                getRecordsLog= Database.query(query);
            }     
            else if(getSchedularRecords.Except_Module_Log__c !=null  && getSchedularRecords.Keep_log_for_last_X_days__c==null)
            {             
                query+=' AND Module__c NOT IN :excepValues';
                getRecordsLog=Database.query(query);
            }
            else if(getSchedularRecords.Except_Module_Log__c ==null  && getSchedularRecords.Keep_log_for_last_X_days__c!=null)
            {
                query+=' AND Date_Time__c< :newdate';
                getRecordsLog=Database.query(query);      
            }
            else if(getSchedularRecords.Except_Module_Log__c !=null  && getSchedularRecords.Keep_log_for_last_X_days__c!=null)
            {
                query+=' AND Date_Time__c < :newdate And Module__c NOT IN :excepValues'; 
                getRecordsLog=Database.query(query); 
            }
            
            System.debug('Recors size is'+getRecordsLog.size());
            Integer recordSize=getRecordsLog.size();
            /**
            *For dynamic CSV Calling rows and header from Custom meta data.
            */
            Monitor__mdt reocords=[select MasterLabel,Header__c,NumberOfRows__c from Monitor__mdt where MasterLabel=:'NumberofRecords'];
            List<String> numberofRecords=reocords.NumberOfRows__c.Split(',');
            String recordValues='';
            /**
            *Creating Header of CSV and insert new Line.
            */ 
            String finalString=reocords.Header__c+'\n';
            System.debug('Header values are '+finalString);
            if(getRecordsLog.size()>0)    
            {
                for(Monitor_Log__c m:getRecordsLog)
                {   
                    for(String numberrec : numberofRecords)
                    {
                        recordValues += String.valueOf(m.get(numberrec))+',';                
                        //String recordValues=m.Id+','+m.Name+','+m.Apex_Class__c+','+m.Concern__c+','+m.Concern_Person__c+','+m.Date_Time__c+','+m.Error_Message__c+','+m.Except_Module_Log__c+','+m.Keep_log_for_last_X_days__c+','+m.Loggin_User__c+','+m.Logging_Type__c+','+m.Module__c+','+m.Notification__c+','+m.Notification_Email__c+','+m.Purged_file_Name__c+','+m.Purged_Status__c+','+m.Purging_Mode__c+','+m.Purging_Schedule__c+','+m.Record_Type__c+','+m.RecordId__c+','+m.Request_JSON__c+','+m.Response_JSON__c+','+m.Schedule_Job_Id__c+','+m.Status_Code__c+','+m.Status__c+','+m.Terms_Condition__c+'\n';                     
                        // finalString=finalString+recordValues.replace('null','');
                    }             
                    recordValues=recordValues.removeEnd(',')+'\n';          
                }          
                finalString=finalString+recordValues.replace('null','');
                
                DateTime d = DateTime.Now() ;
                String dateString =  d.format('dd/MM/yyyy hh:mm a') ;
                
                /**
                *Creating Content Version Of the File.
                */ 
                List<ContentVersion> con=new List<ContentVersion>();                    
                ContentVersion content = new ContentVersion();
                content.VersionData=Blob.valueOf(finalString);
                content.Title='Auto'+dateString+'.csv';
                content.PathOnClient='Auto'+dateString+'.'+'csv';
                content.IsMajorVersion=true;
                con.add(content);
                insert con;
                
                /**
                *Creating Content Documnet Link of the File.
                */ 
                Id conDocId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:content.Id].ContentDocumentId;
                ContentDocumentLink cdl = New ContentDocumentLink();
                cdl.LinkedEntityId = getSchedularRecords.Id;
                cdl.ContentDocumentId = conDocId;
                Insert cdl;
                
                /**
                *Updating Monitor log records.
                */
                monitor.id= getSchedularRecords.id;
                monitor.Purged_Status__c='Completed';
                monitor.Purged_file_Name__c='Auto'+dateString+'.'+'csv';     
                Update monitor;
                
                /**
                *Deleting Records after getting Files.
                */
                if(monitor.Purged_Status__c=='Completed')
                {
                    delete getRecordsLog;
                }
                if(Test.isRunningTest()==false){
                    /**
                    *Aborting Job.
                    */ 
                    CronTrigger cron=[Select Id,CronExpression from CronTrigger where CronExpression=:getSchedularRecords.Purging_Schedule__c];
                    System.debug('Cron details For abort Operation is'+cron);     
                    System.abortJob(cron.id);
                }
                else
                {
                    CronTrigger cron=[Select Id,CronExpression from CronTrigger limit 1];
                    System.debug('Cron details For abort Operation is'+cron);     
                    System.abortJob(cron.id);
                    
                }
                Monitor__mdt emailIds=[select MasterLabel,Email__c from Monitor__mdt where MasterLabel=:'EmailIds'];
                String fileLinks = '';
                String userEmailIds='';
                if(getSchedularRecords.Notification_Email__c !=null && getSchedularRecords.Notification__c==true)
                {
                userEmailIds=getSchedularRecords.Notification_Email__c;
                }
                else
                {
                 userEmailIds=emailIds.Email__c;   
                }
                 
                System.debug('Content URl is'+con[0].ContentUrl);
                fileLinks += '<a href="https://login.salesforce.com/' + con[0].Id + '">' + con[0].Title + '</a><br/>';
                Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();                   
                mail.setUseSignature(false);
                mail.setToAddresses(new String[] {userEmailIds});
                mail.setSubject('Monitor Log');
                mail.setHtmlBody('Dear User,<br /><br />Your Files are Created Successfully.<br /><br />Date: '+dateString+'<br /><br />Number of Records: '+recordSize+'<br /><br />File Link: '+fileLinks+'<br /><br />Regards,<br/>Salesforce Administrator<br />');
                Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });          
            }          
        }
        /**
        *If Exception Occurs Updating Monitor Logs Records as failed.
         */
        Catch(Exception e)
        {
            System.debug('Line Number'+e.getLineNumber());
            System.debug('Message of Error'+e.getMessage());
            System.debug('Cause of error'+e.getCause());
            monitor.id= getSchedularRecords.id;
            monitor.Purged_Status__c='Failed';
            monitor.Error_Message__c=e.getMessage();
            Update monitor;  
        }
    }
}
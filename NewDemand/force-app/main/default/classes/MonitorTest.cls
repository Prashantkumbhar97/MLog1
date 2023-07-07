/**
 * @description       : This class is used to cover all apex classes related to Monitor Log.                                          
 * @author            : prashant.kumbhar@skinternational.com
 * @last modified on  : 06-23-2023
 * @last modified by  :  prashant.kumbhar@skinternational.com
**/


@isTest
public class MonitorTest {
    
    /**
     * @description: This method is used cover Monitor class. 
     * @return void.
     */
  
    
    @isTest
    public static void getMonitor(){
        
        User newUser=new User();
        String profileId=Userinfo.getProfileId();
        newUser.Alias='prashant';
        newUser.Country='India';
        newUser.Email='prashant.kumbhar@skinternational.com';
        newUser.LastName='kumbhar';
        newUser.FirstName='Prashant';
        newUser.Username='prashant.kumbhar111@gmail.com';
        newUser.TimeZoneSidKey ='Asia/Colombo';
        newUser.EmailEncodingKey ='UTF-8';
        newUser.LocaleSidKey='en_IN';
        newUser.ProfileId=profileId;
        newUser.LanguageLocaleKey='en_US';
        insert newUser;
        
        Monitor_Log__c monitorObj = new Monitor_Log__c();
        monitorObj.All_Module__c=true;
        monitorObj.Apex_Class__c='Monitor';
        monitorObj.Concern__c=true;
        monitorObj.Concern_Person__c=newUser.id;
        monitorObj.Date_Time__c=System.now();
        monitorObj.Error_Message__c='Yes';
        monitorObj.Except_Module_Log__c='Account';
        monitorObj.Keep_log_for_last_X_days__c=8;
        monitorObj.Loggin_User__c=newUser.id;
        monitorObj.Logging_Type__c='Info';
        monitorObj.Module__c='Account';
        monitorObj.Name='Newrecords';
        monitorObj.Notification__c=true;
        monitorObj.Notification_Email__c='prashant.kumbhar@skinternational.com';
        monitorObj.Purged_file_Name__c='Auto';
        monitorObj.Purged_Status__c='Draft';
        monitorObj.Purging_Mode__c='Auto';
        monitorObj.Purging_Schedule__c='CronExpression';
        monitorObj.Record_Type__c='Log';
        monitorObj.RecordId__c='123444';
        monitorObj.ReloadStatus__c='draft';
        monitorObj.Request_JSON__c='prashantkumbhar';
        monitorObj.Response_JSON__c='prashantkumbhar';
        monitorObj.Schedule_Job_Id__c='JobId';
        monitorObj.Status__c=true;
        monitorObj.Status_Code__c='200';
        monitorObj.Terms_Condition__c='Dont reuired';
        monitorObj.Type_Of_Integration__c='Inbound';
        monitorObj.Method__c='GET';
        monitorObj.Request_URL__c='google.com';
        monitorObj.Remote_Address__c ='google.com';
        monitorObj.Headers__c='google.com';
        monitorObj.Data_Source__c='google.com';
        monitorObj.External_System_Name__c='google.com';
        insert monitorObj;
        String date11=String.valueof(System.now());
        
        String finalString1='ABCDDD,a,a,a,,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a\n';
        String newfinal='null'+','+ 'abcd'+ ','+'abcd'+','+'true'+','+ newUser.id+','+date11+','+'abcd'+','+'abcd'+','+'10'+','+newUser.id+','+'Info'+','+'Module'+','+'true'+','+'pkumbhar128@gmail.com'+','+'New'+','+'Draft'+','+'Auto'+','+'Draft'+','+'Draft'+','+'Draft'+','+'Draft'+','+'Draft'+','+'Draft'+','+'100'+','+'true';   
        String finalString=finalString1+newfinal;
        String dateString=String.valueof(System.now());                    
        ContentVersion content = new ContentVersion();
        content.VersionData=Blob.valueOf(finalString);
        content.Title='Auto'+dateString+'.csv';
        content.PathOnClient='Auto'+dateString+'.'+'csv';
        content.IsMajorVersion=true; 
        insert content;
        
        //Creating Content Documnet Link of the File.
        Id conDocId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:content.Id].ContentDocumentId;
        ContentDocumentLink cdl = New ContentDocumentLink();
        cdl.LinkedEntityId = monitorObj.Id;
        cdl.ContentDocumentId = conDocId;
        Insert cdl;
        
        Monitor__mdt m=new Monitor__mdt();
        m.MasterLabel='EmailIds';
        m.Email__c='prashant.kumbhar@skinternational.com';
        
        Exception exception1 = new System.CalloutException();
        exception1.setMessage('my message');
        
        Test.startTest();
         
        Monitor.log('apexClass',monitorObj.id,monitorObj.Module__c,newUser.id,monitorObj.Error_Message__c,monitorObj.Method__c,monitorObj.Headers__c);
        Monitor.reloadRecords(monitorObj.Id);
        Monitor.requestResponseLog(monitorObj.Request_JSON__c,monitorObj.Response_JSON__c,monitorObj.Status_Code__c,monitorObj.Apex_Class__c,monitorObj.id,monitorObj.Module__c,newUser.id,monitorObj.Error_Message__c,monitorObj.Type_Of_Integration__c,
                                  monitorObj.Method__c,monitorObj.Request_URL__c,monitorObj.Remote_Address__c,monitorObj.Headers__c,monitorObj.Data_Source__c,monitorObj.External_System_Name__c);
        Monitor.getClassName('Class.line');
        Monitor.getMethod('line');
        Monitor.updateRecords(monitorObj.id, 'try');
        //Monitor.updateRecords(monitorObj.id, 'catch');
        Monitor.exceptionHandler(exception1,monitorObj.id,monitorObj.Request_JSON__c,monitorObj.Response_JSON__c,monitorObj.Apex_Class__c,monitorObj.Module__c);
        Test.stopTest();
        
    }
    
    /**
     * @description: This method is used cover Trigger class and Handler. 
     * @return void.
     */
  
    
    @isTest
    public static void getMonitor1(){
        
        User newUser=new User();
        String profileId=Userinfo.getProfileId();
        newUser.Alias='prashant';
        newUser.Country='India';
        newUser.Email='prashant.kumbhar@skinternational.com';
        newUser.LastName='kumbhar';
        newUser.FirstName='Prashant';
        newUser.Username='prashant.kumbhar111@gmail.com';
        newUser.TimeZoneSidKey ='Asia/Colombo';
        newUser.EmailEncodingKey ='UTF-8';
        newUser.LocaleSidKey='en_IN';
        newUser.ProfileId=profileId;
        newUser.LanguageLocaleKey='en_US';
        insert newUser;
        
        Monitor_Log__c monitorObj = new Monitor_Log__c();
        monitorObj.All_Module__c=true;
        monitorObj.Apex_Class__c='Monitor';
        monitorObj.Concern__c=true;
        monitorObj.Concern_Person__c=newUser.id;
        monitorObj.Date_Time__c=System.now();
        monitorObj.Error_Message__c='Yes';
        monitorObj.Except_Module_Log__c='Account';
        monitorObj.Keep_log_for_last_X_days__c=8;
        monitorObj.Loggin_User__c=newUser.id;
        monitorObj.Logging_Type__c='Info';
        monitorObj.Module__c='Account';
        monitorObj.Name='Newrecords';
        monitorObj.Notification__c=true;
        monitorObj.Notification_Email__c='prashant.kumbhar@skinternational.com';
        monitorObj.Purged_file_Name__c='Auto';
        monitorObj.Purged_Status__c='Draft';
        monitorObj.Purging_Mode__c='Auto';
        monitorObj.Purging_Schedule__c='CronExpression';
        monitorObj.Record_Type__c='Log';
        monitorObj.RecordId__c='123444';
        monitorObj.ReloadStatus__c='draft';
        monitorObj.Request_JSON__c='prashantkumbhar';
        monitorObj.Response_JSON__c='prashantkumbhar';
        monitorObj.Schedule_Job_Id__c='JobId';
        monitorObj.Status__c=true;
        monitorObj.Status_Code__c='200';
        monitorObj.Terms_Condition__c='Dont reuired';
        monitorObj.Type_Of_Integration__c='Inbound';
        monitorObj.Method__c='GET';
        monitorObj.Request_URL__c='google.com';
        monitorObj.Remote_Address__c ='google.com';
        monitorObj.Headers__c='google.com';
        monitorObj.Data_Source__c='google.com';
        monitorObj.External_System_Name__c='google.com';
        
        insert monitorObj;
        String date11=String.valueof(System.now());
        
        String finalString1='ABCDDD,a,a,a,,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a\n';
        String newfinal='null'+','+ 'abcd'+ ','+'abcd'+','+'true'+','+ newUser.id+','+date11+','+'abcd'+','+'abcd'+','+'10'+','+newUser.id+','+'Info'+','+'Module'+','+'true'+','+'pkumbhar128@gmail.com'+','+'New'+','+'Draft'+','+'Auto'+','+'Draft'+','+'Draft'+','+'Draft'+','+'Draft'+','+'Draft'+','+'Draft'+','+'100'+','+'true';   
        String finalString=finalString1+newfinal;
        String dateString=String.valueof(System.now());                    
        ContentVersion content = new ContentVersion();
        content.VersionData=Blob.valueOf(finalString);
        content.Title='Auto'+dateString+'.csv';
        content.PathOnClient='Auto'+dateString+'.'+'csv';
        content.IsMajorVersion=true; 
        insert content;
        
        //Creating Content Documnet Link of the File.
        Id conDocId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:content.Id].ContentDocumentId;
        ContentDocumentLink cdl = New ContentDocumentLink();
        cdl.LinkedEntityId = monitorObj.Id;
        cdl.ContentDocumentId = conDocId;
        Insert cdl;
        
        Monitor__mdt m=new Monitor__mdt();
        m.MasterLabel='EmailIds';
        m.Email__c='prashant.kumbhar@skinternational.com';
        
        Exception exception1 = new System.CalloutException();
        exception1.setMessage('my message');
        
        Test.startTest();
        Monitor.updateRecords(monitorObj.id, 'catch');
        Test.stopTest();
        
    }
    
    /**
     * @description: This method is used cover Monitor reload method. 
     * @return void.
     */
  
    @isTest
    public static void getMonitor2(){
        String recordtypeId= Schema.SObjectType.Monitor_Log__c.getRecordTypeInfosByName().get('Scheduler').getRecordTypeId();
        String recordtypeIdlog= Schema.SObjectType.Monitor_Log__c.getRecordTypeInfosByName().get('Log').getRecordTypeId();
        
        User newUser=new User();
        String profileId=Userinfo.getProfileId();
        newUser.Alias='prashant';
        newUser.Country='India';
        newUser.Email='prashant.kumbhar@skinternational.com';
        newUser.LastName='kumbhar';
        newUser.FirstName='Prashant';
        newUser.Username='prashant.kumbhar111@gmail.com';
        newUser.TimeZoneSidKey ='Asia/Colombo';
        newUser.EmailEncodingKey ='UTF-8';
        newUser.LocaleSidKey='en_IN';
        newUser.ProfileId=profileId;
        newUser.LanguageLocaleKey='en_US';
        insert newUser;
        
        MonitorLogGenerateFile scheduledJob = new MonitorLogGenerateFile();
        Monitor_Log__c monitorObjlog = new Monitor_Log__c();
        monitorObjlog.All_Module__c=true;
        monitorObjlog.Apex_Class__c='Monitor';
        monitorObjlog.Concern__c=true;
        monitorObjlog.Concern_Person__c=newUser.id;
        monitorObjlog.Date_Time__c=System.now();
        monitorObjlog.Error_Message__c='Yes';
        monitorObjlog.Except_Module_Log__c=null;
        monitorObjlog.Keep_log_for_last_X_days__c=null;
        monitorObjlog.Loggin_User__c=newUser.id;
        monitorObjlog.Logging_Type__c='Info';
        monitorObjlog.Module__c='Account';
        monitorObjlog.Name='Newrecords';
        monitorObjlog.Notification__c=false;
        monitorObjlog.Notification_Email__c='prashant.kumbhar@skinternational.com';
        monitorObjlog.Purged_file_Name__c='Auto';
        monitorObjlog.Purged_Status__c='Draft';
        monitorObjlog.Purging_Mode__c='Auto';
        monitorObjlog.Purging_Schedule__c='0 18 16 ? * * *';
        monitorObjlog.Record_Type__c='Log';
        monitorObjlog.RecordId__c='123444';
        monitorObjlog.ReloadStatus__c='draft';
        monitorObjlog.Request_JSON__c='prashantkumbhar';
        monitorObjlog.Response_JSON__c='prashantkumbhar';
        monitorObjlog.Schedule_Job_Id__c=null;
        monitorObjlog.Status__c=true;
        monitorObjlog.Status_Code__c='200';
        monitorObjlog.Terms_Condition__c='Dont reuired';
        monitorObjlog.RecordTypeId=recordtypeIdlog;
        monitorObjlog.Type_Of_Integration__c='Inbound';
        monitorObjlog.Method__c='GET';
        monitorObjlog.Request_URL__c='google.com';
        monitorObjlog.Remote_Address__c ='google.com';
        monitorObjlog.Headers__c='google.com';
        monitorObjlog.Data_Source__c='google.com';
        monitorObjlog.External_System_Name__c='google.com';
        
        insert monitorObjlog;
        
        
        
        Monitor_Log__c monitorObj = new Monitor_Log__c();
        monitorObj.All_Module__c=true;
        monitorObj.Apex_Class__c='Monitor';
        monitorObj.Concern__c=true;
        monitorObj.Concern_Person__c=newUser.id;
        monitorObj.Date_Time__c=System.now();
        monitorObj.Error_Message__c='Yes';
        monitorObj.Except_Module_Log__c='Account';
        monitorObj.Keep_log_for_last_X_days__c=8;
        monitorObj.Loggin_User__c=newUser.id;
        monitorObj.Logging_Type__c='Info';
        monitorObj.Module__c='Account';
        monitorObj.Name='Newrecords';
        monitorObj.Notification__c=false;
        monitorObj.Notification_Email__c='prashant.kumbhar@skinternational.com';
        monitorObj.Purged_file_Name__c='Auto';
        monitorObj.Purged_Status__c='Draft';
        monitorObj.Purging_Mode__c='Auto';
        monitorObj.Purging_Schedule__c='0 18 16 ? * * *';
        monitorObj.Record_Type__c='Log';
        monitorObj.RecordId__c='123444';
        monitorObj.ReloadStatus__c='draft';
        monitorObj.Request_JSON__c='prashantkumbhar';
        monitorObj.Response_JSON__c='prashantkumbhar';
        monitorObj.Schedule_Job_Id__c=null;
        monitorObj.Status__c=true;
        monitorObj.Status_Code__c='200';
        monitorObj.Terms_Condition__c='Dont reuired';
        monitorObj.RecordTypeId=recordtypeId;
        monitorObj.Type_Of_Integration__c='Inbound';
        monitorObj.Method__c='GET';
        monitorObj.Request_URL__c='google.com';
        monitorObj.Remote_Address__c ='google.com';
        monitorObj.Headers__c='google.com';
        monitorObj.Data_Source__c='google.com';
        monitorObj.External_System_Name__c='google.com';
        
        
        insert monitorObj;
        System.schedule('new', monitorObj.Purging_Schedule__c, scheduledJob);
        
        String date11=String.valueof(System.now());
        
        String finalString1='ABCDDD,a,a,a,,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a,a\n';
        String newfinal='null'+','+ 'abcd'+ ','+'abcd'+','+'true'+','+ newUser.id+','+date11+','+'abcd'+','+'abcd'+','+'10'+','+newUser.id+','+'Info'+','+'Module'+','+'true'+','+'pkumbhar128@gmail.com'+','+'New'+','+'Draft'+','+'Auto'+','+'Draft'+','+'Draft'+','+'Draft'+','+'Draft'+','+'Draft'+','+'Draft'+','+'100'+','+'true';   
        String finalString=finalString1+newfinal;
        String dateString=String.valueof(System.now());                    
        ContentVersion content = new ContentVersion();
        content.VersionData=Blob.valueOf(finalString);
        content.Title='Auto'+dateString+'.csv';
        content.PathOnClient='Auto'+dateString+'.'+'csv';
        content.IsMajorVersion=true; 
        insert content;
        
        //Creating Content Documnet Link of the File.
        Id conDocId = [SELECT ContentDocumentId FROM ContentVersion WHERE Id =:content.Id].ContentDocumentId;
        ContentDocumentLink cdl = New ContentDocumentLink();
        cdl.LinkedEntityId = monitorObj.Id;
        cdl.ContentDocumentId = conDocId;
        Insert cdl;
        
        Monitor__mdt m=new Monitor__mdt();
        m.MasterLabel='EmailIds';
        m.Email__c='prashant.kumbhar@skinternational.com';
        
        Exception exception1 = new System.CalloutException();
        exception1.setMessage('my message');
        
        Test.startTest();
        
        Test.stopTest();
        
    }
    
    
    
}
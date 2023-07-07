/**
 * @description       : This handler is used to start Scheduler based on specific                  criteria.                                          
 * @author            : prashant.kumbhar@skinternational.com
 * @last modified on  : 06-23-2023
 * @last modified by  :  prashant.kumbhar@skinternational.com
**/


public class MonitorLogHandler {
    
    MonitorLogGenerateFile scheduledJob = new MonitorLogGenerateFile();
    Monitor monitorclass=new Monitor();
    String jobId='';
    String recordtypeId= Schema.SObjectType.Monitor_Log__c.getRecordTypeInfosByName().get('Scheduler').getRecordTypeId();
    String userId=userInfo.getUserId();
    String monitorId='';
    
/** 
* @Description - This method is Used to Update Job Id of records. 
* @param List -Monitor Log.
* @return  -    void
*/       
    public void beforeInsert(List<Monitor_Log__c> m){        
        for(Monitor_Log__c monitor:m)
        {
            if(monitor.Status__c==true && monitor.Purging_Schedule__c!=null && monitor.RecordTypeId==recordtypeId)
            {
                jobId= System.schedule(monitor.Name, monitor.Purging_Schedule__c,scheduledJob);
                monitor.Schedule_Job_Id__c=jobId;  
                monitor.Purged_Status__c='In Progress';
                monitor.Concern_Person__c=userId;               
            }      
        }     
    }

/** 
* @Description - This method is Used to Update Job Id and Status of records on After Insert Event. 
* @param List -Monitor Log.
* @return  -    void
*/    
    public void afterInsert(List<Monitor_Log__c> n){
        for(Monitor_Log__c monitor1:n)
        {
            if(monitor1.Status__c==false && monitor1.Schedule_Job_Id__c !=null)
            {
                monitor1.Schedule_Job_Id__c='';                 
            }   
            if(monitor1.ReloadStatus__c=='Start' && monitor1.Schedule_Job_Id__c !=null)
            { 
                monitorId=monitor1.id;
                Monitor.reloadRecords(monitorId);
            }     
            else if(monitor1.ReloadStatus__c=='Start' && monitor1.Schedule_Job_Id__c ==null)
             {
                    monitor1.addError('Scheduled Job is Blank');
             }
        }     
    }
    
}
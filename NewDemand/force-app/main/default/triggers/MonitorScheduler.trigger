/**
 * @description       : This trigger is used to start Scheduler based on specific criteria.                                          
 * @author            : prashant.kumbhar@skinternational.com
 * @last modified on  : 06-23-2023
 * @last modified by  :  prashant.kumbhar@skinternational.com
**/


trigger MonitorScheduler on Monitor_Log__c (before insert,before update) {
    MonitorLogHandler handler=new MonitorLogHandler();
    /**
     For before insert Operation to update specific fields.
    */
    if(trigger.isInsert)
    {
       handler.beforeInsert(trigger.new); 
    }
    /**
     For after insert Operation to update specific fields.
    */
    if (Trigger.isUpdate && trigger.isBefore) {
        
        handler.afterInsert(trigger.new);
    }
}
import { LightningElement, api, track, wire} from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi'; 
import getInvoiceProductDetails from '@salesforce/apex/SORProductDetailsChildController.getInvoiceProductDetails';
//import getRSOItemDetails from '@salesforce/apex/SORProductDetailsChildController.getRSOItemDetails';
import deleteRSOItem from '@salesforce/apex/SORProductDetailsChildController.deleteRSOItem';
import RSOLI_OBJECT from '@salesforce/schema/Return_Sales_Order_Line_Item__c';
//import CURRENCY_CODE from '@salesforce/schema/Return_Sales_Order_Line_Item__c.Currency__c';
import AT_AG from '@salesforce/schema/Return_Sales_Order_Line_Item__c.AT_AG__c';
import PRODUCT_DAMAGE from '@salesforce/schema/Return_Sales_Order_Line_Item__c.Product_Damaged__c';
import PACKAGING_CONDITION from '@salesforce/schema/Return_Sales_Order_Line_Item__c.Packing_Condition__c';
import PRODUCT_CONDITION from '@salesforce/schema/Return_Sales_Order_Line_Item__c.Product_Condition__c';
import SLOW_MOVING from '@salesforce/schema/Return_Sales_Order_Line_Item__c.Slow_Moving__c';
import PRODUCT_CONTENTION from '@salesforce/schema/Return_Sales_Order_Line_Item__c.Product_Contention__c';
import PRODUCT_REWORK from '@salesforce/schema/Return_Sales_Order_Line_Item__c.Product_can_be_reworked__c';

export default class SorProductDetailsChild extends LightningElement {
    @api getValueFromParent = {};
    @track bShowModal = false;   
    @track productList = [];
    @track isProductList = false; 
    //@track currencyOptions = [];
    @track atAgOptions = [];
    @track prodDamageOptions = [];
    @track packgCondtnOptions = [];
    @track prodCondtnOptions = [];
    @track slowMovOptions = [];
    @track prodContentnOptions = [];
    @track prodReworkOptions = [];
    @track reworkYes = false;
    @track reworkNo = false;
    @track productObj = {};
    @track currentDate = '';
    @track accountId = '';
    @track invcSerarchField = 'Name';  // default....
    @track invcFilter = ' Sales_Org__r.Sales_Org_Code__c = \'5191\'  ORDER BY Name ASC ';
    @track invcDisable = false;
    @track invcName = '';
    @track invcItemSerarchField = 'SKU_Code__c';  // default....
    @track invcItemFilter = ' Invoice__r.Sales_Org__r.Sales_Org_Code__c = \'5191\'  ORDER BY Name ASC ';
    @track invcItemName = '';
    @track showSpinner = false;
    @track isEdit = false;
    @track itemIndex = 0;

    // getting the default record type id, if you dont' then it will get master
    @wire(getObjectInfo, { objectApiName: RSOLI_OBJECT})
    rsoMetadata;

    // now retriving the field picklist values of object
    /* @wire(getPicklistValues,
        {
            recordTypeId: '012000000000000AAA',// hardcoded value for null recordTypeid...//'$rsoMetadata.data.defaultRecordTypeId', 
            fieldApiName: CURRENCY_CODE
        }
    )
    wiredCurrency({error, data}){
        if(data){
            this.currencyOptions = data.values;
            //console.log('wiredPWR data- ', data.values);
        }
        else if(error){
            console.log('wiredCurrency error- ', error);
        }
    } */
 
    // now retriving the field picklist values of object
    @wire(getPicklistValues,
        {
            recordTypeId: '012000000000000AAA',// hardcoded value for null recordTypeid...//'$rsoMetadata.data.defaultRecordTypeId', 
            fieldApiName: AT_AG
        }
    )
    wiredAG({error, data}){
        if(data){
            this.atAgOptions = data.values;
            //console.log('wiredPWR data- ', data.values);
        }
        else if(error){
            console.log('wiredAG error- ', error);
        }
    }

    // now retriving the field picklist values of object
    @wire(getPicklistValues,
        {
            recordTypeId: '012000000000000AAA',// hardcoded value for null recordTypeid...//'$rsoMetadata.data.defaultRecordTypeId', 
            fieldApiName: PRODUCT_DAMAGE
        }
    )
    wiredProdDamage({error, data}){
        if(data){
            this.prodDamageOptions = data.values;
            //console.log('wiredPWR data- ', data.values);
        }
        else if(error){
            console.log('wiredProdDamage error- ', error);
        }
    }

    // now retriving the field picklist values of object
    @wire(getPicklistValues,
        {
            recordTypeId: '012000000000000AAA',// hardcoded value for null recordTypeid...//'$rsoMetadata.data.defaultRecordTypeId', 
            fieldApiName: PRODUCT_CONDITION
        }
    )
    wiredProdCondtn({error, data}){
        if(data){
            this.prodCondtnOptions = data.values;
            //console.log('wiredPWR data- ', data.values);
        }
        else if(error){
            console.log('wiredProdCondtn error- ', error);
        }
    }

    // now retriving the field picklist values of object
    @wire(getPicklistValues,
        {
            recordTypeId: '012000000000000AAA',// hardcoded value for null recordTypeid...//'$rsoMetadata.data.defaultRecordTypeId', 
            fieldApiName: PACKAGING_CONDITION
        }
    )
    wiredPackCondtn({error, data}){
        if(data){
            this.packgCondtnOptions = data.values;
            //console.log('wiredPWR data- ', data.values);
        }
        else if(error){
            console.log('wiredPackCondtn error- ', error);
        }
    }

    // now retriving the field picklist values of object
    @wire(getPicklistValues,
        {
            recordTypeId: '012000000000000AAA',// hardcoded value for null recordTypeid...//'$rsoMetadata.data.defaultRecordTypeId', 
            fieldApiName: SLOW_MOVING
        }
    )
    wiredSloMo({error, data}){
        if(data){
            this.slowMovOptions = data.values;
            //console.log('wiredPWR data- ', data.values);
        }
        else if(error){
            console.log('wiredSloMo error- ', error);
        }
    }

    // now retriving the field picklist values of object
    @wire(getPicklistValues,
        {
            recordTypeId: '012000000000000AAA',// hardcoded value for null recordTypeid...//'$rsoMetadata.data.defaultRecordTypeId', 
            fieldApiName: PRODUCT_CONTENTION
        }
    )
    wiredProdConten({error, data}){
        if(data){
            this.prodContentnOptions = data.values;
            //console.log('wiredPWR data- ', data.values);
        }
        else if(error){
            console.log('wiredProdConten error- ', error);
        }
    }

    // now retriving the field picklist values of object
    @wire(getPicklistValues,
        {
            recordTypeId: '012000000000000AAA',// hardcoded value for null recordTypeid...//'$rsoMetadata.data.defaultRecordTypeId', 
            fieldApiName: PRODUCT_REWORK
        }
    )
    wiredProdRewrk({error, data}){
        if(data){
            this.prodReworkOptions = data.values;
            //console.log('wiredPWR data- ', data.values);
        }
        else if(error){
            console.log('wiredProdRewrk error- ', error);
        }
    }

    /* javaScipt functions start */ 
    openModal() {    
        if(this.accountId == '' || this.accountId == null){
            this.showToastmessage('ErrorT','Select Account First','Error');
        }
        else{
            let array = this.productList;
            if(array.length > 0){
                let obj = JSON.parse(JSON.stringify(array[0]));
                this.invcFilter = 'CurrencyIsoCode =\''+obj.currencyCode+'\' AND Sold_To_Party__c=\''+this.accountId+'\' AND Sales_Org__r.Sales_Org_Code__c = \'5191\'  ORDER BY Name ASC ';
            }
            else{
                this.invcFilter = 'Sold_To_Party__c=\''+this.accountId+'\' AND Sales_Org__r.Sales_Org_Code__c = \'5191\'  ORDER BY Name ASC ';
            }
            // to open modal window set 'bShowModal' tarck value as true
            this.bShowModal = true;
        }
        
    }

    closeModal() {    
        // to close modal window set 'bShowModal' tarck value as false
        this.bShowModal = false;
        this.reworkYes = false;
        this.reworkNo = false;
        this.resetProductObj();
        this.invcName = '';
        this.invcItemName = '';
    }

    connectedCallback(){
        var today = new Date();
        this.currentDate = today.toISOString();
        console.log('value from parent in Product Details Child - ', this.getValueFromParent);
        this.productList = this.getValueFromParent;
        //console.log('this.productList in Product Details Child - ', this.productList);
        this.resetProductObj();
    }

    @api
    getRecordDetailsFromParent(obj) {
        this.productList = obj;  
        if(this.productList.length>0){
            this.isProductList = true;
        }      
    }

    resetProductObj(){
        this.productObj = {"srNo": 0,"recId": "","sorId": "","invoiceId": "","invoiceName": "","productCode": "","productName": "","productDescription": "","batch": "","currencyCode": "","volume": 0,
        "unitValue": 0,"totalValue": 0,"expireDate": "","atAG": "","productDamage": "","packagingCondition": "","productCondition": "","comments": "","slowMoving": "","productContention": "",
        "productRework": "NA","reworkCost": 0,"writeOff": "","invoiceItemId":""};
    }

    triggerEvent(events){
        //create event
        const custEvent = new CustomEvent("getproductdetails",{
            detail: this.productList
        });

        // dispatch event
        this.dispatchEvent(custEvent);
    }

    @api
    getAccountId(strString) {
        //console.log('getAccountId - ', strString);
        this.accountId = strString;
        if(this.accountId == '' || this.accountId == null){
            this.invcFilter = ' Sales_Org__r.Sales_Org_Code__c = \'5191\'  ORDER BY Name ASC ';
        }
        else{
            this.invcFilter = 'Sold_To_Party__c=\''+this.accountId+'\' AND Sales_Org__r.Sales_Org_Code__c = \'5191\'  ORDER BY Name ASC ';
        }
        //console.log('invoice filter - ', this.invcFilter);
    }

    handleChange(event){
        let obj = JSON.parse(JSON.stringify(this.productObj));
        //console.log('value in Order Details Child - ', obj);
        if(event.target.name == 'batch'){
            obj.batch = event.target.value;
        }
        else if(event.target.name == 'currencyCode'){
            obj.currencyCode = event.target.value;
        }
        else if(event.target.name == 'unitVal'){
            obj.unitValue = event.target.value;
        }
        else if(event.target.name == 'totalVal'){
            obj.totalValue = event.target.value;
        }
        else if(event.target.name == 'expDate'){
            obj.expireDate = event.target.value;
        }
        else if(event.target.name == 'atAg'){
            obj.atAG = event.target.value;
        }
        else if(event.target.name == 'prodDamage'){
            obj.productDamage = event.target.value;
        }
        else if(event.target.name == 'packCondtn'){
            obj.packagingCondition = event.target.value;
        }
        else if(event.target.name == 'prodCondtn'){
            obj.productCondition = event.target.value;
        }
        else if(event.target.name == 'comments'){
            obj.comments = event.target.value;
        }
        else if(event.target.name == 'sloMo'){
            obj.slowMoving = event.target.value;
        }
        else if(event.target.name == 'prodConten'){
            obj.productContention = event.target.value;
        }
        else if(event.target.name == 'prodRewrk'){
            obj.productRework = event.target.value;
            obj.writeOff = '';
            obj.reworkCost = 0;
            this.reworkToggle(event.target.value);
        }
        else if(event.target.name == 'reworkCost'){
            obj.reworkCost = event.target.value;
        }
        else if(event.target.name == 'writeOff'){
            obj.writeOff = event.target.value;
        }
        
        this.productObj = obj;
        //console.log('value in handleChange - ', this.productObj);
        /* //create event
        const custEvent = new CustomEvent("getproductdetails",{
            detail: event.target.value
        });

        // dispatch event
        this.dispatchEvent(custEvent); */
    }

    saveProduct(event){
        let flag = true;
        let volFlag = false;
        let agFlag = false;
        let pdFlag = false;
        let pcFlag = false;
        let prcFlag = false;
        let obj = JSON.parse(JSON.stringify(this.productObj));
        let element = this.template.querySelectorAll(".validt");

        if(obj.invoiceId == '' || obj.invoiceId == null){
            flag = false;
            this.showToastmessage('ErrorT','Select Invoice','Error');
        }
        else if(obj.invoiceItemId == '' || obj.invoiceItemId == null){
            flag = false;
            this.showToastmessage('ErrorT','Select Product','Error');
        }
        else if(obj.currencyCode == '' || obj.currencyCode == null){
            flag = false;
            this.showToastmessage('ErrorT','Currency Not Found','Error');
        }
        else if(obj.unitValue <=0 || obj.unitValue == '' || obj.unitValue == null){
            flag = false;
            this.showToastmessage('ErrorT','Unit value should be greater than zero','Error');
        }
        else if(obj.totalValue <=0 || obj.totalValue == '' || obj.totalValue == null){
            flag = false;
            this.showToastmessage('ErrorT','Total value should be greater than zero','Error');
        }
        else if(obj.expireDate == '' || obj.expireDate == null){
            flag = false;
            this.showToastmessage('ErrorT','Expire Date Not Found','Error');
        }

        if(flag){
            element.forEach(function(item){
                let fieldValue=item.value;
                let fieldName=item.name;

                if(fieldName == 'volume'){
                    if(obj.volume <= 0 || obj.volume == '' || obj.volume == null){
                        volFlag = false;
                        item.setCustomValidity('Volume should be greater than zero');
                    }
                    else{
                        volFlag = true;
                        item.setCustomValidity('');
                    }
                }
                else if(fieldName == 'atAg'){
                    if(obj.atAG == '' || obj.atAG == null){
                        agFlag = false;
                        item.setCustomValidity('Select At AG');
                    }
                    else{
                        agFlag = true;
                        item.setCustomValidity('');
                    }
                } 
                else if(fieldName == 'prodDamage'){
                    if(obj.productDamage == '' || obj.productDamage == null){
                        pdFlag = false;
                        item.setCustomValidity('Select Product Damage');
                    }
                    else{
                        pdFlag = true;
                        item.setCustomValidity('');
                    }
                } 
                else if(fieldName == 'packCondtn'){
                    if(obj.packagingCondition == '' || obj.packagingCondition == null){
                        pcFlag = false;
                        item.setCustomValidity('Select Packaging Condition');
                    }
                    else{
                        pcFlag = true;
                        item.setCustomValidity('');
                    }
                } 
                else if(fieldName == 'prodCondtn'){
                    if(obj.productCondition == '' || obj.productCondition == null){
                        prcFlag = false;
                        item.setCustomValidity('Select Product Condition');
                    }
                    else{
                        prcFlag = true;
                        item.setCustomValidity('');
                    }
                }  
                item.reportValidity();
            },this);
        }

        if(flag && volFlag && agFlag && pdFlag && pcFlag && prcFlag){
            let count = this.productList.length;
            let plist = [];
            plist = JSON.parse(JSON.stringify(this.productList));
            obj.srNo = count + 1;
            obj.accountId = this.accountId;
            this.productObj = obj;
            if(this.isEdit){
                //console.log('splice in update...');
                plist[this.itemIndex] = this.productObj;
                //plist.splice(this.itemIndex, 0, this.productObj); //arr.splice(index, 0, item)..
            }
            else{
                plist.push(this.productObj);
                //console.log('push in update...');
            }
            
            this.productList = plist;
            this.isProductList = true;
            this.triggerEvent();
            this.closeModal();
            this.isEdit = false;
            this.itemIndex = 0;
            this.triggerInvoiceEvent(event,true);
        }
    }

    editProduct(event){
        let array = this.productList;
        let index = event.target.name;
        let prdRecId = event.target.value;
        let flag = true;
        let obj;
        this.isEdit = true;
        this.itemIndex = index;
        obj = JSON.parse(JSON.stringify(array[index])); 
        this.invcName = obj.invoiceName;
        this.invcItemName = obj.productCode;
        this.reworkToggle(obj.productRework);
        obj.recId = prdRecId;
        this.productObj = obj;
        
        this.openModal();
    }

    removeProduct(event){
        this.showSpinner = true;
        let array = this.productList;
        let index = event.target.name;
        let prdRecId = event.target.value;
        let flag = true;
        if(prdRecId.length>0){
            flag = false;
            deleteRSOItem({recId : csRecId})
            .then(result => {
                //console.log('deleteRSOItem result', result);
                if(result === 'success'){
                    flag = true;
                }
                else{
                    this.showToastmessage('ErrorT','FailToDeleteRecord','Error');
                }
                this.showSpinner = false;
            })
            .catch(error => {
                this.showSpinner = false;
                console.log('deleteRSOItem js method catch - ', error);
                this.showToastmessage('ErrorT','FailToDeleteRecord','Error');
            })
        }
        if(flag){
            if (index > -1) {
                array.splice(index, 1);
            }
            this.showToastmessage('Success','RecordDeletedSuccessfully','Success');
            let pList = JSON.parse(JSON.stringify(this.productList));
            pList = array;
            this.productList = pList;
            this.triggerEvent();
        }
        
        if(array.length == 0){
            this.isProductList = false;
            this.triggerInvoiceEvent(event,false);
        }
    }

    reworkToggle(strVal){
        if(strVal == 'Yes'){
            this.reworkYes = true;
            this.reworkNo = false;
        }
        else if(strVal == 'No'){
            this.reworkYes = false;
            this.reworkNo = true;
        }
        else{
            this.reworkYes = false;
            this.reworkNo = false;
        }
    }

    handleVolumeChange(event){
        let obj = JSON.parse(JSON.stringify(this.productObj));
        if(event.target.value == '' || event.target.value == null || event.target.value.length == 0){
            obj.volume = 0;
        }
        else{
            obj.volume = event.target.value;
        }

        obj.totalValue = obj.volume * obj.unitValue;
        this.productObj = obj;
    }

    handleReworkChange(event){
        if(event.target.value == 'Yes'){
            this.reworkYes = true;
            this.reworkNo = false;
        }
        else if(event.target.value == 'No'){
            this.reworkYes = false;
            this.reworkNo = true;
        }
        else{
            this.reworkYes = false;
            this.reworkNo = false;
        }
        this.handleChange(event);
    }

    triggerInvoiceEvent(event,flag){
        //create event
        const custEvent = new CustomEvent("getinvoiceselection",{
            detail: flag
        });

        // dispatch event
        this.dispatchEvent(custEvent);
    }

    handleInvoiceSelected(event){
        //console.log('handleInvoiceSelected - ', event.detail.recId);
        let obj = JSON.parse(JSON.stringify(this.productObj));
        obj.invoiceId = event.detail.recId;
        obj.invoiceName = event.detail.recName;
        this.productObj = obj;
        this.invcName = event.detail.recName;
        this.invcItemFilter = 'Invoice__c =\''+event.detail.recId+'\' AND Invoice__r.Sales_Org__r.Sales_Org_Code__c = \'5191\'  ORDER BY Name ASC ';
        //this.triggerInvoiceEvent(event,true); // event trigger to pass value to Order details lwc...to disable account selection....
        //console.log('this.invcItemFilter - ', this.invcItemFilter);
    }

    handleRemoveInvoice(event){
        //console.log('handleRemoveInvoice - ', event.detail.recId);
        let obj = JSON.parse(JSON.stringify(this.productObj));
        obj.invoiceId = '';
        obj.invoiceName = '';
        this.productObj = obj;
        this.invcName = '';
        //this.triggerInvoiceEvent(event,false);
        //console.log('handleRemoveInvoice - ', this.productObj);
    }

    handleInvoiceItemSelected(event){
        let obj = JSON.parse(JSON.stringify(this.productObj));
        obj.invoiceItemId = event.detail.recId;
        obj.productCode = event.detail.recName;
        this.productObj = obj;
        this.invcItemName = event.detail.recName;
        this.getProductDetails(event.detail.recId);
    }

    handleRemoveInvoiceItem(event){
        let obj = JSON.parse(JSON.stringify(this.productObj));
        obj.invoiceItemId = '';
        obj.productCode = '';
        this.productObj = obj;
        this.invcItemName = '';
        this.resetProductObj();
    }

    getProductDetails(ivncItmId){
        this.showSpinner = false;
        getInvoiceProductDetails({recId : ivncItmId})
            .then(result => {
                //console.log('getProductDetails result', result);
                if(result){
                    this.productObj = result;
                }
                else{
                    this.showToastmessage('ErrorT','Record Details Not Found','Error');
                }
                this.showSpinner = false;
            })
            .catch(error => {
                this.showSpinner = false;
                console.log('getProductDetails js method catch - ', error);
                this.showToastmessage('ErrorT','FailToGetRecord Details','Error');
            })
    }

    showToastmessage(title,message,varient){
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: varient,
            }),
        );
    } 
   
}
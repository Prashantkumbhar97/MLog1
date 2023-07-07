({
    doInit: function (component, event, helper) {
        component.set("v.spinner", true);
        var disabledGoalButton = false;
        var disabledPrintButton = false;
        var action = component.get("c.getContract");
        //Set the Object parameters and Field Set name
        //console.log(''+component.get("v.startDate")+ 'eeeeeeeeeeeee'+component.get("v.endDate"));
        action.setParams({  
            startDatestring : component.get("v.startDate"),
            enddatestring : component.get("v.endDate")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            console.log('State=='+state);
            console.log('response=='+JSON.stringify(response.getReturnValue()));
            if(state === 'SUCCESS'){
                //debugger;
                component.set("v.spinner", false);
                component.set("v.data", response.getReturnValue().liRebateContracts);
                component.set("v.filterdata", response.getReturnValue().liRebateContracts);
                component.set("v.Distributors", response.getReturnValue().liDistributor);
                component.set("v.salesRep", response.getReturnValue().liSalesRep);
                component.set("v.Region", response.getReturnValue().liRegion);
                component.set("v.director", response.getReturnValue().liDirector);
                component.set("v.BU", response.getReturnValue().liBU);
                component.set("v.WFStatus", response.getReturnValue().liWFStatus);
                component.set("v.Type", response.getReturnValue().liType);
                component.set("v.Category", response.getReturnValue().liCategory);
                component.set("v.UserType", response.getReturnValue().UserType);
                component.set("v.DistributorCode", response.getReturnValue().DistributorCode);
                component.set("v.SalesRepCode", response.getReturnValue().SalesRepCode);
                component.set("v.RegionCode", response.getReturnValue().RegionCode);
                component.set("v.ZonalCode", response.getReturnValue().ZonalCode);
                component.set("v.SBUCode", response.getReturnValue().SBUCode);
                component.set("v.startDate", response.getReturnValue().startDate);
                component.set("v.endDate", response.getReturnValue().endDate);
                component.set("v.isDisabled", response.getReturnValue().isDisabled);
                
                var userType = component.get("v.UserType");
                console.log(userType);
                if(userType==="Distributor"){
                    var disabledGoalButton = true;
                }
                
                //Added on 21/04/2020 --> Data protection from Unauthorised user
                console.log('Profile'+response.getReturnValue().LoggedInUserProfile);
                console.log('userType=='+userType);
                if(!userType &&
                   (response.getReturnValue().LoggedInUserProfile != 'Brazil Rebate Admin'&&
                    response.getReturnValue().LoggedInUserProfile != 'Brazil System Administrator'&&
                    response.getReturnValue().LoggedInUserProfile != 'System Administrator'&&
                    response.getReturnValue().LoggedInUserProfile != 'Brazil Customer Service Manager'&&
                    response.getReturnValue().LoggedInUserProfile != 'Brazil Customer Service User'&&
                    response.getReturnValue().LoggedInUserProfile != 'Brazil Regional Head')){ //INCTASK0286695: Sayan given access for the Region Heads
                    
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error!",
                        "message": $A.get("$Label.c.AuthenticationError"),
                        "type": "error"
                    });
                    toastEvent.fire();
                    
                }
                //end patch
                
                console.log(disabledGoalButton);
                component.set('v.columns', [
                    {label: $A.get("$Label.c.RebateContract"), fieldName: 'Contract', type: 'text',initialWidth: 100,},
                    {label: $A.get("$Label.c.RebateDistributor"), fieldName: 'DistributorCodeAndName', type: 'text',initialWidth: 120,},
                    {label: $A.get("$Label.c.RebateType"), fieldName: 'Type', type: 'text',initialWidth: 100,},
                    {label: $A.get("$Label.c.RebateCategory"), fieldName: 'Category_Name', type: 'text',initialWidth: 120,},
                    {label: $A.get("$Label.c.REB_Status"), fieldName: 'Status', type: 'text',initialWidth: 100,},
                    {label: $A.get("$Label.c.Rebate"), fieldName: 'Director', type: 'text',initialWidth: 100,},
                    {label: $A.get("$Label.c.RebateBU"), fieldName: 'BU', type: 'text',initialWidth: 100,},
                    {label: $A.get("$Label.c.RebateRegionalName"), fieldName: 'Branch', type: 'text',initialWidth: 100,},
                    {label: $A.get("$Label.c.RebateSalesRep"), fieldName: 'CTC', type: 'text',initialWidth: 100,},
                    {label: $A.get("$Label.c.RebateStartDate"), fieldName: 'Initial_date', type: 'text',initialWidth: 120,},
                    {label: $A.get("$Label.c.RebateEndDate"), fieldName: 'Final_date', type: 'text',initialWidth: 120,},
                    {label: '', type: 'button', initialWidth: 90, typeAttributes:
                     { label: { fieldName: 'Goals'}, title: $A.get("$Label.c.REB_Goals"), name: 'Goals', iconName: 'action:goal', disabled: disabledGoalButton, class: 'btn_next'}},
                    {label: '', type: 'button', initialWidth: 90, typeAttributes:
                     { label: { fieldName: 'actionLabel'}, title: $A.get("$Label.c.REB_CheckProgress"), name: 'Done', iconName: 'action:following', disabled: {fieldName: 'actionDisabled'}, class: 'btn_next'}},
                    {label: '', type: 'button', initialWidth: 90, typeAttributes:
                     { label: { fieldName: 'actionLabel'}, title: 'Rebate Calculator', name: 'Calc', iconName: 'utility:budget_category_value', disabled: {fieldName: 'actionDisabled'}, class: 'btn_next'}},
                    {label: '', type: 'button', initialWidth: 90, typeAttributes:
                     { label: { fieldName: 'actionLabel'}, title: $A.get("$Label.c.REB_View_Contract"), name: 'Print', iconName: 'utility:print', disabled: { fieldName: 'isDisabled'}, class: 'btn_next'}},
                ]);
                    component.set("v.totalRecords", component.get("v.data").length);
                    var sObjectList = component.get("v.data");
                    var pageSize = component.get("v.pageSize");
                    // set start as 0
                    component.set("v.startPage",0);//changed to 1
                    component.set("v.PageNumber",1);
                    component.set("v.endPage",pageSize-1);
                    component.set("v.TotalPages", Math.ceil(component.get("v.totalRecords") / pageSize));
                    var PaginationList = [];
                              for(var i=0; i< pageSize; i++){
                    if(component.get("v.data").length> i)
                        PaginationList.push(sObjectList[i]);
                    component.set("v.PaginationList", PaginationList);
                    //component.set("v.filterdata", PaginationList);//added for pagination
                    //
                     if(response.getReturnValue().status == "Partial"){
                     component.find('notifLib').showToast({
                        "variant": "error",
                        "message": response.getReturnValue().messsage,
                        
                    });
                   } 
                }          
                
            }
        });
        $A.enqueueAction(action);
    },
    
    Search : function (component, event, helper) {
        component.set("v.spinner", true);
        var action = component.get("c.getContract");
        //Set the Object parameters and Field Set name
        action.setParams({  
            startDatestring : component.get("v.startDate"),
            enddatestring : component.get("v.endDate")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            console.log('response==>>',response.getreturnvalue());
            if(state === 'SUCCESS'){
                component.set("v.showResults",true);
                component.set("v.data", response.getReturnValue().liRebateContracts);
                component.set("v.filterdata", response.getReturnValue().liRebateContracts);
                component.set("v.Distributors", response.getReturnValue().liDistributor);
                component.set("v.salesRep", response.getReturnValue().liSalesRep);
                component.set("v.Region", response.getReturnValue().liRegion);
                component.set("v.WFStatus", response.getReturnValue().liWFStatus);
                component.set("v.Type", response.getReturnValue().liType);
                component.set("v.spinner", false);
                
                //Added on 21/04/2020 --> Data protection from Unauthorised user
                console.log('Profile'+response.getReturnValue().LoggedInUserProfile);
                if(!response.getReturnValue().UserType &&
                   (response.getReturnValue().LoggedInUserProfile != 'Brazil Rebate Admin'&&
                    response.getReturnValue().LoggedInUserProfile != 'Brazil System Administrator'&&
                    response.getReturnValue().LoggedInUserProfile != 'System Administrator'&&
                    response.getReturnValue().LoggedInUserProfile != 'Brazil Customer Service Manager'&&
                    response.getReturnValue().LoggedInUserProfile != 'Brazil Customer Service User'&&
                   	response.getReturnValue().LoggedInUserProfile != 'Brazil Regional Head')){ //INCTASK0286695: Sayan given access for the Region Heads
                    
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error!",
                        "message": $A.get("$Label.c.AuthenticationError"),
                        "type": "error"
                    });
                    toastEvent.fire();
                    
                }
                //end patch
                
                //for pagination
                component.set("v.totalRecords", component.get("v.data").length);
                    var sObjectList = component.get("v.data");
                    var pageSize = component.get("v.pageSize");
                    // set start as 0
                    component.set("v.startPage",0);//changed to 1
                    component.set("v.PageNumber",1);
                    component.set("v.endPage",pageSize-1);
                    component.set("v.TotalPages", Math.ceil(component.get("v.totalRecords") / pageSize));
                    var PaginationList = [];
                              for(var i=0; i< pageSize; i++){
                    if(component.get("v.data").length> i)
                        PaginationList.push(sObjectList[i]);
                    component.set("v.PaginationList", PaginationList);
                              }
                console.log('status'+response.getReturnValue().status);
                console.log('status'+response.getReturnValue().messsage);
                if(response.getReturnValue().status == "Partial"){
                     component.find('notifLib').showToast({
                        "variant": "error",
                        "message": response.getReturnValue().messsage,
                        
                    });
                }
            }
        });
        $A.enqueueAction(action);   
        
        
    },
    
    Cancel: function (component, event, helper) {
        component.set("v.showResults",false);          
    },
    
    handleRowAction: function (component, event, helper) {
        
        var action = event.getParam('action');
        var row = event.getParam('row');
        
        switch (action.name) {
            case 'Goals':
                helper.Goals(component, event, helper, row);
                break;
            case 'Done':
                helper.details(component, event, helper, row);
                break;
            case 'Calc':
                helper.calc(component, event, helper, row);
                break;
            case 'Print':
                helper.Print(component, event, helper, row);
                break;
            default:
                helper.showRowDetails(row);
                break;
        }
    },
    
    onChangeFilter : function (component, event, helper) {
        
        
        var Diretoria = component.find("Diretoria").get("v.value");
        var BU = component.find("BU").get("v.value");
        var Regional = component.find("Regional").get("v.value");
        var CTC = component.find("CTC").get("v.value");
        var distributor = component.find("Distribuidor").get("v.value"); 
        var tipo = component.find("tipo").get("v.value");
        var Classificação = component.find("Classificação").get("v.value");
        var status = component.find("Status").get("v.value");
        
        console.log('search');
        var search = component.find("enter-search").get("v.value");
        console.log(search);
        var data = component.get("v.data");
        
        var query = {} ;
         if(Diretoria != '')
            query.DirectorId = Diretoria;
        
         if(BU != '')
            query.BUId = BU;
        
          if(Regional != '')
            query.BranchId = Regional;
        
        if(distributor != '')
            query.DistributorId = distributor;
        
       
        
        if(status != '')
            query.Status = status;
        
        if(tipo != '')
            query.Type = tipo;
        
        if(CTC != '')
            query.salesRep = CTC;
        
        if(Classificação != '')
            query.Category_Name = Classificação;
        
        var filteredData = data.filter( (item) => {
            
            for (let key in query) {
            
            if (item[key] === undefined || !query[key].includes(item[key])) {
            return false;
        }
                                       }
                                       return true;
                                       });
       console.log(filteredData); 
        if(search != ''){
            query.DistributorId = search;
            filteredData = JSON.parse(JSON.stringify(filteredData));
            console.log(filteredData); 
            filteredData = filteredData.filter(obj => obj.DistributorCodeAndName.toLowerCase().includes(search.toLowerCase()) 
                                              || obj.Contract && obj.Contract.toLowerCase().includes(search.toLowerCase()) 
                                              || obj.Type && obj.Type.toLowerCase().includes(search.toLowerCase())
                                               || obj.Category_Name && obj.Category_Name.toLowerCase().includes(search.toLowerCase())
                                              || obj.Status && obj.Status.toLowerCase().includes(search.toLowerCase())
                                              || obj.Director && obj.Director.toLowerCase().includes(search.toLowerCase())
                                               || obj.BU && obj.BU.toLowerCase().includes(search.toLowerCase())
                                               || obj.Branch && obj.Branch.toLowerCase().includes(search.toLowerCase())
                                               || obj.CTC && obj.CTC.toLowerCase().includes(search.toLowerCase())
                                               || obj.Initial_date && obj.Initial_date.toLowerCase().includes(search.toLowerCase())
                                               || obj.Final_date && obj.Final_date.toLowerCase().includes(search.toLowerCase())
                                                                                  )//
        }
        console.log(filteredData);
        component.set("v.filterdata",filteredData);
        
        if(component.get("v.filterdata").length>0){
            var sObjectList = component.get("v.filterdata");
        
        var pageSize = component.get("v.pageSize");
            console.log(component.get("v.filterdata").length);
        // set start as 0
        component.set("v.totalRecords", component.get("v.filterdata").length);
        component.set("v.startPage",0);//changed to 1
        component.set("v.PageNumber",1);
        component.set("v.endPage",pageSize-1);
        component.set("v.TotalPages", Math.ceil(component.get("v.totalRecords") / pageSize));
        var PaginationList = [];
        for(var i=0; i< pageSize; i++){
            if(component.get("v.filterdata").length> i)
                PaginationList.push(sObjectList[i]);
            
        }
       component.set("v.PaginationList", PaginationList); 
            console.log(PaginationList);
        } 
        else{
            var PaginationList = [];
            component.set("v.PaginationList", PaginationList);
            //Added on 22-04-2020 - Pagination defect patch
            component.set("v.PageNumber",1); 
            component.set("v.TotalPages", 1);
            //
        }
        
    },
    
       Next: function(component, event, helper) {
        
        if(component.get("v.filterdata").length>0)
            var sObjectList = component.get("v.filterdata");
        else
            var sObjectList = component.get("v.data");    
        var end = component.get("v.endPage");
        var start = component.get("v.startPage");
        var pageSize = component.get("v.pageSize");
        var Paginationlist = [];
        var counter = 0;
        for(var i=end+1; i<end+pageSize+1; i++){
            if(sObjectList.length > i){
                Paginationlist.push(sObjectList[i]);
            }
            counter ++ ;
        }
        start = start + counter;
        end = end + counter;
        
        component.set("v.startPage",start);
        component.set("v.endPage",end);
        component.set("v.PaginationList", Paginationlist);
        component.set("v.PageNumber",component.get("v.PageNumber")+1);
    },
    
    Previous: function(component, event, helper) {
        
        if(component.get("v.filterdata").length>0)
            var sObjectList = component.get("v.filterdata");
        else
            var sObjectList = component.get("v.data");
        var end = component.get("v.endPage");
        var start = component.get("v.startPage");
        var pageSize = component.get("v.pageSize");
        var Paginationlist = [];
        var counter = 0;
        for(var i= start-pageSize; i < start ; i++){
            if(i > -1){
                Paginationlist.push(sObjectList[i]);
                counter ++;
            }else{
                start++;
            }
        }
        start = start - counter;
        end = end - counter;
        
        component.set("v.startPage",start);
        component.set("v.endPage",end);
        component.set("v.PaginationList", Paginationlist);
        component.set("v.PageNumber",component.get("v.PageNumber")-1);
    },
    
    onChangePageSize: function(component, event, helper) {
        console.log(component.find("PageSize").get("v.value"));
        component.set("v.pageSize",parseInt(component.find("PageSize").get("v.value")));  
        
        component.set("v.totalRecords", component.get("v.data").length);
        
        if(component.get("v.filterdata").length>0)
            var sObjectList = component.get("v.filterdata");
        else
            var sObjectList = component.get("v.data");
        
        var pageSize = component.get("v.pageSize");
        // set start as 0
        component.set("v.startPage",0);//changed to 1
        component.set("v.PageNumber",1);
        component.set("v.endPage",pageSize-1);
        component.set("v.TotalPages", Math.ceil(component.get("v.totalRecords") / pageSize));
        var PaginationList = [];
        for(var i=0; i< pageSize; i++){
            if(component.get("v.data").length> i)
                PaginationList.push(sObjectList[i]);
            component.set("v.PaginationList", PaginationList);
        }
    },
    
    downloadCsv : function(component,event,helper){
        
        // get the Records [contract] list from 'ListOfContract' attribute 
        var stockData = component.get("v.filterdata");
       
        // call the helper function which "return" the CSV data as a String   
        var csv = helper.convertArrayOfObjectsToCSV(component,stockData);   
         if (csv == null){return;} 
        
        // ####--code for create a temp. <a> html tag [link tag] for download the CSV file--####     
	     var hiddenElement = document.createElement('a');
          hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
          hiddenElement.target = '_self'; // 
          hiddenElement.download = 'ExportData.csv';  // CSV file Name* you can change it.[only name not .csv] 
          document.body.appendChild(hiddenElement); // Required for FireFox browser
    	  hiddenElement.click(); // using click() js function to download csv file
       
        
        }, 
    
})
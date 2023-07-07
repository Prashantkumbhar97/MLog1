({
	Goals : function(component, event, helper, row) {
		component.set("v.showGoal",true);
        component.set("v.showHome",false);
        component.set("v.showCalculator",false);
        component.set("v.ContractHeader",row);
        console.log('header wala header is '+JSON.stringify(component.get("v.ContractHeader") ));
	},
    
    details : function(component, event, helper, row) {
		component.set("v.showDetail",true);
        component.set("v.showHome",false);
        component.set("v.showCalculator",false);
        component.set("v.ContractHeader",row);
	},
    calc : function(component, event, helper, row) {
        component.set("v.ContractHeader",row);
                console.log('w1===='+JSON.stringify(component.get("v.ContractHeader")));

		component.set("v.showDetail",false);
        component.set("v.showHome",false);
        component.set("v.showCalculator",true);
        
	},
    Print : function(component, event, helper, row) {
		component.set("v.showPrint",true);
        component.set("v.showHome",false);
        component.set("v.showCalculator",false);
        component.set("v.ContractHeader",row);
	},
    
    filter : function(component, event, helper, row, array, filters) {
         var filterKeys = Object.keys(filters);
  return array.filter(item => {
    // validates all filter criteria
    return filterKeys.every(key => {
      // ignores non-function predicates
      if (typeof filters[key] !== 'function') return true;
      return filters[key](item[key]);
    });
  });
    },
 
 handleNext: function(component, event, helper) {
        
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
        component.set('v.PaginationList', Paginationlist);
        component.set("v.PageNumber",component.get("v.PageNumber")+1);
    },
        
        handlePrev: function(component, event, helper) {
        
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
        component.set('v.PaginationList', Paginationlist);
        component.set("v.PageNumber",component.get("v.PageNumber")-1);
    },
        
    convertArrayOfObjectsToCSV : function(component,objectRecords){
        // declare variables
        var csvStringResult, counter, keys, columnDivider, lineDivider, Header;
       
        // check if "objectRecords" parameter is null, then return from function
        if (objectRecords == null || !objectRecords.length) {
            return null;
         }
        // store ,[comma] in columnDivider variabel for sparate CSV values and 
        // for start next line use '\n' [new line] in lineDivider varaible  
        columnDivider = ',';
        lineDivider =  '\n';
 
        // in the keys valirable store fields API Names as a key 
        // this labels use in CSV file header  
        Header = ['Contracto','Distribuidor','Tipo','Classificação','Status',
                'Diretoria','BU','Regional','CTC','Válido de','Válido Até' ];
        keys = ['Contract','DistributorCodeAndName','Type','Category_Name','Status',
                'Director','BU','Branch','CTC','Initial_date','Final_date' ];
        csvStringResult = '';
        csvStringResult += Header.join(columnDivider);
        csvStringResult += lineDivider;
 
        for(var i=0; i < objectRecords.length; i++){   
            counter = 0;
           
             for(var sTempkey in keys) {
                var skey = keys[sTempkey] ;  
 
              // add , [comma] after every String value,. [except first]
                  if(counter > 0){ 
                      csvStringResult += columnDivider; 
                   }   
               
               csvStringResult += '"'+ objectRecords[i][skey]+'"'; 
               
               counter++;
 
            } // inner for loop close 
             csvStringResult += lineDivider;
          }// outer main for loop close 
       
       // return the CSV formate String 
        return csvStringResult;        
    },

    
    
})
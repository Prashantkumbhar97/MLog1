@isTest
global class DGMockHttpResponseGenerator implements HttpCalloutMock {
    
    global HTTPResponse respond(HTTPRequest req) {
        HttpResponse res = new HttpResponse();
        
        if(req.getEndpoint().endsWith('testCallout'))
        {
        System.assertEquals('https://example.com/example/test', req.getEndpoint());
        System.assertEquals('POST', req.getMethod());
        }
        else if(req.getEndpoint().endsWith('testCallout'))
        {
        System.assertEquals('https://l4097-iflmap.hcisbp.eu1.hana.ondemand.com/http/Awaiting_Realization_Brazil', req.getEndpoint());
        System.assertEquals('GET', req.getMethod());
        }
        else if(req.getEndpoint().endsWith('testCallout'))
        {
        System.assertEquals('https://l4097-iflmap.hcisbp.eu1.hana.ondemand.com/http/Reject_Or_Cancel_Demand_Brazil', req.getEndpoint());
        System.assertEquals('GET', req.getMethod());
        }
        else if(req.getEndpoint().endsWith('testCallout'))
        {
        System.assertEquals('https://l4097-iflmap.hcisbp.eu1.hana.ondemand.com/http/Update_Actual_Budget_Brazil', req.getEndpoint());
        System.assertEquals('GET', req.getMethod());
        }
        else if(req.getEndpoint().endsWith('testCallout'))
        {
        System.assertEquals('https://l4097-iflmap.hcisbp.eu1.hana.ondemand.com/http/Reject_Or_Cancel_Demand_Brazil', req.getEndpoint());
        System.assertEquals('GET', req.getMethod());
        }
        else if(req.getEndpoint().endsWith('testCallout'))
        {
        System.assertEquals('https://l4097-iflmap.hcisbp.eu1.hana.ondemand.com/http/Fetch_Balance_Budget_Brazil', req.getEndpoint());
        System.assertEquals('GET', req.getMethod());
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.setBody('{"example":"test"}');
        res.setStatusCode(200);
       
        return res;
    }
    
    
    
}
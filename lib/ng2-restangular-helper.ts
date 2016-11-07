debugger;
import {URLSearchParams, Headers, RequestOptions, RequestMethod} from '@angular/http';

export class RestangularHelper {
  
  static createRequestOptions(options) {
    let requestQueryParams = RestangularHelper.createRequestQueryParams(options.params);
    let requestHeaders = RestangularHelper.createRequestHeaders(options.headers);
    let methodName = options.method.charAt(0).toUpperCase() + options.method.substr(1).toLowerCase();
    
    let requestOptions = new RequestOptions({
      method: RequestMethod[methodName],
      headers: requestHeaders,
      search: requestQueryParams,
      url: options.url,
      body: options.data,
    });
    
    return requestOptions;
  }
  
  static createRequestQueryParams(queryParams) {
    let requestQueryParams = Object.assign({}, queryParams);
    let search: URLSearchParams = new URLSearchParams();
    
    for (let key in requestQueryParams) {
      let value: any = requestQueryParams[key];
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      search.append(key, value);
    }
    
    return search;
  }
  
  static createRequestHeaders(headers) {
    return new Headers(Object.assign({}, headers));
  }
}

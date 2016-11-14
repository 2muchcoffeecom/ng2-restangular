import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule, Headers, Response, ResponseOptions} from "@angular/http";
import {RestangularModule} from "./../src";
import {App} from "./app.component";
import {MockProviders} from "./mock-data/mock-providers";
import {MockBackend} from "@angular/http/testing";
import {FormsModule} from "@angular/forms";
import {RouterModule, Router} from "@angular/router";

import {Observable} from "rxjs";

import {RequestShowService} from "./request-show-service/request-show.service"
import {routes} from "./app.routes";
import {RequestCalcModule} from "./request-calc";
import {SimpleAppModule} from "./simple-app";
import {HeroService} from "./heroes-service/hero.service";
import {LandingComponent} from "./landing/landing.component";
import {ExtendAppModule} from "./extend-app/extend-app.module";

@NgModule({
  declarations: [App, LandingComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RequestCalcModule,
    SimpleAppModule,
    ExtendAppModule,
    RouterModule.forRoot(routes),
    RestangularModule.forRoot((RestangularProvider) => {
      RestangularProvider.setBaseUrl('http://api.2muchcoffee.com/v1');
      RestangularProvider.setDefaultHeaders({'Authorization': 'Bearer UDXPx-Xko0w4BRKajozCVy20X11MRZs1'});
      RestangularProvider.addErrorInterceptor((response, subject, responseHandler) => {
        if (response.status === 403) {
          Observable.of(true)
            .switchMap(refreshAccesstokenResponse => {
              console.log("Error Interceptor:", response.request);
              return response.repeatRequest(response.request);
            })
            .subscribe(
              res => responseHandler(res),
              err => subject.error(err)
            );

          return false; // error handled
        }
        return true; // error not handled
      });
    }),
  ],
  providers: [MockProviders, RequestShowService, HeroService],
  bootstrap: [App]
})
export class AppModule {

  // This need only for Demo App
  // Its Fake Backend servise to return data
  constructor(backend: MockBackend, requestShowService: RequestShowService, heroService: HeroService) {
    backend.connections.subscribe(connection => {
      let resOptions = new ResponseOptions({
        body: JSON.stringify([{user: "first"}, {user: "second"}, {user: "third"}]),
        headers: new Headers({
          'header': 'server-header'
        }),
        status: 200
      });
      let response = new Response(resOptions);

      requestShowService.requestToShow.next(connection.request);
      // console.log(connection.request);
      console.log("Request Url on Backend: ", connection.request.url);


      if (/(http:\/\/api.2muchcoffee.com\/v1\/heroes)/.test(connection.request.url)) {
        resOptions = resOptions.merge({body: JSON.stringify(heroService.getHeroes())});
        response = new Response(resOptions);
        if (connection.request.method == 1 && connection.request._body.id >= 0) {
          heroService.deleteHero(connection.request._body.id);
          resOptions = resOptions.merge({body: JSON.stringify(heroService.getHeroes())});
          response = new Response(resOptions);
        }
        if (connection.request.method == 2 && connection.request.headers.has("id")) {
          resOptions = resOptions.merge({body: JSON.stringify(heroService.putHero(connection.request.headers.get("id"), connection.request.getBody()))});
          response = new Response(resOptions);
        }
        // let t = connection.request.url.indexOf(/number=[0-9]+/);
        if (/(http:\/\/api.2muchcoffee.com\/v1\/heroes\?number=)/.test(connection.request.url)) {
          let number = +connection.request.url.slice(connection.request.url.lastIndexOf("=") + 1, connection.request.url.length);
          resOptions = resOptions.merge({body: JSON.stringify(heroService.getHeroes(number))});
          response = new Response(resOptions);
        }
        if (/(http:\/\/api.2muchcoffee.com\/v1\/heroes\/)/.test(connection.request.url)) {
          let id = connection.request.url.slice(connection.request.url.lastIndexOf("/") + 1, connection.request.url.length);
          resOptions = resOptions.merge({body: JSON.stringify(heroService.getHero(id))});
          response = new Response(resOptions);
        }
      }

      if (/(http:\/\/api.2muchcoffee.com\/v1\/error)/.test(connection.request.url)) {
        resOptions = resOptions.merge({status: 403});
        response = new Response(resOptions);
        connection.mockError(response);
      }
      else {
        connection.mockRespond(response);
      }
    })
  }

}
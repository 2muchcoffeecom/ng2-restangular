import {Component, Inject} from "@angular/core";
import {Restangular} from "./../../src";

import 'rxjs/Rx';
import {RequestShowService} from "../request-show-service/request-show.service";
import {Hero} from "../heroes-service/hero";
// import {Random, RandomUser} from "./extend-app.module";
import {RANDOM_USER} from "../random-user-restangular/random-user-restangular";


@Component({
  selector: 'extend-app',
  styleUrls: ['./extend-app/extend-app.style.css'],
  templateUrl: './extend-app/extend-app.template.html'
})
export class ExtendAppComponent {
  public response;

  public users;

  constructor(public restangular: Restangular,  @Inject(RANDOM_USER) public randomUser) {

  }

  getUsers() {
    this.randomUser.all("users").getList().subscribe(users => {
      this.users = users;
    });
  }
}

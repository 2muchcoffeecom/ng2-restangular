import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {HttpModule} from "@angular/http";
import {FormsModule} from "@angular/forms";
import {HeroDetailComponent} from "./hero-detail.component";



@NgModule({
  declarations: [HeroDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
  ],
  exports: [HeroDetailComponent]
})
export class HeroDetailModule {


}

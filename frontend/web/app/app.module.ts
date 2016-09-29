import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './component/app.component';
import { MessageComponent }   from './component/message.component';

import { routing,appRoutingProviders } from './app.routing';

@NgModule({
    imports: [BrowserModule, routing],
    declarations: [AppComponent, MessageComponent],
    providers: [appRoutingProviders],
    bootstrap: [AppComponent]
})
export class AppModule {
}
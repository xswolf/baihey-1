import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent }      from './component/app.component';
import { MessageComponent }      from './component/message.component';

const appRoutes: Routes = [
    { path: 'message', component: MessageComponent },
    { path: '', component: AppComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
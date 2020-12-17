import { NgModule, Injectable, Inject } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { HTTP_INTERCEPTORS, HttpClientXsrfModule } from '@angular/common/http';
import { Request } from 'express';
import { browser } from 'protractor';
import { TokenInterceptor } from './helper/token.interceptor';
import { ErrorInterceptor } from './helper/error.interceptor';


@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ModuleMapLoaderModule,
    ServerTransferStateModule
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule { }

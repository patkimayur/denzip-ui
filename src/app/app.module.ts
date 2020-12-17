import { AgmCoreModule } from '@agm/core';
import { HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule, MatBadgeModule,
  MatButtonModule, MatChipsModule, MatFormFieldModule,
  MatIconModule, MatInputModule, MatMenuModule,
  MatRadioModule, MatSelectModule, MatSnackBarModule, MatTooltipModule
} from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeferLoadModule } from '@trademe/ng-defer-load';
import { AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider, SocialLoginModule } from 'angularx-social-login';
import { ConnectionService } from 'ng-connection-service';
import { NouisliderModule } from 'ng2-nouislider';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { AlertComponent } from './components/alert/alert.component';
import { AmenitiesComponent } from './components/amenities/amenities.component';
import { TextGridComponent } from './components/app-text-grid/app-text-grid.component';
import { CarouselDialogComponent, CarouselNgComponent } from './components/carousel-ng/carousel-ng.component';
import { DeactivationDialogComponent } from './components/deactivated-listing-component/deactivated-listing-dialog.component';
import { InvalidCashbackDeactivationDialogComponent } from './components/deactivated-listing-component/invalid-cashback-dialog.component';
import { DetailInfoComponent } from './components/detail-info/detail-info.component';
import { ErrorComponent } from './components/error-component/error-component';
import { ErrorSearchListingComponent } from './components/error-search-listing/error-search-listing.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FilterComponent, FilterDialogComponent } from './components/filter/filter.component';
import { FooterComponent } from './components/footer/footer/footer.component';
import { InfoGridComponent } from './components/info-grid/info-grid.component';
import { InterestedUsersComponent } from './components/interested-users/interested-users.component';
import { LocalityComponent } from './components/locality/locality.component';
import { LocationMapComponent } from './components/location-map/location-map.component';
import { OnlineDetectionComponent } from './components/online-detection/online-detection.component';
import { PageNotFoundComponent } from './components/page-not-found-component/page-not-found-component';
import { PropertySummaryCardComponent } from './components/property-summary-card/property-summary-card.component';
import {
  ScheduledAlertDialogComponent, ScheduleRequestApprovalDialogComponent,
  ScheduleRequestComponent, ScheduleRequestDialogComponent
} from './components/schedule-request/schedule-request.component';
import { SearchComponent } from './components/search/search.component';
import { SortComponent, SortDialogComponent } from './components/sort/sort.component';
import { TopToolbarComponent } from './components/top-toolbar/top-toolbar.component';
import { UserAgreementDialogComponent } from './components/user-agreement-dialog/user-agreement-dialog.component';
import { AuthGuard } from './guards/auth.guard';
import { ErrorInterceptor } from './helper/error.interceptor';
import { TokenInterceptor } from './helper/token.interceptor';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { AddApartmentComponent } from './pages/add-apartment/add-apartment.component';
import { AddListingComponent } from './pages/add-listing/add-listing.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { HomeComponent } from './pages/home/home.component';
import { PropertyDetailComponent } from './pages/property-detail/property-detail.component';
import { PropertySummaryComponent } from './pages/property-summary/property-summary.component';
import { ScheduleListingComponent } from './pages/schedule-listing/schedule-listing.component';
import { ShortlistedListingComponent } from './pages/shortlisted-listing/shortlisted-listing.component';
import { AcceptOTPDialogComponent, OTPDialogComponent } from './pages/sign-in/accept-otp-dialog.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { UserDisplayDetailsComponent, UserTagDialogComponent } from './pages/user-display-details/user-display-details.component';
import { UserInfoComponent } from './pages/user-info/user-info.component';
import { AddApartmentService } from './service/add-apartment.service';
import { AddListingService } from './service/add-listing.service';
import { AlertService } from './service/alert.service';
import { AuthenticationService } from './service/authentication.service';
import { CustomErrorHandler } from './service/custom-error-handler';
import { FileUploadService } from './service/file-upload.service';
import { FilterService } from './service/filter.service';
import { ListingSummaryService } from './service/listing-summary.service';
import { ListingUserRelationService } from './service/listing-user-relation.service';
import { MatSnackbarService } from './service/mat-snackbar.service';
import { MetaService } from './service/meta.service';
import { PropertyDetailService } from './service/property-detail.service';
import { RazorpayService } from './service/razorpay.service';
import { RestClientService } from './service/rest-client.service';
import { TagService } from './service/tag.service';
import { UserService } from './service/user.service';
import { UserProspectiveInfoComponent } from './pages/user-prospective-info/user-prospective-info.component';
import { TitleCasePipe, CommonModule, LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { InputTagComponent } from './components/input-tag/input-tag.component';
import { BrokerOrgService } from './service/broker-org.service';
import { BrokerOrgRegComponent } from './pages/broker-org-reg/broker-org-reg.component';
import { BrokerOrgMappingComponent } from './pages/broker-org-mapping/broker-org-mapping.component';
import { Ng2ImgMaxModule } from 'ng2-img-max';
import { AllRecentListingsComponent } from './pages/all-recent-listings/all-recent-listings.component';
import { NgtUniversalModule } from '@ng-toolkit/universal';
import { BrowserModule } from '@angular/platform-browser';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { UtilsService } from './service/utils.service';
import {
  ListingStatusButtonsComponent,
  OwnerDetailDialogComponent
} from './components/listing-status-buttons/listing-status-buttons.component';

/**
 * Pages
 */
const Components = [
  TopToolbarComponent,
  AmenitiesComponent,
  LocationMapComponent,
  CarouselNgComponent,
  LocalityComponent,
  TextGridComponent,
  InfoGridComponent,
  PropertyDetailComponent,
  SearchComponent,
  FilterDialogComponent,
  FilterComponent,
  PropertySummaryCardComponent,
  PropertySummaryComponent,
  PageNotFoundComponent,
  ErrorComponent,
  HomeComponent,
  ShortlistedListingComponent,
  ScheduleRequestDialogComponent,
  ScheduledAlertDialogComponent,
  ScheduleRequestApprovalDialogComponent,
  ScheduleRequestComponent,
  ScheduleListingComponent,
  AddListingComponent,
  OTPDialogComponent,
  AcceptOTPDialogComponent,
  FooterComponent,
  CarouselDialogComponent,
  DeactivationDialogComponent,
  InvalidCashbackDeactivationDialogComponent,
  UserDisplayDetailsComponent,
  UserAgreementDialogComponent,
  SortDialogComponent,
  UserTagDialogComponent,
  UserProspectiveInfoComponent,
  InputTagComponent,
  OwnerDetailDialogComponent
];

// Configs
export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
    [
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider('312489496331262')
      },
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('718448223879-3bad7sbr86h7to4agrm0cqrs2sm6dt5l.apps.googleusercontent.com')
      },
    ]
  );
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    ...Components,
    SignInComponent,
    UserDetailComponent,
    AlertComponent,
    FileUploadComponent,
    ListingStatusButtonsComponent,
    DetailInfoComponent,
    UserInfoComponent,
    AddApartmentComponent,
    InterestedUsersComponent,
    ErrorSearchListingComponent,
    ContactUsComponent,
    SortComponent,
    OnlineDetectionComponent,
    AboutUsComponent,
    InputTagComponent,
    BrokerOrgRegComponent,
    BrokerOrgMappingComponent,
    AllRecentListingsComponent,
  ],
  entryComponents: [...Components],
  imports: [
    HttpClientModule,
    TransferHttpCacheModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN'
    }),
    MatGridListModule,
    MatCardModule,
    MatBadgeModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBAPxKtJBPZ1mg2eTmafIWa_LMHcqdHqWc',
    }),
    NgbModule.forRoot(),
    MatTabsModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    FormsModule,
    AppRoutingModule,
    MatDialogModule,
    MatCheckboxModule,
    MatExpansionModule,
    NouisliderModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    SocialLoginModule,
    MatSnackBarModule,
    MatMenuModule,
    DeferLoadModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatFormFieldModule,
    DeviceDetectorModule.forRoot(),
    Ng2ImgMaxModule,
    CommonModule,
    NgtUniversalModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  providers: [PropertyDetailService, RestClientService,
    AuthenticationService, ListingSummaryService, FilterService, TagService, BrokerOrgService,
    ListingUserRelationService, ScheduleRequestComponent, InputTagComponent,
    FileUploadService,
    AlertService, AuthGuard, ConnectionService,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} },
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    {
      provide: LOCALE_ID,
      useValue: 'en-IN'
    },
    UserService,
    AddListingService,
    AddApartmentService,
    MatSnackbarService,
    MetaService,
    UserAgreementDialogComponent,
    TitleCasePipe,
    UtilsService,
    RazorpayService,
    { provide: ErrorHandler, useClass: CustomErrorHandler }],
  bootstrap: [AppComponent]
})
export class AppModule { }

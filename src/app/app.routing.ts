import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './components/error-component/error-component';
import { PageNotFoundComponent } from './components/page-not-found-component/page-not-found-component';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { AuthGuard } from './guards/auth.guard';
import { FilterRequest } from './models/filter-request';
import { ListingDetailRequest } from './models/listing-detail-request';
import { PageNavigationData } from './models/page-navigation-data';
import { User, UserDisplayInfo } from './models/user';
import { AddApartmentComponent } from './pages/add-apartment/add-apartment.component';
import { AddListingComponent } from './pages/add-listing/add-listing.component';
import { HomeComponent } from './pages/home/home.component';
import { PropertyDetailComponent } from './pages/property-detail/property-detail.component';
import { PropertySummaryComponent } from './pages/property-summary/property-summary.component';
import { ScheduleListingComponent } from './pages/schedule-listing/schedule-listing.component';
import { ShortlistedListingComponent } from './pages/shortlisted-listing/shortlisted-listing.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { UserInfoComponent } from './pages/user-info/user-info.component';
import { AddApartmentResolver } from './resolvers/add-apartment-resolver.service';
import { AddListingResolver } from './resolvers/add-listing-resolver.service';
import { HomePageResolver } from './resolvers/home-page-resolver.service';
import { ListingSummaryResolver } from './resolvers/listing-summary-resolver.service';
import { PropertyDetailResolver } from './resolvers/property-detail-resolver.service';
import { ScheduleListingResolver } from './resolvers/schedule-listing-resolver.service';
import { ShortlistedListingResolver } from './resolvers/shortlisted-listing-resolver.service';
import { UserInfoResolver } from './resolvers/user-info-resolver.service';
import { RestClientService } from './service/rest-client.service';
import { UserDisplayDetailsComponent } from './pages/user-display-details/user-display-details.component';
import { UserDisplayDetailsResolver } from './resolvers/user-display-details-resolver.service';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { MatSnackbarService } from './service/mat-snackbar.service';
import { UserAgreementDialogComponent } from './components/user-agreement-dialog/user-agreement-dialog.component';
import { UpdateListingResolver } from './resolvers/update-listing-resolver.service';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { UserProspectiveInfoComponent } from './pages/user-prospective-info/user-prospective-info.component';
import { UserProspectiveInfoResolver } from './resolvers/user-prospective-info-resolver.service';
import { InputTagComponent } from './components/input-tag/input-tag.component';
import { BrokerOrgRegComponent } from './pages/broker-org-reg/broker-org-reg.component';
import { BrokerOrgMappingComponent } from './pages/broker-org-mapping/broker-org-mapping.component';
import { AdminBrokerAuthGuard } from './guards/admin-broker-auth.guard';
import { AllRecentListingsResolver } from './resolvers/all-recent-listings-resolver.service';
import { AllRecentListingsComponent } from './pages/all-recent-listings/all-recent-listings.component';



const appRoutes: Routes = [
  {
    path: 'home', component: HomeComponent,
    resolve: { message: HomePageResolver }, runGuardsAndResolvers: 'always'
  },
  {
    path: 'policy', component: UserAgreementDialogComponent, runGuardsAndResolvers: 'always'
  },
  {
    path: 'add-listing', component: AddListingComponent, pathMatch: 'full',
    resolve: { message: AddListingResolver }, canActivate: [AdminBrokerAuthGuard],
    data: {
      title: 'Add Denzip Property | Rent / Buy / Sell Property | Denzip - Bangalore\'s NextGen Property Portal',
    }
  },
  {
    path: 'update-listing/:id', component: AddListingComponent,
    pathMatch: 'full', runGuardsAndResolvers: 'always', resolve: { message: UpdateListingResolver }, canActivate: [AdminAuthGuard],
    data: {
      title: 'Update Denzip Property | Rent / Buy / Sell Property | Denzip - Bangalore\'s NextGen Property Portal',
    }
  },
  {
    path: 'add-apartment', component: AddApartmentComponent, pathMatch: 'full',
    resolve: { message: AddApartmentResolver }, canActivate: [AdminBrokerAuthGuard],
    data: {
      title: 'Add Apartment To Denzip | Rent / Buy / Sell Property | Denzip - Bangalore\'s NextGen Property Portal',
    }
  },
  {
    path: 'listing-summary', component: PropertySummaryComponent, pathMatch: 'full',
    resolve: { message: ListingSummaryResolver }, runGuardsAndResolvers: 'always',
    // No data required here as component sets title dynamically
  },
  {
    path: 'listing-detail', component: PropertyDetailComponent,
    resolve: { message: PropertyDetailResolver },
    // No data required here as component sets title dynamically
  },
  {
    path: 'listing-detail/:id', component: PropertyDetailComponent,
    resolve: { message: PropertyDetailResolver },
    // No data required here as component sets title dynamically
  },
  {
    path: 'shortlisted-listings', component: ShortlistedListingComponent,
    resolve: { message: ShortlistedListingResolver }, runGuardsAndResolvers: 'always', canActivate: [AuthGuard],
    data: {
      title: 'Denzip Property Cart | Rent / Buy / Sell Property | Denzip - Bangalore\'s NextGen Property Portal',
    }
  },
  {
    path: 'app-user-display-details', component: UserDisplayDetailsComponent,
    resolve: { message: UserDisplayDetailsResolver }, canActivate: [AuthGuard]
    , runGuardsAndResolvers: 'always',
    data: {
      title: 'Denzip User Detail | Rent / Buy / Sell Property | Denzip - Bangalore\'s NextGen Property Portal',
    }
  },
  {
    path: 'sign-in', component: SignInComponent,
  },
  {
    path: 'contact-us', component: ContactUsComponent,
    data: {
      title: 'Contact Us to Rent, Sale, Buy a Home, Apartment, Flat In Bangalore',
    }
  },
  {
    path: 'about-us', component: AboutUsComponent,
    data: {
      title: 'Know About Us to Rent, Sale, Buy a Home, Apartment, Flat In Bangalore',
    }
  },
  {
    path: 'app-user-detail', component: UserDetailComponent,
    data: {
      title: 'Denzip User Detail | Rent / Buy / Sell Property | Denzip - Bangalore\'s NextGen Property Portal',
    }
  },
  {
    path: 'app-broker-org-reg', component: BrokerOrgRegComponent,
    pathMatch: 'full', runGuardsAndResolvers: 'always', canActivate: [AdminAuthGuard],
    data: {
      title: 'Denzip Broker Org Registration | Rent / Buy / Sell Property | Denzip - Bangalore\'s NextGen Property Portal',
    }
  },
  {
    path: 'app-broker-org-mapping', component: BrokerOrgMappingComponent,
    pathMatch: 'full', runGuardsAndResolvers: 'always', canActivate: [AdminAuthGuard],
    data: {
      title: 'Denzip Broker Org Mapping | Rent / Buy / Sell Property | Denzip - Bangalore\'s NextGen Property Portal',
    }
  },
  {
    path: 'schedule-listings', component: ScheduleListingComponent,
    resolve: { message: ScheduleListingResolver }, runGuardsAndResolvers: 'always', canActivate: [AuthGuard],
    data: {
      title: 'Denzip User Shortlisted Listings | Rent / Buy / Sell Property | Denzip - Bangalore\'s NextGen Property Portal',
    }
  },
  {
    path: 'user-info', component: UserInfoComponent,
    resolve: { message: UserInfoResolver }, runGuardsAndResolvers: 'always', canActivate: [AuthGuard],
    data: {
      title: 'Denzip User Properties | Rent / Buy / Sell Property | Denzip - Bangalore\'s NextGen Property Portal',
    }
  },
  {
    path: 'user-prospective-info', component: UserProspectiveInfoComponent,
    resolve: { message: UserProspectiveInfoResolver }, runGuardsAndResolvers: 'always', canActivate: [AuthGuard],
    data: {
      title: 'Denzip Prospective Properties | Rent / Buy / Sell Property | Denzip - Bangalore\'s NextGen Property Portal',
    }
  },
  {
    path: 'recentListings', component: AllRecentListingsComponent,
    resolve: { message: AllRecentListingsResolver }, runGuardsAndResolvers: 'always',
    data: {
      title: 'Recently Added Home, Apartment, Flats for Rent, Sale, Buy In Bangalore',
    }
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'error', component: ErrorComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
  providers: [
    HomePageResolver,
    PropertyDetailResolver,
    ListingSummaryResolver,
    FilterRequest,
    ListingDetailRequest,
    RestClientService,
    PageNavigationData,
    ShortlistedListingResolver,
    AuthGuard,
    AdminBrokerAuthGuard,
    AdminAuthGuard,
    User,
    UserDisplayInfo,
    UserDisplayDetailsResolver,
    ScheduleListingResolver,
    AddListingResolver,
    UpdateListingResolver,
    UserInfoResolver,
    UserProspectiveInfoResolver,
    AddApartmentResolver,
    MatSnackbarService,
    UserAgreementDialogComponent,
    InputTagComponent,
    AllRecentListingsResolver
  ]
})
export class AppRoutingModule { }

import SecureLS from 'secure-ls';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

export const SERVER_URL = '/propertyDetail';

export const PROPERTY_DETAIL_URL = '/getListingDetail';

export const FILTER_SERVICE_URL = '/getFilters';

// prod 2 link
 // export const SERVER_BASE_PATH = 'https://13.127.93.182/crs/';

// in local use below
// export const SERVER_BASE_PATH = 'https://localhost:8082/crs/';

// prod 1
// export const SERVER_BASE_PATH = 'https://13.234.166.235/crs/';

// prod 3 link
export const SERVER_BASE_PATH = 'https://www.denzip.com/crs/';


export const PROPERTY_SUMMARY_URL = '/getListings';

export const LISTING_TYPE_RENTAL = 'Rent';

export const LISTING_TYPE_SALE = 'Sale';

export const DEFAULT_LISTING_TYPE = LISTING_TYPE_RENTAL;

export const INDIA_PHONE_COUNTRY_CODE = '91';

// main title
export const TITLE = 'Real Estate Solutions';

// just add any type from here to display in neighbourhood - https://developers.google.com/places/supported_types
export const PLACE_SEARCH_CATEGORIES = ['restaurant', 'hospital', 'bank'];

// temp property to be removed
export const LISTING_SUMMARY_PROPERTIES = 'Bengaluru';

export const REST_CALL_RETRIES = 2;

export const CLIENT_ID = 'rw-client';

export const CLIENT_SECRET = 'crs-rw-ro7&';

export const OAUTH_ACCESS_TOKEN_URL = 'oauth/token';

export let SECURE_LS: SecureLS;

export function initialiseSecureLS() {
  // if (isPlatformBrowser(PLATFORM_ID)) {
  // Client only code.
  console.log('INTIALIZING SECURE LS');
  if (!SECURE_LS) {
    SECURE_LS = new SecureLS({
      isCompression: true,
      encodingType: 'aes', encryptionSecret: 'crsSecureLs', encryptionNamespace: 'realm1'
    });
  }
  // }
}

export const SNACKBAR_DURATION = 5000;

export const MARATHAHALLI = 'MARATHAHALLI';
export const KORAMANGALA = 'KORAMANGALA';
export const BTM = 'BTM';
export const OWNER_DETAIL_COST = '1000';
export const RAZORPAY_KEY_ID = 'rzp_live_OHSB6YJVY1fnbl';

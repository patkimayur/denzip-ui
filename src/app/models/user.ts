import { Injectable } from '@angular/core';

export class User {
  userId: string;
  userName: string;
  userMobile: any;
  userEmail: string;
  otp: string;
  secret: string;
  userFacebookId: string;
  userGoogleId: string;
  oAuthObj: OAuthObj;
  authorities: Authorities[];
}

export class UserDisplayInfo {
  userName: string;
  userMobile: any;
  userEmail: string;
}

export class OAuthObj {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

export class Authorities {
  id: string;
  name: string;
  authority: string;
}

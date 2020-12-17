import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserPrefVisitSlot, UserRequest } from '../models/user-pref-visit-slot';
import { SERVER_BASE_PATH } from '../resources/properties';
import { RestClientService } from './rest-client.service';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {

    private get_user_pref_visit_slot = 'getUserPrefVisitSlot';
    private update_user_pref_visit_slot = 'updateUserPrefVisitSlot';
    private update_shortlisted_listing_schedule_request = 'updateShortlistedListingToScheduleRequest';
    private update_exists_by_phone = 'userExistsByPhone';
    private add_User_Request_Callback = 'addUserRequestCallback';
    private get_owner_details = 'getOwnerDetails';

    constructor(private restClientService: RestClientService) { }

    public getUserPrefVisitSlot(currentUserId: string) {
        let body = new HttpParams();
        body = body.set('userId', currentUserId);
        return this.restClientService.executePostCall<UserPrefVisitSlot>(SERVER_BASE_PATH + this.get_user_pref_visit_slot, body);
    }

    public updateUserPrefVisitSlot(currentUserId: string, userPrefVisitSlot: UserPrefVisitSlot) {
        return this.restClientService.executePostCall<Boolean>(SERVER_BASE_PATH + this.update_user_pref_visit_slot,
            new UserRequest(currentUserId, userPrefVisitSlot));
    }

    public updateShortlistedListingToScheduleRequest(currentUserId: string) {
        let body = new HttpParams();
        body = body.set('userId', currentUserId);
        return this.restClientService.executePostCall<Boolean>(SERVER_BASE_PATH + this.update_shortlisted_listing_schedule_request, body);
    }

    public userExistsByPhone(userPhone: string) {
        let body = new HttpParams();
        body = body.set('userPhone', userPhone);
        return this.restClientService.executePostCall<Boolean>(SERVER_BASE_PATH + this.update_exists_by_phone, body);
    }

    public addUserRequestCallback(phoneNo: string) {
        let body = new HttpParams();
        body = body.set('phoneNo', phoneNo);
        return this.restClientService.executePostCall<Boolean>(SERVER_BASE_PATH + this.add_User_Request_Callback, body);
    }

    public getOwnerDetails(listingId: string, currentUserId: string): Observable<User> {
        let body = new HttpParams();
        body = body.set('listingId', listingId);
        body = body.set('userId', currentUserId);
        return this.restClientService.executePostCall<User>(SERVER_BASE_PATH + this.get_owner_details, body);
    }

}

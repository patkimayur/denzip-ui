import { Injectable } from '@angular/core';
import { Filter, FilterRequest } from '../models/filter-request';
import { SERVER_BASE_PATH } from '../resources/properties';
import { RestClientService } from './rest-client.service';
import { Tag } from '../models/tag';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class TagService {

    private static GET_ALL_TAGS_PATH = 'getAllTags';
    private static UPDATE_USER_TAGS_PATH = 'updateUserTags';
    private static GET_USER_TAGS_PATH = 'getUserTags';


    constructor(private restClientService: RestClientService) { }

    public getAllTags() {
        return this.restClientService.executeGetCall<Tag[]>(SERVER_BASE_PATH + TagService.GET_ALL_TAGS_PATH);
    }

    public getUserTags(userId: string) {
        let body = new HttpParams();
        body = body.set('userId', userId);
        return this.restClientService.executePostCall<Tag[]>(SERVER_BASE_PATH + TagService.GET_USER_TAGS_PATH, body);
    }

    public updateUserTags(userId: string, tagIdList: string[]) {
        let body = new HttpParams();
        body = body.set('userId', userId);
        body = body.set('tagIdList', tagIdList.join(','));
        return this.restClientService.executePostCall<boolean>(SERVER_BASE_PATH + TagService.UPDATE_USER_TAGS_PATH, body);
    }
}

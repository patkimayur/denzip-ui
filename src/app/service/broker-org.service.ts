import { Injectable } from '@angular/core';
import { Filter, FilterRequest } from '../models/filter-request';
import { SERVER_BASE_PATH } from '../resources/properties';
import { RestClientService } from './rest-client.service';
import { Tag } from '../models/tag';
import { HttpParams } from '@angular/common/http';
import { BrokerOrg } from '../models/broker-org';

@Injectable()
export class BrokerOrgService {

    private static GET_BROKER_ORG_DETAILS_BY_USER = 'getBrokerOrgByUserId';
    private static REGISTER_BROKER_ORG_DETAILS = 'registerBrokerOrgDetails';
    private static REGISTER_BROKER_ORG_MAPPING = 'registerBrokerOrgMapping';

    constructor(private restClientService: RestClientService) { }

    public getBrokerOrgByUserId(userId: string) {
        let body = new HttpParams();
        body = body.set('userId', userId);
        return this.restClientService.executePostCall<Tag[]>(SERVER_BASE_PATH + BrokerOrgService.GET_BROKER_ORG_DETAILS_BY_USER, body);
    }

    public registerBrokerOrg(brokerOrg: BrokerOrg) {
      return this.restClientService.executePostCall<BrokerOrg>(SERVER_BASE_PATH + BrokerOrgService.REGISTER_BROKER_ORG_DETAILS, brokerOrg);

    }

    public registerBrokerOrgMapping(brokerOrg: BrokerOrg) {
      return this.restClientService.executePostCall<BrokerOrg>(SERVER_BASE_PATH + BrokerOrgService.REGISTER_BROKER_ORG_MAPPING, brokerOrg);

    }

}

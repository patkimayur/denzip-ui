import { User } from './user';
import { Tag } from './tag';

export class BrokerOrg {
    brokerOrgId: string;
    brokerOrgName: string;
    brokerOrgAddress: string;
    brokerOrgMobile: string;
    brokerOrgEmail: string;
    tags: string;
    brokerPhoneNumbers: string;

    brokerOrgPrimaryUser: User;
}

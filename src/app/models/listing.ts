import { Apartment } from './apartment';

export class CRSImage {
  defaultImage: string;
  imageSet: string;
  imageName: string;
}

export class Listing {
  userId: string;
  listingId: string;
  listingTitle: string;
  listingAddress: string;
  listingType: string;
  propertyType: string;
  listingLatitude: number;
  listingLongitude: number;
  listingArea: number;
  listingValue: number;
  listingDeposit: number;
  furnishingType: string;
  listingBedroomCount: number;
  transactionMode: string;
  nonVegAllowed: boolean;
  bachelorAllowed: boolean;
  listingActiveInd: boolean;
  usersInterestedCount: number;
  currentLoggedInUserStatus: string;
  createdTime: Date;
  show: boolean;
  showMapLocality: boolean;
  createdByUserId: string;
  createdUserAuthorityNames: string[];
  listingPossessionBy: string;
  brokerListingOwnerMobile: string;
  listingVirtualPresence: boolean;

  crsImages: CRSImage[];

  listingAmenities: Map<String, Boolean>;
  apartment: Apartment;
}

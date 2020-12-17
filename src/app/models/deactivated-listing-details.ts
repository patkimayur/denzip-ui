export class DeactivateListingDetails {
  ownerId: string;
  tenantUserId: string;
  listingId: string;
  deactivationStatus: string;

  constructor(ownerId, tenantUserId, listingId, deactivationStatus) {
    this.ownerId = ownerId;
    this.tenantUserId = tenantUserId;
    this.listingId = listingId;
    this.deactivationStatus = deactivationStatus;
  }
}

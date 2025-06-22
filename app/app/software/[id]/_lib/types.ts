export interface SoftwareVersion {
  id: string;
  versionNumber: string;
  softwareId: string;
  price: number;
  published: string;
  isDefault: boolean;
  isApproved: boolean;
  isActive: boolean;
  licenseType: string;
}

export interface Publisher {
  id: string;
  name: string;
  countryName: string;
}

export interface Software {
  id: string;
  name: string;
  publisherId: string;
  approvalType: string;
  publisher: Publisher;
  versions: SoftwareVersion[];
}

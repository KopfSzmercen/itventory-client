export interface Logon {
  id: string;
  userId: string;
  hardwareId: string;
  domain: string;
  logonTime: string;
  ipAddress: string;
  user: {
    id: string;
    fullName: string;
    seniority: string;
    positionName: string;
  };
  hardware: {
    id: string;
    serialNumber: string;
    hardwareType: string;
  };
}

export interface PrimaryUser {
  id: string;
  fullName: string;
  seniority: string;
  positionName: string;
}

export interface Producent {
  id: string;
  name: string;
  countryName: string;
}

export interface Model {
  id: string;
  name: string;
  producentId: string;
  releaseDate: string;
  comments: string;
  producent: Producent;
}

export interface Room {
  roomName: string;
  floor: number;
}

export interface Manager {
  id: string;
  fullName: string;
  seniority: string;
  positionName: string;
}

export interface Department {
  id: string;
  name: string;
  manager: Manager;
}

export interface HardwareDetails {
  id: string;
  primaryUserId: string;
  defaultDomain: string;
  hardwareType: string;
  isActive: boolean;
  description: string;
  worth: number;
  producentId: string;
  modelId: string;
  modelYear: number;
  serialNumber: string;
  purchasedDate: string;
  roomId: string;
  departmentId: string;
  logons: Logon[];
  primaryUser: PrimaryUser;
  producent: Producent;
  model: Model;
  room: Room;
  department: Department;
}

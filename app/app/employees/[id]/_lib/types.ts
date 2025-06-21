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

export interface Room {
  id: string;
  officeId: string;
  roomName: string;
  floor: number;
  area: number;
  capacity: number;
  personResponsibleId: string;
  personResponsible: Manager;
}

export interface Employee {
  id: string;
  username: string;
  name: string | null;
  lastName: string | null;
  isActive: boolean;
  area: string | null;
  positionName: string | null;
  seniority: string | null;
  managerId?: string | null;
  departmentId?: string | null;
  hireDate: string | null;
  birthDate: string | null;
  roomId?: string | null;
  manager?: Manager | null;
  department?: Department | null;
  room?: Room | null;
}

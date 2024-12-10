export interface Matter {
  id: string;
  name: string;
  client: string;
  status: 'Open' | 'Pending' | 'Closed';
  notes: string;
  originatingAttorney: string;
  responsibleAttorney: string;
  courtLocation: string;
  practiceArea: string;
  caseNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MatterDeadline {
  id: string;
  matterId: string;
  matterOpens: Date;
  matterCloses: Date;
  matterDue: Date;
  statuteOfLimitations: Date;
}

export interface SubscribedAttorney {
  id: string;
  matterId: string;
  attorneyName: string;
}

export interface MatterDocument {
  id: string;
  matterId: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: Date;
} 
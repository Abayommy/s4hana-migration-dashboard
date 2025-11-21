export interface SystemInfo {
  sid: string;
  systemType: 'ECC' | 'ECC_on_HANA' | 'S4HANA';
  version: string;
  database: string;
  size: number;
  modules: string[];
  customCode: number;
  users: number;
}

export interface CustomObject {
  id: string;
  name: string;
  type: 'REPORT' | 'FUNCTION' | 'TABLE' | 'ENHANCEMENT' | 'BADI' | 'USER_EXIT';
  complexity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  lines: number;
  lastModified: Date;
  module: string;
  s4Impact: S4Impact;
}

export interface S4Impact {
  compatibility: 'COMPATIBLE' | 'DEPRECATED' | 'REPLACED' | 'INCOMPATIBLE';
  simplificationItem?: string;
  alternativeSolution?: string;
  estimatedEffort: number;
  automationPossible: boolean;
}

export interface MigrationAssessment {
  id: string;
  systemInfo: SystemInfo;
  assessmentDate: Date;
  totalScore: number;
  complexityLevel: 'SIMPLE' | 'MODERATE' | 'COMPLEX' | 'HIGHLY_COMPLEX';
  estimatedDuration: number;
  customObjects: CustomObject[];
  recommendations: Recommendation[];
  risks: Risk[];
}

export interface Recommendation {
  id: string;
  category: 'TECHNICAL' | 'FUNCTIONAL' | 'PROCESS' | 'TRAINING';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  effort: number;
}

export interface Risk {
  id: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  mitigation: string;
  probability: number;
}

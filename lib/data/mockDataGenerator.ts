import type { SystemInfo, CustomObject, MigrationAssessment, Recommendation, Risk } from '../types/migration';

const SIMPLIFICATION_ITEMS = [
  { id: '2267308', desc: 'S4TWL - Material Ledger Mandatory' },
  { id: '2220005', desc: 'SD - Pricing Condition Tables' },
  { id: '2265093', desc: 'FI - Document Splitting Mandatory' },
  { id: '2270456', desc: 'MM - Procurement Simplifications' },
];

const CUSTOM_PROGRAMS = [
  'ZSD_PRICING_REPORT', 'ZFI_ASSET_TRANSFER', 'ZMM_VENDOR_EVAL',
  'ZHR_PAYROLL_EXT', 'ZCUSTOM_WORKFLOW', 'ZBAPI_CUSTOMER',
];

export function generateMockAssessment(): MigrationAssessment {
  const customObjects: CustomObject[] = Array.from({ length: 150 }, (_, i) => {
    const complexity = Math.random() > 0.7 ? 'HIGH' : Math.random() > 0.4 ? 'MEDIUM' : 'LOW';
    const compatibility = Math.random() > 0.6 ? 'COMPATIBLE' : 
                          Math.random() > 0.3 ? 'DEPRECATED' : 'INCOMPATIBLE';
    
    return {
      id: `OBJ${1000 + i}`,
      name: CUSTOM_PROGRAMS[Math.floor(Math.random() * CUSTOM_PROGRAMS.length)] + `_${i}`,
      type: ['REPORT', 'FUNCTION', 'TABLE', 'ENHANCEMENT'][Math.floor(Math.random() * 4)] as any,
      complexity: complexity as any,
      lines: Math.floor(Math.random() * 5000) + 100,
      lastModified: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), 1),
      module: ['SD', 'MM', 'FI', 'CO', 'HR', 'PP'][Math.floor(Math.random() * 6)],
      s4Impact: {
        compatibility: compatibility as any,
        simplificationItem: Math.random() > 0.5 ? SIMPLIFICATION_ITEMS[Math.floor(Math.random() * 4)].id : undefined,
        alternativeSolution: compatibility !== 'COMPATIBLE' ? 'Use S/4HANA standard functionality' : undefined,
        estimatedEffort: complexity === 'HIGH' ? 40 : complexity === 'MEDIUM' ? 16 : 8,
        automationPossible: Math.random() > 0.4,
      }
    };
  });

  const systemInfo: SystemInfo = {
    sid: 'PRD',
    systemType: 'ECC',
    version: 'EHP8 for SAP ERP 6.0',
    database: 'Oracle 19c',
    size: 2500,
    modules: ['FI', 'CO', 'SD', 'MM', 'PP', 'HR'],
    customCode: customObjects.reduce((acc, obj) => acc + obj.lines, 0),
    users: 1200,
  };

  return {
    id: 'ASSESS-2024-001',
    systemInfo,
    assessmentDate: new Date(),
    totalScore: 72,
    complexityLevel: 'COMPLEX',
    estimatedDuration: 36,
    customObjects,
    recommendations: generateRecommendations(),
    risks: generateRisks(),
  };
}

function generateRecommendations(): Recommendation[] {
  return [
    {
      id: 'REC001',
      category: 'TECHNICAL',
      priority: 'HIGH',
      title: 'Custom Code Remediation',
      description: 'Analyze and remediate 47 critical custom objects before migration',
      effort: 320,
    },
    {
      id: 'REC002',
      category: 'FUNCTIONAL',
      priority: 'HIGH',
      title: 'Business Process Redesign',
      description: 'Align SD pricing procedures with S/4HANA best practices',
      effort: 160,
    },
  ];
}

function generateRisks(): Risk[] {
  return [
    {
      id: 'RISK001',
      category: 'Technical Debt',
      severity: 'CRITICAL',
      description: '2,345 custom code objects require review and potential remediation',
      mitigation: 'Implement phased remediation starting with critical objects',
      probability: 85,
    },
  ];
}

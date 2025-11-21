'use client';

import { useState, useEffect } from 'react';
import { Card, Title, Text, Metric, ProgressBar, Grid } from '@tremor/react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database,
  Code,
  Users 
} from 'lucide-react';
import { generateMockAssessment } from '@/lib/data/mockDataGenerator';
import { MigrationAssessment } from '@/lib/types/migration';
import CustomCodeAnalysis from '@/components/dashboard/CustomCodeAnalysis';
import MigrationTimeline from '@/components/dashboard/MigrationTimeline';
import ConfigurationPanel from '@/components/dashboard/ConfigurationPanel';
import { useConfigStore } from '@/lib/store/configStore';

export default function DashboardPage() {
  const [assessment, setAssessment] = useState<MigrationAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const config = useConfigStore();

  useEffect(() => {
    // Initial load
    setTimeout(() => {
      const initialAssessment = generateMockAssessment();
      setAssessment(initialAssessment);
      setLoading(false);
    }, 1000);
  }, []);

  // Regenerate assessment when config changes
  const handleConfigApply = () => {
    setLoading(true);
    setTimeout(() => {
      const newAssessment = generateMockAssessment();
      
      // Apply config values
      newAssessment.systemInfo.size = config.systemSize;
      newAssessment.systemInfo.users = config.users;
      newAssessment.systemInfo.modules = config.modules;
      newAssessment.totalScore = config.calculateReadiness();
      newAssessment.complexityLevel = config.complexity;
      
      // Adjust custom objects count based on config
      if (config.customObjects !== newAssessment.customObjects.length) {
        if (config.customObjects < newAssessment.customObjects.length) {
          newAssessment.customObjects = newAssessment.customObjects.slice(0, config.customObjects);
        } else {
          // Generate more objects if needed
          const currentLength = newAssessment.customObjects.length;
          for (let i = currentLength; i < config.customObjects; i++) {
            newAssessment.customObjects.push({
              id: `OBJ${2000 + i}`,
              name: `ZCUSTOM_PROGRAM_${i}`,
              type: 'REPORT',
              complexity: Math.random() > 0.5 ? 'HIGH' : 'MEDIUM',
              lines: Math.floor(Math.random() * 5000) + 100,
              lastModified: new Date(),
              module: config.modules[Math.floor(Math.random() * config.modules.length)] || 'FI',
              s4Impact: {
                compatibility: Math.random() > 0.6 ? 'COMPATIBLE' : 'INCOMPATIBLE',
                estimatedEffort: 20,
                automationPossible: Math.random() > 0.5,
              }
            });
          }
        }
      }
      
      // Update custom code count in system info
      newAssessment.systemInfo.customCode = newAssessment.customObjects.reduce((acc, obj) => acc + obj.lines, 0);
      
      // Adjust estimated duration based on complexity
      switch(config.complexity) {
        case 'SIMPLE':
          newAssessment.estimatedDuration = 16;
          break;
        case 'MODERATE':
          newAssessment.estimatedDuration = 24;
          break;
        case 'COMPLEX':
          newAssessment.estimatedDuration = 36;
          break;
        case 'HIGHLY_COMPLEX':
          newAssessment.estimatedDuration = 52;
          break;
      }
      
      setAssessment(newAssessment);
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!assessment) return null;

  const compatibleObjects = assessment.customObjects.filter(
    obj => obj.s4Impact.compatibility === 'COMPATIBLE'
  ).length;
  const incompatibleObjects = assessment.customObjects.filter(
    obj => obj.s4Impact.compatibility === 'INCOMPATIBLE'
  ).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <Title>S/4HANA Migration Readiness Dashboard</Title>
            <Text>System: {assessment.systemInfo.sid} | Assessment Date: {assessment.assessmentDate.toLocaleDateString()}</Text>
          </div>
          <div className="text-right">
            <Text className="text-sm text-gray-600">Interactive Demo Mode</Text>
            <Text className="text-xs text-blue-600">Click settings to adjust parameters →</Text>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <Grid numItemsLg={4} className="gap-6 mb-8">
        <Card decoration="top" decorationColor="blue">
          <div className="flex items-center justify-between">
            <div>
              <Text>Overall Readiness</Text>
              <Metric>{assessment.totalScore}%</Metric>
            </div>
            <Database className="h-8 w-8 text-blue-600" />
          </div>
          <ProgressBar value={assessment.totalScore} className="mt-3" color="blue" />
        </Card>

        <Card decoration="top" decorationColor="amber">
          <div className="flex items-center justify-between">
            <div>
              <Text>Migration Complexity</Text>
              <Metric>{assessment.complexityLevel}</Metric>
            </div>
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>
          <Text className="mt-3 text-sm">
            {assessment.estimatedDuration} weeks estimated
          </Text>
        </Card>

        <Card decoration="top" decorationColor="emerald">
          <div className="flex items-center justify-between">
            <div>
              <Text>Custom Objects</Text>
              <Metric>{assessment.customObjects.length}</Metric>
            </div>
            <Code className="h-8 w-8 text-emerald-600" />
          </div>
          <div className="mt-3 flex justify-between text-sm">
            <Text>{compatibleObjects} Compatible</Text>
            <Text className="text-red-600">{incompatibleObjects} Need Work</Text>
          </div>
        </Card>

        <Card decoration="top" decorationColor="violet">
          <div className="flex items-center justify-between">
            <div>
              <Text>System Size</Text>
              <Metric>{(assessment.systemInfo.size / 1000).toFixed(1)} TB</Metric>
            </div>
            <Users className="h-8 w-8 text-violet-600" />
          </div>
          <Text className="mt-3 text-sm">
            {assessment.systemInfo.users} Active Users
          </Text>
        </Card>
      </Grid>

      {/* Analysis Sections with actual components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomCodeAnalysis customObjects={assessment.customObjects} />
        <MigrationTimeline assessment={assessment} />
      </div>

      {/* Recommendations and Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <Title>Top Recommendations</Title>
          <div className="mt-4 space-y-3">
            {assessment.recommendations.slice(0, 3).map((rec) => (
              <div key={rec.id} className="border-l-4 border-blue-500 pl-3">
                <div className="flex justify-between">
                  <Text className="font-semibold">{rec.title}</Text>
                  <span className={`px-2 py-1 text-xs rounded ${
                    rec.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <Text className="text-sm text-gray-600">{rec.description}</Text>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <Title>Critical Risks</Title>
          <div className="mt-4 space-y-3">
            {assessment.risks.slice(0, 3).map((risk) => (
              <div key={risk.id} className="border-l-4 border-red-500 pl-3">
                <div className="flex justify-between">
                  <Text className="font-semibold">{risk.category}</Text>
                  <span className={`px-2 py-1 text-xs rounded ${
                    risk.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {risk.severity}
                  </span>
                </div>
                <Text className="text-sm text-gray-600">{risk.description}</Text>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Configuration Panel - Floating button and panel */}
      <ConfigurationPanel onApply={handleConfigApply} />
    </div>
  );
}

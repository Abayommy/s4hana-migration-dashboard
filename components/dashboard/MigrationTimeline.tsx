'use client';

import { Card, Title, Text, ProgressBar, Badge } from '@tremor/react';
import { CheckCircle, Circle, Clock, Calendar, Users, Target } from 'lucide-react';
import { MigrationAssessment } from '@/lib/types/migration';

interface Props {
  assessment: MigrationAssessment;
}

const PHASES = [
  { 
    id: 'prep',
    name: 'Preparation', 
    duration: 4, 
    tasks: ['System analysis', 'Custom code review', 'Data cleansing'],
    status: 'completed',
    progress: 100,
    icon: Target,
    color: 'emerald'
  },
  { 
    id: 'real',
    name: 'Realization', 
    duration: 12, 
    tasks: ['Configuration', 'Custom code adaptation', 'Integration testing'],
    status: 'in-progress',
    progress: 45,
    icon: Clock,
    color: 'blue'
  },
  { 
    id: 'final',
    name: 'Final Preparation', 
    duration: 8, 
    tasks: ['Data migration test', 'End user training', 'Cutover planning'],
    status: 'pending',
    progress: 0,
    icon: Users,
    color: 'gray'
  },
  { 
    id: 'golive',
    name: 'Go-Live & Support', 
    duration: 2, 
    tasks: ['Production cutover', 'Hypercare support', 'Performance tuning'],
    status: 'pending',
    progress: 0,
    icon: Calendar,
    color: 'gray'
  },
];

export default function MigrationTimeline({ assessment }: Props) {
  const totalDuration = PHASES.reduce((sum, phase) => sum + phase.duration, 0);
  const completedWeeks = PHASES
    .filter(p => p.status === 'completed')
    .reduce((sum, phase) => sum + phase.duration, 0);
  const overallProgress = (completedWeeks / totalDuration) * 100;

  return (
    <Card>
      <div className="mb-6">
        <div className="flex justify-between items-start mb-2">
          <Title>Migration Roadmap</Title>
          <Badge color="blue">{assessment.estimatedDuration} weeks total</Badge>
        </div>
        <Text>Overall Progress: {overallProgress.toFixed(0)}%</Text>
        <ProgressBar value={overallProgress} className="mt-2" color="blue" />
      </div>
      
      <div className="space-y-4">
        {PHASES.map((phase, index) => {
          const Icon = phase.icon;
          return (
            <div key={phase.id} className="relative">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`p-2 rounded-full bg-${phase.color}-100`}>
                    {phase.status === 'completed' ? (
                      <CheckCircle className={`h-5 w-5 text-${phase.color}-600`} />
                    ) : phase.status === 'in-progress' ? (
                      <Icon className={`h-5 w-5 text-${phase.color}-600 animate-pulse`} />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  {index < PHASES.length - 1 && (
                    <div className={`w-0.5 h-20 mt-2 ${
                      phase.status === 'completed' ? `bg-${phase.color}-500` : 'bg-gray-200'
                    }`} />
                  )}
                </div>
                
                <div className="flex-1 pb-8">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{phase.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        phase.status === 'completed' ? 'bg-green-100 text-green-700' :
                        phase.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {phase.status === 'in-progress' ? 'In Progress' : 
                         phase.status === 'completed' ? 'Completed' : 'Upcoming'}
                      </span>
                    </div>
                    <Text className="text-sm font-medium">{phase.duration} weeks</Text>
                  </div>
                  
                  {phase.progress > 0 && (
                    <ProgressBar 
                      value={phase.progress} 
                      className="mt-2 mb-2" 
                      color={phase.color as any}
                    />
                  )}
                  
                  <div className="text-sm text-gray-600 mt-2">
                    {phase.tasks.map((task, i) => (
                      <span key={task} className="inline-block">
                        {task}{i < phase.tasks.length - 1 ? ' • ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

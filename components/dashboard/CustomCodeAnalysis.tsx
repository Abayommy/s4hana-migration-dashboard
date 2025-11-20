'use client';

import { Card, Title, BarChart, Text, Badge, DonutChart, Flex } from '@tremor/react';
import { CustomObject } from '@/lib/types/migration';
import { Code, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface Props {
  customObjects: CustomObject[];
}

export default function CustomCodeAnalysis({ customObjects }: Props) {
  // Group by module and complexity
  const moduleAnalysis = customObjects.reduce((acc, obj) => {
    if (!acc[obj.module]) {
      acc[obj.module] = {
        module: obj.module,
        Compatible: 0,
        'Needs Review': 0,
        'Requires Change': 0,
        total: 0
      };
    }
    
    acc[obj.module].total++;
    
    switch(obj.s4Impact.compatibility) {
      case 'COMPATIBLE':
        acc[obj.module]['Compatible']++;
        break;
      case 'DEPRECATED':
        acc[obj.module]['Needs Review']++;
        break;
      case 'INCOMPATIBLE':
        acc[obj.module]['Requires Change']++;
        break;
    }
    
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(moduleAnalysis).sort((a: any, b: any) => b.total - a.total);

  // Calculate totals for donut chart
  const totals = customObjects.reduce((acc, obj) => {
    switch(obj.s4Impact.compatibility) {
      case 'COMPATIBLE':
        acc[0].value++;
        break;
      case 'DEPRECATED':
        acc[1].value++;
        break;
      case 'INCOMPATIBLE':
        acc[2].value++;
        break;
    }
    return acc;
  }, [
    { name: 'Compatible', value: 0, color: 'emerald', icon: CheckCircle },
    { name: 'Needs Review', value: 0, color: 'amber', icon: AlertCircle },
    { name: 'Requires Change', value: 0, color: 'red', icon: XCircle }
  ]);

  const totalEffort = customObjects.reduce((sum, obj) => sum + obj.s4Impact.estimatedEffort, 0);

  return (
    <>
      <Card>
        <Flex>
          <div>
            <Title>Custom Code Impact Analysis</Title>
            <Text>Objects by module and S/4HANA compatibility</Text>
          </div>
          <div className="text-right">
            <Text className="text-sm text-gray-600">Total Effort</Text>
            <Text className="text-2xl font-bold text-blue-600">{totalEffort.toLocaleString()} hrs</Text>
          </div>
        </Flex>
        
        <BarChart
          data={chartData}
          index="module"
          categories={['Compatible', 'Needs Review', 'Requires Change']}
          colors={['emerald', 'amber', 'red']}
          valueFormatter={(value) => `${value}`}
          yAxisWidth={40}
          className="mt-6 h-72"
          showLegend={true}
          stack={true}
        />

        <div className="mt-6 grid grid-cols-3 gap-4">
          {totals.map((item) => {
            const Icon = item.icon;
            const percentage = ((item.value / customObjects.length) * 100).toFixed(1);
            return (
              <div key={item.name} className="text-center">
                <div className={`inline-flex p-2 rounded-full bg-${item.color}-100 mb-2`}>
                  <Icon className={`h-5 w-5 text-${item.color}-600`} />
                </div>
                <Text className="text-2xl font-bold">{item.value}</Text>
                <Text className="text-sm text-gray-600">{item.name}</Text>
                <Text className="text-xs text-gray-500">{percentage}%</Text>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

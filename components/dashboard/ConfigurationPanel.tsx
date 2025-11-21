'use client';

import { Card, Title, Text, NumberInput, Select, SelectItem, Button } from '@tremor/react';
import { Settings, RefreshCw, Download } from 'lucide-react';
import { useConfigStore } from '@/lib/store/configStore';
import { useState } from 'react';

const AVAILABLE_MODULES = ['FI', 'CO', 'SD', 'MM', 'PP', 'HR', 'PM', 'QM', 'PS', 'WM'];

export default function ConfigurationPanel({ onApply }: { onApply: () => void }) {
  const { systemSize, customObjects, users, modules, scenario, updateConfig } = useConfigStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleScenarioChange = (value: string) => {
    switch(value) {
      case 'best':
        updateConfig({
          scenario: 'best' as const,
          systemSize: 500,
          customObjects: 20,
          users: 200,
          complexity: 'SIMPLE'
        });
        break;
      case 'worst':
        updateConfig({
          scenario: 'worst' as const,
          systemSize: 10000,
          customObjects: 500,
          users: 5000,
          complexity: 'HIGHLY_COMPLEX'
        });
        break;
      default:
        updateConfig({
          scenario: 'realistic' as const,
          systemSize: 2500,
          customObjects: 150,
          users: 1200,
          complexity: 'COMPLEX'
        });
    }
    onApply();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50"
      >
        <Settings className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 z-50">
          <Card className="shadow-2xl border-2 border-blue-200">
            <div className="flex justify-between items-center mb-4">
              <Title>System Configuration</Title>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Text>Migration Scenario</Text>
                <Select value={scenario} onValueChange={handleScenarioChange}>
                  <SelectItem value="best">Best Case (Simple)</SelectItem>
                  <SelectItem value="realistic">Realistic (Moderate)</SelectItem>
                  <SelectItem value="worst">Worst Case (Complex)</SelectItem>
                </Select>
              </div>

              <div>
                <Text>System Size (GB)</Text>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  value={systemSize}
                  onChange={(e) => updateConfig({ systemSize: Number(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>100 GB</span>
                  <span className="font-bold">{systemSize} GB</span>
                  <span>10 TB</span>
                </div>
              </div>

              <div>
                <Text>Custom Objects</Text>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={customObjects}
                  onChange={(e) => updateConfig({ customObjects: Number(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0</span>
                  <span className="font-bold">{customObjects}</span>
                  <span>1000</span>
                </div>
              </div>

              <div>
                <Text>Active Users</Text>
                <input
                  type="range"
                  min="10"
                  max="10000"
                  value={users}
                  onChange={(e) => updateConfig({ users: Number(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>10</span>
                  <span className="font-bold">{users}</span>
                  <span>10K</span>
                </div>
              </div>

              <div>
                <Text>Active Modules ({modules.length} selected)</Text>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {AVAILABLE_MODULES.map(mod => (
                    <button
                      key={mod}
                      onClick={() => {
                        if (modules.includes(mod)) {
                          updateConfig({ modules: modules.filter(m => m !== mod) });
                        } else {
                          updateConfig({ modules: [...modules, mod] });
                        }
                      }}
                      className={`px-2 py-1 text-xs rounded ${
                        modules.includes(mod) 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {mod}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  size="sm"
                  variant="primary"
                  icon={RefreshCw}
                  onClick={onApply}
                  className="flex-1"
                >
                  Apply Changes
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  icon={Download}
                  onClick={() => alert('Export feature coming soon!')}
                >
                  Export
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

const fs = require('fs');
const path = require('path');

const analysisPath = path.join(__dirname, '..', '.tools', 'api-analysis.json');
const outputPath = path.join(__dirname, '..', 'src', 'lib', 'api', 'operationMap.ts');

const data = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));

const lines = [];
lines.push('// Auto-generated from scripts/generate-operation-map.js');
lines.push('// Do not edit manually.');
lines.push("import type { HttpMethod } from './types';");
lines.push('');
lines.push('export interface OperationMeta {');
lines.push('  method: HttpMethod;');
lines.push('  path: string;');
lines.push('  resource: string;');
lines.push('  pagination: string[];');
lines.push('  description?: string;');
lines.push('}');
lines.push('');
lines.push('export const operationMap = {');

for (const endpoint of data.endpoints) {
  lines.push(`  ${endpoint.operationId}: {`);
  lines.push(`    method: '${endpoint.method}' as HttpMethod,`);
  lines.push(`    path: '${endpoint.path}',`);
  lines.push(`    resource: '${endpoint.resource}',`);
  lines.push(`    pagination: ${JSON.stringify(endpoint.pagination)},`);
  if (endpoint.description) {
    lines.push(`    description: ${JSON.stringify(endpoint.description)},`);
  }
  lines.push('  },');
}
lines.push('} as const satisfies Record<string, OperationMeta>;');
lines.push('');
lines.push('export type OperationId = keyof typeof operationMap;');

const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(outputPath, lines.join('\n'));
console.log(`operationMap written to ${outputPath}`);

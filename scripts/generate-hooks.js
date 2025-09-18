const fs = require('fs');
const path = require('path');

const analysisPath = path.join(__dirname, '..', '.tools', 'api-analysis.json');
const data = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));

const outputDir = path.join(__dirname, '..', 'src', 'hooks', 'api');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const toPascal = (value) => value
  .replace(/[^a-zA-Z0-9]+/g, ' ')
  .split(' ')
  .filter(Boolean)
  .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
  .join('');

const formatOperationName = (operationId) => {
  const parts = operationId.split('_');
  let versionPrefix = '';
  if (parts.length && /^v\d+$/i.test(parts[0])) {
    versionPrefix = parts.shift().toUpperCase();
  }
  const suffix = parts.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1)).join('');
  return versionPrefix ? versionPrefix + suffix : suffix;
};

const grouped = new Map();
for (const endpoint of data.endpoints) {
  const resourceName = toPascal(endpoint.resource || 'core');
  if (!grouped.has(resourceName)) {
    grouped.set(resourceName, []);
  }
  grouped.get(resourceName).push(endpoint);
}

const buildArgsType = (baseName, operationId) => `export type ${baseName}Args = Omit<OperationCallArgs<'${operationId}'>, 'signal'>;`;

const buildOptionsTypes = () => `type QueryOptions<Op extends OperationId, TData> = Omit<UseQueryOptions<OperationResponse<Op>, ApiError, TData, QueryKey>, 'queryKey' | 'queryFn'>;

type MutationOptions<Op extends OperationId, TVariables> = Omit<UseMutationOptions<OperationResponse<Op>, ApiError, TVariables>, 'mutationFn' | 'mutationKey'>;`;

const buildQueryHook = (endpoint, baseName, argsRequired) => {
  const operationId = endpoint.operationId;
  const argsTypeName = `${baseName}Args`;
  const functionName = `use${baseName}Query`;
  const argsParam = argsRequired
    ? `args: ${argsTypeName}`
    : `args?: ${argsTypeName}`;
  const optionsParam = `options?: QueryOptions<'${operationId}', OperationResponse<'${operationId}'>>`;
  const argsForKey = argsRequired ? 'args' : '(args ?? null)';
  const payloadInit = argsRequired ? 'args' : '(args ?? {})';
  return `export const ${functionName} = (
  ${argsParam},
  ${optionsParam}
) => {
  return useQuery<OperationResponse<'${operationId}'>, ApiError, OperationResponse<'${operationId}'>, QueryKey>({
    queryKey: ['${operationId}', ${argsForKey}],
    queryFn: ({ signal }) => {
      const payload = { ...${payloadInit}, signal } as Partial<OperationCallArgs<'${operationId}>>;
      return apiClient.call('${operationId}', createCallArgs<'${operationId}>(payload));
    },
    ...options,
  });
};`;
};

const buildMutationHook = (endpoint, baseName) => {
  const operationId = endpoint.operationId;
  const argsTypeName = `${baseName}Args`;
  const functionName = `use${baseName}Mutation`;
  return `export const ${functionName} = (
  options?: MutationOptions<'${operationId}', ${argsTypeName}>
) => {
  return useMutation<OperationResponse<'${operationId}'>, ApiError, ${argsTypeName}>({
    mutationKey: ['${operationId}'],
    mutationFn: async (variables) => {
      const payload = { ...variables } as Partial<OperationCallArgs<'${operationId}>>;
      return apiClient.call('${operationId}', createCallArgs<'${operationId}'>(payload));
    },
    ...options,
  });
};`;
};

for (const [resource, endpoints] of grouped.entries()) {
  const sorted = endpoints.slice().sort((a, b) => {
    if (a.path === b.path) {
      return a.method.localeCompare(b.method);
    }
    return a.path.localeCompare(b.path);
  });

  const fileName = `use${resource}.ts`;
  const filePath = path.join(outputDir, fileName);

  const lines = [];
  lines.push(`import { useMutation, useQuery, type QueryKey, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';`);
  lines.push(`import { apiClient, createCallArgs, type OperationCallArgs, type OperationResponse } from '@/lib/apiClient';`);
  lines.push(`import type { OperationId } from '@/lib/api/operationMap';`);
  lines.push(`import type { ApiError } from '@/lib/api/base';`);
  lines.push('');
  lines.push(buildOptionsTypes());
  lines.push('');

  const emittedArgsTypes = new Set();

  for (const endpoint of sorted) {
    const baseName = formatOperationName(endpoint.operationId);
    const argsTypeName = `${baseName}Args`;
    if (!emittedArgsTypes.has(argsTypeName)) {
      lines.push(buildArgsType(baseName, endpoint.operationId));
      lines.push('');
      emittedArgsTypes.add(argsTypeName);
    }

    if (endpoint.method === 'GET') {
      const requiresPath = endpoint.parameters?.path && endpoint.parameters.path.length > 0;
      lines.push(buildQueryHook(endpoint, baseName, Boolean(requiresPath)));
      lines.push('');
    } else {
      lines.push(buildMutationHook(endpoint, baseName));
      lines.push('');
    }
  }

  fs.writeFileSync(filePath, lines.join('\n'));
  console.log(`Generated hooks for ${resource} -> ${fileName}`);
}


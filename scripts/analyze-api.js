const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const apiFilePath = path.join(__dirname, '..', 'src', 'types', 'api.d.ts');
const outputDir = path.join(__dirname, '..', '.tools');

const sourceText = fs.readFileSync(apiFilePath, 'utf8');
const sourceFile = ts.createSourceFile('api.d.ts', sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

function cleanName(node) {
  if (!node) return '';
  if (ts.isIdentifier(node) || ts.isPrivateIdentifier(node)) {
    return node.text;
  }
  if (ts.isStringLiteralLike(node) || ts.isNumericLiteral(node)) {
    return node.text;
  }
  return node.getText(sourceFile).replace(/^"|"$/g, '');
}

function getJSDocComment(node) {
  if (!node.jsDoc) return undefined;
  const parts = [];
  for (const doc of node.jsDoc) {
    if (typeof doc.comment === 'string') {
      const trimmed = doc.comment.trim();
      if (trimmed) parts.push(trimmed);
    } else if (Array.isArray(doc.comment)) {
      const text = doc.comment.map(part => part.text).join('').trim();
      if (text) parts.push(text);
    }
    if (doc.tags) {
      for (const tag of doc.tags) {
        if (tag.tagName && tag.tagName.text === 'description' && tag.comment) {
          const commentText = Array.isArray(tag.comment)
            ? tag.comment.map(part => part.text).join('').trim()
            : String(tag.comment).trim();
          if (commentText) parts.push(commentText);
        }
      }
    }
  }
  return parts.length ? Array.from(new Set(parts)).join(' ') : undefined;
}

function getTypeText(node) {
  if (!node) return 'unknown';
  return node.getText(sourceFile).replace(/\s+/g, ' ').trim();
}

function extractProperties(typeLiteral) {
  if (!typeLiteral || !ts.isTypeLiteralNode(typeLiteral)) return [];
  const props = [];
  for (const member of typeLiteral.members) {
    if (!ts.isPropertySignature(member) || !member.name) continue;
    props.push({
      name: cleanName(member.name),
      optional: Boolean(member.questionToken),
      type: member.type ? getTypeText(member.type) : 'unknown',
      description: getJSDocComment(member),
    });
  }
  return props;
}

function parseRequestBody(node) {
  if (!node || !ts.isTypeLiteralNode(node)) return [];
  const contentMember = node.members.find(
    member => ts.isPropertySignature(member) && cleanName(member.name) === 'content' && member.type
  );
  if (!contentMember || !ts.isTypeLiteralNode(contentMember.type)) return [];
  const contentTypes = [];
  for (const mediaMember of contentMember.type.members) {
    if (!ts.isPropertySignature(mediaMember) || !mediaMember.name || !mediaMember.type) continue;
    contentTypes.push({
      mediaType: cleanName(mediaMember.name),
      type: getTypeText(mediaMember.type),
    });
  }
  return contentTypes;
}

function parseResponses(node) {
  if (!node || !ts.isTypeLiteralNode(node)) return [];
  const responses = [];
  for (const member of node.members) {
    if (!ts.isPropertySignature(member) || !member.name || !member.type) continue;
    const statusCode = cleanName(member.name);
    if (!ts.isTypeLiteralNode(member.type)) {
      responses.push({ status: statusCode, mediaType: undefined, type: getTypeText(member.type) });
      continue;
    }
    const contentMember = member.type.members.find(
      inner => ts.isPropertySignature(inner) && cleanName(inner.name) === 'content' && inner.type
    );
    if (contentMember && ts.isTypeLiteralNode(contentMember.type)) {
      for (const content of contentMember.type.members) {
        if (!ts.isPropertySignature(content) || !content.name || !content.type) continue;
        responses.push({
          status: statusCode,
          mediaType: cleanName(content.name),
          type: getTypeText(content.type),
        });
      }
    } else {
      responses.push({ status: statusCode, mediaType: undefined, type: getTypeText(member.type) });
    }
  }
  return responses;
}

function extractSchemaRefs(typeString) {
  const refs = [];
  const regex = /components\["schemas"\]\["([\w_-]+)"\]/g;
  let match;
  while ((match = regex.exec(typeString))) {
    refs.push(match[1]);
  }
  return Array.from(new Set(refs));
}

function findInterface(name) {
  let result;
  function visitor(node) {
    if (ts.isInterfaceDeclaration(node) && node.name.text === name) {
      result = node;
      return;
    }
    ts.forEachChild(node, visitor);
  }
  visitor(sourceFile);
  if (!result) throw new Error(`Interface ${name} not found`);
  return result;
}

const resourceMap = {
  auth: 'Auth',
  users: 'Users',
  profile: 'Profile',
  profiles: 'Profiles',
  templates: 'Templates',
  'template-categories': 'Templates',
  library: 'Library',
  analytics: 'Analytics',
  optimize: 'Optimize',
  optimization: 'Optimize',
  orchestrator: 'Orchestrator',
  rag: 'RAG',
  billing: 'Billing',
  payments: 'Billing',
  subscriptions: 'Billing',
  usage: 'Usage',
  notifications: 'Notifications',
  gaming: 'Gaming',
  leaderboard: 'Gaming',
  workspace: 'Workspace',
  teams: 'Teams',
  admin: 'Admin',
  health: 'Health',
  chat: 'Chat',
  history: 'History',
  prompts: 'Prompts',
  builder: 'Builder',
  experiments: 'Experiments',
};

function toTitleCase(value) {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim();
}

function deriveResource(apiPath) {
  const parts = apiPath.split('/').filter(Boolean);
  if (!parts.length) return 'Root';
  let index = 0;
  if (parts[index] === 'api') {
    index += 1;
  }
  if (parts[index] && /^v\d+/i.test(parts[index])) {
    index += 1;
  }
  const segment = parts[index] || parts[parts.length - 1];
  return resourceMap[segment] || toTitleCase(segment || 'Misc');
}

function detectPagination(queryParams) {
  if (!Array.isArray(queryParams)) return [];
  const paginationKeys = ['page', 'page_size', 'pageSize', 'limit', 'offset', 'ordering', 'search', 'cursor'];
  return queryParams
    .filter(param => paginationKeys.includes(param.name))
    .map(param => param.name);
}

const operationsInterface = findInterface('operations');
const operationMap = new Map();
for (const member of operationsInterface.members) {
  if (!ts.isPropertySignature(member) || !member.name || !member.type || !ts.isTypeLiteralNode(member.type)) {
    continue;
  }
  const opId = cleanName(member.name);
  const opDetails = {
    parameters: {},
    requestBody: [],
    responses: [],
    description: getJSDocComment(member),
  };

  for (const property of member.type.members) {
    if (!ts.isPropertySignature(property) || !property.name) continue;
    const propName = cleanName(property.name);

    if (propName === 'parameters' && property.type && ts.isTypeLiteralNode(property.type)) {
      for (const paramGroup of property.type.members) {
        if (!ts.isPropertySignature(paramGroup) || !paramGroup.name || !paramGroup.type) continue;
        const groupName = cleanName(paramGroup.name);
        if (groupName === 'query' || groupName === 'path' || groupName === 'header' || groupName === 'cookie') {
          opDetails.parameters[groupName] = extractProperties(paramGroup.type);
        }
      }
    }

    if (propName === 'requestBody' && property.type && ts.isTypeLiteralNode(property.type)) {
      opDetails.requestBody = parseRequestBody(property.type);
    }

    if (propName === 'responses' && property.type && ts.isTypeLiteralNode(property.type)) {
      opDetails.responses = parseResponses(property.type);
    }
  }

  opDetails.pagination = detectPagination(opDetails.parameters.query);
  opDetails.requestSchemas = Array.from(new Set(opDetails.requestBody.flatMap(body => extractSchemaRefs(body.type))));
  opDetails.responseSchemas = Array.from(new Set(opDetails.responses.flatMap(res => extractSchemaRefs(res.type))));

  operationMap.set(opId, opDetails);
}

const pathsInterface = findInterface('paths');
const endpoints = [];

for (const member of pathsInterface.members) {
  if (!ts.isPropertySignature(member) || !member.name || !member.type || !ts.isTypeLiteralNode(member.type)) {
    continue;
  }
  const apiPath = cleanName(member.name);
  for (const property of member.type.members) {
    if (!ts.isPropertySignature(property) || !property.name || !property.type) continue;
    const methodName = cleanName(property.name);
    const httpMethods = ['get', 'put', 'post', 'patch', 'delete', 'options', 'head', 'trace'];
    if (!httpMethods.includes(methodName)) continue;

    if (!ts.isIndexedAccessTypeNode(property.type)) continue;
    const indexedAccess = property.type;
    const indexType = indexedAccess.indexType;
    if (!ts.isLiteralTypeNode(indexType) || !ts.isStringLiteralLike(indexType.literal)) continue;
    const operationId = indexType.literal.text;
    const operationDetails = operationMap.get(operationId) || {
      parameters: {},
      requestBody: [],
      responses: [],
      pagination: [],
      requestSchemas: [],
      responseSchemas: [],
    };

    const resource = deriveResource(apiPath);
    endpoints.push({
      resource,
      method: methodName.toUpperCase(),
      path: apiPath,
      operationId,
      description: getJSDocComment(property),
      parameters: operationDetails.parameters,
      requestBody: operationDetails.requestBody,
      responses: operationDetails.responses,
      pagination: operationDetails.pagination,
      requestSchemas: operationDetails.requestSchemas,
      responseSchemas: operationDetails.responseSchemas,
    });
  }
}

endpoints.sort((a, b) => {
  if (a.resource === b.resource) {
    if (a.path === b.path) {
      return a.method.localeCompare(b.method);
    }
    return a.path.localeCompare(b.path);
  }
  return a.resource.localeCompare(b.resource);
});

const summary = {
  generatedAt: new Date().toISOString(),
  endpointCount: endpoints.length,
  resources: Array.from(new Set(endpoints.map(ep => ep.resource))).sort(),
};

const result = { summary, endpoints };
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const jsonOutputPath = path.join(outputDir, 'api-analysis.json');
fs.writeFileSync(jsonOutputPath, JSON.stringify(result, null, 2));

const header = ['Resource', 'Method', 'Path', 'Request Type(s)', 'Response Type(s)', 'Pagination', 'OperationId'];
const markdownLines = [];
markdownLines.push(`# API Endpoint Inventory`);
markdownLines.push(`Generated: ${summary.generatedAt}`);
markdownLines.push('');
markdownLines.push(`Total endpoints: ${summary.endpointCount}`);
markdownLines.push('');
markdownLines.push('| ' + header.join(' | ') + ' |');
markdownLines.push('|' + header.map(() => ' --- ').join('|') + '|');

for (const endpoint of endpoints) {
  const requestTypes = endpoint.requestBody.length
    ? endpoint.requestBody.map(rb => `
${rb.mediaType}: ${rb.type}`).join('<br>')
    : '—';
  const responseTypes = endpoint.responses.length
    ? endpoint.responses.map(res => `${res.status}${res.mediaType ? ' ' + res.mediaType : ''}: ${res.type}`).join('<br>')
    : '—';
  const pagination = endpoint.pagination.length ? endpoint.pagination.join(', ') : '—';
  markdownLines.push(`| ${endpoint.resource} | ${endpoint.method} | ${endpoint.path} | ${requestTypes} | ${responseTypes} | ${pagination} | ${endpoint.operationId} |`);
}

const markdownOutputPath = path.join(outputDir, 'api-inventory.md');
fs.writeFileSync(markdownOutputPath, markdownLines.join('\n'));

console.log(`API analysis written to ${jsonOutputPath} and ${markdownOutputPath}`);

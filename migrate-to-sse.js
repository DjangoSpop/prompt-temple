#!/usr/bin/env node

/**
 * SSE Migration Helper Script
 * 
 * This script helps automate the migration from WebSocket to SSE
 * by finding and suggesting replacements for WebSocket components.
 */

const fs = require('fs');
const path = require('path');

const WEBSOCKET_PATTERNS = [
  {
    pattern: /import.*useWebSocketChat.*from.*websocket-chat/g,
    replacement: "import { useSSEChat } from '@/lib/services/sse-chat';",
    description: "Replace useWebSocketChat import with useSSEChat"
  },
  {
    pattern: /import.*EnhancedChatInterface.*from.*EnhancedChatInterface/g,
    replacement: "import SSEChatInterface from '@/components/SSEChatInterface';",
    description: "Replace EnhancedChatInterface import with SSEChatInterface"
  },
  {
    pattern: /import.*EnhancedWebSocketChat.*from.*EnhancedWebSocketChat/g,
    replacement: "import SSEChatInterface from '@/components/SSEChatInterface';",
    description: "Replace EnhancedWebSocketChat import with SSEChatInterface"
  },
  {
    pattern: /useWebSocketChat\(\)/g,
    replacement: "useSSEChat()",
    description: "Replace useWebSocketChat() calls with useSSEChat()"
  },
  {
    pattern: /<EnhancedChatInterface/g,
    replacement: "<SSEChatInterface",
    description: "Replace EnhancedChatInterface component with SSEChatInterface"
  },
  {
    pattern: /<\/EnhancedChatInterface>/g,
    replacement: "</SSEChatInterface>",
    description: "Replace EnhancedChatInterface closing tag"
  },
  {
    pattern: /<EnhancedWebSocketChat/g,
    replacement: "<SSEChatInterface",
    description: "Replace EnhancedWebSocketChat component with SSEChatInterface"
  },
  {
    pattern: /<\/EnhancedWebSocketChat>/g,
    replacement: "</SSEChatInterface>",
    description: "Replace EnhancedWebSocketChat closing tag"
  }
];

function findFilesToMigrate(dir, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  const files = [];
  
  function walk(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and .next directories
        if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(item)) {
          walk(fullPath);
        }
      } else {
        const ext = path.extname(fullPath);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  walk(dir);
  return files;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = [];
  
  for (const { pattern, replacement, description } of WEBSOCKET_PATTERNS) {
    const found = content.match(pattern);
    if (found) {
      matches.push({
        pattern: pattern.toString(),
        replacement,
        description,
        matches: found,
        file: filePath
      });
    }
  }
  
  return matches;
}

function generateMigrationReport(projectDir) {
  console.log('🔍 Scanning for WebSocket usage...\n');
  
  const files = findFilesToMigrate(projectDir);
  const allMatches = [];
  
  for (const file of files) {
    const matches = analyzeFile(file);
    if (matches.length > 0) {
      allMatches.push(...matches);
    }
  }
  
  if (allMatches.length === 0) {
    console.log('✅ No WebSocket patterns found! Your codebase might already be migrated.\n');
    return;
  }
  
  console.log(`📊 Found ${allMatches.length} WebSocket patterns to migrate:\n`);
  
  // Group by file
  const fileGroups = {};
  for (const match of allMatches) {
    if (!fileGroups[match.file]) {
      fileGroups[match.file] = [];
    }
    fileGroups[match.file].push(match);
  }
  
  for (const [file, matches] of Object.entries(fileGroups)) {
    const relativePath = path.relative(projectDir, file);
    console.log(`📁 ${relativePath}`);
    
    for (const match of matches) {
      console.log(`   ❌ ${match.description}`);
      console.log(`      Found: ${match.matches[0]}`);
      console.log(`      Replace with: ${match.replacement}`);
      console.log('');
    }
  }
  
  console.log('🚀 Migration suggestions:');
  console.log('1. Run: npm install  # Update dependencies');
  console.log('2. Import new SSE components');
  console.log('3. Replace WebSocket usage step by step');
  console.log('4. Test each component after migration');
  console.log('5. Remove old WebSocket dependencies');
  console.log('');
  console.log('📖 For detailed migration guide, visit: /sse-migration');
}

function performMigration(projectDir, dryRun = true) {
  console.log(dryRun ? '🧪 DRY RUN: Showing what would be changed\n' : '🔧 PERFORMING MIGRATION\n');
  
  const files = findFilesToMigrate(projectDir);
  let totalChanges = 0;
  
  for (const file of files) {
    const originalContent = fs.readFileSync(file, 'utf8');
    let newContent = originalContent;
    let fileChanges = 0;
    
    for (const { pattern, replacement, description } of WEBSOCKET_PATTERNS) {
      const matches = newContent.match(pattern);
      if (matches) {
        newContent = newContent.replace(pattern, replacement);
        fileChanges += matches.length;
        totalChanges += matches.length;
        
        const relativePath = path.relative(projectDir, file);
        console.log(`${dryRun ? '📝' : '✅'} ${relativePath}: ${description} (${matches.length} changes)`);
      }
    }
    
    if (fileChanges > 0 && !dryRun) {
      fs.writeFileSync(file, newContent, 'utf8');
    }
  }
  
  if (totalChanges === 0) {
    console.log('✅ No changes needed! Your codebase appears to be already migrated.\n');
  } else {
    console.log(`\n📊 Summary: ${totalChanges} changes ${dryRun ? 'would be made' : 'made'} across ${files.length} files\n`);
    
    if (dryRun) {
      console.log('🚀 To perform the actual migration, run:');
      console.log('   node migrate-to-sse.js --apply');
      console.log('');
      console.log('⚠️  IMPORTANT: Backup your code before running with --apply');
    } else {
      console.log('✅ Migration complete!');
      console.log('');
      console.log('📝 Next steps:');
      console.log('1. Test your application');
      console.log('2. Remove unused WebSocket dependencies');
      console.log('3. Update your imports if needed');
      console.log('4. Visit /sse-migration to verify everything works');
    }
  }
}

// Main execution
const args = process.argv.slice(2);
const projectDir = process.cwd();

if (args.includes('--help') || args.includes('-h')) {
  console.log('SSE Migration Helper');
  console.log('');
  console.log('Usage:');
  console.log('  node migrate-to-sse.js              # Analyze and show migration report');
  console.log('  node migrate-to-sse.js --dry-run    # Show what would be changed');
  console.log('  node migrate-to-sse.js --apply      # Perform actual migration');
  console.log('  node migrate-to-sse.js --help       # Show this help');
  console.log('');
  console.log('Examples:');
  console.log('  node migrate-to-sse.js              # Scan for WebSocket usage');
  console.log('  node migrate-to-sse.js --apply      # Migrate to SSE');
  process.exit(0);
}

if (args.includes('--apply')) {
  console.log('⚠️  This will modify your files. Make sure you have backups!\n');
  performMigration(projectDir, false);
} else if (args.includes('--dry-run')) {
  performMigration(projectDir, true);
} else {
  generateMigrationReport(projectDir);
}

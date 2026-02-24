import * as path from 'path';
import * as fs from 'fs';

/**
 * Resolves file paths correctly in both Lambda and local environments.
 * Works by finding the project root and then constructing paths from there.
 */
export function getProjectPath(relativePath: string): string {
  let basePath = __dirname;
  
  // In development: __dirname is src/utils
  // In compiled (local or Lambda): __dirname is dist/utils
  
  // Go up to the project root (dist or src parent)
  while (basePath.length > 1) {
    const parent = path.dirname(basePath);
    const basename = path.basename(basePath);
    
    // Stop when we reach src, dist, or the project folder
    if (basename === 'src' || basename === 'dist') {
      basePath = parent;
      break;
    }
    
    // Safety check - stop at root
    if (parent === basePath) break;
    
    basePath = parent;
  }
  
  const resolvedPath = path.join(basePath, relativePath);
  
  // Log for debugging
  if (process.env.DEBUG_PATHS) {
    console.log(`[PathUtil] __dirname: ${__dirname}`);
    console.log(`[PathUtil] basePath: ${basePath}`);
    console.log(`[PathUtil] relativePath: ${relativePath}`);
    console.log(`[PathUtil] resolvedPath: ${resolvedPath}`);
    console.log(`[PathUtil] exists: ${fs.existsSync(resolvedPath)}`);
  }
  
  return resolvedPath;
}

/**
 * Get the full path to a file in the public directory
 */
export function getPublicPath(filePath: string): string {
  return getProjectPath(`public/${filePath}`);
}

/**
 * Get the full path to a template file
 */
export function getTemplatePath(fileName: string): string {
  return getProjectPath(`src/templates/${fileName}`);
}

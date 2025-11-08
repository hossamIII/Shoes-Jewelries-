const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const MEDUSA_SERVER_PATH = path.join(process.cwd(), '.medusa', 'server');

// Check if .medusa/server exists - if not, build process failed
if (!fs.existsSync(MEDUSA_SERVER_PATH)) {
  throw new Error('.medusa/server directory not found. This indicates the Medusa build process failed. Please check for build errors.');
}

// Detect and copy existing lockfile (pnpm, npm, or yarn)
const rootDir = process.cwd();
const lockfiles = {
  pnpm: 'pnpm-lock.yaml',
  npm: 'package-lock.json',
  yarn: 'yarn.lock'
};

let installer = null;
let lockfileName = null;

if (fs.existsSync(path.join(rootDir, lockfiles.pnpm))) {
  installer = 'pnpm';
  lockfileName = lockfiles.pnpm;
} else if (fs.existsSync(path.join(rootDir, lockfiles.npm))) {
  installer = 'npm';
  lockfileName = lockfiles.npm;
} else if (fs.existsSync(path.join(rootDir, lockfiles.yarn))) {
  installer = 'yarn';
  lockfileName = lockfiles.yarn;
}

if (lockfileName) {
  fs.copyFileSync(
    path.join(rootDir, lockfileName),
    path.join(MEDUSA_SERVER_PATH, lockfileName)
  );
} else {
  console.warn('No lockfile found (pnpm-lock.yaml, package-lock.json, or yarn.lock). Proceeding without copying a lockfile.');
}

// Copy .env if it exists
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  fs.copyFileSync(
    envPath,
    path.join(MEDUSA_SERVER_PATH, '.env')
  );
}

// Install dependencies using detected package manager
console.log('Installing dependencies in .medusa/server...');

if (installer === 'pnpm') {
  execSync('pnpm i --prod --frozen-lockfile', {
    cwd: MEDUSA_SERVER_PATH,
    stdio: 'inherit'
  });
} else if (installer === 'npm') {
  // Prefer CI for reproducible installs if a lockfile is present
  const hasNpmLock = fs.existsSync(path.join(MEDUSA_SERVER_PATH, lockfiles.npm));
  const cmd = hasNpmLock ? 'npm ci --omit=dev' : 'npm i --omit=dev';
  execSync(cmd, {
    cwd: MEDUSA_SERVER_PATH,
    stdio: 'inherit'
  });
} else if (installer === 'yarn') {
  const hasYarnLock = fs.existsSync(path.join(MEDUSA_SERVER_PATH, lockfiles.yarn));
  const cmd = hasYarnLock ? 'yarn install --production --frozen-lockfile' : 'yarn install --production';
  execSync(cmd, {
    cwd: MEDUSA_SERVER_PATH,
    stdio: 'inherit'
  });
} else {
  // Fallback to npm
  execSync('npm i --omit=dev', {
    cwd: MEDUSA_SERVER_PATH,
    stdio: 'inherit'
  });
}

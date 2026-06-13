import fs from 'node:fs';
import { execSync } from 'node:child_process';

const root = process.cwd();
const nextDir = `${root}/.next`;

if (process.platform === 'win32') {
  try {
    execSync(
      'for /f "tokens=5" %a in (\'netstat -ano ^| findstr :3040 ^| findstr LISTENING\') do taskkill /F /PID %a 2>nul',
      { stdio: 'ignore', shell: 'cmd.exe' }
    );
  } catch {
    /* no process */
  }
}

if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log('[clean-next] .next 삭제 완료');
} else {
  console.log('[clean-next] .next 없음');
}

console.log('[clean-next] 이제 npm run dev 또는 dev.bat 실행');

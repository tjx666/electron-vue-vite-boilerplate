import chalk from 'chalk';
import childPrecess from 'child_process';
import dateFormat from 'dateformat';
import { prompt } from 'enquirer';
import fs from 'fs-extra';
import path from 'path';

import { runCommandWithOutput } from './utils';

async function build(system: string, env: string) {
    const buildInfo = `\n 即将构建 ${chalk.cyanBright(system)} 系统 ${chalk.cyanBright(
        env === 'test' ? '测试' : '线上',
    )} 包`;
    console.log(buildInfo);
    const cwd = path.resolve(__dirname, '../');
    await runCommandWithOutput('pnpm build:renderer', { cwd });
    await runCommandWithOutput('pnpm build:main', { cwd });
    const envFilePath = path.resolve(__dirname, '../src/main/src/.env');
    const devEnvContent = await fs.readFile(envFilePath, { encoding: 'utf-8' });
    const latestGitCommit = childPrecess
        .execSync('git rev-parse HEAD', { cwd: __dirname })
        .toString()
        .trim();
    const dateTime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss.l');
    const packedEnvContent =
        devEnvContent.replace('DEV_MODE=development', `DEV_MODE=${env}`) +
        `\nPACK_GIT_COMMIT=${latestGitCommit}` +
        `\nPACK_DATE_TIME=${dateTime}`;
    const envFilePathInDist = path.resolve(__dirname, '../src/main/dist/.env');
    await fs.writeFile(envFilePathInDist, packedEnvContent);
    await runCommandWithOutput(`npx electron-builder build -${system === 'MacOS' ? 'm' : 'w'}`, {
        cwd,
    });
}

async function main() {
    enum InputFields {
        system = 'system',
        environment = 'environment',
    }

    // 在 docker 中运行时 ts-node 的第二个参数就是开发环境
    if (process.argv[2]) {
        await build('Windows', process.argv[2]);
    } else {
        const answer = await prompt<Record<InputFields, string>>([
            {
                type: 'select',
                name: InputFields.system,
                message: '请选择 app 运行的操作系统',
                choices: ['MacOS', 'Windows'],
            },
            {
                type: 'select',
                name: InputFields.environment,
                message: '请选择 app 的运行环境',
                choices: [
                    {
                        name: 'test',
                        message: '测试环境',
                    },
                    {
                        name: 'production',
                        message: '生产环境',
                    },
                ],
            },
        ]);

        const { system, environment } = answer;

        if (system === 'MacOS') {
            await build('MacOS', environment);
        } else if (system === 'Windows') {
            await runCommandWithOutput(`sudo zsh ./build_windows_app.sh ${environment}`, {
                cwd: path.resolve(__dirname, '../../../'),
                shell: true,
            });
        }
    }
}

main();

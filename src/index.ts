#!/usr/bin/env node
import os from 'os';
import { Command } from 'commander';
import chalk from 'chalk';
import { execSync } from 'child_process';

interface BasicMemoryInfo {
  total: number;
  used: number;
  available: number;
  usagePercent: number;
}

interface MacMemoryInfo extends BasicMemoryInfo {
  active: number;
  inactive: number;
  wired: number;
}

function isMacMemoryInfo(memInfo: BasicMemoryInfo | MacMemoryInfo): memInfo is MacMemoryInfo {
  return (
    'active' in memInfo &&
    'inactive' in memInfo &&
    'wired' in memInfo
  );
}

function getCpuUsage(): Promise<number> {
  return new Promise((resolve) => {
    const startMeasure = os.cpus().map(cpu => ({
      idle: cpu.times.idle,
      total: Object.values(cpu.times).reduce((acc, tv) => acc + tv, 0)
    }));

    setTimeout(() => {
      const endMeasure = os.cpus().map(cpu => ({
        idle: cpu.times.idle,
        total: Object.values(cpu.times).reduce((acc, tv) => acc + tv, 0)
      }));

      const idleDifferences = endMeasure.map((end, i) => end.idle - startMeasure[i].idle);
      const totalDifferences = endMeasure.map((end, i) => end.total - startMeasure[i].total);

      const averageUsage = 100 - (idleDifferences.reduce((acc, idle, i) => 
        acc + (idle / totalDifferences[i]) * 100, 0) / os.cpus().length);

      resolve(averageUsage);
    }, 1000);
  });
}

function getMacMemoryInfo(): MacMemoryInfo {
  try {
    const vmStat = execSync('vm_stat').toString();
    const pageSize = 4096;
    
    const metrics: { [key: string]: number } = vmStat.split('\n').reduce((acc, line) => {
      const match = line.match(/^(.+):[\s]+(.+)\.$/);
      if (match) {
        acc[match[1]] = parseInt(match[2].replace(/[^0-9]/g, '')) * pageSize;
      }
      return acc;
    }, {} as { [key: string]: number });
    
    const total = os.totalmem();
    const free = metrics['Pages free'] || 0;
    const active = metrics['Pages active'] || 0;
    const inactive = metrics['Pages inactive'] || 0;
    const wired = metrics['Pages wired down'] || 0;
    
    const used = wired + active;
    const available = free + inactive;
    
    return {
      total: total / (1024 * 1024 * 1024),
      used: used / (1024 * 1024 * 1024),
      available: available / (1024 * 1024 * 1024),
      active: active / (1024 * 1024 * 1024),
      inactive: inactive / (1024 * 1024 * 1024),
      wired: wired / (1024 * 1024 * 1024),
      usagePercent: (used / total) * 100
    };
  } catch (error) {
    const basic = getBasicMemoryInfo();
    return {
      ...basic,
      active: 0,
      inactive: 0,
      wired: 0
    };
  }
}

function getBasicMemoryInfo(): BasicMemoryInfo {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  
  return {
    total: total / (1024 * 1024 * 1024),
    used: used / (1024 * 1024 * 1024),
    available: free / (1024 * 1024 * 1024),
    usagePercent: (used / total) * 100
  };
}

const program = new Command();

program
  .version('1.0.0')
  .description('System resource monitoring tool')
  .option('-w, --watch [seconds]', 'Watch mode with custom update interval (default: 1 second)', '1');

program
  .action(async (options) => {
    const showStats = async () => {
      console.clear();
      // CPU 정보 출력
      console.log(chalk.blue.bold('CPU Information:'));
      console.log(`Model: ${os.cpus()[0].model}`);
      console.log(`Cores: ${os.cpus().length}`);
      const cpuUsage = await getCpuUsage();
      console.log(`Usage: ${chalk.yellow(cpuUsage.toFixed(1))}%`);

      // 메모리 정보 출력
      const memInfo = process.platform === 'darwin' ? getMacMemoryInfo() : getBasicMemoryInfo();
      console.log(chalk.blue.bold('\nMemory Information:'));
      console.log(`Total: ${chalk.yellow(memInfo.total.toFixed(2))} GB`);
      console.log(`Used: ${chalk.yellow(memInfo.used.toFixed(2))} GB (Active)`);
      console.log(`Available: ${chalk.yellow(memInfo.available.toFixed(2))} GB`);
      
      if (isMacMemoryInfo(memInfo)) {
        console.log(`Wired: ${chalk.yellow(memInfo.wired.toFixed(2))} GB (System)`);
        console.log(`Active: ${chalk.yellow(memInfo.active.toFixed(2))} GB (Apps)`);
        console.log(`Inactive: ${chalk.yellow(memInfo.inactive.toFixed(2))} GB (Cached)`);
      }
      console.log(`Usage: ${chalk.yellow(memInfo.usagePercent.toFixed(1))}%`);

      // 시스템 정보 출력
      console.log(chalk.blue.bold('\nSystem Information:'));
      console.log(`Platform: ${os.platform()}`);
      console.log(`OS: ${os.type()} ${os.release()}`);
      console.log(`Uptime: ${(os.uptime() / 3600).toFixed(1)} hours`);

      // Refresh rate 표시
      if (options.watch) {
        console.log(chalk.dim(`\nRefresh: ${options.watch} seconds`));
      }
    };

    if (options.watch) {
      const interval = parseFloat(options.watch) * 1000; // 초를 밀리초로 변환
      if (isNaN(interval) || interval <= 0) {
        console.error(chalk.red('Error: Please provide a valid positive number for the watch interval'));
        process.exit(1);
      }
      
      while (true) {
        await showStats();
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    } else {
      await showStats();
    }
  });

program.parse(process.argv);

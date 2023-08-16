import { execSync } from 'node:child_process'

export function gitCommit(newVersion: string) {
  const args = ['--all']
  // 生成 commit 信息
  args.push(`-m chore: "release v${newVersion}"`)
  // 执行 commit 命令
  execSync(`git commit ${args.push(' ')}`)
}

export function gitTag(newVersion: string) {
  execSync(`git tag --annotate --message "release v${newVersion}"`)
}

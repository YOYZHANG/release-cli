import { execSync } from 'node:child_process'

export function gitCommit(newVersion: string) {
  // 执行 commit 命令
  execSync(`git commit --all --message "chore: release v${newVersion}"`)
}

export function gitTag(newVersion: string) {
  execSync(`git tag --annotate v${newVersion} --message "release v${newVersion}"`)
}

export function gitPush(hasTag: boolean) {
  execSync('git push')

  if (hasTag)
    execSync('git push --tags')
}

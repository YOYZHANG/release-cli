import { gitCommit, gitTag } from '../git'
import { ExitCode } from '../utils/constant'
import { parseArgs } from '../utils/parse-arg'
import { versionBump } from '../version-bump'

export async function main() {
  try {
    process.on('uncaughtException', errorHandler)
    process.on('unhandledRejection', errorHandler)

    const { help, version, option } = await parseArgs()

    if (help || version)
      process.exit(ExitCode.Success)

    const newVersion = await versionBump(option)

    if (option.commit)
      gitCommit(newVersion)

    if (option.tag)
      gitTag(newVersion)
  }
  catch (e) {

  }
}

function errorHandler(error: Error) {
  console.error(error)
  process.exit(ExitCode.FatalError)
}

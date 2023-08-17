import cac from 'cac'
import { version } from '../../package.json'
import { loadRealseConfig, releaseConfigDefaults } from '../config'
import { ExitCode } from './constant'

export async function parseArgs() {
  try {
    const cli = cac('release')
    cli
      .version(version)
      .option('-c, --commit [msg]', `Commit message (default: ${releaseConfigDefaults.commit})`)
      .option('-t, --tag [tag]', `Tag name (default: ${releaseConfigDefaults.tag})`)
      .option('-p, --push [tag]', `Push commits (default: ${releaseConfigDefaults.push})`)
      .option('-r, --recursive', `recursively modify file package.json (default: ${releaseConfigDefaults.recursive})`)
      .help()

    const result = cli.parse()

    const options = result.options as any

    return {
      help: options.help,
      version: options.version,
      option: await loadRealseConfig({
        commit: options.commit,
        tag: options.tag,
        push: options.push,
        recursive: options.recursive,
      }),
    }
  }
  catch (e) {
    console.error(e)
    process.exit(ExitCode.InvalidArguments)
  }
}

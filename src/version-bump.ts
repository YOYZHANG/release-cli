import { inc, valid as validVersion } from 'semver'
import c from 'picocolors'
import prompts from 'prompts'
import { readJSONFile, writeJSONFile } from './fs'
import type { ConfigOption } from './types'
import { ExitCode, releaseType } from './utils/constant'

async function readVersion(cwd: string, filePath: string): Promise<string | undefined> {
  const content = await readJSONFile(`${cwd}/${filePath}`)

  if (content && validVersion(content.version))
    return content.version

  return undefined
}

// find the first version that found in the files in order
async function getOldVersion(cwd: string, files: string[]): Promise<string> {
  for (const file of files) {
    const version = await readVersion(cwd, file)

    if (version)
      return version
  }

  process.exit(ExitCode.FatalError)
}

function getFiles(recursive: boolean): string[] {
  if (recursive) {
    return [
      'package.json',
      'packages/**/package.json',
    ]
  }
  else {
    return [
      'package.json',
    ]
  }
}

function getNextVersion(oldVersion: string) {
  const next: Record<string, string> = {}

  // const parsed = parseVersion(oldVersion)
  for (const type of releaseType) {
    next[type] = inc(oldVersion, type)!
    console.log(next)
  }

  return next
}

async function updateFile(file: string, version: string) {
  const name = file.trim().toLowerCase()
  const content = await readJSONFile(name)

  if (content && content.version !== version) {
    content.version = version
    await writeJSONFile(file, content)
  }
}

async function updateFiles(cwd: string, files: string[], version: string) {
  Promise.all(files.map(async file => await updateFile(`${cwd}/${file}`, version)))
}

async function promptForNewVersion(oldVersion: string): Promise<string> {
  const next = getNextVersion(oldVersion)

  const prettier = (str: string, version: string) =>
    `${str.padStart(13, ' ')} ${c.bold(version)}`

  const response = await prompts([
    {
      type: 'autocomplete',
      name: 'value',
      message: 'Current version',
      initial: 'next',
      choices: [
        // eslint-disable-next-line dot-notation
        { title: prettier('major', next['major']!) },
        // eslint-disable-next-line dot-notation
        { title: prettier('minor', next['minor']!) },
        // eslint-disable-next-line dot-notation
        { title: prettier('patch', next['patch']!) },
        // eslint-disable-next-line dot-notation
        { title: prettier('next', next['next']!) },
        // eslint-disable-next-line dot-notation
        { title: prettier('prepatch', next['prepatch']!) },
        // eslint-disable-next-line dot-notation
        { title: prettier('preminor', next['preminor']!) },
        // eslint-disable-next-line dot-notation
        { title: prettier('premajor', next['premajor']!) },
        { title: prettier('custom', '') },
      ],
    },
  ])

  const newVersion = response.value

  if (!newVersion)
    process.exit(ExitCode.FatalError)

  console.log(newVersion)
  return newVersion
}

export async function versionBump(option: ConfigOption): Promise<string> {
  const cwd = process.cwd()
  const files = getFiles(!!option.recursive)
  // get the old and new version
  const oldVersion = await getOldVersion(cwd, files)

  const newVersion = await promptForNewVersion(oldVersion)

  // update the npm version in files
  await updateFiles(cwd, files, newVersion)

  return newVersion
}

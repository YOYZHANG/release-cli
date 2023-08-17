import { inc, parse as parseVersion, valid as validVersion } from 'semver'
import c from 'picocolors'
import prompts from 'prompts'
import { readJSONFile, writeJSONFile } from './fs'
import type { ConfigOption } from './types'
import { ExitCode, releaseType } from './utils/constant'

async function readVersion(cwd: string, filePath: string): Promise<string | undefined> {
  const result = await readJSONFile(`${cwd}/${filePath}`)

  if (result?.data && validVersion(result?.data.version))
    return result?.data.version

  return undefined
}

// find the first version that found in the files in order
async function getOldVersion(cwd: string, files: string[]): Promise<string> {
  for (const file of files) {
    const version = await readVersion(cwd, file)

    if (version)
      return version
  }

  throw new Error('no version in current files')
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
  let preid = 'beta'

  const parsed = parseVersion(oldVersion)

  if (typeof parsed?.prerelease[0] === 'string')
    preid = parsed?.prerelease[0]

  for (const type of releaseType)
    next[type] = inc(oldVersion, type, preid)!

  // eslint-disable-next-line dot-notation
  next['next'] = parsed?.prerelease.length
    // eslint-disable-next-line dot-notation
    ? next['prepatch']!
    // eslint-disable-next-line dot-notation
    : next['patch']!

  console.log(next)
  return next
}

async function updateFile(file: string, version: string) {
  const name = file.trim().toLowerCase()
  const result = await readJSONFile(name)

  if (!result)
    return

  const { data, indent, newline } = result

  if (data && data.version !== version) {
    data.version = version
    let jsonString = JSON.stringify(data, null, indent)

    if (newline)
      jsonString += newline

    await writeJSONFile(file, jsonString)
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
        { title: prettier('major', next['major']!), value: next['major'] },
        // eslint-disable-next-line dot-notation
        { title: prettier('minor', next['minor']!), value: next['minor'] },
        // eslint-disable-next-line dot-notation
        { title: prettier('patch', next['patch']!), value: next['patch'] },
        // eslint-disable-next-line dot-notation
        { title: prettier('next', next['next']!), value: next['next'] },
        // eslint-disable-next-line dot-notation
        { title: prettier('prepatch', next['prepatch']!), value: next['prepatch'] },
        // eslint-disable-next-line dot-notation
        { title: prettier('preminor', next['preminor']!), value: next['preminor'] },
        // eslint-disable-next-line dot-notation
        { title: prettier('premajor', next['premajor']!), value: next['premajor'] },
        { title: prettier('custom', ''), value: 'custom' },
      ],
    },
    {
      type: prev => prev === 'custom' ? 'text' : null,
      name: 'custom',
      message: 'custom value',
      initial: oldVersion,
      validate: (custom: string) => validVersion(custom) ? true : 'not a valid version',

    },
  ])
  console.log(response, 'response answers')
  const newVersion = response.value === 'custom' ? response.custom : response.value

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

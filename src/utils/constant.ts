import type { ReleaseType } from 'semver'

export enum ExitCode {
  Success = 0,
  FatalError = 1,
  InvalidArguments = 2,
}

export const preReleaseType: ReleaseType[] = ['premajor', 'preminor', 'prerelease']

export const releaseType: ReleaseType[] = preReleaseType.concat(['major', 'minor', 'patch'])

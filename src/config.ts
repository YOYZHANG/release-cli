import { loadConfig } from 'c12'
import type { ConfigOption } from './types'

export const releaseConfigDefaults: ConfigOption = {
  commit: false,
  tag: false,
  recursive: false,
  push: false,
}

export async function loadRealseConfig(overrides?: Partial<ConfigOption>, cwd = process.cwd()): Promise<Partial<ConfigOption>> {
  const { config } = await loadConfig({
    name: 'release',
    defaults: releaseConfigDefaults,
    overrides: { ...overrides },
    cwd,
  })

  return config!
}

export function defineConfig(config: ConfigOption) {
  return config
}

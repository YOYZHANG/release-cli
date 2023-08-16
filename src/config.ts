import { loadConfig } from 'c12'
import type { ConfigOption } from './types'

export const releaseConfigDefaults: ConfigOption = {
  commit: true,
  tag: false,
  recursive: false,
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

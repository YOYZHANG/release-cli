import fs from 'node:fs'
import detectIndent from 'detect-indent'
import { detectNewline } from 'detect-newline'

interface JSONInfo {
  data: {
    version: string
  }
  indent: string
  newline: string | undefined
}

export async function writeJSONFile(filePath: string, content: string) {
  await writeFile(filePath, content)
}
export async function readJSONFile(path: string): Promise<JSONInfo | null> {
  try {
    const content = await readFile(path)

    const data = JSON.parse(content)
    const indent = detectIndent(content).indent || '  '
    const newline = detectNewline(content)

    return {
      data,
      indent,
      newline,
    }
  }
  catch (e) {
    console.error(e)
    return null
  }
}
function readFile(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, text) => {
      if (err)
        reject(err)
      if (text)
        resolve(text)
    })
  })
}

function writeFile(path: string, content: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, content, (err) => {
      if (err)
        reject(err)

      else
        resolve()
    })
  })
}

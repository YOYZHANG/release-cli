import fs from 'node:fs'

interface PackageJSON {
  version: string
}
export async function writeJSONFile(filePath: string, content: any) {
  const jsonString = JSON.stringify(content, null, 2)
  await writeFile(filePath, jsonString)
}
export async function readJSONFile(path: string): Promise<PackageJSON | null> {
  try {
    const content = await readFile(path)

    return JSON.parse(content)
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

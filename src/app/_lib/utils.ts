import path from 'path';
import fs from 'fs-extra';
import YAML from 'yaml'

export function loadText(fileName: string): string {
    const filePath = path.resolve("./private/data", fileName)
    return fs.readFileSync(filePath, { encoding: 'utf-8' })
}

export function loadYAML<T>(fileName: string): T {
    return YAML.parse(loadText(fileName))
}
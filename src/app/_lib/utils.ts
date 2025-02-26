import path from 'path';
import fs from 'fs-extra';
import YAML from 'yaml'

export function loadYAML<T>(fileName: string): T {
    const yamlPath = path.resolve("./private/data", fileName)
    const yamlText = fs.readFileSync(yamlPath, { encoding: 'utf-8' })
    return YAML.parse(yamlText)
}
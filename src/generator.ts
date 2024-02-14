import 'dotenv/config'

import { outputFile, readFile, readdir } from 'fs-extra'
import OASNormalize from 'oas-normalize'
import OpenAI from 'openai'
import * as OpenAPI from 'openapi-typescript-codegen'
import path from 'path'
import * as prettier from 'prettier'

if (!process.env['OPENAI_API_KEY']) {
  throw new Error('OPENAI_API_KEY environment variable is not set')
}

const openai = new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] })

// where the sdk's are generated
const sdkDir = path.join(process.cwd(), 'sdks')

// local shim for something like logtail, etc
const logger = { log: (message: string) => console.log(message) }

const readAllFilesInFolder = async (folder: string) => {
  const files = await readdir(folder)

  return await Promise.all(
    files.map(async file => {
      const filePath = path.join(folder, file)
      const content = await readFile(filePath, 'utf-8')
      return { filePath, content }
    })
  )
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// samples a portion of the endpoint response, so it fits within the AI's context window
const getRepresentativeSample = (data: unknown): unknown => {
  if (Array.isArray(data)) {
    return data.slice(0, 5).map(getRepresentativeSample)
  }

  if (isPlainObject(data)) {
    const sample: Record<string, unknown> = {}
    for (const key in data) {
      sample[key] = getRepresentativeSample(data[key])
    }
    return sample
  }

  if (typeof data === 'string') {
    return data.slice(0, 100)
  }

  return data
}

interface IEndpoint {
  method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD'
  url: string
}

interface IEndpointSample {
  endpoint: IEndpoint
  response: unknown
}

const getEndpointSamples = async (endpoints: IEndpoint[]) => {
  const samples: IEndpointSample[] = []

  for (const endpoint of endpoints) {
    const response = await fetch(endpoint.url, { method: endpoint.method })
    const fullData = await response.json()
    samples.push({ endpoint, response: getRepresentativeSample(fullData) })
  }

  return samples
}

const generateCode = async (prompt: string) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt.trim() }],
    model: 'gpt-4-turbo-preview',
    max_tokens: 4096
  })

  const rawCode = chatCompletion.choices[0].message.content

  return rawCode ? rawCode.replace(/```[a-z]*/gi, '') : null
}

const formatCode = async (code: string, fileExtension: 'js' | 'ts' | 'json') =>
  prettier.format(code, {
    filepath: path.join(sdkDir, `index.${fileExtension}`),
    ...(await prettier.resolveConfig(sdkDir))
  })

const generateSpec = async (samples: IEndpointSample[]) => {
  logger.log('Generating Spec...')

  const prompt = `
You are an expert OpenAPI generator. Given the following API responses, write an OpenAPI specification for the API.

Requirements:
- Output in the latest version of OpenAPI, in JSON format
- Every endpoint gets a unique operationId, summary, description, parameters, and responses
- The operationId is camelCase and follows the pattern of verb then noun then any qualifiers
- Include a clear description for every field in the response (inferred from sample values)

The descriptions you write must be clear and concise, and the fields in the response must be well-documented. Your output is going straight to production to be seen by developers. Do not explain anything, only output JSON.

API responses: """
${samples
  .map(
    sample =>
      `Endpoint: ${sample.endpoint.method} ${sample.endpoint.url}\nResponse: ${JSON.stringify(
        sample.response,
        null,
        2
      )}`
  )
  .join('\n\n')}
"""
  `

  const rawCode = await generateCode(prompt)
  const code = rawCode ? await formatCode(rawCode, 'json') : null

  if (!code) {
    throw new Error('Failed to generate spec')
  }

  try {
    await new OASNormalize(code).validate()
  } catch (e) {
    throw new Error('Generated invalid OpenAPI spec')
  }

  logger.log('Generated Spec')

  return code
}

const generateClient = async (sdkName: string) => {
  logger.log('Generating client...')

  await OpenAPI.generate({
    input: path.join(sdkDir, sdkName, 'openapi.json'),
    output: path.join(sdkDir, sdkName, 'client'),
    httpClient: 'node'
  })

  logger.log('Generated client')
}

const generateTests = async (sdkName: string) => {
  logger.log('Generating tests...')

  const [models, services] = await Promise.all([
    readAllFilesInFolder(path.join(sdkDir, sdkName, 'client', 'models')),
    readAllFilesInFolder(path.join(sdkDir, sdkName, 'client', 'services'))
  ])

  // remove everything before first export, then join all files together
  const clientCode = [...models, ...services]
    .map(({ content }) => content.replace(/[^]*?(export)/, 'export'))
    .join('\n')

  const prompt = `
You are an expert API SDK test writer. Given the following SDK (DefaultService), write a set of tests.

Requirements:
- Every method is tested with both a successful response and a failed response
- The tests are written in JavaScript using Jest
- Methods that output a value that can be used in another method are tested to ensure that the output is correct

Do not import anything, the tests will run in the same file. Your output is going straight to production. Do not explain anything, only output the code.

API client: """
${clientCode}
"""
  `

  const imports = `
  import { DefaultService } from './client/services/DefaultService'
  `

  const rawCode = await generateCode(prompt)
  const code = rawCode ? formatCode(`${imports}\n${rawCode}`, 'js') : null

  if (!code) {
    throw new Error('Failed to generate tests')
  }

  logger.log('Generated tests')

  return code
}

const generateSdk = async (sdkName: string, endpoints: IEndpoint[]) => {
  logger.log(`Generating ${sdkName} SDK...`)

  // create spec
  const samples = await getEndpointSamples(endpoints)
  const spec = await generateSpec(samples)
  await outputFile(path.join(sdkDir, sdkName, 'openapi.json'), spec)

  // create client
  await generateClient(sdkName)

  // create tests
  const tests = await generateTests(sdkName)
  await outputFile(path.join(sdkDir, sdkName, 'client.test.js'), tests)

  logger.log(`Generated ${sdkName} SDK`)
}

generateSdk('pokemon', [
  { method: 'GET', url: 'https://pokeapi.co/api/v2/pokemon/2' },
  { method: 'GET', url: 'https://pokeapi.co/api/v2/stat/2' },
  { method: 'GET', url: 'https://pokeapi.co/api/v2/nature/2' }
])

/**
 * future work would be...
 * - validate generated spec against endpoint data (adjusting on and on until it's valid)
 * - adjust generated client for any dx improvements
 * - generate quick start file (most common workflows, intro to objects, etc)
 * - generate sdk changelog
 * - more extensive tests + check that they compile / run on change
 * - small diffs when regenerating spec and tests over time
 * - packaging and deployment
 */

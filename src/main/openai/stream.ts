import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const API_KEY = process.env.OPENAI_API_KEY
const MODEL = 'gpt-3.5-turbo'

if (!API_KEY) {
  throw new Error('Missing API_KEY or BASE_URL')
}

const openai = new OpenAI({ apiKey: API_KEY })

async function main() {
  console.log('NON STREAMING')

  const result = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: 'Say hello!' }],
  })

  console.log(result.choices[0].message.content, '\n')

  console.log('STREAMING')

  const stream = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: 'user', content: 'Say hello!' }],
    stream: true,
  })

  for await (const message of stream) {
    process.stdout.write(message.choices[0]?.delta?.content || '')
  }
  process.stdout.write('\n')
}

/* main().catch((err) => {
  console.error(err)
  process.exit(1)
}) */

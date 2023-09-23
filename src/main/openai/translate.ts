import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const API_KEY = process.env.OPENAI_API_KEY
const MODEL = 'gpt-3.5-turbo'

if (!API_KEY) {
  throw new Error('Missing API_KEY')
}

const openai = new OpenAI({ apiKey: API_KEY })

function prompt(languageFrom: string, languageTo: string, data: string) {
  return `Translate the following JSON file from ${languageFrom} to ${languageTo},
following the same structure and following the JSON rules.

${data}

Return only JSON content.
`
}

export async function translate(data: any) {
  // console.log(prompt('Spanish', 'English', JSON.stringify(data, null, 2)))

  const result = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'user',
        content: prompt('Spanish', 'English', JSON.stringify(data, null, 2)),
      },
    ],
  })

  console.log(result.choices[0]?.message?.content, '\n')

  return result.choices[0]?.message?.content
}

/* translate(data).catch((err) => {
  console.error(err);
  process.exit(1);
}); */

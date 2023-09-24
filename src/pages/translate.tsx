import { Layout } from '@/components/layout/root'
import {
  BracesIcon,
  Check,
  ChevronsUpDown,
  HistoryIcon,
  MessageCircleIcon,
  XIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { CodeViewer } from '@/components/playground/code-viewer'
import { models, types } from '@/components/playground/data/models'
import { presets } from '@/components/playground/data/presets'
import { MaxLengthSelector } from '@/components/playground/maxlength-selector'
import { ModelSelector } from '@/components/playground/model-selector'
import { PresetActions } from '@/components/playground/preset-actions'
import { PresetSave } from '@/components/playground/preset-save'
import { PresetSelector } from '@/components/playground/preset-selector'
import { PresetShare } from '@/components/playground/preset-share'
import { TemperatureSelector } from '@/components/playground/temperature-selector'
import { TopPSelector } from '@/components/playground/top-p-selector'
import { useState } from 'react'
import { ElectronHandler } from '@/main/preload'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import useToggle from '@/lib/hooks/use-toggle'
import { LanguageSelector } from '@/components/language-selector'

/*
 * Main task for now is to open the file explirer, select a json file,
 * send it to the node process so that it can make a request to the openai api,
 * save the response in sqlite local db and return the response to the client.
 * Paint the reponse in this page.
 */

type Use<T extends (...args: any[]) => any> = Awaited<ReturnType<T>>

interface IPCOptions<T, E> {
  fn: (ipc: ElectronHandler) => T | Promise<T>
  onSucces?: (data: T) => void
  onError?: (error: E) => void
}

function useIPC<T, E extends Error = Error>({
  fn,
  onSucces = () => {},
  onError = () => {},
}: IPCOptions<T, E>) {
  const [data, setData] = useState<T>()

  const [isLoading, setIsLoading] = useState(false)

  const [error, setError] = useState({ status: false, message: '' })

  async function exec() {
    setIsLoading(true)
    try {
      const result = await fn(window.electron)
      setData(result)
      setError({ status: false, message: '' })
      onSucces(result)
    } catch (err: any) {
      setError({ status: true, message: err.message })
      onError(err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    exec,
    data,
    isLoading,
    error,
    isError: error.status,
  }
}

// const { mutate, data, isLoading, ... } = useIPCMutation({
//  fn: async (newData) => {
//    const res = await ipc.translate({ text: newData })
//    return res.data
//    }
// })

interface IPCMutationOptions<T, E, I> {
  fn: (ctx: Ctx<I>) => T | Promise<T>
  onSucces?: (data: T) => void
  onError?: (error: E) => void
}

interface Ctx<I> {
  ipc: ElectronHandler
  input: I
}

function useIPCMutation<T, I = unknown, E extends Error = Error>({
  fn,
  onSucces = () => {},
  onError = () => {},
}: IPCMutationOptions<T, E, I>) {
  const [data, setData] = useState<T>()

  const [isLoading, setIsLoading] = useState(false)

  const [error, setError] = useState({ status: false, message: '' })

  async function mutate(input: I) {
    setIsLoading(true)
    try {
      const result = await fn({ ipc: window.electron, input })
      setError({ status: false, message: '' })
      setData(result)
      onSucces(result)
    } catch (err: any) {
      setError({ status: true, message: err.message })
      onError(err)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    mutate,
    data,
    isLoading,
    error,
    isError: error.status,
  }
}

/*
 * Input editor:
 * - plain text (default)
 * - key value - column (excel like)
 * - Json editor
 * - Import json, csv, excel
 */

type Data = Record<string, string>

interface KV {
  key: string
  value: string
}

export default function Translate() {
  const [kv, setKv] = useState<KV[]>([{ key: '', value: '' }])

  const [langTo, setLangTo] = useState({ label: 'English', value: 'en' })

  const [showLangFrom, toggleLangFrom] = useToggle()
  const [showLangTo, toggleLangTo] = useToggle()

  const { mutate, data, isLoading, isError, error } = useIPCMutation<
    Data,
    Data
  >({
    fn: async ({ ipc, input }) => {
      const res = await ipc.translate(input)
      return res.data
    },
    onSucces: (data) => {
      console.log('onSucces', data)
    },
    onError: (error) => {
      console.log('onError', error)
    },
  })

  async function onSubmitKv() {
    const json = kv
      .filter((item) => !!item.key?.trim() && !!item.value?.trim())
      .reduce((acc, item) => ({
        ...acc,
        [item.key]: item.value,
      }), {})

    console.log('data', json)
    await mutate(json)
  }

  return (
    <Layout>
      <div className='hidden h-full flex-col md:flex'>
        <div className='container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16'>
          <h2 className='text-lg font-semibold'>Translate</h2>
          <div className='ml-auto flex w-full space-x-2 sm:justify-end'>
            <PresetSelector presets={presets} />
            <PresetSave />
            <div className='hidden space-x-2 md:flex'>
              <CodeViewer />
              <PresetShare />
            </div>
            <PresetActions />
          </div>
        </div>
        <Separator />
        <Tabs defaultValue='json' className='flex-1'>
          <div className='container h-full py-6'>
            <div className='grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]'>
              <div className='hidden flex-col space-y-4 sm:flex md:order-2'>
                <div className='grid gap-2'>
                  <HoverCard openDelay={200}>
                    <HoverCardTrigger asChild>
                      <span className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                        Mode
                      </span>
                    </HoverCardTrigger>
                    <HoverCardContent className='w-[320px] text-sm' side='left'>
                      Choose the interface that best suits your task. You can
                      provide: a simple prompt to complete, starting and ending
                      text to insert a completion within, or some text with
                      instructions to edit it.
                    </HoverCardContent>
                  </HoverCard>
                  <TabsList className='grid grid-cols-3'>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TabsTrigger value='json'>
                          <span className='sr-only'>Complete</span>
                          <BracesIcon className='h-4 w-4' />
                          <TooltipContent side='bottom'>
                            JSON
                          </TooltipContent>
                        </TabsTrigger>
                      </TooltipTrigger>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TabsTrigger value='text'>
                          <MessageCircleIcon className='h-4 w-4' />
                          <TooltipContent side='bottom'>
                            Text
                          </TooltipContent>
                        </TabsTrigger>
                      </TooltipTrigger>
                    </Tooltip>
                    <TabsTrigger value='edit'>
                      <span className='sr-only'>Edit</span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                        fill='none'
                        className='h-5 w-5'
                      >
                        <rect
                          x='4'
                          y='3'
                          width='12'
                          height='2'
                          rx='1'
                          fill='currentColor'
                        >
                        </rect>
                        <rect
                          x='4'
                          y='7'
                          width='12'
                          height='2'
                          rx='1'
                          fill='currentColor'
                        >
                        </rect>
                        <rect
                          x='4'
                          y='11'
                          width='3'
                          height='2'
                          rx='1'
                          fill='currentColor'
                        >
                        </rect>
                        <rect
                          x='4'
                          y='15'
                          width='4'
                          height='2'
                          rx='1'
                          fill='currentColor'
                        >
                        </rect>
                        <rect
                          x='8.5'
                          y='11'
                          width='3'
                          height='2'
                          rx='1'
                          fill='currentColor'
                        >
                        </rect>
                        <path
                          d='M17.154 11.346a1.182 1.182 0 0 0-1.671 0L11 15.829V17.5h1.671l4.483-4.483a1.182 1.182 0 0 0 0-1.671Z'
                          fill='currentColor'
                        >
                        </path>
                      </svg>
                    </TabsTrigger>
                  </TabsList>
                </div>
                <ModelSelector types={types} models={models} />
                <TemperatureSelector defaultValue={[0.56]} />
                <MaxLengthSelector defaultValue={[256]} />
                <TopPSelector defaultValue={[0.9]} />
                <LanguageSelector value='es' />
                <LanguageSelector value='en' />
              </div>
              <div className='md:order-1'>
                <TabsContent value='json' className='mt-0 border-0 p-0'>
                  <div className='flex h-full flex-col space-y-4'>
                    {
                      /* <Textarea
                      onChange={(e) => setText(e.target.value)}
                      value={text}
                      placeholder='Write a tagline for an ice cream shop'
                      className='min-h-[400px] flex-1 p-4 md:min-h-[700px] lg:min-h-[700px]'
                    /> */
                    }
                    {/*  key valeu intpu*/}

                    <div className='flex items-center justify-around'>
                      <h3 className='text-sm font-medium leading-none'>
                        KEY
                      </h3>
                      <h3 className='text-sm font-medium leading-none'>
                        VALUE
                      </h3>
                    </div>

                    {kv.map((item, i) => (
                      <div key={i} className='flex items-center space-x-2'>
                        <Input
                          value={item.key}
                          onChange={(e) => {
                            setKv((prev) => {
                              const temp = [...prev]
                              temp[i].key = e.target.value
                              return temp
                            })
                          }}
                        />
                        <Input
                          value={item.value}
                          onChange={(e) => {
                            setKv((prev) => {
                              const temp = [...prev]
                              temp[i].value = e.target.value
                              return temp
                            })
                          }}
                        />
                        <Button
                          variant='destructive'
                          size='sm'
                          onClick={() => {
                            setKv((prev) => {
                              const temp = [...prev]
                              temp.splice(i, 1)
                              return temp
                            })
                          }}
                        >
                          <span className='sr-only'>Remove</span>
                          <XIcon className='h-4 w-4' />
                        </Button>
                      </div>
                    ))}
                    <Button
                      className='self-end'
                      onClick={() =>
                        setKv((prev) => [...prev, { key: '', value: '' }])}
                    >
                      Add
                    </Button>

                    <div className='flex items-center space-x-2'>
                      <Button onClick={() => onSubmitKv()}>
                        Submit
                      </Button>
                      <Button variant='secondary'>
                        <span className='sr-only'>Show history</span>
                        <HistoryIcon className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value='text' className='mt-0 border-0 p-0'>
                  <div className='flex flex-col space-y-4'>
                    <div className='grid h-full grid-rows-2 gap-6 lg:grid-cols-2 lg:grid-rows-1'>
                      <Textarea
                        // value={text}
                        // onChange={(e) => setText(e.target.value)}
                        placeholder="We're writing to [inset]. Congrats from OpenAI!"
                        className='h-full min-h-[300px] lg:min-h-[700px] xl:min-h-[700px]'
                      />
                      <div className='rounded-md border bg-muted p-4'>
                        {JSON.stringify(data, null, 2)}
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Button
                        // onClick={async () => {
                        //   if (!text?.trim) return
                        //   await exec()
                        // }}
                      >
                        Submit
                      </Button>
                      <Button variant='secondary'>
                        <span className='sr-only'>Show history</span>
                        <HistoryIcon className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value='edit' className='mt-0 border-0 p-0'>
                  <div className='flex flex-col space-y-4'>
                    <div className='grid h-full gap-6 lg:grid-cols-2'>
                      <div className='flex flex-col space-y-4'>
                        <div className='flex flex-1 flex-col space-y-2'>
                          <Label htmlFor='input'>Input</Label>
                          <Textarea
                            id='input'
                            placeholder='We is going to the market.'
                            className='flex-1 lg:min-h-[580px]'
                          />
                        </div>
                        <div className='flex flex-col space-y-2'>
                          <Label htmlFor='instructions'>Instructions</Label>
                          <Textarea
                            id='instructions'
                            placeholder='Fix the grammar.'
                          />
                        </div>
                      </div>
                      <div className='mt-[21px] min-h-[400px] rounded-md border bg-muted lg:min-h-[700px]' />
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Button>Submit</Button>
                      <Button variant='secondary'>
                        <span className='sr-only'>Show history</span>
                        <HistoryIcon className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </Layout>
  )
}

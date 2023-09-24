import { ipcMain } from 'electron'
import { db } from './db'
import { translate } from './openai/translate'

export function loadIPC() {
  ipcMain.on('ipc-example', async (event, arg) => {
    const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`
    console.log(msgTemplate(arg))
    event.reply('ipc-example', msgTemplate('pong'))
  })

  ipcMain.handle('tls:list', async (event, arg) => {
    console.log('tls:list', arg)
    // const result = await db.query.translations.findMany()
    const result = [
      {
        id: 1,
        name: 'test',
        createdAt: new Date(),
      },
    ]
    return result
  })

  ipcMain.handle('translate', async (event, data) => {
    console.log('recieved data', data)
    // handle erros in the renderer useIPC hook
    // const result = await translate(data);
    return { ok: true, data: 'result' }
  })
}

import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

export type Channels =
  | 'ipc-example'
  | 'tls:list'
  | 'tls:create'
  | 'tls:update'
  | 'tls:delete'

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args)
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args)
      ipcRenderer.on(channel, subscription)

      return () => {
        ipcRenderer.removeListener(channel, subscription)
      }
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args))
    },
  },
  translate: (data: any) => ipcRenderer.invoke('translate', data),
  db: {
    tls: {
      list: () => ipcRenderer.invoke('tls:list'),
      create: (name: string) => ipcRenderer.invoke('tls:create', name),
      update: (id: number, name: string) => {
        ipcRenderer.invoke('tls:update', id, name)
      },
      delete: (id: number) => ipcRenderer.invoke('tls:delete', id),
    },
  },
}

contextBridge.exposeInMainWorld('electron', electronHandler)

export type ElectronHandler = typeof electronHandler

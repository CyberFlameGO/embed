import { types } from 'mobx-state-tree'

export const Modal = types
  .model('Modal', {
    type: types.maybeNull(types.string),
    data: types.maybeNull(types.string),
    channel: types.maybeNull(types.string),
    thread: false,
    content: types.maybeNull(types.string),
    isOpen: false
  })
  .actions(self => ({
    openImage(url: string) {
      self.isOpen = true
      self.type = 'image'
      self.data = url
    },
    openSettings() {
      self.isOpen = true
      self.type = 'settings'
      self.data = null
    },
    openTopic(topic, channel) {
      self.isOpen = true
      self.type = 'topic'
      self.data = topic
      self.channel = channel
    },
    openUpload(channel, thread, content) {
      self.isOpen = true
      self.type = 'upload'
      self.channel = channel
      self.thread = thread
      self.content = content
    },
    close() {
      self.isOpen = false
    }
  }))

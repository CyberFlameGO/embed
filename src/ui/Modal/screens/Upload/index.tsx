import { Root, Top, Title, Close, Body, Image, Field, Checkbox, Button, Loading } from './elements'
import { store } from '@models'
import { generalStore } from '@store'
import { useRef, useState } from 'react'
import { useSendMessage } from '@hooks'
import { Input } from '../Authenticate/elements'

const Upload = () => {
  const file = generalStore.file

  const [dataURL, setDataURL] = useState(null)

  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = () => setDataURL(reader.result)

  let nameField: HTMLInputElement;
  let descField: HTMLInputElement;
  let contentField: HTMLInputElement;
  let spoilerRef = useRef<HTMLInputElement>(null);

  const sendMessage = useSendMessage(store.modal.thread ? generalStore.activeThread.id : null)

  const upload = async (e) => {
    e.preventDefault()
    await sendMessage(contentField.value, (spoilerRef.current.checked ? 'SPOILER_' : '') + (nameField.value || file.name), dataURL, descField.value)
    store.modal.close()
  }

  return (
    <Root className="upload-modal">
      <Top className="top">
        {file.type.includes('image') && <Image src={dataURL} />}
        <Close onClick={store.modal.close} />
      </Top>
      <Body className="body" onSubmit={upload}>
        {dataURL ? <>
          <Title className="title">Upload {file.name}</Title>
          <Field className="filename field">
            <span>Filename</span>
            <Input
              innerRef={ref => (nameField = ref)}
              spellCheck={false}
              defaultValue={file.name}
              placeholder={file.name}
              maxLength={999}
              className="input"
            />
          </Field>
          <Field className="description field" style={{display: 'none'}}> {/* alt field hidden */}
            <span>Description (ALT Text)</span>
            <Input
              innerRef={ref => (descField = ref)}
              placeholder="Add a description (optional)"
              maxLength={999}
              className="input"
            />
          </Field>
          <Field className="message field">
            <span>Message</span>
            <Input
              innerRef={ref => (contentField = ref)}
              autoFocus={true}
              defaultValue={store.modal.content}
              placeholder="Add message content (optional)"
              maxLength={2000}
              className="input"
            />
          </Field>
          <Checkbox className="spoiler checkbox-field">
            <input
              type="checkbox"
              ref={spoilerRef}
            />
            <span className="checkbox">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M8.99991 16.17L4.82991 12L3.40991 13.41L8.99991 19L20.9999 7.00003L19.5899 5.59003L8.99991 16.17Z"></path></svg>
            </span>
            <span className="checkbox-text">Mark as spoiler</span>
          </Checkbox>
          <Button variant="large" className="button">
            Upload to {store.modal.thread ? `"${generalStore.activeThread.name}"` : '#'+store.modal.channel}
          </Button>
        </>
        : <Loading className="loading" />}
      </Body>
    </Root>
  )
}

export default Upload

import GET_CHANNEL_NAME from './ChannelName.graphql'
import { useRouter, useSendMessage } from '@hooks'
import { useQuery } from 'react-apollo-hooks'
import Input from './Input'
import { Field, Root, Slowmode } from './elements'
import { useState, useRef, FunctionComponent, useEffect } from 'react'
import ErrorAhoy from "@ui/Overlays/ErrorAhoy";
import { formatError } from "@views/Messages/utils";
import { Loading } from "@ui/Overlays";
import { addNotification } from "notify";
import { Locale } from '@lib/Locale'
import { authStore, generalStore } from "@store";
import { ChannelName } from '@generated'
import Emoji from "@ui/shared/Emoji";
import thread from "@ui/Message/Thread";
import Tooltip from 'rc-tooltip'
import moment from 'moment'
import { observer } from 'mobx-react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

export interface ChatProps {
  thread?: boolean;
}

moment.relativeTimeThreshold('ss', 0)

const parseTimeRemaining = (timeRemaining: number) => {
  const h = Math.floor(timeRemaining / 3600)
  const m = Math.floor(timeRemaining % 3600 / 60).toString().padStart(2, '0')
  const s = Math.floor(timeRemaining % 60).toString().padStart(2, '0')

  return `${h ? h+':' : ''}${m}:${s}`
}

export const Chat = withRouter(observer((props: ChatProps & RouteComponentProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sendMessage = useSendMessage(props.thread ? generalStore.activeThread.id : null);
  const [rows, setRows] = useState(1);
  const { channel } = useRouter();
  const { data, error, errors, networkStatus, loading } = useQuery<ChannelName>(GET_CHANNEL_NAME, { variables: { channel } });

  const [slowmodeTimeRemaining, setSlowmodeTimeRemaining] = useState(-1)
  const [slowmodeInterval, setSlowmodeInterval] = useState<NodeJS.Timeout | null>(null)
  const [slowmodeRed, setSlowmodeRed] = useState(false)

  useEffect(() => {
    if (slowmodeTimeRemaining < 0) clearInterval(slowmodeInterval)
  }, [slowmodeTimeRemaining])

  if (loading) return <Loading />;
  if (!data || !data.channel) {
    addNotification({
      level: 'error',
      title: Locale.translate('notif.channelunavailable'),
      message: Locale.translate('notif.channelunavailable.desc'),
      autoDismiss: 0,

    });
    return null;
  }
  if (error) addNotification({
    level: 'warning',
    title: Locale.translate('notif.loaderror.chat'),
    message: formatError(error),
    autoDismiss: 0,

  });
  if (error) return <ErrorAhoy message={formatError(error)} />;

  const channelName = props.thread ? generalStore.activeThread.name : data.channel?.name;

  const slowmode = data.channel?.rateLimitPerUser || null

  return (
    <Root className="chat">
      <Field rows={rows} canSend={authStore.user && data.channel.canSend} className="field">
        <Input
          channel={data.channel}
          thread={props.thread}
          onChange={(value: string) => {
            const rows = value.split(/\r\n|\r|\n/).length;
            setRows(rows)
          }}
          onSubmit={async (content: string) => {
            if (content.length === 0) return

            if (slowmodeTimeRemaining >= 0) {
              setSlowmodeRed(true)
              setTimeout(() => setSlowmodeRed(false), 500)
              return
            }

            content = content.replace(/:([^\s:]+?):/g, (match, name) => {
              const result = generalStore.emojis.get(name)
              return result
                ? result.category === 'custom'
                  ? `<${result.animated ? 'a' : ''}:${result.keywords[0]}:${result.emoji}>`
                  : result.emoji
                : match
            })

            if (content.startsWith('/')) {
              const words = content.split(' ')
              const command = words.shift().substring(1)
              if (['shrug', 'tableflip', 'unflip', 'me', 'spoiler'].includes(command)) {
                content = words.join(' ')

                if (['me', 'spoiler'].includes(command) && !content) return

                switch (command) {
                  case 'shrug':     content += ' ¯\\_(ツ)_/¯';     break;
                  case 'tableflip': content += ' (╯°□°）╯︵ ┻━┻';  break;
                  case 'unflip':    content += ' ┬─┬ ノ( ゜-゜ノ)'; break;
                  case 'me':        content  = `_${content}_`;     break;
                  case 'spoiler':   content  = `||${content}||`;   break;
                }
              }
            }

            // TODO: Clear the input field only when the user is signed in, otherwise they lose their message
            inputRef.current.value = ''

            await sendMessage(content)

            if (slowmode) {
              setSlowmodeTimeRemaining(slowmode)

              setSlowmodeInterval(setInterval(() =>
                setSlowmodeTimeRemaining(time => time - 1)
              , 1000))
            }
          }}
          innerRef={ref => (inputRef.current = ref)}
          innerProps={{
            placeholder: channelName ? Locale.translate('input.message', {CHANNEL: channelName}) : null
          }}
        />

         {/*<Emoji />*/}
      </Field>

      {slowmode && <Tooltip
        placement="top"
        overlay={<>Slowmode is enabled.<br />Members can send one<br />message every {moment.duration(slowmode * 1000).humanize()}.</>}
      >
        <Slowmode red={slowmodeRed}>
          {slowmodeTimeRemaining < 0 ? 'Slowmode is enabled.' : parseTimeRemaining(slowmodeTimeRemaining)}
          <svg width="16" height="16" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path fill="currentColor" fillRule="nonzero" d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"></path></g></svg>
        </Slowmode>
      </Tooltip>}
    </Root>
  )
}))

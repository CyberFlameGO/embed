import GET_CHANNEL_NAME from './ChannelName.graphql'
import { useRouter, useSendMessage } from '@hooks'
import { useQuery } from 'react-apollo-hooks'
import Input from './Input'
import { Field, Root } from './elements'
import { useState, useRef, FunctionComponent } from 'react'
import ErrorAhoy from "@ui/Overlays/ErrorAhoy";
import { formatError } from "@views/Messages/utils";
import { Loading } from "@ui/Overlays";
import { addNotification } from "notify";
import { Locale } from '@lib/Locale'
import { authStore, generalStore } from "@store";
import { ChannelName } from '@generated'
import Emoji from "@ui/shared/Emoji";
import thread from "@ui/Message/Thread";

export interface ChatProps {
  thread?: boolean;
}

export const Chat: FunctionComponent<ChatProps> = (props) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sendMessage = useSendMessage(props.thread ? generalStore.activeThread.id : null);
  const [rows, setRows] = useState(1);
  const { channel } = useRouter();
  const { data, error, errors, networkStatus, loading } = useQuery<ChannelName>(GET_CHANNEL_NAME, { variables: { channel } });

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
          }}
          innerRef={ref => (inputRef.current = ref)}
          innerProps={{
            placeholder: channelName ? Locale.translate('input.message', {CHANNEL: channelName}) : null
          }}
        />

         {/*<Emoji />*/}
      </Field>
    </Root>
  )
}

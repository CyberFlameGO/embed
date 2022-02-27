import * as React from 'react'
import Wrapper from '@ui/Wrapper'
import { Header, Fallback } from './Header'
import { Chat } from '@ui/Chat'
import { Messages } from './Messages'
import { Loading } from '@ui/Overlays'
import { observer } from "mobx-react";
import { useEffect } from "react";
import { generalStore } from "@store";

interface Props {
    match: {
        params: {
            channel: string,
            guild: string
        }
    }
}

const MessagesView = observer((props: Props) => {
  useEffect(() => {
    generalStore.clearThread(); // Channel changed, cant be looking at a thread anymore
  },[props.match.params.channel]);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {!(generalStore.activeThread && generalStore.threadFullscreen) && (
        <Wrapper hideOnMobile={!!generalStore.activeThread}>
          <React.Suspense fallback={<Fallback />}>
            <Header channel={props.match.params.channel} guild={props.match.params.guild}/>
          </React.Suspense>

          <React.Suspense fallback={<Loading />}>
            <Messages guild={props.match.params.guild} channel={props.match.params.channel} />
          </React.Suspense>
          <Chat />
        </Wrapper>
      )}

      {generalStore.activeThread && (
        // TODO: I should use a context here realistically, rather than passing thread deep down various components
        <Wrapper threadFullscreen={generalStore.threadFullscreen}>
          <React.Suspense fallback={<Fallback />}>
            <Header channel={props.match.params.channel} guild={props.match.params.guild} thread />
          </React.Suspense>

          <React.Suspense fallback={<Loading />}>
            <Messages guild={props.match.params.guild} channel={props.match.params.channel} thread />
          </React.Suspense>
          <Chat thread />
        </Wrapper>
      )}
    </div>
  )
})

export default MessagesView;

import Tooltip from 'rc-tooltip'
import CHANNEL from './Channel.graphql'
import {
  Name,
  NewsName,
  NSFWName,
  NSFWNewsName,
  Emoji,
  Topic,
  Join,
  Stretch,
  SingleChannelAuthWrapper,
  RulesName,
  ThreadName, Fullscreen
} from '@ui/Header'

import { Root } from './elements'
import { Locale } from "@lib/Locale"
import { store } from '@models'
import { useQuery } from 'react-apollo-hooks'
import GET_INFO from "@ui/Sidebar/Header/GuildInfo.graphql";
import {authStore, AuthStore} from "@store/auth";
import {Auth} from "@ui/Sidebar/Panel/elements";
import {observer} from "mobx-react";
import { SingleChannelAuth } from '@ui/Sidebar/Panel'
import {generalStore} from "@store";
import Pins from './Pins'

export interface HeaderProps {
  channel: string,
  guild: string,
  thread?: boolean,
  AuthStore?: AuthStore
}

export const Header = observer(({ channel, guild, thread }: HeaderProps) => {
    let cData;
    try {
        cData = generalStore.guild.channels.find(c => c.id === channel) || {};
    } catch (_) {
        cData = {}
    }

    const invite = generalStore.settings?.invite;
    const threadData = thread && generalStore.activeThread;

    return (
        <Root thread={thread}>
            <Stretch>
                { cData.nsfw && cData.__typename === 'AnnouncementChannel' ?
                    <NSFWNewsName><Emoji>{cData?.name}</Emoji></NSFWNewsName>
                : cData.__typename === 'AnnouncementChannel' ?
                    <NewsName><Emoji>{cData?.name}</Emoji></NewsName>
                : cData.id === generalStore.guild?.rulesChannelId ?
                    <RulesName><Emoji>{cData?.name}</Emoji></RulesName>
                : cData.nsfw ?
                    <NSFWName><Emoji>{cData?.name}</Emoji></NSFWName>
                : thread ?
                    <ThreadName><Emoji>{threadData.name}</Emoji></ThreadName>
                : <Name><Emoji>{cData?.name}</Emoji></Name>}
                {window.innerWidth < 520 || !cData.topic || thread ? null : (
                        <Topic
                            onClick={() => store.modal.openTopic(cData?.topic, cData.name)}
                            className="topic"
                        >
                            {cData?.topic}
                        </Topic>
                    )}
            </Stretch>
            <Pins />
            <SingleChannelAuthWrapper>
                <SingleChannelAuth />
            </SingleChannelAuthWrapper>
            {invite ? <Tooltip placement="bottom" overlay={Locale.translate('opendiscord.tooltip')}>
                    <Join
                        className="join"
                        href={invite}
                        target="_blank"
                        // TODO: Fix join button
                        // onClick={this.join}
                    >
                        {Locale.translate('opendiscord')}
                    </Join>
                </Tooltip> : null}

          {thread && !generalStore.threadFullscreen && (
            // This is rancid, idk how to do this properly honestly
            <Fullscreen aria-hidden="true" focusable="false" data-prefix="fas" data-icon="expand-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" onClick={() => generalStore.setThreadFullscreen(true)}>
              <path fill="currentColor" d="M212.686 315.314L120 408l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C10.697 480 0 469.255 0 456V344c0-21.382 25.803-32.09 40.922-16.971L72 360l92.686-92.686c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.249 6.248 6.249 16.378 0 22.627zm22.628-118.628L328 104l-32.922-31.029C279.958 57.851 290.666 32 312.048 32h112C437.303 32 448 42.745 448 56v112c0 21.382-25.803 32.09-40.922 16.971L376 152l-92.686 92.686c-6.248 6.248-16.379 6.248-22.627 0l-25.373-25.373c-6.249-6.248-6.249-16.378 0-22.627z"></path>
            </Fullscreen>
          )}
        </Root>
    )
});

export function onClick()  {
    generalStore.settings?.guestMode
        ? (authStore.user ? logout() : generalStore.toggleMenu(true))
        : (authStore.user ? logout() : login())
}

export function login() {
    authStore.discordLogin().then(async () => {
        await authStore.fetchDiscordUser();
        generalStore.needsUpdate = true;
        // await authStore.refreshChannels();
    });
}


export function logout() {
    authStore.logout();
    generalStore.needsUpdate = true;
}

export const Fallback = () => (
  <Root>
    <Stretch>
      <Name>Loading...</Name>
    </Stretch>
  </Root>
);

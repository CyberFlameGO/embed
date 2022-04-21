import Tooltip from 'rc-tooltip'
import * as React from 'react'
import {Query} from 'react-apollo'
import {Route} from 'react-router-dom'

import {GuildInfo, GuildInfoVariables} from '@generated'
import {BannerName, BannerRoot, Count, Icon, Acronym, Name, Root} from './elements'
import {AuthStore, generalStore} from "@store";
import GET_INFO from './GuildInfo.graphql'
import {addNotification} from "notify";
import {store} from "@models";
import {Close} from "@ui/Sidebar/elements";
import webpCheck from '@ui/shared/webpCheck'
import {inject, observer} from "mobx-react";
import { Locale } from '@lib/Locale'
import categorise from "@ui/Sidebar/Channels/categorise";
import {autorun} from "mobx";
import {Util} from '@lib/Util';
import { EmojiStore } from '@services/Emoji'
import { defaultEmojis } from '@services/Emoji/defaultEmojis'

const formatter = new Intl.NumberFormat('en', { notation: 'compact' })

const { compare } = new Intl.Collator()

@observer
export class Header extends React.Component {
	render() {
		return (
			<Route path="/:guild">
				{({match}) => (
					<Query<GuildInfo, GuildInfoVariables>
						key={`guild_info:${match.params.guild}`}
						query={GET_INFO}
						variables={match.params}
						fetchPolicy='cache-and-network'
					>
						{({loading, error, data, refetch}) => {
							generalStore.fetchGuild = refetch;
							generalStore.loading = loading;

							if (loading) return null;
							if (!data || !data.guild) {
								addNotification({
									level: 'error',
									title: Locale.translate('notif.serverunavailable'),
									message: Locale.translate('notif.serverunavailable.desc'),
									autoDismiss: 0,
								});
								return null;
							}

							try {
								generalStore.setGuild(data.guild);
							} catch (_) {
								// noop
							}

							try {
								generalStore.setChannels(categorise((data.guild.channels as any).sort((a, b) => { return a.position - b.position })))
							} catch (_) {
								generalStore.setChannels([]);
							}

							generalStore.setEmojis(new EmojiStore(
								...generalStore.guild?.emojis.sort((a, b) => compare(a.name, b.name)).map(e => ({
									category: 'custom',
									emoji: e.id,
									keywords: [e.name],
									animated: e.animated,
									available: e.available
								})),
								...defaultEmojis
							))

							if (error) return null;

							let icon = data.guild.icon && Util.craftServerUrl(data.guild.id, data.guild.icon);

							if (icon) {
								if (icon.includes('a_')) {
									icon = icon.replace('webp', 'gif?size=64')
								} else {
									icon = webpCheck(icon) + '?size=64'
								}
							}

							if (data.guild.banner) {

								let banner = webpCheck(Util.craftBannerUrl(data.guild.id, data.guild.banner));

								if (window.innerWidth < 520) return (
									<BannerRoot className="header" backgroundImage={banner}>
										{icon ? <Icon src={icon} className="icon"/>
										: <Acronym>{data.guild.name.replace(/'s /g, ' ').replace(/\w+/g, e => e[0]).replace(/\s/g, '')}</Acronym>}
										<BannerName className="name">{data.guild.name}</BannerName>
										<Close onClick={store.sidebar.toggle}/>
									</BannerRoot>
								)
								return (
									<BannerRoot className="header" backgroundImage={banner}>
										{icon ? <Icon src={icon} className="icon"/>
										: <Acronym>{data.guild.name.replace(/'s /g, ' ').replace(/\w+/g, e => e[0]).replace(/\s/g, '')}</Acronym>}
										<BannerName className="name">{data.guild.name}</BannerName>
										<Tooltip
											placement="bottom"
											overlay={
												`${data.guild.memberCount === 1 ? Locale.translate('membercount.one.tooltip') : Locale.translate('membercount.tooltip', {COUNT: data.guild.memberCount.toLocaleString()})}`
											}
										>
											<Count className="count">{formatter.format(data.guild.memberCount)}</Count>
										</Tooltip>
										<Close onClick={store.sidebar.toggle}/>
									</BannerRoot>
								)

							}

							if (window.innerWidth < 520) return (
								<Root className="header">
									{icon ? <Icon src={icon} className="icon"/>
									: <Acronym>{data.guild.name.replace(/'s /g, ' ').replace(/\w+/g, e => e[0]).replace(/\s/g, '')}</Acronym>}
									<Name className="name">{data.guild.name}</Name>
									<Close onClick={store.sidebar.toggle}/>
								</Root>
							)
							return (
								<Root className="header">
									{icon ? <Icon src={icon} className="icon"/>
									: <Acronym>{data.guild.name.replace(/'s /g, ' ').replace(/\w+/g, e => e[0]).replace(/\s/g, '')}</Acronym>}
									<Name className="name">{data.guild.name}</Name>
									<Tooltip
										placement="bottom"
										overlay={
											`${data.guild.memberCount === 1 ? Locale.translate('membercount.one.tooltip') : Locale.translate('membercount.tooltip', {COUNT: data.guild.memberCount.toLocaleString()})}`
										}
									>
										<Count className="count">{formatter.format(data.guild.memberCount)}</Count>
									</Tooltip>
									<Close onClick={store.sidebar.toggle}/>
								</Root>
							)
						}}
					</Query>
				)}
			</Route>
		)
	}
}

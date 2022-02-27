import * as React from 'react'

import {Auth, Developers, Root, Version} from './elements'
import {inject, observer} from "mobx-react";
import {authStore, AuthStore} from "@store/auth";
import {onClick} from "@views/Messages/Header";
import {Locale} from '@lib/Locale';
import {FiLogOut, FiLogIn} from 'react-icons/fi'
import Tooltip from 'rc-tooltip';
import {generalStore} from "@store";

const { version } = require('../../../../package.json');

console.log(`WidgetBot version: ${version}`)

const queryParams = new URLSearchParams(location.search)

@observer
export default class Panel extends React.Component<{}> {
	onClick(e: React.MouseEvent<HTMLAnchorElement>)  {
		onClick.call({ props: { AuthStore: authStore }}, e)
	};

	render(): React.ReactNode {
		// const lastUpdate = localStorage.getItem('lastUpdate');
		// if (!lastUpdate || Semver.newMinorOrMajor(lastUpdate, version)) {
		// 	localStorage.setItem('lastUpdate', version);
		// 	authStore.logout();
		// 	authStore.needsUpdate = true;
		// }
		//  <LoginButton AuthStore={authStore}/>
		//  {window.innerWidth > 520 ? (authStore.user ? `Logged in as ${authStore.user.username}` : undefined) : undefined}
		return (
			<Root className="panel">
				<Developers>
					{queryParams.has('username') ||
						<Auth
							className="auth"
							target="_blank"
							onClick={this.onClick.bind(this)}
						>
							{Locale.translate(`frontend.auth.${authStore.user ? 'logout' : 'login'}`)}
						</Auth>
					}
				</Developers>
				<Version
					href={`https://widgetbot.io`}
					target="_blank"
					onClick={e => {
						e.preventDefault();
						// openModal({ variables: { type: 'settings', data: null } })
					}}
				>
					{`${version}`}
				</Version>
				{
					/* <Tooltip
					   placement="top"
					   overlay={<Trans id="Panel.settings">Settings</Trans>}
					 >
					   <Settings onClick={store.modal.openSettings} />
						<Tooltip
							 placement="top"
							 overlay={<Trans id="Panel.about">About</Trans>}
						   >

						   </Tooltip> */
				}
			</Root>
		)
	}
}

@observer
export class SingleChannelAuth extends React.Component<{}> {
	onClick(e: React.MouseEvent<HTMLAnchorElement>)  {
		onClick()
	};

	render(): React.ReactNode {
		if (queryParams.has('username')) return null

		return (
			<Tooltip placement="bottom" overlay={Locale.translate(`frontend.auth.${authStore.user ? 'logout' : 'login'}`)}>
				<Auth
					className="auth"
					target="_blank"
					onClick={this.onClick.bind(this)}
					style={{padding: '2px 0', minWidth: '28px'}}
				>
					{authStore.user ? <FiLogOut /> : <FiLogIn />}
				</Auth>
			</Tooltip>
		)
	}
}

import * as React from "react";
import { inject, observer } from "mobx-react";
import { Box, Close } from "@ui/Modal";
import {authStore, AuthStore} from "@store/auth";
import { Overlay, Create, Greeting, Group, Input, Root, Title, SSO, Discord, LSText, XEye } from "./elements";
import {store} from "@models";
import { Locale } from "@lib/Locale";
import {generalStore} from "@store";

import icon from '@images/cookies/icon.svg'
import screenshot from '@images/cookies/screenshot.png'

interface State {
  awaiting: boolean;
}

@observer
class Authenticate extends React.Component<{}, State> {
  state: State = {
    awaiting: false
  };
  nameField: HTMLInputElement;

  signUp(e: Event) {
    e.preventDefault();

    const name = this.nameField.value;
    if (name.length < 1) return;

    this.setState({
      awaiting: true
    });
    authStore.guestLogin(name).then(async () => {
      await authStore.setGuestUser(name);
      generalStore.needsUpdate = true;

      generalStore.toggleMenu(false);
      this.setState({
        awaiting: false
      });
    });
  }

  discordSignOn(e?: Event) {
    if (e) e.preventDefault();
    this.setState({
      awaiting: true
    });
    authStore.discordLogin().then(async () => {
      await authStore.fetchDiscordUser();
      generalStore.needsUpdate = true;

      generalStore.toggleMenu(false);
      this.setState({
        awaiting: false
      });
    });
  }

  render() {
    const { awaiting } = this.state;

    if (!generalStore.menuOpen) return null

    try {
      localStorage
    } catch (e) {
      return <Overlay className="modal-overlay">
        <Root loading={false}>
          <Close onClick={() => generalStore.toggleMenu(false)} className="close-button" />
          <Title>We can't log you in</Title>
          <Greeting>(╯°□°）╯︵ ┻━┻</Greeting>
          <LSText>{e.toString()}</LSText>
          <LSText>
            This is usually due to your browser blocking third-party cookies, which often happens in Chrome Incognito mode.
            Please turn on third-party cookies, then try again.
          </LSText>
          <LSText>
            Look for a <XEye src={icon} /> icon in the address bar.
            If you see it, click it and click "Site not working", then "Allow cookies".</LSText>
            <img src={screenshot} height="350" />
          <LSText>If you use Brave, change the Brave Shield settings.</LSText>
        </Root>
      </Overlay>
    }

    if (!generalStore.settings?.guestMode) return null

    return (
        <Overlay className="modal-overlay">
          <Root loading={awaiting} className={`login-modal${awaiting ? ' inactive' : ''}`}>
            <Close onClick={() => generalStore.toggleMenu(false)} className="close-button" />
            <Title className="title">{Locale.translate('auth.welcome')}</Title>
            <Greeting className="greeting">{Locale.translate('auth.pickname')}</Greeting>
            <Group label={Locale.translate('auth.name')} onSubmit={this.signUp.bind(this)} className="group">
              <Input
                  innerRef={ref => (this.nameField = ref)}
                  autoFocus={true}
                  spellCheck={false}
                  minLength={1}
                  maxLength={80}
                  required
                  className="input"
              />
              <Create variant="large" className="login-button">{Locale.translate('auth.continue')}</Create>
              <SSO className="sso">
                {Locale.translate('auth.discordacc')}
                <Discord onClick={this.discordSignOn.bind(this)} className="discord-button">
                  {Locale.translate('auth.login2')}
                </Discord>
              </SSO>
            </Group>
          </Root>
        </Overlay>
    )
  }
}

export default Authenticate;

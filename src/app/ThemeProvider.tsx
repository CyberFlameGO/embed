import { Theme as ThemeContext } from '@lib/emotion'
import Color from 'color'
import { ThemeProvider as Provider } from 'emotion-theming'
import * as _ from 'lodash'
import { GlobalStyles } from './elements'
import GET_SETTINGS from './Settings.graphql'

import { Settings, Settings_settings_theme } from '@generated'
import * as Constants from '@constants'
import { useQuery } from 'react-apollo-hooks'
import {useCacheLoaded, useRouter} from '@hooks'
import {generalStore, authStore} from '@store';

const queryParams = new URLSearchParams(location.search)

export const ThemeProvider = ({ children }) => {
  let guild;
  const use = useRouter();

  if (!use) {
    guild  = null;
  } else {
    guild = use.guild;
  }

  const { data: {settings} } = useQuery<Settings>(GET_SETTINGS, { variables: { guild }, fetchPolicy: 'network-only' })

  const allowedDomains = settings?.allowedDomains
  if (allowedDomains?.length > 0) {
    let allowed = true

    // @ts-expect-error
    if (location.ancestorOrigins?.length > 0 && ![...location.ancestorOrigins].some(origin => allowedDomains.some(d => origin.includes(d)))) {
      console.error('WidgetBot: allowedDomains failed ancestorOrigins check', location.ancestorOrigins, allowedDomains)
      allowed = false
    }

    if (!location.ancestorOrigins && document.referrer && !allowedDomains.some(d => document.referrer.includes(d))) {
      console.error('WidgetBot: allowedDomains failed referrer check', document.referrer, allowedDomains)
      allowed = false
    }

    if (!allowed) return <>
      <div style={{color: 'white', fontFamily: 'sans-serif'}}>
        <p>This Discord server does not allow being embedded on this website.</p>
        <p>Discord embed powered by <a href="https://widgetbot.io" target="_blank" rel="noopener" style={{color: 'white'}}>WidgetBot.io</a></p>
      </div>
      <style>{'#root {opacity: 100%}'}</style>
    </>
  }

  let theme: Settings_settings_theme = {
    __typename: 'ThemeSettings',
    colors: {
      __typename: 'ThemeColorSettings',
      primary: settings?.theme?.colors?.primary || Constants.THEME_COLOR_PRIMARY,
      accent: settings?.theme?.colors?.accent || Constants.THEME_COLOR_ACCENT,
      background: settings?.theme?.colors?.background || Constants.THEME_BACKGROUND
    },
    css: settings?.theme?.css || ``
  };

  generalStore.setSettings(settings)
  
  if (queryParams.has('username')) {
    const name = decodeURIComponent(queryParams.get('username'))
    if (name !== authStore.user?.username)
      authStore.guestLogin(name).then(async () => {
        await authStore.setGuestUser(name);
        generalStore.needsUpdate = true;
      })
  }

  const themeContext: ThemeContext = {
    ...theme,
    readonly: settings?.readonly || false,
    guestMode: settings?.guestMode || false,
    singleChannel: settings?.singleChannel || '',
    colors: {
      ...theme.colors,
      _primary: Color(theme.colors.primary),
      _background: Color(theme.colors.background),
      _accent: Color(theme.colors.accent)
    },
    url: {
      preset: queryParams.get('preset') as 'crate' | null,
      api: queryParams.get('api')
    }
  };
  // TODO: I found why the URL parsing doesn't work l m a o.

  GlobalStyles.inject(themeContext);

  return <Provider theme={themeContext}>{children}</Provider>
};

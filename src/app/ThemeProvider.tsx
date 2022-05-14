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

  let theme: Settings_settings_theme = {
    __typename: 'ThemeSettings',
    colors: {
      __typename: 'ThemeColorSettings',
      primary: settings?.theme?.colors?.primary || Constants.THEME_COLOR_PRIMARY,
      accent: settings?.theme?.colors?.accent || Constants.THEME_COLOR_ACCENT,
      background: settings?.theme?.colors?.background || Constants.THEME_BACKGROUND
    },
    css: queryParams.has('css') && decodeURIComponent(queryParams.get('css')) || settings?.theme?.css || ``
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
    singleChannel: !!settings?.singleChannel || settings?.hideSidebar || false,
    colors: {
      ...theme.colors,
      _primary: Color(theme.colors.primary),
      _background: Color(theme.colors.background),
      _accent: Color(theme.colors.accent)
    },
    url: {
      preset: queryParams.get('preset') as 'crate' | null,
      api: queryParams.get('api')
    },
    loadedSettings: !!settings
  };

  GlobalStyles.inject(themeContext);

  return <Provider theme={themeContext}>{children}</Provider>
};

import { action, computed, observable } from "mobx";
import axios from 'axios';
import { APIRequest, Endpoints } from "../api";
import {API_URL, url} from "@lib/env";
import { ICategory } from "@ui/Sidebar/Channels/categorise";
import { useRouter } from "@hooks";
import CHANNELS from "@ui/Sidebar/Channels/Channels.graphql";
import { addNotification } from 'notify';
import {act} from "react-dom/test-utils";
import {Locale} from "@lib/Locale";
import {generalStore} from "@store/general";

interface DiscordUser {
  avatar: string
  discriminator: null
  username: string
  _id: string
}

interface GuestUser {
  username: string
  avatarUrl: string | null
  guest: true
}

type User = DiscordUser | GuestUser;

const queryParams = new URLSearchParams(location.search)

const loginError = (msg: string) => addNotification({
  level: 'warning',
  title: Locale.translate('notif.login.unsuccessful'),
  message: msg.replace('GraphQL error: ', ''),
  autoDismiss: 0,
});
export class AuthStore {
  @observable token: string;
  @observable locale: string;

  @observable inProgress: boolean = false;
  @observable errors: string | undefined = undefined;
  @observable user: User | null;

  constructor() {
    try {
      this.token = window.localStorage.getItem('token');
      this.locale = window.localStorage.getItem("locale") || "en";
      this.user = JSON.parse(window.localStorage.getItem('user'));

      if (!localStorage.getItem('token')) {
        this.logout();
        generalStore.needsUpdate = true;
        // localStorage.setItem('lastUpdate', version)
      }
    } catch (e) {
      console.log('WidgetBot: localStorage is inaccessible so auth is disabled')
    }
  }

  @action setLocale(locale: string) {
    const keys = Locale.allKeys();
    if (!keys.includes(locale)) return; // Temp fix
    window.localStorage.setItem("locale", locale);
    this.locale = locale;
  }

  @action async fetchDiscordUser() {
    const { data } = await APIRequest(Endpoints.auth.fetchLatestProfile);

    window.localStorage.setItem('user', JSON.stringify(data));
    this.user = data;

    return data;
  }

  @action async setGuestUser(username: string) {
    const user: GuestUser = {
      username,
      avatarUrl: queryParams.get('avatar'),
      guest: true
    }
    window.localStorage.setItem('user', JSON.stringify(user))

    this.user = user

    return user
  }

  @action logout() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');

    this.user = undefined;
    this.token = undefined;
  }

  @action discordLogin() {
    return new Promise<void>((resolve, reject) => {
      this.inProgress = true;
      this.errors = undefined;

      const x: number = screen.width / 2 - 840 / 2;
      const y: number = screen.height / 2 - 700 / 2;

      const newWindow = window.open(`${API_URL}${Endpoints.auth.discord.split(' ')[1]}`, 'Login to WidgetBot with Discord!', `menubar=no,width=905,height=752,location=no,resizable=no,scrollbars=yes,status=no,left=${x},top=${y}`);

      const timer = setInterval(() => {
        if ((newWindow as Window).closed) {
          cleanup();
          this.inProgress = false;
          reject(() => {});
        }
      }, 500);

      const receiveMessage = ({ data, source }: MessageEvent) => {
        source = source as Window;

        switch (data.type) {
          case 'AUTH_SUCCESS': {
            source.close();
            if (!data.token) {
              this.inProgress = false;
              return reject(() => {});
            }

            localStorage.setItem('token', data.token);

            this.token = data.token;
            this.inProgress = false;
            return resolve();
          }
          case 'AUTH_FAIL': {
            source.close();
            cleanup();
            console.log(data.error);
            return reject(() => {})
            // return reject(loginError("You pressed cancel on the authentication window"));
          }
        }
      };
      window.addEventListener('message', receiveMessage);

      const cleanup = () =>  {
        clearInterval(timer);
        window.removeEventListener('message', receiveMessage);
      }
    })
  }

  @action guestLogin(username: string) {
    return new Promise<void>(async (resolve, reject) => {
      this.inProgress = true;
      this.errors = undefined;

      const { data } = await APIRequest(Endpoints.auth.guest, { payload: {
        username,
        avatar: queryParams.get('avatar')
      } })

      switch (data.type) {
        case 'AUTH_SUCCESS': {
          if (!data.token) {
            this.inProgress = false;
            return reject(() => {});
          }

          localStorage.setItem('token', data.token);

          this.token = data.token;
          this.inProgress = false;
          return resolve();
        }
        case 'AUTH_FAIL': {
          console.log(data.error);
          return reject(() => {})
        }
      }
    })
  }
}

export const authStore = new AuthStore();

import 'babel-polyfill'

import * as Sentry from '@sentry/browser';

import * as ReactDOM from 'react-dom'
import { Suspense, lazy } from 'react'

import { Loading } from '@ui/Overlays/Loading/elements'

import icon from '@images/cookies/icon.svg'
import screenshot from '@images/cookies/screenshot.png'

if (!window.location.hostname.includes(`127.0.0.1`) && !window.location.hostname.includes(`localhost`))
    Sentry.init({dsn: 'https://dc53893051504a7f9f94b1c207364f5f@o328116.ingest.sentry.io/1840509'});

let ls: Storage
try {
  ls = localStorage
} catch (e) {
  ReactDOM.render(<>
    <div style={{color: 'white', fontFamily: 'sans-serif'}}>
      <p>There was an error loading the WidgetBot.io Discord chat embed:</p>
      <p>{e.toString()}</p>
      <p>This is usually due to your browser blocking third-party cookies, which often happens in Chrome Incognito mode.
        Look for a <img src={icon} style={{height: '1.2rem', width: '1.2rem', verticalAlign: 'middle'}} /> icon in the address bar.
        If you see it, click it and click "Site not working", then "Allow cookies".</p>
        <img src={screenshot} height="350" />
      <p>If you use Brave, change the Brave Shield settings.</p>
    </div>
    <style>{'#root {opacity: 100%}'}</style>
  </>, document.getElementById('root'))
}

if (ls) {
  const Renderer = lazy(() => import('./Renderer'))
  ReactDOM.render(
    <Suspense 
      fallback={<Loading />}>
      <Renderer />
    </Suspense>
  , document.getElementById('root'))
}

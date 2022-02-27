import { Root, SingleChannel, Inner } from './elements'
import Hamburger from './Hamburger'
import { store } from '@models'
import { observer } from 'mobx-react'
import { Header as ServerInfo } from '@ui/Sidebar/Header'
import { generalStore } from "@store";

interface Props {
  children: any;
  thread?: boolean
}

const Header = observer(({ children, thread = false }: Props) => (
  <Root className="header">
    <SingleChannel>
      <ServerInfo />
    </SingleChannel>
    <Inner>
      <Hamburger
        onClick={e => {
          e.stopPropagation();
          thread
            ? generalStore.clearThread()
            : store.sidebar.toggle();
        }}
        open={store.sidebar.isOpen}
        thread={thread}
      />

      {children}
    </Inner>
  </Root>
))

export default Header

export * from './elements'

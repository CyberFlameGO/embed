import { generalStore } from '@store'
import Message from '@ui/Message'
import { Loading } from '@ui/Overlays/Loading/elements'
import { observer } from 'mobx-react'
import { useEffect, useState } from 'react'
import { PinButton, Display, Title, List, Pin, NoPins } from './elements'
import noPins from '@images/discordAssets/ef3a1ed683cfcf029971b12a26462072.svg'
import Tooltip from 'rc-tooltip'

export default observer(() => {
    const [right, setRight] = useState(0)
    let button: HTMLElement
    let display: HTMLDivElement

    useEffect(() => {
        setRight(innerWidth - button.getBoundingClientRect().right)

        const handleShortcut = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'p') {
                event.preventDefault()
                generalStore.togglePins()
            }
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (![display, button].some(e => e?.contains(event.target as Node))) generalStore.togglePins(false)
        }

        document.addEventListener('keydown', handleShortcut)
        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('keydown', handleShortcut)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    })

    const pins = generalStore.pins

    return <>
        <Tooltip
            placement="bottom"
            overlay="Pinned Messages"
        >
            <PinButton innerRef={ref => (button = ref)} onClick={() => generalStore.togglePins()} open={generalStore.pinsOpen} className="pin-button" x="0" y="0" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12L12.101 2.10101L10.686 3.51401L12.101 4.92901L7.15096 9.87801V9.88001L5.73596 8.46501L4.32196 9.88001L8.56496 14.122L2.90796 19.778L4.32196 21.192L9.97896 15.536L14.222 19.778L15.636 18.364L14.222 16.95L19.171 12H19.172L20.586 13.414L22 12Z"></path></PinButton>
        </Tooltip>
        {generalStore.pinsOpen && <Display right={right} innerRef={ref => (display = ref)} className="pin-display">
            <Title className="pin-title">Pinned Messages</Title>
            <List className="pin-list">
                {pins
                    ? pins.length
                        ? pins.map(pin => <Pin className="pin"><Message messages={[pin]} allMessages={pins} /></Pin>)
                        : <NoPins className="no-pins">
                            <img src={noPins} />
                            <span>This channel doesn't have any <br /> pinned messages... yet.</span>
                          </NoPins>
                    : <div style={{ height: '300px' }}><Loading /></div>
                }
            </List>
        </Display>}
    </>
})

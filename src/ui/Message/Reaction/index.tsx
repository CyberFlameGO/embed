import { Message_reactions } from '@generated'
import webpCheck from '@ui/shared/webpCheck'
import Tooltip from 'rc-tooltip'
import * as React from 'react'
import { generalStore } from '@store'

import { Count, Emoji, Root } from './elements'

type Props = Message_reactions

class Reaction extends React.Component<Props> {
  render() {
    const { emojiName, emojiId, count, animated } = this.props
    const url: string = emojiId && webpCheck(`https://cdn.discordapp.com/emojis/${emojiId}.${animated ? 'gif' : 'webp'}?v=1`)

    return (
      <Tooltip
        placement="top"
        overlay={`:${emojiId ? emojiName : generalStore.emojis.get(emojiName)?.keywords[0]}:`}
        mouseEnterDelay={0.5}
      >
        <span>
          <Root className="reaction">
            {url ? (
              <Emoji src={url} />
            ) : (
              <Emoji className="reaction-emoji" disableTooltip={true}>{emojiName}</Emoji>
            )}
            <Count className="reaction-count">{count}</Count>
          </Root>
        </span>
      </Tooltip>
    )
  }
}

export default Reaction

import { createRef, useEffect, useMemo, useState } from 'react';
import { AutoSizer } from 'react-virtualized';
import { FixedSizeList as List } from 'react-window';
import {
  Root,
  Container,
  Sidebar,
  Content,
  EmojiDisplay,
  RowContainer,
  NameDisplay,
  Icons,
  SidebarEmojiDisplay,
  ServerIcon
} from './elements/emojipicker'
import { Twemoji } from '@ui/shared/Emoji/emoji'
import { generalStore } from '@store'
import _ from 'lodash'
import { Util } from '@lib/Util'
import { observer } from 'mobx-react'
import Tooltip from 'rc-tooltip'

interface Props {
  button: HTMLButtonElement
  close: () => void
  onSelect: (emoji: string) => void
}

const EmojiPicker = observer(({ button, close, onSelect }: Props) => {
  let picker: HTMLDivElement
  let list = createRef<List>();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (![picker, button].some(e => e?.contains(event.target as Node))) close();
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [picker])


  let rowCount: number

  const emojiCategories = useMemo(() => {
    const categories = generalStore.emojis.reduce((obj, emoji) => ({
      ...obj,
      ...({ [emoji.category]: [...(obj[emoji.category] || []), emoji] })
    }), {});

    Object.keys(categories).forEach(category => categories[category] = _.chunk(categories[category], 9));

    let index = 0

    Object.keys(categories).forEach(category => {
      categories[category] = [index, categories[category]]
      index += categories[category][1].length + 1
      rowCount = index
    })

    return categories
  }, [generalStore.emojis]) as Record<string, [number, any[][]]>

  const scrollToCategory = (category: string) => {
    const rowIdx = emojiCategories[category][0];

    list.current.scrollToItem(rowIdx, 'start');
  }

  return (
    <Root className="emoji-picker" innerRef={ref => picker = ref}>
      <Container>
        <Sidebar className="emoji-picker-sidebar">
          {Object.keys(emojiCategories).map(category => {
            const CategoryIcon = Icons.mapped[category] || Icons.People;

            return (
              <SidebarEmojiDisplay key={category} onClick={() => scrollToCategory(category)}>
                 {category === 'custom'
                    ? generalStore.guild?.icon && <ServerIcon sidebar src={Util.craftServerUrl(generalStore.guild.id, generalStore.guild.icon)} />
                    : <CategoryIcon sidebar/>}
              </SidebarEmojiDisplay>
            );
          })}
        </Sidebar>

        <Content className="emoji-picker-content">
          <AutoSizer innerRef={ref => list = ref}>
            {({ width, height }) => {
              if (!width || !height) return null

              return <List
                ref={list}
                className="emoji-list"
                width={width}
                height={height}
                itemSize={40}
                itemCount={rowCount}
              >
                {({ index, style }) => {
                  const [name, cat] = Object.entries(emojiCategories).reverse().find(c => c[1][0] <= index)

                  if (index === cat[0]) {
                    const CategoryIcon = Icons.mapped[name] || Icons.People;

                    return (
                      // @ts-expect-error
                      <RowContainer style={style}>
                        <NameDisplay className="emoji-picker-name">
                          {name === 'custom'
                            ? <>
                                {generalStore.guild?.icon && <ServerIcon src={Util.craftServerUrl(generalStore.guild.id, generalStore.guild.icon)} />}
                                {generalStore.guild?.name}
                              </>
                            : <>
                                <CategoryIcon />
                                {name}
                              </>
                          }
                        </NameDisplay>
                      </RowContainer>
                    )
                  }

                  const emojiIndex = index - 1;

                  const emojis = cat[1][emojiIndex - cat[0]]

                  return (
                    // @ts-expect-error
                    <RowContainer style={style} className="emoji-picker-row">
                      {emojis.map(emoji => (
                        <EmojiDisplay key={emoji.keywords[0]} onClick={() => onSelect(`:${emoji.keywords[0]}:`)}>
                          {emoji.category === 'custom'
                            ? <Tooltip
                                placement="top"
                                overlay={`:${emoji.keywords[0]}:`}
                                mouseEnterDelay={0.6}
                                mouseLeaveDelay={0}
                              >
                                <img src={`https://cdn.discordapp.com/emojis/${emoji.emoji}.${emoji.animated ? 'gif' : 'png'}`} />
                              </Tooltip>
                            : <Twemoji>{emoji.emoji}</Twemoji>
                          }
                        </EmojiDisplay>
                      ))}
                    </RowContainer>
                  )
                }}
              </List>
            }}
          </AutoSizer>
        </Content>
      </Container>
    </Root>
  )
})

export default EmojiPicker

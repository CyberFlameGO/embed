import { Message_author } from '@generated'
import Moment from 'moment'
import * as React from 'react'

import { Sysadmin, Tag, Verified } from "./Badges";
import { Name, Root, Time, VerifiedBot } from './elements'
import { Locale } from '@lib/Locale';
import Tooltip from 'rc-tooltip';
import { store } from '@models';

interface Props {
  author: Message_author
  time: number
  crosspost?: boolean
  referenceGuild?: string
  guest: boolean
}

const developers = {
  "96626362277720064": {
    href: null,
    title: "Owner",
  },
  "242097488507568128": {
    href: null,
    title: "Developer"
  },
  "326483019349098506": {
    href: null,
    title: "Developer"
  },
  "190916650143318016": {
    href: null,
    title: "Staff"
  },
  "302604426781261824": {
    href: null,
    title: "Developer"
  }
};

export const Timestamp = ({ time }: { time: number }) => (
  <Tooltip
    mouseEnterDelay={1}
    placement="top"
    overlay={Moment(time).format('LLLL')}
  >
    <Time className="time">{Moment(time).calendar()}</Time>
  </Tooltip>
);

const verified = 
  <Tooltip placement="top" overlay="Verified Bot">
    <VerifiedBot aria-label="Verified Bot" aria-hidden="false" width="16" height="16" viewBox="0 0 16 15.2"><path d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z" fill="currentColor"></path></VerifiedBot>
  </Tooltip>

export const tags = ({author, crosspost, referenceGuild, guest}: Omit<Props, 'time' | 'author'> & { author: Pick<Message_author, 'bot' | 'flags'>}) => 
  <React.Fragment>
    {author.bot &&
      ( guest ? <Tag className="guest">Guest</Tag>
      : author.flags & 1 << 12 ? <Tag className="verified system">{verified} System</Tag>
      : referenceGuild === '667560445975986187' ? <Tag className="system">System</Tag>
      : crosspost ? <Tag className="server">{Locale.translate('tag.server')}</Tag>
      : author.flags & 1 << 16 ? <Tag className="verified bot">{verified} {Locale.translate('tag.bot')}</Tag>
      : <Tag className="bot">{Locale.translate('tag.bot')}</Tag>
      )}
  </React.Fragment>

class Author extends React.PureComponent<Props> {
  render() {
    const { author, time } = this.props;

    const hexColor = '#'+ (author.color.toString(16).padStart(6, '0') || 'fff')

    let name: HTMLDivElement

    return (
      <Root className="author">
        <Name
          color={hexColor}
          className="name"
          innerRef={ref => name = ref}
          onClick={() => store.modal.openProfile(
            author.id,
            author.name,
            author.discrim,
            author.avatarUrl,
            author.bot,
            author.flags,
            this.props.guest,
            name.getBoundingClientRect().right + 10,
            Math.min(name.getBoundingClientRect().y, innerHeight - 250)
          )}
        >
          {author.name}
        </Name>
        {tags(this.props)}
        {Author.verified({ id: author.id })}
        <Timestamp time={time} />
      </Root>
    )
  }

  static verified({ id }: { id: string }) {
    if (developers[id]) {
      const dev = developers[id];
      return <Verified
        href={dev.href}
        title={dev.title}
        target="_blank"
        rel="noopener"
      />
    }

    return null
  }
}

export default Author

import { Message_author } from '@generated'
import Moment from 'moment'
import * as React from 'react'

import { Sysadmin, Tag, Verified } from "./Badges";
import { Name, RoleIcon, Root, Time, UnicodeEmoji, VerifiedBot } from './elements'
import { Locale } from '@lib/Locale';
import Tooltip from 'rc-tooltip';
import { generalStore } from '@store';
import webpCheck from '@ui/shared/webpCheck'

interface Props {
  author: Message_author
  time: number
  crosspost: boolean
  referenceGuild: string
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

export const tags = ({author, crosspost, referenceGuild, guest}: Omit<Props, 'time'>) => 
  <React.Fragment>
    {author.bot &&
      ( guest ? <Tag className="guest">Guest</Tag>
      : author.flags & 1 << 12 ? <Tag className="verified system">{verified} System</Tag>
      : referenceGuild === '667560445975986187' ? <Tag className="system">System</Tag>
      : crosspost ? <Tag className="server">{Locale.translate('tag.server')}</Tag>
      : author.flags & 1 << 16 ? <Tag className="verified bot">{verified} {Locale.translate('tag.bot')}</Tag>
      : <Tag className="bot">{Locale.translate('tag.bot')}</Tag>
      )}
    {author.id === 'aaaa' && <Tag className="guest">Guest</Tag>}
  </React.Fragment>

const roleIcon = (roleIDs: string[]) => {
  if (!generalStore.guild?.roles?.length || !roleIDs) return null

  const roles = roleIDs.map(id => generalStore.guild.roles.find(r => r.id === id)).sort((a, b) => b.position - a.position)

  const role = roles.find(r => r.icon || r.unicodeEmoji)
  if (!role) return null

  if (role.icon) return (
    <Tooltip
      placement="top"
      overlay={role.name}
    >
      <RoleIcon className="role-icon role-icon-image" src={webpCheck(`https://cdn.discordapp.com/role-icons/${role.id}/${role.icon}.webp`)} />
    </Tooltip>)
  
  if (role.unicodeEmoji) return (
    <Tooltip
      placement="top"
      overlay={role.name}
    >
      <span><UnicodeEmoji className="role-icon" disableTooltip={true}>{role.unicodeEmoji}</UnicodeEmoji></span>
    </Tooltip>)

  return null
}

class Author extends React.PureComponent<Props> {
  render() {
    const { author, time } = this.props;

    const hexColor = '#'+ (author.color.toString(16).padStart(6, '0') || 'fff')

    return (
      <Root className="author">
        <Name color={hexColor} className="name">
          {author.name}
        </Name>
        {roleIcon(author.roles)}
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

import webpCheck from '@ui/shared/webpCheck'
import { shouldShowContext } from '.';
import { MemberLink } from '@ui/shared/Member'
import { Message } from '@generated';
import { MessageType } from '@generated/globalTypes';

import add from '@images/discordAssets/e06a573355c490f7ce6e3125ac01db81.svg'
import remove from '@images/discordAssets/f772d3d7eddcf3c84f710c10999479f0.svg'
import pencil from '@images/discordAssets/1688a01d0e6f27bead9ae6ca9e51dd32.svg'
import pin from '@images/discordAssets/5da4cdab01d4d89c593c48c62ae0d937.svg'
import x from '@images/discordAssets/c7078943fc392e7dede27a20e6cfdcfb.svg'
import check from '@images/discordAssets/86b5987e685f72352730d56690393fc8.svg'

import styled from './ThemeContext'

export const Group = styled('div')`
  box-sizing: border-box;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  padding: 17px 35px 0 20px;
  user-select: text;
  word-wrap: break-word;

  @media (max-width: 500px), (max-height: 370px) {
    padding: 12px 35px 10px 15px;
  }

  @media (max-width: 260px) {
    padding: 12px 35px 10px 10px;
  }
`

export const ReplySpine = styled.div`
  position: absolute;
  width: 33px;
  height: 12px;
  top: 25px;
  left: 40px;
  border-left: 2px solid #4f545c;
  border-top: 2px solid #4f545c;
  border-top-left-radius: 6px;

  @media (max-width: 500px), (max-height: 370px) {
    top: 20px;
    left: 35px;
  }

  @media (max-width: 260px) {
    left: 30px;
  }
`

export const RepliedMessage = styled.div`
  font-size: 14px;
  margin-bottom: 4px;
`

export const RepliedAvatar = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  user-select: none;
  vertical-align: sub;
`

interface RepliedUserProps {
  nameColor: number
}
export const RepliedUser = styled.span<RepliedUserProps>`
  color: ${({ nameColor }) => (nameColor ? '#'+nameColor.toString(16).padStart(6, '0') : null)};
  font-weight: 500;
  opacity: .64;
  margin: 0 .25rem;
`

export const RepliedText = styled.div`
  color: ${({ theme }) => theme.colors._primary.fade(0.34).string()};
  display: inline-block;

  * {
    color: inherit
  }

  a {
    color: #00b0f4;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  strong {
    font-weight: 700;
    color: inherit;
  }
`

export const UnknownReplyIconWrapper = styled.div`
  background-color: #202225;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
  display: inline-flex;
  margin-right: .25rem;
`

export const ReplySystemText = styled.span`
  color: ${({ theme }) => theme.colors._primary.fade(0.34).string()};
  font-style: italic;
`

export const InteractionText = styled.span`
  color: ${({ theme }) => theme.colors._primary.fade(0.34).string()};
`

export const ReplyImageIcon = styled.svg`
  vertical-align: text-bottom;
  margin-left: 6px;
`

interface AvatarProps {
  url: string
  reply: boolean
}
export const Avatar = styled('div')<AvatarProps>`
  flex-shrink: 0;
  /*cursor: pointer;*/
  background-image: url('${props => webpCheck(props.url)}');
  border-radius: 50%;
  background-size: cover;
  height: 40px;
  width: 40px;
  margin-right: 20px;
  margin-top: ${props => props.reply ? 24 : 2}px;

  @media (max-width: 400px), (max-height: 370px) {
    height: 35px;
    width: 35px;
    margin-right: 15px;
  }
`

export const Messages = styled('div')`
  flex-grow: 1;
`

export const Edited = styled('span')`
  font-size: 0.625rem;
  line-height: 0.625rem;
  margin-left: 3px;
  opacity: 0.3;
  cursor: default;
  user-select: none;
`

export namespace Secondary {
  const Message = styled('span')`
    margin-left: 12px;
    padding-left: 48px;
    background-repeat: no-repeat;
    background-position: left center;
    background-size: 18px;
    color: ${({ theme }) => theme.colors._primary.fade(0.6).string()};
  `

  export const Add = styled(Message)`
    background-image: url("${add}");
  `

  export const Remove = styled(Message)`
    background-image: url("${remove}");
  `

  export const Changed = styled(Message)`
    color: ${({ theme }) => theme.colors.primary};
    background-image: url("${pencil}");
  `

  export const Pinned = styled(Message)`
    background-image: url("${pin}");
  `

  export const Boost = styled(Message)`
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' aria-hidden='false' width='24' height='24' viewBox='0 0 8 12'%3E%3Cpath d='M4 0L0 4V8L4 12L8 8V4L4 0ZM7 7.59L4 10.59L1 7.59V4.41L4 1.41L7 4.41V7.59Z' fill='%23ff73fa'%3E%3C/path%3E%3Cpath d='M2 4.83V7.17L4 9.17L6 7.17V4.83L4 2.83L2 4.83Z' fill='%23ff73fa'%3E%3C/path%3E%3C/svg%3E");
  `

  export const X = styled(Message)`
    background-image: url("${x}");
  `

  export const Check = styled(Message)`
    background-image: url("${check}");
  `

  export const Warning = styled(Message)`
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' aria-hidden='false' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M10 0C4.486 0 0 4.486 0 10C0 15.515 4.486 20 10 20C15.514 20 20 15.515 20 10C20 4.486 15.514 0 10 0ZM9 4H11V11H9V4ZM10 15.25C9.31 15.25 8.75 14.691 8.75 14C8.75 13.31 9.31 12.75 10 12.75C10.69 12.75 11.25 13.31 11.25 14C11.25 14.691 10.69 15.25 10 15.25Z' fill-rule='evenodd' clip-rule='evenodd' fill='%23faa61a'%3E%3C/path%3E%3C/svg%3E");
  `

  export const Command = styled(Message)`
    color: ${({ theme }) => theme.colors.primary};
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' aria-hidden='false' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%238e9297' fill-rule='evenodd' clip-rule='evenodd' d='M5 3C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5ZM16.8995 8.41419L15.4853 6.99998L7 15.4853L8.41421 16.8995L16.8995 8.41419Z'%3E%3C/path%3E%3C/svg%3E");
  `

  export const Thread = styled(Message)`
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='icon-1zIRB4' aria-hidden='false' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Cpath fill='${({theme})=>encodeURIComponent(theme.colors._primary.fade(0.6).string())}' d='M5.43309 21C5.35842 21 5.30189 20.9325 5.31494 20.859L5.99991 17H2.14274C2.06819 17 2.01168 16.9327 2.02453 16.8593L2.33253 15.0993C2.34258 15.0419 2.39244 15 2.45074 15H6.34991L7.40991 9H3.55274C3.47819 9 3.42168 8.93274 3.43453 8.85931L3.74253 7.09931C3.75258 7.04189 3.80244 7 3.86074 7H7.75991L8.45234 3.09903C8.46251 3.04174 8.51231 3 8.57049 3H10.3267C10.4014 3 10.4579 3.06746 10.4449 3.14097L9.75991 7H15.7599L16.4523 3.09903C16.4625 3.04174 16.5123 3 16.5705 3H18.3267C18.4014 3 18.4579 3.06746 18.4449 3.14097L17.7599 7H21.6171C21.6916 7 21.7481 7.06725 21.7353 7.14069L21.4273 8.90069C21.4172 8.95811 21.3674 9 21.3091 9H17.4099L17.0495 11.04H15.05L15.4104 9H9.41035L8.35035 15H10.5599V17H7.99991L7.30749 20.901C7.29732 20.9583 7.24752 21 7.18934 21H5.43309Z'%3E%3C/path%3E%3Cpath fill='${({theme})=>encodeURIComponent(theme.colors._primary.fade(0.6).string())}' d='M13.4399 12.96C12.9097 12.96 12.4799 13.3898 12.4799 13.92V20.2213C12.4799 20.7515 12.9097 21.1813 13.4399 21.1813H14.3999C14.5325 21.1813 14.6399 21.2887 14.6399 21.4213V23.4597C14.6399 23.6677 14.8865 23.7773 15.0408 23.6378L17.4858 21.4289C17.6622 21.2695 17.8916 21.1813 18.1294 21.1813H22.5599C23.0901 21.1813 23.5199 20.7515 23.5199 20.2213V13.92C23.5199 13.3898 23.0901 12.96 22.5599 12.96H13.4399Z'%3E%3C/path%3E%3C/svg%3E");  `
}

export const Command = styled.span`
  color: #00b0f4;
  font-weight: 500;
  opacity: .64;
`

export const CommandArgs = styled.div`
  margin-left: 60px;
  background-color: rgba(0, 0, 0, 9%);
  color: ${({ theme }) => theme.colors._primary.fade(0.3).string()};
  padding: .5rem;
  border-radius: .25rem;
  margin-top: .25rem;
  display: table;
`

const BottomSpine = styled.div`
  position: absolute;
  width: 33px;
  left: 40px;
  border-left: 2px solid #4f545c;
  border-bottom: 2px solid #4f545c;
  border-bottom-left-radius: 6px;

  @media (max-width: 500px), (max-height: 370px) {
    left: 35px;
  }

  @media (max-width: 260px) {
    left: 30px;
  }
`

export const CommandArgsSpine = styled(BottomSpine)`
  height: 1.5rem;
  bottom: 15px;

  @media (max-width: 500px), (max-height: 370px) {
    bottom: 20px;
  }
`

interface ThreadSpineProps {
  message: Message
}
export const ThreadSpine = styled(BottomSpine)<ThreadSpineProps>`
  top: ${({ message }) => 
    message.type === MessageType.ThreadCreated ? 2.5
    : shouldShowContext(message) ? 5.3
    : 3.8}rem;
  bottom: ${({ message }) => message.thread.archivedAt || message.thread.messageCount === 0 ? 30 : 19}px;

  @media (max-width: 500px), (max-height: 370px) {
    bottom: ${({ message }) => message.thread.archivedAt || message.thread.messageCount === 0 ? 35 : 24}px;
  }
`

// Username
interface NameProps {
  color?: number
}
export const Member = styled(MemberLink)<NameProps>`
  color: ${({ theme, color }) => (color ? '#'+color.toString(16).padStart(6, '0') : theme.colors.primary)};
  font-weight: 500;
  /*cursor: pointer;

  &:hover {
    text-decoration: underline;
  }*/
`

export const Root = styled('div')`
  color: ${({ theme }) => theme.colors._primary.fade(0.173).string()};
  opacity: ${({ theme }) =>
    /* todo: theme.message.type === 'SENDING'* ? 0.5 : */ 1};

  font-size: 1rem;
  line-height: 1.375rem;
  padding: 2px 0;
  white-space: pre-wrap;
  word-wrap: break-word;

  * {
    color: inherit;
  }

  a {
    color: #00b0f4;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  strong {
    font-weight: 700;
    color: inherit;
  }
`

export const Reactions = styled('div')``

interface ContentProps {
  sending?: boolean
}
export const Content = styled('div')<ContentProps>`
  ${props => props.sending && 'opacity: .5'}
`

export const InteractionLoading = styled.div`
  font-size: 14px;
`

export const InteractionFailed = styled.div`
  color: #f04747;
  display: flex;

  svg {
    margin-right: 8px
  }
`

export namespace Sys {
  export const Container = styled('div')`
    height: 1px;
    margin: 12px 0;
  `

  export const Lines = styled('div')`
    width: calc(100% - 50px);
    height: 16px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);

    &::before {
      background-color: #f04747;
      content: '';
      height: 1px;
      display: block;
      opacity: 0.4;
    }
  `

  export const Message = styled('span')`
    display: inline-block;
    color: rgba(240, 71, 71, 0.8);
    line-height: 16px;
    text-transform: uppercase;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    padding: 0 10px;
    z-index: 2;
    margin-top: -8px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background: #36393f;
  `
}

export const Video = styled('video')`
  max-height: 225px;
  width: 400px;
  max-width: 100%;
  outline: none;
`

export const Attachment = styled.div`
  border: 1px solid rgba(0,0,0,.7);
  background-color: rgba(0,0,0,.1);
  max-width: 520px;
  width: 100%;
  padding: 10px;
  display: flex;
  border-radius: 3px
`

export const AttachmentIcon = styled.img`
  width: 30px;
  height: 40px;
  margin-right: 8px;
`

export const AttachmentInner = styled.div`
  flex: 1;
`

export const AttachmentSize = styled.div`
  color: rgba(255,255,255,.22);
  line-height: 16px;
  font-size: 12px;
`

export const Audio = styled.div`
  border: 1px solid rgba(0,0,0,.05);
  background-color: rgba(0,0,0,.04);
  width: 400px;
  max-width: 100%;
  padding: 10px;
`

export const AudioMetadata = styled.div`
  display: flex;
`

export const AudioPlayer = styled.audio`
  width: 100%;
  height: 32px;
  margin-top: 8px;
  outline: 0;
  border-radius: 3px;
`

export const StickerTooltipIcon = styled.svg`
  vertical-align: bottom
`

export const LottieStickerWrapper = styled.span`
  display: inline-block
`

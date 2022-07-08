import { Message as MessageData, Message_author } from '@generated'
import Markdown, { LinkMarkdown } from '@ui/shared/markdown/render'
import { ThemeProvider } from 'emotion-theming'
import Moment from 'moment'
import Tooltip from 'rc-tooltip'
import * as React from 'react'
import { Lottie } from './Lottie'
import reactStringReplace from 'react-string-replace'

import Author, { tags, Timestamp } from './Author'
import {
  Attachment,
  AttachmentIcon,
  AttachmentInner,
  AttachmentSize,
  Audio,
  AudioMetadata,
  AudioPlayer,
  Avatar,
  Command,
  CommandArgs,
  CommandArgsSpine,
  Content,
  Edited,
  Group,
  InteractionFailed,
  InteractionLoading,
  InteractionText,
  LottieStickerWrapper,
  Member,
  Messages,
  Link,
  Reactions,
  RepliedAvatar,
  RepliedMessage,
  RepliedText,
  RepliedUser,
  ReplyImageIcon,
  ReplyPopup,
  ReplySpine,
  ReplySystemText,
  Root,
  Secondary,
  StickerTooltipIcon,
  ThreadSpine,
  UnknownReplyIconWrapper,
  Video,
  Name
} from './elements'
import { Image } from './Embed/elements/media'
import Reaction from './Reaction'
import Embed from './Embed'
import AttachmentSpoiler from '@ui/shared/markdown/render/elements/AttachmentSpoiler'
import { Locale } from '@lib/Locale'
import { MessageType } from '@generated/globalTypes'
import { generalStore } from '@store'
import webpCheck from '@ui/shared/webpCheck'
import Thread from "@ui/Message/Thread";
import { compareGroupability } from '@views/Messages/utils'
import { store } from '@models'
import getAvatar from "@utils/getAvatar";

// attachment icons
import audio from '@images/discordAssets/7674eb0d869afebca7b1f3a5202506c6.svg'
import acrobat from '@images/discordAssets/aee87e981ef9acae845ef397c7a034c5.svg'
import ae from '@images/discordAssets/f8e80ba7587764ddfa27aa1e02c6ed54.svg'
import sketch from '@images/discordAssets/318ce2f97a8bd1d7a693938d9aff5f08.svg'
import ai from '@images/discordAssets/f1141359084b3b61f3a41adbe541fdbb.svg'
import archive from '@images/discordAssets/4f27cbf7f975daa32fe7c8dec19ce2de.svg'
import code from '@images/discordAssets/d6bb78c1d64640ad06cc8cdd1c61b67d.svg'
import document from '@images/discordAssets/3c2ce4428c2c44824b07162f648524f5.svg'
import spreadsheet from '@images/discordAssets/1939fe07993a754364bf3fee5223428d.svg'
import webcode from '@images/discordAssets/557b6b6b982a8c2b2c97048b86e2e6c3.svg'
import unknown from '@images/discordAssets/66084381f55f4238d69e5cbe3b8dc42e.svg'

interface Props {
  messages: MessageData[],
  allMessages: MessageData[],
  style?
}

export const shouldShowContext = (message: MessageData) =>
  message.type === MessageType.Reply || !!message.interaction

const getUsers = (messages: MessageData[]) => new Map(messages.map(m => [m.author.id, m.author]))

class Message extends React.PureComponent<Props, any> {
  theme = message => theme => ({
    ...theme,
    message
  });

  render() {
    const { messages, allMessages } = this.props;

    if (messages[0].type === MessageType.ThreadStarterMessage)
      messages[0] = { ...messages[0].referencedMessage, referencedMessage: null, thread: null }

    const [firstMessage] = messages;

    let repliedMessage = firstMessage.referencedMessage

    if (firstMessage.type === MessageType.Reply && !repliedMessage)
      repliedMessage = allMessages.find(m => m.id === firstMessage.messageReference.messageId)

    const prevMessage = allMessages[allMessages.findIndex(m => m.id === firstMessage.id) - 1]

    const shouldShowAuthor = shouldShowContext(firstMessage) ||
      firstMessage.type === MessageType.Default && (!prevMessage || compareGroupability(prevMessage, firstMessage) || !prevMessage.thread)
      // when the previous message has a thread, it should be the end of its group to position the thread spine correctly
      // but the next group should appear connected by hiding author

    let avatar: HTMLDivElement

    return (
      <Group style={this.props.style} className="group">

        {shouldShowAuthor &&
          <Avatar
            url={getAvatar(firstMessage.author)}
            className="avatar"
            reply={shouldShowContext(firstMessage)}
            innerRef={ref => avatar = ref}
            onClick={() => store.modal.openProfile(
              firstMessage.author.id,
              firstMessage.author.name,
              firstMessage.author.discrim,
              firstMessage.author.avatarUrl,
              firstMessage.author.bot,
              firstMessage.author.flags,
              firstMessage.isGuest,
              avatar.getBoundingClientRect().right + 10,
              Math.min(avatar.getBoundingClientRect().y, innerHeight - 300)
            )}
          />
        }

        <Messages className="messages" style={firstMessage.type === MessageType.Default && !shouldShowAuthor ? { marginLeft:  '60px', marginTop: '-17px' } : {}}>
          {shouldShowContext(firstMessage) &&
            <React.Fragment>
              <ReplySpine />
              {repliedMessage ?
                <Tooltip
                  trigger={["click"]}
                  placement="top"
                  overlay={<ReplyPopup>
                    <Message
                      messages={[{...repliedMessage, referencedMessage: null}]}
                      allMessages={allMessages}
                    />
                  </ReplyPopup>}
                  overlayStyle={store.sidebar.isOpen ? {marginLeft: '200px'} : {}}
                >
                  <RepliedMessage className="replied-message">
                    {repliedMessage.type !== MessageType.GuildMemberJoin ? <>
                      <RepliedAvatar src={getAvatar(repliedMessage.author)} className="avatar" />
                      <span style={{verticalAlign: 'sub'}}>{tags({author: repliedMessage.author, crosspost: !!(repliedMessage.flags & 1 << 1), referenceGuild: repliedMessage.messageReference?.guildId, guest: repliedMessage.isGuest})}</span>
                      <RepliedUser nameColor={repliedMessage.author.color} className="user">{firstMessage.mentions.some(m => m.id === repliedMessage.author.id) && '@'}{repliedMessage.author.name}</RepliedUser>
                    </> : <svg width="12" height="12" viewBox="0 0 18 18" style={{marginRight: '.25rem'}}><path fill="#3ba55c" d="M0 8h14.2l-3.6-3.6L12 3l6 6-6 6-1.4-1.4 3.6-3.6H0"></path></svg>}
                    {repliedMessage.content
                      ? <RepliedText className="text">
                          <Markdown mentions={repliedMessage.mentions}>{repliedMessage.content}</Markdown>
                          {repliedMessage.editedAt && (
                            <Tooltip
                              mouseEnterDelay={1}
                              placement="top"
                              overlay={Moment(repliedMessage.editedAt).format('LLLL')}
                            >
                              <Edited className="edited">
                                {Locale.translate('edited')}
                              </Edited>
                            </Tooltip>
                          )}
                        </RepliedText>
                      : repliedMessage.interaction
                        ? <ReplySystemText>Command</ReplySystemText>
                      : repliedMessage.stickers.length > 0
                        ? <ReplySystemText>{repliedMessage.stickers[0].name} sticker</ReplySystemText>
                      : repliedMessage.type === MessageType.GuildMemberJoin
                        ? <RepliedText>{joinMessage(repliedMessage).replace('{member}', repliedMessage.author.name)}</RepliedText>
                      : <ReplySystemText>Attachment</ReplySystemText>}
                    {repliedMessage.interaction ?
                      <ReplyImageIcon aria-hidden="false" width="20" height="20" viewBox="0 0 24 24"><path fill="rgba(255,255,255,.66)" fillRule="evenodd" clipRule="evenodd" d="M5 3C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5ZM16.8995 8.41419L15.4853 6.99998L7 15.4853L8.41421 16.8995L16.8995 8.41419Z"></path></ReplyImageIcon>
                    : repliedMessage.stickers.length > 0 ?
                      <ReplyImageIcon width="20" height="20" aria-hidden="false" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M9.20038 2.39762V5.24178C9.20038 6.10455 9.89673 6.80072 10.7597 6.80072H13.6046C13.9558 6.80072 14.1343 6.37826 13.8844 6.12835L9.87292 2.11796C9.62295 1.86806 9.20038 2.04061 9.20038 2.39762ZM10.7461 8.01794C9.22044 8.01794 7.98197 6.77947 7.98197 5.25382V2.03499H3.19561C2.53749 2.03499 1.99902 2.57346 1.99902 3.23158V12.8043C1.99902 13.4624 2.53749 14.0009 3.19561 14.0009H12.7683C13.4265 14.0009 13.9649 13.4624 13.9649 12.8043V8.01794H10.7461ZM9.80015 9C9.80015 9.99411 8.99427 10.8 8.00015 10.8C7.00604 10.8 6.20015 9.99411 6.20015 9H5.00015C5.00015 10.6569 6.3433 12 8.00015 12C9.65701 12 11.0002 10.6569 11.0002 9H9.80015Z" fill="rgba(255,255,255,.66)"></path></ReplyImageIcon>
                    : (repliedMessage.attachments.length > 0 || repliedMessage.embeds.length > 0) &&
                      <ReplyImageIcon aria-hidden="false" width="20" height="20" viewBox="0 0 64 64"><path fill="rgba(255,255,255,.66)" d="M56 50.6667V13.3333C56 10.4 53.6 8 50.6667 8H13.3333C10.4 8 8 10.4 8 13.3333V50.6667C8 53.6 10.4 56 13.3333 56H50.6667C53.6 56 56 53.6 56 50.6667ZM22.6667 36L29.3333 44.0267L38.6667 32L50.6667 48H13.3333L22.6667 36Z"></path></ReplyImageIcon>}
                  </RepliedMessage>
                </Tooltip>
                : firstMessage.interaction ?
                  <RepliedMessage className="replied-message">
                    <RepliedAvatar src={getAvatar(firstMessage.interaction.user)} className="avatar" />
                    <RepliedUser nameColor={allMessages.find(m => m.author.id === firstMessage.interaction.user.id)?.author.color} className="user">{firstMessage.interaction.user.username}</RepliedUser>
                    <InteractionText className="interaction">used <Command className="command">{firstMessage.type === MessageType.ChatInputCommand && '/'}{firstMessage.interaction.name}</Command></InteractionText>
                  </RepliedMessage>
                :
                <RepliedMessage className="replied-message">
                  <UnknownReplyIconWrapper>
                    <svg width="12" height="8" viewBox="0 0 12 8"><path d="M0.809739 3.59646L5.12565 0.468433C5.17446 0.431163 5.23323 0.408043 5.2951 0.401763C5.35698 0.395482 5.41943 0.406298 5.4752 0.432954C5.53096 0.45961 5.57776 0.50101 5.61013 0.552343C5.64251 0.603676 5.65914 0.662833 5.6581 0.722939V2.3707C10.3624 2.3707 11.2539 5.52482 11.3991 7.21174C11.4028 7.27916 11.3848 7.34603 11.3474 7.40312C11.3101 7.46021 11.2554 7.50471 11.1908 7.53049C11.1262 7.55626 11.0549 7.56204 10.9868 7.54703C10.9187 7.53201 10.857 7.49695 10.8104 7.44666C8.72224 5.08977 5.6581 5.63359 5.6581 5.63359V7.28135C5.65831 7.34051 5.64141 7.39856 5.60931 7.44894C5.5772 7.49932 5.53117 7.54004 5.4764 7.5665C5.42163 7.59296 5.3603 7.60411 5.29932 7.59869C5.23834 7.59328 5.18014 7.57151 5.13128 7.53585L0.809739 4.40892C0.744492 4.3616 0.691538 4.30026 0.655067 4.22975C0.618596 4.15925 0.599609 4.08151 0.599609 4.00269C0.599609 3.92386 0.618596 3.84612 0.655067 3.77562C0.691538 3.70511 0.744492 3.64377 0.809739 3.59646Z" fill="#b9bbbe"></path></svg>
                  </UnknownReplyIconWrapper>
                  <ReplySystemText>Original message was deleted or is unknown.</ReplySystemText>
                </RepliedMessage>
              }
            </React.Fragment>}

          {shouldShowAuthor &&
            <Author
              author={firstMessage.author}
              time={firstMessage.createdAt}
              crosspost={!!(firstMessage.flags & 1 << 1)}
              referenceGuild={firstMessage.messageReference?.guildId}
              guest={firstMessage.isGuest}
            />
          }

          {messages.map((message, i) => {
            switch (message.type) {
              // type 20 is at the top so it can fallback to normal rendering for the new ui, this is for the legacy ui
              case MessageType.ChatInputCommand: {
                if (!message.interaction) {
                  const member =
                    <Member id={message.author.id} color={message.author.color}>
                      {message.author.name}
                    </Member>

                  const command =
                    <Command>
                      {message.content.split(':')[0].substring(1)}
                    </Command>

                  return (
                    <React.Fragment key={message.id}>
                      <Secondary.Command>
                        {member} used {command}
                      </Secondary.Command>
                      <Timestamp time={message.createdAt} />
                      {!message.content.endsWith('> ') &&
                        <React.Fragment>
                          <CommandArgsSpine/>
                          <CommandArgs>{message.content.split(':')[0].substring(1)} {message.content.split('> ')[1]}</CommandArgs>
                        </React.Fragment>
                      }
                    </React.Fragment>
                  )
                }
              }

              case MessageType.Default: // 0
              case MessageType.Reply: // 19
              case MessageType.ContextMenuCommand: { // 23
                return (
                  <ThemeProvider key={message.id} theme={this.theme(message)}>
                    <Root className="message" id={message.id}>
                      <Content sending={!!(message.flags & 1 << 4)} className="content">
                        {message.author.discrim === '0000' || message.interaction
                            // passes mentions and users to markdown parser for mention rendering
                          ? <LinkMarkdown mentions={message.mentions} users={getUsers(allMessages)}>{message.content}</LinkMarkdown>
                          : <Markdown mentions={message.mentions} users={getUsers(allMessages)}>{message.content}</Markdown>}
                        {// interaction response loading
                          message.flags & 1 << 7 ?
                            <InteractionLoading>{
                              Date.now() - message.createdAt < 900000 // 15 mins - interaction token timeout
                                ? `${message.author.name} is thinking...`
                                : <InteractionFailed>
                                  <svg aria-hidden="false" width="16" height="16" viewBox="0 0 20 20"><path d="M10 0C4.486 0 0 4.486 0 10C0 15.515 4.486 20 10 20C15.514 20 20 15.515 20 10C20 4.486 15.514 0 10 0ZM9 4H11V11H9V4ZM10 15.25C9.31 15.25 8.75 14.691 8.75 14C8.75 13.31 9.31 12.75 10 12.75C10.69 12.75 11.25 13.31 11.25 14C11.25 14.691 10.69 15.25 10 15.25Z" fillRule="evenodd" clipRule="evenodd" fill="currentColor"></path></svg>
                                  <span>The application did not respond</span>
                                </InteractionFailed>
                            }</InteractionLoading>
                          : null
                        }
                        {message.editedAt && (
                          <Tooltip
                            mouseEnterDelay={1}
                            placement="top"
                            overlay={Moment(message.editedAt).format('LLLL')}
                          >
                            <Edited className="edited">
                              {Locale.translate('edited')}
                            </Edited>
                          </Tooltip>
                        )}
                      </Content>

                      {message.attachments?.map((attachment, i) => {
                          if(attachment.height && attachment.width) {
                            if(/\.(?:mp4|webm|mov)$/.test(attachment.filename)) {
                              return <Video controls
                                key={attachment.url}
                                src={attachment.url}
                                height={+attachment.height}
                                width={+attachment.width}
                              />;
                            } else {
                                return attachment.filename.startsWith('SPOILER_') ? (
                                <AttachmentSpoiler
                                  key={attachment.url}
                                  src={attachment.url}
                                  height={+attachment.height}
                                  width={+attachment.width}
                                />) : (
                                <Image
                                  key={attachment.url}
                                  src={attachment.url}
                                  height={+attachment.height}
                                  width={+attachment.width}
                              />)
                          }
                        } else {
                          if(/\.(?:mp3|ogg|wav|flac)$/.test(attachment.filename)) {
                            return <Audio key={attachment.url}>
                                <AudioMetadata>
                                  <AttachmentIcon src={audio}/>
                                  <AttachmentInner>
                                    <div><a href={attachment.url}>{attachment.filename}</a></div>
                                    <AttachmentSize>{attachment.size} bytes</AttachmentSize>
                                  </AttachmentInner>
                                  <a href={attachment.url} style={{margin: 'auto'}}>
                                    <svg aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path d="M0 0h24v24H0z"></path><path fill="#4f545c" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"></path></g></svg>
                                  </a>
                                </AudioMetadata>
                                <AudioPlayer controls src={attachment.url}></AudioPlayer>
                              </Audio>
                          } else {
                            return <Attachment key={attachment.url}>
                                <AttachmentIcon
                                  src={ /\.pdf$/.test(attachment.filename) ? acrobat
                                      : /\.ae/.test(attachment.filename) ? ae
                                      : /\.sketch$/.test(attachment.filename) ? sketch
                                      : /\.ai$/.test(attachment.filename) ? ai
                                      : /\.(?:rar|zip|7z|tar|tar\.gz)$/.test(attachment.filename) ? archive
                                      : /\.(?:c\+\+|cpp|cc|c|h|hpp|mm|m|json|js|rb|rake|py|asm|fs|pyc|dtd|cgi|bat|rss|java|graphml|idb|lua|o|gml|prl|sls|conf|cmake|make|sln|vbe|cxx|wbf|vbs|r|wml|php|bash|applescript|fcgi|yaml|ex|exs|sh|ml|actionscript)$/.test(attachment.url) ? code
                                      : /\.(?:txt|rtf|doc|docx|md|pages|ppt|pptx|pptm|key|log)$/.test(attachment.filename) ? document
                                      : /\.(?:xls|xlsx|numbers|csv)$/.test(attachment.filename) ? spreadsheet
                                      : /\.(?:html|xhtml|htm|js|xml|xls|xsd|css|styl)$/.test(attachment.filename) ? webcode
                                      : unknown
                                      }/>
                                <AttachmentInner>
                                  <div><a href={attachment.url}>{attachment.filename}</a></div>
                                  <AttachmentSize>{attachment.size} bytes</AttachmentSize>
                                </AttachmentInner>
                                <a href={attachment.url} style={{margin: 'auto'}}>
                                  <svg aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><path fill="rgba(255, 255, 255, .65)" fillRule="evenodd" clipRule="evenodd" d="M16.293 9.293L17.707 10.707L12 16.414L6.29297 10.707L7.70697 9.293L11 12.586V2H13V12.586L16.293 9.293ZM18 20V18H20V20C20 21.102 19.104 22 18 22H6C4.896 22 4 21.102 4 20V18H6V20H18Z"></path></svg>
                                </a>
                              </Attachment>
                          }
                        }
                      })}

                      {message.embeds?.map((e, i) => (
                          // pass message authors for rendering user mentions
                          <Embed key={i} {...e} users={getUsers(allMessages)} />
                      ))}

                      {message.stickers?.map(s =>
                        <Tooltip
                          key={s.id}
                          placement="top"
                          overlay={<><StickerTooltipIcon width="16" height="16" viewBox="0 0 16 16"><path fillRule="evenodd" clipRule="evenodd" d="M9.20038 2.39762V5.24178C9.20038 6.10455 9.89673 6.80072 10.7597 6.80072H13.6046C13.9558 6.80072 14.1343 6.37826 13.8844 6.12835L9.87292 2.11796C9.62295 1.86806 9.20038 2.04061 9.20038 2.39762ZM10.7461 8.01794C9.22044 8.01794 7.98197 6.77947 7.98197 5.25382V2.03499H3.19561C2.53749 2.03499 1.99902 2.57346 1.99902 3.23158V12.8043C1.99902 13.4624 2.53749 14.0009 3.19561 14.0009H12.7683C13.4265 14.0009 13.9649 13.4624 13.9649 12.8043V8.01794H10.7461ZM9.80015 9C9.80015 9.99411 8.99427 10.8 8.00015 10.8C7.00604 10.8 6.20015 9.99411 6.20015 9H5.00015C5.00015 10.6569 6.3433 12 8.00015 12C9.65701 12 11.0002 10.6569 11.0002 9H9.80015Z" fill="#dcddde"/></StickerTooltipIcon> {s.name}</>}
                          mouseEnterDelay={.25}
                          mouseLeaveDelay={0}
                        >
                          {s.formatType === 'LOTTIE' ?
                            <LottieStickerWrapper>
                              <Lottie
                                data={s.lottieData}
                                width={160}
                                height={160}
                              />
                            </LottieStickerWrapper>
                          : <img
                              height={160}
                              width={160}
                              style={{objectFit: 'contain'}}
                              alt={s.name+' Sticker'}
                              src={s.formatType === 'APNG'
                                    ? `https://cdn.discordapp.com/stickers/${s.id}.png`
                                    : webpCheck(`https://media.discordapp.net/stickers/${s.id}.webp?size=240`)}
                              draggable={false}
                            />}
                        </Tooltip>
                      )}

                      {message.reactions && (
                        <Reactions className="reactions">
                          {message.reactions.map((reaction, i) => (
                            <Reaction key={i} {...reaction} />
                          ))}
                        </Reactions>
                      )}

                      {message.thread && <>
                        <ThreadSpine message={message} />
                        <Thread thread={message.thread} />
                      </>}
                    </Root>
                  </ThemeProvider>
                )
              }

              case MessageType.RecipientAdd: { // 1
                const member = (
                  <Member id={message.author.id} color={message.author.color}>
                    {message.author.name}
                  </Member>
                );

                const target = (
                  <Member id={message.mentions[0].id} color={allMessages.find(m => m.author.id === message.mentions[0].id)?.author.color}>
                    {message.mentions[0].name}
                  </Member>
                );

                return (
                  <React.Fragment key={message.id}>
                    <Secondary.Add>
                      {member} added {target} to the thread.
                    </Secondary.Add>
                    <Timestamp time={message.createdAt} />
                  </React.Fragment>
                )
              }

              case MessageType.RecipientRemove: { // 2
                const member = (
                  <Member id={message.author.id} color={message.author.color}>
                    {message.author.name}
                  </Member>
                );

                const target = (
                  <Member id={message.mentions[0].id} color={allMessages.find(m => m.author.id === message.mentions[0].id)?.author.color}>
                    {message.mentions[0].name}
                  </Member>
                );

                return (
                  <React.Fragment key={message.id}>
                    <Secondary.Remove>
                      {member} removed {target} from the thread.
                    </Secondary.Remove>
                    <Timestamp time={message.createdAt} />
                  </React.Fragment>
                )
              }

              case MessageType.ChannelNameChange: { // 4
                const member = (
                  <Member id={message.author.id} color={message.author.color}>
                    {message.author.name}
                  </Member>
                );

                return (
                  <React.Fragment key={message.id}>
                    <Secondary.Changed>
                      {member} changed the channel name: <strong>{message.content}</strong>
                    </Secondary.Changed>
                    <Timestamp time={message.createdAt} />
                  </React.Fragment>
                )
              }

              case MessageType.ChannelPinnedMessage: { // 6
                const member = (
                  <Member id={message.author.id} color={message.author.color}>
                    {message.author.name}
                  </Member>
                );

                const pinLink = <Link onClick={() => generalStore.togglePins(true)}>pinned messages</Link>

                return (
                  <React.Fragment key={message.id}>
                    <Secondary.Pinned>
                      {member} {Locale.translate('messages.pinned')} See all {pinLink}.
                    </Secondary.Pinned>
                    <Timestamp time={message.createdAt} />
                  </React.Fragment>
                )
              }

              case MessageType.GuildMemberJoin: { // 7
                return (
                  <React.Fragment key={message.id}>
                    <Secondary.Add>
                      {reactStringReplace(joinMessage(message), '{member}', (match, i) => (
                        <Member key={match + i} id={message.author.id} color={message.author.color}>
                          {message.author.name}
                        </Member>
                      ))}
                    </Secondary.Add>
                    <Timestamp time={message.createdAt} />
                  </React.Fragment>
                )
              }

              case MessageType.UserPremiumGuildSubscription: // 8
              case MessageType.UserPremiumGuildTier1: // 9
              case MessageType.UserPremiumGuildTier2: // 10
              case MessageType.UserPremiumGuildTier3: { // 11
                const member = (
                  <Member id={message.author.id} color={message.author.color}>
                    {message.author.name}
                  </Member>
                );

                if(message.type !== 'UserPremiumGuildSubscription') {
                  return (
                    <React.Fragment key={message.id}>
                      <Secondary.Boost>
                        {member} {Locale.translate('messages.boost')} {Locale.translate('messages.boost.achieved', {GUILD: generalStore.guild.name, TIER: message.type.replace('UserPremiumGuildTier', '')})}
                      </Secondary.Boost>
                      <Timestamp time={message.createdAt} />
                    </React.Fragment>
                  )
                } else {
                  return (
                    <React.Fragment key={message.id}>
                      <Secondary.Boost>
                        {member} {Locale.translate('messages.boost')}
                      </Secondary.Boost>
                      <Timestamp time={message.createdAt} />
                    </React.Fragment>
                  )
                }
              }

              case MessageType.ChannelFollowAdd: { // 12
                const member = (
                  <Member id={message.author.id} color={message.author.color}>
                    {message.author.name}
                  </Member>
                );

                return (
                  <React.Fragment key={message.id}>
                    <Secondary.Add>
                      {member} {reactStringReplace(Locale.translate('messages.follow'), '{HOOK}', (match, i) => <Name key={match + i}>{message.content}</Name>)}
                    </Secondary.Add>
                    <Timestamp time={message.createdAt} />
                  </React.Fragment>
                )
              }

              case MessageType.GuildDiscoveryDisqualified: { // 14
                return (
                  <React.Fragment key={message.id}>
                    <Secondary.X>
                      This server has been removed from Server Discovery because it no longer passes all the requirements. Check Server Settings for more details.
                    </Secondary.X>
                    <Timestamp time={message.createdAt} />
                  </React.Fragment>
                )
              }

              case MessageType.GuildDiscoveryRequalified: { // 15
                return (
                  <React.Fragment key={message.id}>
                    <Secondary.Check>
                      This server is eligible for Server Discovery again and has been automatically relisted!
                    </Secondary.Check>
                    <Timestamp time={message.createdAt} />
                  </React.Fragment>
                )
              }

              case MessageType.GuildDiscoveryGracePeriodInitialWarning: { // 16
                return (
                  <React.Fragment key={message.id}>
                    <Secondary.Warning>
                      This server has failed Discovery activity requirements for 1 week. If this server fails for 4 weeks in a row, it will be automatically removed from Discovery.
                    </Secondary.Warning>
                    <Timestamp time={message.createdAt} />
                  </React.Fragment>
                )
              }

              case MessageType.GuildDiscoveryGracePeriodFinalWarning: { // 17
                return (
                  <React.Fragment key={message.id}>
                    <Secondary.Warning>
                      This server has failed Discovery activity requirements for 3 weeks in a row. If this server fails for 1 more week, it will be removed from Discovery.
                    </Secondary.Warning>
                    <Timestamp time={message.createdAt} />
                  </React.Fragment>
                )
              }

              case MessageType.ThreadCreated: { // 18
                const member = (
                  <Member id={message.author.id} color={message.author.color}>
                    {message.author.name}
                  </Member>
                );

                const openThread = () => generalStore.setActiveThread({
                  id: message.id,
                  name: message.content,
                  messageCount: 0,
                  archivedAt: null,
                  locked: false
                });

                return <React.Fragment key={message.id}>
                  <Secondary.Thread onClick={openThread}>
                    {member} {Locale.translate('messages.threadcreated')} <span>{message.content}</span>
                  </Secondary.Thread>
                  <Timestamp time={message.createdAt} />
                  {message.thread && <div style={{ marginLeft: '60px' }}>
                    <ThreadSpine message={message} />
                    <Thread thread={message.thread} />
                  </div>}
                </React.Fragment>;
              }

              default:
                console.warn(`WidgetBot: Unknown message type: ${message.type} (message ID: ${message.id})`)
                return null
            }
          })}
        </Messages>
      </Group>
    )
    // }
  }
}

export default Message

// Join messages: https://github.com/Discord-Datamining/Discord-Datamining/commit/c79bf619ca341d97af219fe127efac2b31d0dde5#comments

function joinMessage(message: { createdAt: number }): string {
  const messages = [
      '{member} joined the party.',
      '{member} is here.',
      'Welcome, {member}. We hope you brought pizza.',
      'A wild {member} appeared.',
      '{member} just landed.',
      '{member} just slid into the server.',
      '{member} just showed up!',
      'Welcome {member}. Say hi!',
      '{member} hopped into the server.',
      'Everyone welcome {member}!',
      "Glad you're here, {member}.",
      'Good to see you, {member}.',
      'Yay you made it, {member}!'
  ];

  return messages[(Number(new Date(message.createdAt))) % messages.length]
}

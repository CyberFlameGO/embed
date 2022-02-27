import { useMessages } from "@hooks";
import { formatError, groupMessages } from "./utils";
import ErrorAhoy from "@ui/Overlays/ErrorAhoy";
import { Info, Loading, NoMessages } from "@ui/Overlays";
import { MessageList, MessagesWrapper } from "./elements";
import { observer } from "mobx-react-lite";
import Message from "@ui/Message";
import {Locale} from "@lib/Locale";
import { addNotification } from "notify";
import InfiniteScroll from "react-infinite-scroll-component";
import { createRef, useState } from "react";
import { generalStore } from "@store";

type MessagesProps = {
  guild: string;
  channel: string;
  thread?: boolean;
};

export const Messages = observer(({ guild, channel, thread = false }: MessagesProps) => {
  const { messages, error, ready, stale, fetchMore } = useMessages(channel, guild, thread ? generalStore.activeThread.id : null);
  const groupedMessages = groupMessages(messages);

  const [readyToLoadMore, setReadyToLoadMore] = useState(true);
  const scrollableTarget = createRef<HTMLDivElement>();

  const fetchMoreMessages = async (...params: any[]) => {
    if (!readyToLoadMore) return console.log(`Unready to load`);

    const currentScrollHeight = scrollableTarget.current?.scrollTop;

    setReadyToLoadMore(false);
    await fetchMore(...params);

    setTimeout(() => {
      console.log('Ready to load again');
      setReadyToLoadMore(true);
    }, 150);

    const newScrollableTarget = document.getElementById('scrollableDiv');

    console.log(`Loaded more - scrolling to ${currentScrollHeight}`);

    newScrollableTarget.scrollTop = currentScrollHeight;

    return true;
  }

  if (error) addNotification({
    level: 'warning',
    title: Locale.translate('frontend.notif.loaderror.messages'),
    message: formatError(error),
    autoDismiss: 0,

  });
  if (error) return <ErrorAhoy message={formatError(error)} />;
  if (!ready) return <Loading />;

  if (!groupedMessages.length)
    return (
      <NoMessages className="no-messages">
        <Info>{Locale.translate('frontend.nomessages')}</Info>
      </NoMessages>
    );

  return (
    <MessagesWrapper stale={stale} className="messages">
      <MessageList innerRef={scrollableTarget} id="scrollableDiv">
        <InfiniteScroll
          dataLength={groupedMessages.length}
          next={fetchMoreMessages}
          // style={{ display: 'flex', flexDirection: 'column-reverse' }}
          inverse={true}
          hasMore={true}
          loader={<>Loading</>}
          scrollableTarget={'scrollableDiv'}

          // height={height}
        >
          {groupedMessages.map((g, idx) => (
            <Message
              key={idx}
              // style={style}
              messages={g}
              allMessages={messages}
            />
          ))}
        </InfiniteScroll>
      </MessageList>
      {stale && <Loading />}
    </MessagesWrapper>
  );
});

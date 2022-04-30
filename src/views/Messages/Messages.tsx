import { useMemo } from "react";
import { useMessages } from "@hooks";
import { formatError, groupMessages } from "./utils";
import ErrorAhoy from "@ui/Overlays/ErrorAhoy";
import { Info, Loading, NoMessages } from "@ui/Overlays";
import { MessageList, MessagesWrapper, Scroller } from "./elements";
import {
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";
import { InfiniteLoader } from 'react-window-infinite-loader';
import { observer, useObservable } from "mobx-react-lite";
import Message from "@ui/Message";
import {Locale} from "@lib/Locale";
import { addNotification } from "notify";
import { generalStore } from "@store";

type MessagesProps = {
  guild: string;
  channel: string;
  thread?: boolean;
};

export const Messages = observer(({ guild, channel, thread = false }: MessagesProps) => {
  const { messages, error, ready, stale, fetchMore } = useMessages(channel, guild, thread ? generalStore.activeThread.id : null);
  const groupedMessages = groupMessages(messages);
  const scroller = useObservable({
    isLoadingMore: false,
    readyToLoadMore: false,
    width: null,
    count: -1,
    scrollToIndex: -1
  });

  const getKey = (rowIndex: number) => {
    const group = groupedMessages[rowIndex];
    const ids = group ? group.map(m => m.id).join(":") : "placeholder";

    // Given the following data points, the group should be identical
    const identifier = [guild, channel, ids, scroller.width];

    return identifier.join("$");
  };

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    keyMapper: getKey
  });

  if (error) addNotification({
    level: 'warning',
    title: Locale.translate('notif.loaderror.messages'),
    message: formatError(error),
    autoDismiss: 0,

  });
  if (error) return <ErrorAhoy message={formatError(error)} />;
  if (!ready) return <Loading />;

  if (!groupedMessages.length)
    return (
      <NoMessages className="no-messages">
        <Info>{Locale.translate('nomessages')}</Info>
      </NoMessages>
    );

  const index =
    scroller.scrollToIndex < 0
      ? groupedMessages.length + scroller.scrollToIndex
      : scroller.scrollToIndex;

  return (
    <MessagesWrapper stale={stale} className="messages">
      <MessageList>
        {({ width, height }) => {
          scroller.width = width;

          return (
            <InfiniteLoader
              isItemLoaded={({ index }) => {
                const loadMore = [0].includes(index) ;

                if (loadMore) {
                  if (scroller.readyToLoadMore) return false;
                  scroller.readyToLoadMore = true;
                }

                return true;
              }}
              loadMoreItems={async () => {
                if (scroller.isLoadingMore) return;

                scroller.isLoadingMore = true;
                await fetchMore();
                scroller.isLoadingMore = false;

                // Clear the cache for the message at the top
                // could be a message added into its group
                cache.clear(2, 0);
              }}
              itemCount={Infinity}
              threshold={1}
            >
              {({ onItemsRendered, ref }) => {
                return (
                    <Scroller
                        width={width}
                        height={height}
                        onItemsRendered={(data) => {
                          const diff = groupedMessages.length - scroller.count
                          if (groupedMessages.length !== scroller.count) {
                            if (scroller.count !== -1) {
                              scroller.scrollToIndex = diff === 1
                                ? groupedMessages.length
                                : diff
                            }

                            scroller.count = groupedMessages.length
                          }

                          onItemsRendered(data)
                        }}
                        willUnmount={() => {
                          scroller.count = -1
                          scroller.scrollToIndex = -1
                          scroller.readyToLoadMore = false
                          scroller.isLoadingMore = false
                        }}
                        listRef={ref}
                        rowHeight={index => cache.rowHeight({ index })}
                        rowRenderer={({ index, key, style, parent }) =>
                            groupedMessages[index] ? (
                                <CellMeasurer
                                    key={key}
                                    cache={cache}
                                    parent={parent}
                                    rowIndex={index}
                                >
                                  <Message
                                      style={style}
                                      messages={groupedMessages[index]}
                                      allMessages={messages}
                                  />
                                </CellMeasurer>
                            ) : null
                        }
                        rowCount={groupedMessages.length + 1}
                        scrollToIndex={index}
                        scrollToAlignment="start"
                        overscanRowCount={0}
                    />
                )
              }}
            </InfiniteLoader>
          );
        }}
      </MessageList>
      {stale && <Loading />}
    </MessagesWrapper>
  );
});

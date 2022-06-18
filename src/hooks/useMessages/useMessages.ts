import produce from "immer";
import { MESSAGES, MORE_MESSAGES, NEW_MESSAGE, MESSAGE_UPDATED, MESSAGE_DELETED, MESSAGES_BULK_DELETED } from ".";
import { useQuery, useSubscription } from "react-apollo-hooks";
import { MessageDeleted, MessagesBulkDeleted, Messages_channel, Message, MessageUpdated, NewMessage, UpdatedMessage } from "@generated";
import { generalStore } from "@store";

/**
 * Fetches the messages for a channel
 */
export const useMessages = (channel: string, guild: string, thread?: string) => {
  const query = useQuery(MESSAGES, {
    variables: { channel, thread },
    fetchPolicy: 'network-only'
  });

  const ready =
    (query.data?.channel?.id === channel) ||
    false;

  const messages = ready ? query.data.channel.messageBunch.messages : [];

  generalStore.setPins(ready ? query.data.channel.messageBunch.pinnedMessages : null)

  let fullyLoaded = false

  async function fetchMore(options?: {
    around?: string;
    after?: string;
    before?: string;
    limit?: number;
  }) {
    if (!channel || fullyLoaded) return;
    if (!options) {
      const [firstMessage] = messages;
      if (!firstMessage) return;

      options = { before: firstMessage.id };
    }

    await query.fetchMore({
      query: MORE_MESSAGES,
      variables: { channel, thread, ...options },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (fetchMoreResult.channel.messageBunch.messages.length === 0) {
          fullyLoaded = true
          return
        }
        return produce(prev, draftState => {
          draftState.channel.messageBunch.messages = [
            ...fetchMoreResult.channel.messageBunch.messages,
            ...draftState.channel.messageBunch.messages
          ];
        })
      }
    })
  }

  useSubscription<NewMessage>(NEW_MESSAGE, {
    variables: { channel, guild, threadId: thread },
    onSubscriptionData({ subscriptionData }) {
      query.updateQuery(prev =>
        produce(prev, (data?: { channel: Messages_channel }) => {
          const messages = data?.channel.messageBunch.messages;
          if (!messages) {
            console.warn('NEW_MESSAGE received empty initial state within subscription', subscriptionData, data);
            return;
          }

          const message = subscriptionData.data.message as Message
          message.author.color = messages.find(m => m.author.id === message.author.id)?.author.color || 0xffffff
          if (!messages.find(m => m.id === message.id)) messages.push(message);
        })
      )}
  });

  useSubscription<MessageUpdated>(MESSAGE_UPDATED, {
    variables: { channel, guild, threadId: thread },
    onSubscriptionData({ subscriptionData }) {
      query.updateQuery(prev =>
        produce(prev, (data?: { channel: Messages_channel }) => {
          const messages = data?.channel.messageBunch.messages;
          if (!messages) {
            console.warn('MESSAGE_UPDATED received empty initial state within subscription', subscriptionData, data);
            return;
          }

          const message = subscriptionData.data.messageUpdate
          const index = messages.findIndex(m => m.id === message.id);

          if (index > -1) {
            const updatedProps = Object.fromEntries(Object.entries(message).filter(([_, v]) => v !== null)) as Partial<Message>
            if (updatedProps.author) updatedProps.author.color = messages.find(m => m.author.id === message.author?.id)?.author.color || 0xffffff
            delete updatedProps.__typename

            Object.assign(messages[index], updatedProps)
          }
        })
      );
    }
  });

  useSubscription<MessageDeleted>(MESSAGE_DELETED, {
    variables: { channel, guild, threadId: thread },
    onSubscriptionData({ subscriptionData }) {
      query.updateQuery(prev =>
        produce(prev, (data?: { channel: Messages_channel }) => {
          const messages = data?.channel.messageBunch.messages;
          if (!messages) {
            console.warn('MESSAGE_DELETED received empty initial state within subscription', subscriptionData, data);
            return;
          }

          const { id } = subscriptionData.data.messageDelete
          const index = messages.findIndex(m => m.id === id)

          if (index > -1) messages.splice(index, 1)
        })
      );
    }
  });

  useSubscription<MessagesBulkDeleted>(MESSAGES_BULK_DELETED, {
    variables: { channel, guild, threadId: thread },
    onSubscriptionData({ subscriptionData }) {
      query.updateQuery(prev =>
        produce(prev, (data?: { channel: Messages_channel }) => {
          const channel = data?.channel;
          if (!channel) {
            console.warn('MESSAGES_BULK_DELETED received empty initial state within subscription', subscriptionData, data);
            return;
          }

          const { ids } = subscriptionData.data.messageDeleteBulk

          channel.messageBunch.messages = channel.messageBunch.messages.filter(
            message => !ids.includes(message.id)
          );
        })
      );
    }
  });

  return <any>{
    ready,
    messages,
    fetchMore,
    error: query.error,
    // @ts-ignore
    stale: query.stale
  };
};

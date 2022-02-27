import { Message } from '@generated';
import { MessageType } from '@generated/globalTypes';

/**
 * Compares whether a message should go in a group
 */
export const compareGroupability = (
  a: Message,
  b: Message
) => {
  const nonGroupable = ![MessageType.Default, MessageType.Reply].includes(a.type) || b.type !== MessageType.Default || !!b.thread;
  const differentAuthor = (!(b.flags & 1 << 4) && a.author.id !== b.author.id) || a.author.name !== b.author.name || a.author.bot !== b.author.bot;
  const staleGroup = (Number(new Date(b.createdAt)) - Number(new Date(a.createdAt))) > 5 * 60 * 1000;

  return nonGroupable || differentAuthor || staleGroup
};

/**
 * Groups messages into an array
 * @example
 * [{ id: 1 }, { id: 2 }, { id: 1 }, { id: 1 }]
 * // Output
 * [[{ id: 1 }], [{ id: 2 }], [{ id: 1 }, { id: 1 }]]
 * @param messages The messages to group
 */
export const groupMessages = <
  Group extends Message[]
>(
  messages: Group
): Group[] => {
  const result = new Array<Group>()
  let group = null
  let previous: Message

  for (const message of messages) {
    if (group === null || compareGroupability(previous, message) || previous.thread) {
      group = result.push([] as Group) - 1
    }
    result[group].push(message);
    previous = message
  }

  return result
};

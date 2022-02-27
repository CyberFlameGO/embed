import matchSorter from 'match-sorter'
import * as React from 'react'
import { Hash } from '@ui/shared/Channel'

import { Description, Icon, Info, Name } from '../elements'
import { Suggestion } from '../types'

interface Command {
  name: string
  description: string
}

const commands: Command[] = [
  {
    name: 'shrug',
    description: 'Appends ¯\\_(ツ)_/¯ to your message.'
  },
  {
    name: 'tableflip',
    description: 'Appends (╯°□°）╯︵ ┻━┻ to your message.'
  },
  {
    name: 'unflip',
    description: 'Appends ┬─┬ ノ( ゜-゜ノ) to your message.'
  },
  {
    name: 'me',
    description: 'Displays text with emphasis.'
  },
  {
    name: 'spoiler',
    description: 'Marks your message as a spoiler.'
  }
]

const Commands: Suggestion<Command> = {
  getSuggestions: query =>
    matchSorter(commands, query, {
      keys: [
        {
          minRanking: matchSorter.rankings.STRING_CASE_ACRONYM,
          maxRanking: matchSorter.rankings.STARTS_WITH,
          threshold: matchSorter.rankings.STARTS_WITH,
          key: 'name'
        }
      ]
    }),

  extract: (_, { value }) => value[0] === '/' && value.substring(1),
  toString: ({ name }) => `/${name}`,

  description: query => (
    <Description className="description">
      Commands
      {query ? (
        <React.Fragment>
          {` matching `}
          <strong>{`/${query}`}</strong>
        </React.Fragment>
      ) : null}
    </Description>
  ),

  suggestion: ({ name, description }) => (
    <React.Fragment>
      <Icon><svg width="16" height="16" viewBox="0 0 16 16"><g fill="none" fillRule="evenodd"><rect width="16" height="16"></rect><polygon fill="currentColor" points="12 2.32 10.513 2 4 13.68 5.487 14"></polygon></g></svg></Icon>
      <Name className="name">{name}</Name>
      <Info className="info">{description}</Info>
    </React.Fragment>
  )
}

export default Commands

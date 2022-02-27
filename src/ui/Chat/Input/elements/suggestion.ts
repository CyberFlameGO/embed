import styled, { css } from '@lib/emotion'
import { Twemoji } from '@ui/shared/Emoji/emoji'

interface Props {
  selected: boolean
}

export const Suggestion = styled('li')<Props>`
  display: flex;
  cursor: pointer;
  align-items: center;
  margin: 0 8px;
  font-weight: 500;
  line-height: 16px;
  border-radius: 3px;
  padding: 8px;
  ${({ selected, theme }) =>
    selected
      ? css`
          background-color: ${theme.colors._primary.fade(0.95).string()};
        `
      : null};
`

export const Icon = styled(Twemoji)`
  width: 16px;
  height: 16px;
  text-align: center;
  flex-shrink: 0;

  * {
    color: ${({ theme }) => theme.colors._primary.fade(0.34).string()};
  }
`

export const Name = styled('div')`
  margin-left: 10px;
  flex-grow: 1;
  flex-shrink: 0;
  font-size: 16px;
  line-height: 20px;
`

export const Info = styled('div')`
  overflow: hidden;
  margin-left: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  color: ${({ theme }) => theme.colors._primary.fade(0.34).string()};
  text-transform: lowercase;
  &:first-letter {
    text-transform: uppercase;
  }
`

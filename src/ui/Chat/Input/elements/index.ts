import styled from '@lib/emotion'
import emojiSprite from '../../../../app/res/images/discordAssets/15e026451fd814e2d1a13e49c8076978.png'

export const Root = styled('div')`
  display: flex;
  width: 100%;
`

export const UploadButton = styled.label`
  padding: 10px 16px;
  cursor: pointer;

  path {
    color: ${({ theme }) => theme.colors._primary.fade(0.335).string()} !important;
  }

  &:hover {
    path {
      color: ${({ theme }) => theme.colors._primary.fade(0.17).string()} !important;
    }
  }
`

export const Textarea = styled('textarea')`
  width: 100%;
  height: 100%;
  padding: 10px 16px 10px 0;
  background-color: transparent;
  border: none;
  resize: none;
  outline: none;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: -0.025rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.colors._primary.fade(0.3).string()};

  &::placeholder {
    color: ${({ theme }) => theme.colors._primary.fade(0.7).string()};
    user-select: none;
  }

  ::-webkit-scrollbar {
    width: 5px;
    background-color: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 50px;
  }

  ::-webkit-scrollbar-button {
    display: none;
    width: 0;
    height: 0;
  }

  ::-webkit-scrollbar-corner {
    background-color: transparent;
  }
`

interface EmojiButtonProps {
  active: boolean
}
export const EmojiButton = styled.div<EmojiButtonProps>`
  background-image: url(${emojiSprite});
  background-size: 242px 110px;
  min-width: 22px;
  height: 22px;
  transition: filter .1s, transform .1s;
  cursor: pointer;
  margin: 10px;
  ${({ theme }) => theme.url.preset === 'crate' ? 'margin-right: 50px;' : ''}

  ${({ active }) => active
    ? 'transform: scale(1.14);'
    : 'filter: grayscale(100%);'}
`

export * from './suggestion'
export * from './suggestions'

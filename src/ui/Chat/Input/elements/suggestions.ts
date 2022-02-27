import { ScrollOverlay } from '@ui/shared/scrollable'
import styled from '@lib/emotion'

interface Props {
  length: number
}

export const Description = styled('div')`
  padding: 12px 8px;
  font-size: 12px;
  text-transform: uppercase;
  line-height: 16px;
  color: ${({ theme }) => theme.colors._primary.fade(0.34).string()};
  font-weight: 600;
  user-select: none;

  strong {
    text-transform: none;
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const Suggestions = styled(ScrollOverlay)<Props>`
  position: absolute !important;
  left: 0;
  border-radius: ${({ theme }) => theme.url.preset === 'crate' ? '5px 5px 0 0' : '5px'};
  padding: 8px 0;
  background-color: ${({ theme }) => theme.colors._background.darken(0.15).string()};
  bottom: ${({ theme }) => theme.url.preset === 'crate' ? '100%' : 'calc(100% + 8px)'};
  ${({ theme }) => theme.url.preset === 'crate' ? '' : 'box-shadow: 0 0 0 1px rgba(4,4,5,0.15), 0 8px 16px rgba(0,0,0,0.24);'}

  height: ${({ length }) => (length > 8 ? 300 : length * 36) + 8 * 2 + 34}px !important;
  max-height: calc(100vh - 130px);

  & > div:nth-child(1) {
    padding: 0 8px 8px 0;
  }
`

export const NoPerms = styled(`p`)`
  opacity: 0.4;
  margin: 10px;
  -webkit-touch-callout: none; 
  user-select: none;
  cursor: pointer;
`;

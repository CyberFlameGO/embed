import styled from "@ui/Message/ThemeContext";

export const ThreadBox = styled.div`
  background-color: #2f3136;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 8px;
  max-width: 480px;
  min-width: 0;
  width: fit-content;
  padding: 8px;
  font-size: 0.875rem;
`;

export const ThreadBoxHeader = styled.div`
  display: flex;
  font-weight: 600;
`

export const ThreadName = styled.span`
  color: ${({ theme }) => theme.colors._primary.string()};
  margin-right: 8px
`;

interface MessageCountProps {
  hover: boolean
}
export const MessageCount = styled.span<MessageCountProps>`
  color: #00b0f4 !important;
  ${({ hover }) => hover && `text-decoration: underline;`}
`;

export const ThreadText = styled.div`
  color: #b9bbbe;
`

export const Archived = styled(ThreadText)`
  font-style: italic;
  display: flex;
  align-items: center;
`;

export const Clock = styled.svg`
  margin-left: 6px;
`

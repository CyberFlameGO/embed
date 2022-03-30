import { Error } from '..'
import Header, { Name, Topic } from './header'
import Wrapper from './wrapper'
import { Message } from './elements'
import { Locale } from '@lib/Locale'

const ErrorAhoy = ({ message }) => (
  <Wrapper>
    <Header>
      <Name>
        {Locale.translate('errorahoy')}
      </Name>
      <Topic>
      {Locale.translate('errorahoy.desc')}
      </Topic>
    </Header>
    <Error>
      {message ? <Message length={message.length}>{message}</Message> : null}
    </Error>
  </Wrapper>
);

export default ErrorAhoy;
import { Chat } from '@ui/Overlays'
import Header, { Name, Topic } from '@ui/Header'
import Wrapper from '@ui/Wrapper'
import { Locale } from '@lib/Locale';

const ChooseChannel = () => (
  <Wrapper>
    <Header>
      <Name>
        {Locale.translate('choosechannel')}
      </Name>
      <Topic>
      {Locale.translate('choosechannel.desc')}
      </Topic>
    </Header>
    <Chat />
  </Wrapper>
);

export default ChooseChannel

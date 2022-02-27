import { Root, OpenImage } from './elements'
import { Box, Close } from '@ui/Modal'
import { observer } from 'mobx-react'
import { store } from '@models'

const Image = observer(() => {
  return (
    <Box>
      <Close onClick={store.modal.close} />

      <Root src={store.modal.data} />
      <OpenImage
        href={store.modal.data}
        target="_blank"
        onClick={store.modal.close}
      >
        Open original
      </OpenImage>
    </Box>
  )
})

export default Image

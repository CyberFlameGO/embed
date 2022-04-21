import { useState } from 'react'
import { EmojiButton } from './elements'

interface Props {
  pickerIsOpen: boolean
  setPickerState: (state: boolean) => void
  setElement: (element: HTMLButtonElement) => void
}

export default ({ pickerIsOpen, setPickerState, setElement }: Props) => {
  const [pos, setPos] = useState(null)
  const [hover, setHover] = useState(false)

  return (
    <EmojiButton
      style={{ backgroundPosition: pos }}
      onMouseEnter={() => {
        setHover(true)
        if (!pickerIsOpen) {
          const x = Math.floor(Math.random() * 11)
          const y = Math.floor(Math.random() * (x <= 5 ? 5 : 4))
          setPos(`-${x * 22}px -${y * 22}px`)
        }
      }}
      onMouseLeave={() => setHover(false)}
      onClick={() => setPickerState(!pickerIsOpen)}
      active={hover || pickerIsOpen}
      innerRef={ref => setElement(ref)}
      className="emoji-button"
    />
  )
}

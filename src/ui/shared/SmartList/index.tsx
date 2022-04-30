import { Component } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import { VariableSizeGrid, VariableSizeGridProps } from 'react-window'

const listStyle = {
  overflowX: null,
  overflowY: null,
  outline: 'none'
}

const noop = () => {}

class SmartList extends Component<
  VariableSizeGridProps & {
    className?: string
    listRef?: (list: VariableSizeGrid) => void
    scrollRef?: (scroller: Scrollbars) => void
    willUnmount?: () => void
  }
> {
  static defaultProps = {
    scroller: Scrollbars,
    listRef: noop,
    scrollRef: noop
  }
  list: VariableSizeGrid
  scroller: Scrollbars

  toList = ({ target }) => {
    const { scrollTop, scrollLeft } = target

    this.list.scrollTo({ scrollLeft, scrollTop })
  }

  toScroller = ({ scrollTop }) => {
    if (this.scroller) {
      this.scroller.scrollTop(scrollTop)
    }
  }

  componentWillUnmount() {
    if (this.props.willUnmount) {
      this.props.willUnmount()
    }
  }

  render() {
    const { className, ...props } = this.props
    const { width, height } = props

    return (
      <Scrollbars
        style={{ width, height }}
        onScroll={this.toList}
        className={className}
        ref={instance => {
          this.scroller = instance
          this.props.scrollRef(instance)
        }}
      >
        <VariableSizeGrid
          {...props}
          ref={instance => {
            this.list = instance
            this.props.listRef(instance)
          }}
          onScroll={this.toScroller}
          style={listStyle}
        />
      </Scrollbars>
    )
  }
}

export default SmartList

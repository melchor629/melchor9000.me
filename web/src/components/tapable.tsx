import React from 'react'

interface TapableProps {
  tapTime?: number
  tapDelta?: number
  onTap?: (event: React.TouchEvent<HTMLElement>, position: TouchPosition) => void
  onLongTap?: (event: React.TouchEvent<HTMLElement>, position: TouchPosition) => void
  children: React.ReactNode
}

interface TouchPosition {
  x: number
  y: number
  when: Date
}

class Tapable extends React.Component<TapableProps> {
  private startTouch: TouchPosition | null = null

  private endTouch: TouchPosition | null = null

  private startTouching(event: React.TouchEvent<HTMLElement>): void {
    event.preventDefault()
    event.stopPropagation()
    this.startTouch = {
      x: event.touches.item(0).clientX,
      y: event.touches.item(0).clientY,
      when: new Date(),
    }
    this.endTouch = {
      x: event.touches.item(0).clientX,
      y: event.touches.item(0).clientY,
      when: new Date(),
    }
  }

  private moveTouching(event: React.TouchEvent<HTMLElement>): void {
    this.endTouch = {
      x: event.touches.item(0).clientX,
      y: event.touches.item(0).clientY,
      when: new Date(),
    }
  }

  private endTouching(event: React.TouchEvent<HTMLElement>): void {
    if (this.startTouch) {
      const {
        tapDelta,
        tapTime,
        onLongTap,
        onTap,
      } = this.props
      const diffx = Math.abs(this.endTouch!.x - this.startTouch.x)
      const diffy = Math.abs(this.endTouch!.y - this.startTouch.y)
      const diffTime = +new Date() - +this.startTouch.when
      if (diffx < (tapDelta || 10) && diffy < 10) {
        event.preventDefault()
        event.stopPropagation()
        if (diffTime > (tapTime || 250)) {
          if (onLongTap) {
            onLongTap(event, this.startTouch)
          }
        } else if (diffTime < 100) {
          if (onTap) {
            onTap(event, this.startTouch)
          }
        }
      }
      this.startTouch = null
    }
  }

  render() {
    const { children } = this.props
    return (
      <div
        onTouchStart={(event) => this.startTouching(event)}
        onTouchMove={(event) => this.moveTouching(event)}
        onTouchEnd={(event) => this.endTouching(event)}
        onContextMenu={(event) => event.preventDefault()}
      >
        {children}
      </div>
    )
  }
}

// @ts-ignore
Tapable.defaultProps = {
  tapTime: 250,
  tapDelta: 10,
  onTap: null,
  onLongTap: null,
}

export default Tapable

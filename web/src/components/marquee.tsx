import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  PropsWithChildren,
} from 'react'

// based from https://github.com/cdtinney/react-double-marquee/blob/master/src/index.jsx
// uses other kind of triggering for the animation and is full hooks

type MarqueeProps = PropsWithChildren<{
  childMargin?: number
  direction?: 'left' | 'right'
  loop?: boolean
  speed?: number
  trigger?: 'on-mouse-enter'
}>

const Child = forwardRef<HTMLSpanElement, PropsWithChildren<{ childMargin: number }>>(
  ({ children, childMargin }, ref) => (
    <span ref={ref} style={{ margin: `0 ${childMargin}px` }}>
      {children}
    </span>
  ),
)

const Marquee = ({
  children,
  childMargin,
  direction,
  loop,
  speed,
  trigger,
}: MarqueeProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const itemRef = useRef<HTMLSpanElement>(null)
  const s = useRef({
    x: 0,
    animation: null as number | null,
    lastFrameTime: null as number | null,
  })
  const [itemIsLargerThanContainer, setItemIsLargerThanContainer] = useState(true)

  const getInitialPosition = useCallback(() => (
    direction === 'right'
      ? -((innerRef.current?.clientWidth ?? 0) / 2) - childMargin!
      : -childMargin!
  ), [direction, childMargin])

  const resetPosition = useCallback(() => {
    s.current.x = getInitialPosition()
    if (innerRef.current) {
      innerRef.current.style.transform = `translateX(${s.current.x}px)`
    }
  }, [getInitialPosition])

  const updateInnerPosition = useCallback(
    (timeDelta: number) => {
      const nextPosX = (() => {
        if (direction === 'right') {
          const nextPos = s.current.x + timeDelta * speed!
          return nextPos > -childMargin! ? getInitialPosition() : nextPos
        }
        if (direction === 'left') {
          const nextPos = s.current.x - timeDelta * speed!
          return nextPos < -((innerRef.current?.clientWidth ?? 0) / 2) - childMargin!
            ? getInitialPosition()
            : nextPos
        }

        return s.current.x
      })()

      s.current.x = nextPosX

      if (innerRef.current) {
        innerRef.current.style.transform = `translateX(${s.current.x}px)`
      }
    },
    [childMargin, direction, getInitialPosition, speed],
  )

  const requestAnimationIfNeeded = useCallback(() => {
    let shouldAnimate = itemIsLargerThanContainer
    if (!loop) {
      shouldAnimate = shouldAnimate
        && !(typeof s.current.animation === 'number' && s.current.x === getInitialPosition())
    }
    if (!shouldAnimate) {
      s.current.animation = null
      s.current.lastFrameTime = null
      return false
    }

    const animate = (time: number) => {
      if (s.current.lastFrameTime) {
        updateInnerPosition(time - s.current.lastFrameTime)
      } else {
        updateInnerPosition(1 / 60)
      }

      s.current.lastFrameTime = time
      requestAnimationIfNeeded()
    }

    s.current.animation = requestAnimationFrame(animate)
    return true
  }, [updateInnerPosition, getInitialPosition, loop, itemIsLargerThanContainer])

  const startAnimation = useCallback(() => {
    if (s.current.animation || !itemIsLargerThanContainer) {
      return
    }

    resetPosition()
    requestAnimationIfNeeded()
  }, [resetPosition, requestAnimationIfNeeded, itemIsLargerThanContainer])

  useLayoutEffect(() => {
    resetPosition()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => cancelAnimationFrame(s.current.animation!)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useLayoutEffect(() => {
    const itemSize = itemRef.current?.getBoundingClientRect().width ?? 0
    const containerSize = containerRef.current?.clientWidth ?? 0
    const newValue = itemSize > containerSize
    setItemIsLargerThanContainer(newValue)
    if (!newValue && innerRef.current) {
      // undo transform, it is not needed because this text will not have the animation
      innerRef.current.style.transform = ''
    }
  }, [children, childMargin])

  useLayoutEffect(() => {
    // trick to update the requestAnimationIfNeeded function ref when it changes
    // and an animation is running
    if (s.current.animation) {
      requestAnimationIfNeeded()
      const { animation } = s.current
      return () => cancelAnimationFrame(animation)
    }

    return () => {}
  }, [requestAnimationIfNeeded])

  return (
    <div
      ref={containerRef}
      style={{ overflowX: 'hidden' }}
      onMouseEnter={trigger === 'on-mouse-enter' ? startAnimation : undefined}
      onTouchStart={trigger === 'on-mouse-enter' ? startAnimation : undefined}
    >
      <div ref={innerRef} style={{ display: 'inline-block', willChange: 'transform' }}>
        <Child ref={itemRef} childMargin={childMargin!}>{children}</Child>
        {itemIsLargerThanContainer && <Child childMargin={childMargin!}>{children}</Child>}
      </div>
    </div>
  )
}

Marquee.defaultProps = {
  speed: 0.04,
  direction: 'left',
  childMargin: 15,
  loop: false,
  children: null,
  trigger: 'on-mouse-enter',
}

export default Marquee

import React, { memo } from 'react'
import { animated, useTransition } from 'react-spring'

interface OverlayImageViewProps {
    imageSwitcher: boolean
    imageUrl1: string
    imageUrl2: string
    changeDirection: 'next' | 'prev'
}

const translateXFromDirection = (u: number, direction: 'next' | 'prev') =>
    `translateX(${(direction === 'next' ? 25 : -25) * u}px)`

const ImageViewImpl = ({ imageSwitcher, imageUrl1, imageUrl2, changeDirection }: OverlayImageViewProps) => {
    const transitions = useTransition(imageSwitcher, null, {
        from: { opacity: 0, transform: translateXFromDirection(1, changeDirection) },
        enter: { opacity: 1, transform: translateXFromDirection(0, changeDirection) },
        leave: { opacity: 0, transform: translateXFromDirection(-1, changeDirection) },
        unique: true,
    })

    return (
        <>{transitions.map(({ item, props }) => !item ? (
            <animated.div className="img" id="img" key="img1"
                style={{
                    ...props,
                    backgroundImage: `url(${imageUrl1})`,
                }} />
        ) : (
            <animated.div className="img" id="img2" key="img2"
                style={{
                    ...props,
                    backgroundImage: `url(${imageUrl2})`,
                }} />
        ),
        )}</>
    )
}

export const ImageView = memo(ImageViewImpl)

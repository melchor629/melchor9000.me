import * as React from 'react';

interface TapableProps {
    tapTime?: number;
    tapDelta?: number;
    onTap?: (event: React.TouchEvent<HTMLElement>, position: TouchPosition) => void;
    onLongTap?: (event: React.TouchEvent<HTMLElement>, position: TouchPosition) => void;
}

interface TouchPosition {
    x: number;
    y: number;
    when: Date;
}

class Tapable extends React.Component<TapableProps> {
    private startTouch: TouchPosition | null = null;
    private endTouch: TouchPosition | null = null;

    render() {
        return (
            <div onTouchStart={ event => this.startTouching(event) }
                 onTouchMove={ event => this.moveTouching(event) }
                 onTouchEnd={ event => this.endTouching(event) }
                 onContextMenu={ event => event.preventDefault() }>
                { this.props.children }
            </div>
        );
    }

    private startTouching(event: React.TouchEvent<HTMLElement>): void {
        event.preventDefault();
        event.stopPropagation();
        this.startTouch = {
            x: event.touches.item(0).clientX,
            y: event.touches.item(0).clientY,
            when: new Date()
        };
        this.endTouch = {
            x: event.touches.item(0).clientX,
            y: event.touches.item(0).clientY,
            when: new Date()
        };
    }

    private moveTouching(event: React.TouchEvent<HTMLElement>): void {
        this.endTouch = {
            x: event.touches.item(0).clientX,
            y: event.touches.item(0).clientY,
            when: new Date()
        };
    }

    private endTouching(event: React.TouchEvent<HTMLElement>): void {
        if(this.startTouch) {
            let diffx = Math.abs(this.endTouch!.x - this.startTouch.x);
            let diffy = Math.abs(this.endTouch!.y - this.startTouch.y);
            let diffTime = +new Date() - +this.startTouch.when;
            if(diffx < (this.props.tapDelta || 10) && diffy < 10) {
                event.preventDefault();
                event.stopPropagation();
                if(diffTime > (this.props.tapTime || 250)) {
                    if(this.props.onLongTap) {
                        this.props.onLongTap(event, this.startTouch);
                    }
                } else if(diffTime < 100) {
                    if(this.props.onTap) {
                        this.props.onTap(event, this.startTouch);
                    }
                }
            }
            this.startTouch = null;
        }
    }
}

export default Tapable;

import * as React from 'react';
import * as Swipeable from 'react-swipeable';
import { WithNamespaces } from 'react-i18next';
import { animated, Transition } from 'react-spring';
import ZoomImageOverlay from './zoom-image-overlay';
import { buildLargePhotoUrl } from 'src/lib/flickr';
import { OverlayDispatchToProps, OverlayStateToProps } from 'src/containers/gallery/overlay';
import OverlayImageInfo from 'src/components/gallery/overlay-image-info';

const $ = require('jquery');

type OverlayProps = OverlayStateToProps & OverlayDispatchToProps & {
    userId: string;
    photosetId: string;
    perPage: number;
} & WithNamespaces;

interface OverlayState {
    imageSwitcher: boolean;
    holdImageSwitcher: boolean;
}

export default class Overlay extends React.Component<OverlayProps, OverlayState> {
    private _lastTapTime: number | null = null;
    private _startTouchInfo: React.Touch | null = null;
    private _startTouchTime: number | null = null;

    constructor(props: OverlayProps) {
        super(props);
        this.nextPhotoLoadingNextPage = this.nextPhotoLoadingNextPage.bind(this);
        this.previousPhoto = this.previousPhoto.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.nextPhoto = this.nextPhoto.bind(this);
        this.onTap = this.onTap.bind(this);

        this.state = {
            imageSwitcher: false,
            holdImageSwitcher: false,
        };
    }

    componentDidMount() {
        this.props.loadFullInfoForPhoto(this.props.currentPhoto);
        requestAnimationFrame(this.props.toggleShow);
        $(window).keyup(this.onKeyUp.bind(this));
        $('body').css('overflow', 'hidden');
    }

    componentWillUnmount() {
        $(window).off('keyup');
        $('body').css('overflow', 'inherit');
    }

    componentDidUpdate(prevProps: Readonly<OverlayProps>) {
        if(this.props.previousPhoto) {
            if(prevProps.currentPhoto.id !== this.props.currentPhoto.id) {
                //Instead of change the images, wait for the new image to be loaded
                this.setState({
                    holdImageSwitcher: true,
                });
            } else if(prevProps.imageIsLoading && !this.props.imageIsLoading) {
                //Now the image has been loaded, so we can change the image to the next one
                this.setState({
                    imageSwitcher: !this.state.imageSwitcher,
                    holdImageSwitcher: false,
                });
            }
        }

        if(prevProps.currentPhoto.id !== this.props.currentPhoto.id) {
            this.props.loadFullInfoForPhoto(this.props.currentPhoto);
            this.props.photoIsLoading();
        }
    }

    onKeyUp(event: React.KeyboardEvent<HTMLDivElement>) {
        event.preventDefault();
        const key = event.keyCode;
        if(key === 27) { //ESC
            if(this.props.isZoomed) {
                this.props.zoomOff();
            } else {
                this.props.close();
            }
        } else if(key === 39) { //Right
            if(this.props.hasNext) {
                this.nextPhoto();
            } else if(this.props.hasNextPage) {
                this.nextPhotoLoadingNextPage();
            }
        } else if(key === 37 && this.props.hasPrev) { //Left
            this.previousPhoto();
        }
    }

    onTap() {
        //That's not really a pure function, but we need it to simulate a double tap action on mobiles
        if(Date.now() - (this._lastTapTime || 0) <= 500) {
            window.navigator.vibrate([ 40, 50 ]);
            this.props.zoom(this.props.currentPhoto);
        } else {
            this._lastTapTime = Date.now();
        }
    }

    onTouchStart(e: React.TouchEvent<HTMLElement>) {
        this._startTouchInfo = e.changedTouches[0];
        this._startTouchTime = Date.now();
    }

    onTouchEnd(e: React.TouchEvent<HTMLElement>) {
        //That's not really a pure function, but we need it to simulate a long tap action on mobiles
        if(Date.now() - (this._startTouchTime || 0) >= 1000) {
            const diff = {
                x: Math.abs(e.changedTouches[0].clientX - this._startTouchInfo!.clientX),
                y: Math.abs(e.changedTouches[0].clientY - this._startTouchInfo!.clientY)
            };
            if(diff.x < 5 && diff.y < 5) {
                window.navigator.vibrate(100);
                this.props.zoomOff();
            }
        }
    }

    render() {
        const {
            currentPhoto: photo, isZoomed, close, zoom, hasNext, hasPrev, show, showInfoPanel, toggleInfoPanel,
            photoIsLoaded, hasNextPage, previousPhoto, directionOfChange
        } = this.props;
        const { imageSwitcher, holdImageSwitcher } = this.state;

        const imageViewClasses = [ 'image-view', 'col-sm-8', 'col-12' ];
        if(!showInfoPanel) {
            imageViewClasses.push('max-size');
        }

        const nopeWithVibration = () => window.navigator.vibrate(150);

        let imageUrl1: string;
        let imageUrl2: string;
        if(holdImageSwitcher) {
            //If the image is loading, don't change anything yet
            imageUrl1 = imageSwitcher ? buildLargePhotoUrl(photo) : buildLargePhotoUrl(previousPhoto!);
            imageUrl2 = imageSwitcher ? (previousPhoto ? buildLargePhotoUrl(previousPhoto) : '') :
                buildLargePhotoUrl(photo);
        } else {
            //When the image has loaded, do the change
            imageUrl1 = imageSwitcher ? buildLargePhotoUrl(previousPhoto!) : buildLargePhotoUrl(photo);
            imageUrl2 = imageSwitcher ? buildLargePhotoUrl(photo) :
                (previousPhoto ? buildLargePhotoUrl(previousPhoto) : '');
        }

        return (
            <div className={`photo-overlay ${show ? 'show' : ''}`}>
                <div className="photo-overlay-container" role="document" style={{height: '100%'}}>

                    <Transition native={ true } from={{ t: 0 }} enter={{ t: 1 }} leave={{ t: 0 }} items={ isZoomed }>
                    { (_isZoomed: boolean) => _isZoomed && ((s: any) => (
                        <animated.div style={{ opacity: s.t }} className="zoom-container">
                            <ZoomImageOverlay photo={ photo }
                                              onTouchStart={ this.onTouchStart }
                                              onTouchEnd={ this.onTouchEnd } />
                        </animated.div>
                    ))}
                    </Transition>

                    <Swipeable onSwipedLeft={ hasNext ? this.nextPhoto :
                        (hasNextPage ? this.nextPhotoLoadingNextPage : nopeWithVibration ) }
                               onSwipedRight={ hasPrev ? this.previousPhoto : nopeWithVibration }
                               onTap={ this.onTap }
                               className={imageViewClasses.join(' ')}>
                        <img src={ buildLargePhotoUrl(photo) } onLoad={ () => photoIsLoaded() }
                             style={{ display: 'none' }} alt={ photo.title as string } />

                        <Transition native={ true }
                                    from={{ t: 0, u: 1 }}
                                    enter={{ t: 1, u: 0 }}
                                    leave={{ t: 0, u: -1 }}
                                    items={ imageSwitcher }>
                            { (switcher: boolean) => (({ t, u }: any) => (
                                !switcher ?
                                <animated.div className="img" id="img"
                                              style={{
                                                  backgroundImage: `url(${imageUrl1})`,
                                                  opacity: t,
                                                  transform: directionOfChange === 'next' ?
                                                      u.interpolate((x: number) => `translateX(${25 * x}px)`)
                                                      :
                                                      u.interpolate((x: number) => `translateX(${-25 * x}px`),
                                              }} />
                                :
                                <animated.div className="img" id="img2"
                                              style={{
                                                  backgroundImage: `url(${imageUrl2})`,
                                                  opacity: t,
                                                  transform: directionOfChange === 'next' ?
                                                        u.interpolate((x: number) => `translateX(${25 * x}px)`)
                                                        :
                                                        u.interpolate((x: number) => `translateX(${-25 * x}px`),
                                              }} />
                            )) }
                        </Transition>

                        <div className="buttons-container">
                            <div className="buttons">
                                <button type="button" className="close" id="close" onClick={ close }>
                                    <span className="fa-stack">
                                        <i className="fa fa-circle-o fa-stack-2x"/>
                                        <i className="fa fa-close fa-stack-1x"/>
                                    </span>
                                </button>
                                <button type="button" className="close d-none d-sm-block" id="info"
                                        onClick={ toggleInfoPanel }>
                                    <span className="fa-stack">
                                        <i className="fa fa-circle-o fa-stack-2x"/>
                                        <i className="fa fa-info fa-stack-1x"/>
                                    </span>
                                </button>
                                <button type="button" className="close d-none d-sm-block" id="zoom"
                                        onClick={ zoom.bind(null, photo) }>
                                    <span className="fa-stack">
                                        <i className="fa fa-circle-o fa-stack-2x"/>
                                        <i className="fa fa-search-plus fa-stack-1x"/>
                                    </span>
                                </button>
                            </div>

                            { hasPrev && <div className="change-photo prev d-none d-sm-block"
                                              onClick={ this.previousPhoto }>
                                <i className="fa fa-chevron-left fa-3x"/>
                            </div> }
                            { hasNext &&
                                <div className="change-photo next d-none d-sm-block" onClick={ this.nextPhoto }>
                                    <i className="fa fa-chevron-right fa-3x"/>
                                </div> }
                            { !hasNext && hasNextPage ?
                                <div className="change-photo next next-page d-none d-sm-block"
                                     onClick={ this.nextPhotoLoadingNextPage }>
                                    <i className="fa fa-chevron-right fa-3x"/>
                                </div> : null }
                        </div>
                    </Swipeable>

                    <OverlayImageInfo photo={ photo } show={ showInfoPanel } />
                </div>
            </div>
        );
    }

    private nextPhoto() {
        if(!this.props.imageIsLoading) {
            this.props.next();
        }
    }

    private previousPhoto() {
        if(!this.props.imageIsLoading) {
            this.props.prev();
        }
    }

    private nextPhotoLoadingNextPage() {
        const { imageIsLoading, loadMorePhotosAndNext, userId, photosetId, perPage, page } = this.props;
        if(!imageIsLoading) {
            loadMorePhotosAndNext(userId, photosetId, perPage, page);
        }
    }

}
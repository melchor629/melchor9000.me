import * as React from 'react';
import * as Swipeable from 'react-swipeable';
import { WithNamespaces } from 'react-i18next';
import ZoomImageOverlay from './zoom-image-overlay';
import { buildLargePhotoUrl } from 'src/lib/flickr';
import { OverlayDispatchToProps, OverlayStateToProps } from 'src/containers/gallery/overlay';
const $ = require('jquery');
const { Transition, animated } = require('react-spring');

type OverlayProps = OverlayStateToProps & OverlayDispatchToProps & {
    userId: string;
    photosetId: string;
    perPage: number;
} & WithNamespaces;

export default class Overlay extends React.Component<OverlayProps> {
    private _lastTapTime: number | null = null;
    private _startTouchInfo: React.Touch | null = null;
    private _startTouchTime: number | null = null;

    constructor(props: OverlayProps) {
        super(props);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onTap = this.onTap.bind(this);
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

    componentWillReceiveProps(nextProps: OverlayProps) {
        if(nextProps.currentPhoto.id !== this.props.currentPhoto.id) {
            this.props.loadFullInfoForPhoto(nextProps.currentPhoto);
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
        } else if(key === 39 && this.props.hasNext) { //Right
            this.props.next();
        } else if(key === 37 && this.props.hasPrev) { //Left
            this.props.prev();
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
            currentPhoto, isZoomed, next, prev, close, zoom, hasNext,
            hasPrev, show, showInfoPanel, toggleInfoPanel, photoIsLoaded,
            hasNextPage, userId, photosetId, perPage, page, loadMorePhotosAndNext,
            changeAnimation, t
        } = this.props;
        const photo = currentPhoto;
        const info = photo.info ? photo.info : null;
        const exif = photo.exif ? photo.exif : null;
        let descripcion = null;
        let fecha = null;
        let camara = null;
        let exposicion = null;
        let apertura = null;
        let iso = null;
        let distanciaFocal = null;
        let flash = null;
        let enlace = null;

        const infoHtml = (value: string, id: string) => (
            <p className="lead" id={ id }>
                <strong>{ t(`gallery.overlay.${id}`) }:</strong> <span>{ value }</span>
            </p>
        );

        if(info) {
            if(info.description) {
                descripcion = <span id="descripcion">{ info.description._content }</span>;
            }
            if(info.dates) {
                let sd = info.dates.taken.split(/[-: ]/);
                let date = new Date(
                    Number(sd[0]),
                    Number(sd[1]),
                    Number(sd[2]),
                    Number(sd[3]),
                    Number(sd[4]),
                    Number(sd[5]),
                    0
                );
                fecha = infoHtml(date.toLocaleDateString(), 'fecha');
            }
            if(info.urls.url) {
                enlace = (
                    <p id="enlace">
                        <a href={ info.urls.url[0]._content } target="_blank">{ t('gallery.overlay.seeFlickr') }</a>
                    </p>
                );
            }
        }

        if(exif) {
            let _exposicion = null;
            let _apertura = null;
            let _iso = null;
            let _distFocal = null;
            let _flash = null;

            for(let tag of exif.exif) {
                if(tag.tagspace === 'ExifIFD') {
                    if(tag.tag === 'ExposureTime') { _exposicion = tag.raw._content; }
                    if(tag.tag === 'FNumber') { _apertura = tag.raw._content; }
                    if(tag.tag === 'ISO') { _iso = tag.raw._content; }
                    if(tag.tag === 'FocalLength') { _distFocal = tag.raw._content; }
                    if(tag.tag === 'Flash') { _flash = tag.raw._content; }
                }
            }

            if(exif.camera) { camara = infoHtml(exif.camera, 'camara'); }
            if(_exposicion) { exposicion = infoHtml(_exposicion, 'exposicion'); }
            if(_apertura) { apertura = infoHtml(_apertura, 'apertura'); }
            if(_iso) { iso = infoHtml(_iso, 'iso'); }
            if(_distFocal) { distanciaFocal = infoHtml(_distFocal, 'dist-focal'); }
            if(_flash) {
                flash = infoHtml(t(`gallery.overlay.flash-${_flash.indexOf('Off') === -1}`), 'flash');
            }
        }

        const imageInfoClasses = [ 'image-info', 'col-sm-4', 'd-none', 'd-sm-block' ];
        if(!showInfoPanel) { imageInfoClasses.push('min-size'); }
        const imageViewClasses = [ 'image-view', 'col-sm-8', 'col-12' ];
        if(!showInfoPanel) { imageViewClasses.push('max-size'); }
        const leftButtonLeft = !showInfoPanel ? $(window).width() - 70 : null;

        const nnextt = loadMorePhotosAndNext.bind(null, userId, photosetId, perPage, page);

        const nopeWithVibration = () => window.navigator.vibrate(150);

        return (
            <div className={`photo-overlay ${show ? 'show' : ''}`}>
                <div className="photo-overlay-container" role="document" style={{height: '100%'}}>

                    <Transition native={ true } from={{ t: 0 }} enter={{ t: 1 }} leave={{ t: 0 }} items={ isZoomed }>
                    { (_isZoomed: boolean) => _isZoomed && ((s: any) => (
                        <animated.div style={{ opacity: s.t }}
                                      className="zoom-container">
                            <ZoomImageOverlay photo={ currentPhoto }
                                              onTouchStart={ this.onTouchStart }
                                              onTouchEnd={ this.onTouchEnd } />
                        </animated.div>
                    ))}
                    </Transition>

                    <Swipeable onSwipedLeft={ hasNext ? next : (hasNextPage ? nnextt : nopeWithVibration ) }
                               onSwipedRight={ hasPrev ? prev : nopeWithVibration }
                               onTap={ this.onTap }
                               className={imageViewClasses.join(' ')}>
                        <img src={ buildLargePhotoUrl(photo) } onLoad={ () => photoIsLoaded() }
                             style={{ display: 'none' }} alt={ photo.title as string } />
                        { !changeAnimation.animating ?
                            <div className="img" id="img"
                                 style={{ backgroundImage: `url(${buildLargePhotoUrl(photo)})` }}/>
                            :
                            <div className="img" id="img" style={ changeAnimation.style1 as any } />
                        }
                        { !changeAnimation.animating ?
                            <div className="img" id="img2"/>
                            :
                            <div className="img" id="img2" style={ changeAnimation.style2 as any } />
                        }

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

                            { hasPrev ? <div className="change-photo prev d-none d-sm-block" onClick={ prev }>
                                <i className="fa fa-chevron-left fa-3x"/>
                            </div> : null }
                            { hasNext ?
                                <div className="change-photo next d-none d-sm-block" onClick={ next }
                                     style={{ left: `${leftButtonLeft}px` }}>
                                    <i className="fa fa-chevron-right fa-3x"/>
                                </div> : null }
                            { !hasNext && hasNextPage ?
                                <div className="change-photo next next-page d-none d-sm-block"
                                     onClick={ nnextt } style={{ left: `${leftButtonLeft}px` }}>
                                    <i className="fa fa-chevron-right fa-3x"/>
                                </div> : null }
                        </div>
                    </Swipeable>

                    <div className={imageInfoClasses.join(' ')}>
                        <div className="page-header">
                            <h2>{ photo.title }</h2>
                            {descripcion}
                        </div>

                        {fecha}
                        {camara}
                        {exposicion}
                        {apertura}
                        {iso}
                        {distanciaFocal}
                        {flash}
                        {enlace}
                    </div>
                </div>
            </div>
        );
    }
}
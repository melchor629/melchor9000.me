import * as React from 'react';
import Header from './header';
import PhotoItem from '../../containers/gallery/photo-item';
import Overlay from '../../containers/gallery/overlay';
import { GalleryPhoto } from '../../redux/gallery/reducers';
import { GalleryDispatchToProps, GalleryStateToProps } from '../../containers/gallery/gallery';
const $ = require('jquery');
import './gallery.css';

type GalleryProps = GalleryStateToProps & GalleryDispatchToProps & {
    userId: string;
    photosetId: string;
    perPage: number;
};

export default class Gallery extends React.Component<GalleryProps> {

    componentDidMount() {
        this.props.loadFirstPhotos();
        //No se me ocurre mejor idea para esto :(
        this.onScroll = this.onScroll.bind(this);
        window.addEventListener('scroll', this.onScroll, { passive: true });
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
    }

    render() {
        const { photos, primary, detailedPhoto, loading, page, totalPages, userId, photosetId, perPage } = this.props;
        let spinnerClasses = [ 'load-spin-container', 'd-flex', 'justify-content-center'];
        if(loading) {
            spinnerClasses.push('overlay-loading');
        } else if(page === totalPages) {
            spinnerClasses = [ 'd-none' ];
        }
        //Loading spinner from http://codepen.io/jczimm/pen/vEBpoL
        return (
            <div style={{ paddingTop: 300 }}>
                <Header photo={ primary } />

                <div className="row gallery">
                    { photos.map((photo: GalleryPhoto) => <PhotoItem photo={photo} key={photo.id} />) }
                </div>

                <div className={spinnerClasses.join(' ')}>
                    <div className="load-spin">
                        <svg className="load-spin-inner" viewBox="25 25 50 50">
                            <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="6"
                                    strokeMiterlimit="10"/>
                        </svg>
                    </div>
                </div>

                { detailedPhoto ? <Overlay userId={ userId } photosetId={ photosetId } perPage={ perPage } /> : null }
            </div>
        );
    }

    private onScroll(): void {
        const bottom = $(document).scrollTop() + $(window).height();
        const sizeOfPage = document.body.scrollHeight;
        if(sizeOfPage - bottom < 100 && !this.props.loadingPhotosList) {
            this.props.loadMorePhotos(this.props.page);
            if(this.props.page + 1 === this.props.totalPages) {
                window.removeEventListener('scroll', this.onScroll);
            }
        }
    }
}
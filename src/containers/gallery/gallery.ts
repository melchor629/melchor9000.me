import { connect } from 'react-redux';
import GalleryComponent from 'src/components/gallery/gallery';
import { State } from 'src/redux/reducers';
import { GalleryPhoto } from 'src/redux/gallery/reducers';
import { loadFirstPhotos, loadMorePhotos } from 'src/redux/gallery/actions.js';
import { changeTitle } from 'src/redux/title/actions.js';

export interface GalleryStateToProps {
    primary: string | null;
    photos: GalleryPhoto[];
    page: number;
    totalPages: number;
    detailedPhoto: string | undefined;
    loading: boolean;
    loadingPhotosList: boolean;
}

export interface GalleryDispatchToProps {
    loadFirstPhotos: () => void;
    loadMorePhotos: (page: number) => void;
    changeTitle: (title: string) => void;
}

const mapStateToProps = ({ galleryList }: State): GalleryStateToProps => ({
    primary: galleryList.primary,
    photos: galleryList.photos,
    page: galleryList.page,
    totalPages: galleryList.totalPages,
    detailedPhoto: galleryList.detailedPhoto,
    loading: galleryList.loading || galleryList.loadingPhoto,
    loadingPhotosList: galleryList.loadingPhotos
});

const mapDispatchToProps = (dispatch: any, { userId, photosetId, perPage }: any): GalleryDispatchToProps => ({
    loadFirstPhotos: () => dispatch(loadFirstPhotos(userId, photosetId, perPage, 1)),
    loadMorePhotos: (page: number) => dispatch(loadMorePhotos(userId, photosetId, perPage, page)),
    changeTitle: (title: string) => dispatch(changeTitle(title)),
});

export const Gallery = connect(
    mapStateToProps,
    mapDispatchToProps
)(GalleryComponent);

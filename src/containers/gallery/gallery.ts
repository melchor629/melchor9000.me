import { connect } from 'react-redux';
import GalleryComponent from '../../components/gallery/gallery';
import { State } from '../../redux/reducers';
import { GalleryPhoto } from '../../redux/gallery/reducers';
import { loadFirstPhotos, loadMorePhotos } from '../../redux/gallery/actions';

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
});

export const Gallery = connect(
    mapStateToProps,
    mapDispatchToProps
)(GalleryComponent);

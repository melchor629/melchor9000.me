import moment from 'moment';
import React, { memo, useMemo } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { GalleryPhoto } from '../../../redux/gallery/reducers';
import { DefaultContainer } from '../../default-container';
import LoadSpinner from '../../load-spinner';

interface OverlayImageInfoProps {
    photo: GalleryPhoto;
    loading: boolean;
    rootRef?: React.RefObject<HTMLDivElement>;
}

const exifToMap = (photo: GalleryPhoto): Map<string, string> => {
    if(!photo.exif) {
        return new Map();
    }

    return photo.exif.exif
        .reduce((map, exif) => map.set(`${exif.tagspace}:${exif.tag}`, exif.raw._content), new Map());
};

const ImageInfoViewImpl = ({ photo, loading, rootRef, t }: OverlayImageInfoProps & WithTranslation) => {
    const info = photo.info ? photo.info : null;
    const exif = photo.exif ? photo.exif : null;
    const exifMap = exifToMap(photo);
    let geolocation = null;

    const InfoItem = useMemo(() => ({ id, children }: { id: string, children: any }) => !!children ? (
        <div className="lead col-12 col-md-6 mb-2 info-item">
            <small>{ t(`gallery.photoPage.${id}`) }</small><br/>
            <span>{ children }</span>
        </div>
    ) : null, [t]);

    if(info) {
        if(info.location) {
            const l = info.location;
            const locationString = [
                l.neighbourhood && `${l.neighbourhood._content},`,
                l.locality && `${l.locality._content},`,
                l.county && `${l.county._content} -`,
                l.region && l.region._content,
                l.country && `(${l.country._content})`,
            ].filter(f => f).join(' ');
            const url = `https://www.google.es/maps/@${l.latitude},${l.longitude},15z?q=${l.latitude},${l.longitude}`;
            geolocation = (
                <InfoItem id="geoposition">
                    <a href={ url }
                        target="_blank"
                        rel="noreferrer">
                        { locationString }
                    </a>
                </InfoItem>
            );
        }
    }

    return (
        <div className="image-info" ref={ rootRef }>
            <DefaultContainer>
                <Helmet>
                    <title>{ photo.title } - Gallery</title>
                    { info && <meta name="Description" content={ `Photo: ${info.description._content}` } /> }
                </Helmet>

                <div className="page-header">
                    <h2>{ photo.title }</h2>
                    { info && <span id="descripcion">{ info.description._content }</span> }
                </div>

                { loading && <div className="d-flex justify-content-center"><LoadSpinner /></div> }

                <div className="mt-3 row">
                    <InfoItem id="captureDate">{
                        info && moment(info.dates.taken, 'YYYY-MM-DD hh:mm:ss').format('LLLL')
                    }</InfoItem>
                    { geolocation }
                    <InfoItem id="camera">{ exif && exif.camera }</InfoItem>
                    <InfoItem id="lens">{ exif && exifMap.get('ExifIFD:LensModel') }</InfoItem>
                    <InfoItem id="exposure">{ exifMap.get('ExifIFD:ExposureTime') }</InfoItem>
                    <InfoItem id="aperture">{ exifMap.get('ExifIFD:FNumber') }</InfoItem>
                    <InfoItem id="iso">{ exifMap.get('ExifIFD:ISO') }</InfoItem>
                    <InfoItem id="focalDistance">{ exifMap.get('ExifIFD:FocalLength') }</InfoItem>
                    <InfoItem id="flash">{
                        exifMap.get('ExifIFD:Flash') &&
                            t(`gallery.photoPage.flash-${exifMap.get('ExifIFD:Flash')!.indexOf('Off') === -1}`)
                    }</InfoItem>
                    <InfoItem id="width">{
                        exifMap.get('IFD0:ImageWidth') ||
                        (photo.sizes && photo.sizes.Original && photo.sizes.Original.width)
                    }</InfoItem>
                    <InfoItem id="height">{
                        exifMap.get('IFD0:ImageHeight') ||
                        (photo.sizes && photo.sizes.Original && photo.sizes.Original.height)
                    }</InfoItem>
                    <InfoItem id="rotation">{
                        exifMap.get('IFD0:Orientation') &&
                        exifMap.get('IFD0:Orientation')!.match(/(\d+)/) &&
                        (exifMap.get('IFD0:Orientation')!.endsWith('CCW') ? '-' : '') +
                            exifMap.get('IFD0:Orientation')!.match(/(\d+)/)![1] + 'º'
                    }</InfoItem>
                    <InfoItem id="exposureMode">{ exifMap.get('ExifIFD:ExposureMode') }</InfoItem>
                    <InfoItem id="colorSpace">{ exifMap.get('ExifIFD:ColorSpace') }</InfoItem>
                    <InfoItem id="software">{ exifMap.get('IFD0:Software') }</InfoItem>
                </div>

                <div className="mt-2">
                    { info && info.urls.url.length > 0 && (
                        <p id="enlace">
                            <a href={ info.urls.url[0]._content } target="_blank">
                                { t('gallery.photoPage.seeFlickr') }
                            </a>
                        </p>
                    ) }
                </div>
            </DefaultContainer>
        </div>
    );
};

export const ImageInfoView =  memo(
    withTranslation()(ImageInfoViewImpl),
    (a, b) => a.photo.id === b.photo.id && !a.photo.info && !b.photo.info
);

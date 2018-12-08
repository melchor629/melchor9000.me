import React from 'react';
import { withNamespaces, WithNamespaces } from 'react-i18next';
import { GalleryPhoto } from '../../redux/gallery/reducers';

interface OverlayImageInfoProps {
    show: boolean;
    photo: GalleryPhoto;
}

const OverlayImageInfo = ({ show, photo, t }: OverlayImageInfoProps & WithNamespaces) => {
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
    let geolocation = null;

    const infoHtml = (value: string | React.ReactElement<any>, id: string) => (
        <div className="lead" id={ id }>
            <strong>{ t(`gallery.overlay.${id}`) }:</strong> <span>{ value }</span>
        </div>
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
        if(info.location) {
            const l = info.location;
            geolocation = infoHtml((
                <a href={`https://www.google.es/maps/@${l.latitude},${l.longitude},15z?q=${l.latitude},${l.longitude}`}
                   target="_blank"
                   rel="noreferrer">
                    {l.locality._content}, {l.county._content} - {l.region._content} ({l.country._content})
                </a>
            ), 'geoposicion');
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
    if(!show) { imageInfoClasses.push('min-size'); }

    return (
        <div className={ imageInfoClasses.join(' ') }>
            <div className="page-header">
                <h2>{ photo.title }</h2>
                { descripcion }
            </div>

            <div className="mt-3">
                { fecha }
                { camara }
                { exposicion }
                { apertura }
                { iso }
                { distanciaFocal }
                { flash }
                { geolocation }
            </div>

            <div className="mt-2">
                { enlace }
            </div>
        </div>
    );
};

export default withNamespaces()(OverlayImageInfo);

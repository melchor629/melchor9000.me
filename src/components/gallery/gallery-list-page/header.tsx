import React, { memo } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

const Header = ({ photo, t }: { photo: string | null } & WithTranslation) => {
    return (
        <div className="gallery-header" style={{ position: 'absolute' }}>
            <div className="image-background" style={ { backgroundImage: `url(${photo || ''})` } } />
            <div>
                <h1>{ t('gallery.header.title') }</h1>
                <p className="lead">{ t('gallery.header.description') }</p>
            </div>
        </div>
    );
};

export default memo(withTranslation()(Header));

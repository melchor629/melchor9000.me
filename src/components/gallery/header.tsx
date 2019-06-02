import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

class Header extends React.Component<{ photo: string | null } & WithTranslation> {
    render() {
        const { t, photo } = this.props;
        return (
            <div className="gallery-header" style={{ position: 'absolute' }}>
                <div className="image-background" style={ { backgroundImage: `url(${photo || ''})` } } />
                <div>
                    <h1>{ t('gallery.header.title') }</h1>
                    <p className="lead">{ t('gallery.header.description') }</p>
                </div>
            </div>
        );
    }
}

export default withTranslation()(Header);

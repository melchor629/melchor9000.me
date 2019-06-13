import React from 'react';
import { Route } from 'react-router';

import { GalleryListPage } from './gallery-list-page';
import { PhotoPage } from './photo-page';
import { withDefaultContainer } from '../default-container';

import './gallery.scss';

const config = {
    userId: '142458589@N03',
    photosetId: '72157667134867210',
    perPage: 15,
};

const withConfig = (Component: any) => (props: any) => <Component {...props} {...config} />;

const GalleryListPageComponent = withDefaultContainer(withConfig(GalleryListPage as any));
const PhotoPageComponent = withConfig(PhotoPage);

export default () => (
    <>
        <Route exact={ true }
            path="/gallery/"
            component={ GalleryListPageComponent } />
        <Route path="/gallery/:id"
            component={ PhotoPageComponent } />
    </>
);

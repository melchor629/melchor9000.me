import $ from 'jquery'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'

import Header from './header'
import { PhotoItem } from './photo-item'
import { useGalleryListActions, useGalleryListState } from './redux-connector'
import LoadSpinner from '../../load-spinner'

interface GalleryListProps {
    userId: string
    photosetId: string
    perPage: number
}

export const GalleryListPage = ({ userId, photosetId }: GalleryListProps) => {
    const [ page, setPage ] = useState(0)
    const { primary, photos, totalPhotos, loadingPhotosList } = useGalleryListState()
    const { loadFirstPhotos, loadMorePhotos } = useGalleryListActions(userId, photosetId)

    useEffect(() => {
        loadFirstPhotos()
    }, []); //eslint-disable-line

    //TODO calculate this in a better way
    const perPage = window.document.body.clientWidth > 992 ? 16 : 15
    const photosLoaded = photos.length
    const morePhotosToLoad = page < Math.floor(totalPhotos / perPage) + 1
    useEffect(() => {
        if(!morePhotosToLoad) {
            return
        }

        const onScroll = () => {
            const bottom = $(document).scrollTop()! + $(window).height()!
            const sizeOfPage = document.body.scrollHeight
            if(sizeOfPage - bottom < 125 && !loadingPhotosList) {
                if(page * perPage >= photosLoaded) {
                    loadMorePhotos()
                } else {
                    setPage(page + 1)
                }
                window.removeEventListener('scroll', onScroll)
            }
        }

        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [ loadingPhotosList, photosLoaded, totalPhotos, page, perPage ]); //eslint-disable-line

    const spinnerClasses = !morePhotosToLoad ?
        [ 'd-none' ] :
        [ 'd-flex', 'justify-content-center' ]

    return (
        <div style={{ paddingTop: 300 }} className="mb-4">
            <Helmet>
                <title>Gallery</title>
                <meta name="Description"
                    content="Gallery of photos taken by melchor9000" />
            </Helmet>

            <Header photo={ primary } />

            <div className="d-flex flex-wrap gallery">
                { photos.slice(0, page * perPage).map(photo => <PhotoItem photo={ photo } key={ photo.id } />) }
            </div>

            <div className={ spinnerClasses.join(' ') }>
                <LoadSpinner />
            </div>
        </div>
    )
}

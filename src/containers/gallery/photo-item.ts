import * as React from 'react';
import { connect } from 'react-redux';
import { showDetailed } from 'src/redux/gallery/actions';
import PhotoItem from 'src/components/gallery/photo-item';

interface PhotoItemDispatchToProps {
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const mapStateToProps = () => ({

});

const mapDispatchToProps = (dispatch: any, ownProps: any): PhotoItemDispatchToProps => ({
    onClick: () => dispatch(showDetailed(ownProps.photo))
});

const ContainerPhotoItem = connect(
    mapStateToProps,
    mapDispatchToProps
)(PhotoItem);

export default ContainerPhotoItem;

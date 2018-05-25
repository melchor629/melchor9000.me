import { connect } from 'react-redux';
import { showDetailed } from '../../redux/gallery/actions';
import PhotoItem from '../../components/gallery/photo-item';
import * as React from 'react';

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

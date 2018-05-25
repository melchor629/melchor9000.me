import * as React from 'react';
import './load-spinner.css';

interface LoadSpinnerProps {
    show?: boolean;
    className?: string;
}

export default ({ show, className }: LoadSpinnerProps) => {
    if(show || show === undefined) {
        return (
            <div className={ `load-spin-container d-flex justify-content-center ${className ? className : ''}` }>
                <div className="load-spin">
                    <svg className="load-spin-inner" viewBox="25 25 50 50">
                        <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="6"
                                strokeMiterlimit="10"/>
                    </svg>
                </div>
            </div>
        );
    } else {
        return null;
    }
};

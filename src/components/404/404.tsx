import * as React from 'react';
const Parallax = require('parallax-js');

import './404.css';

export default class PageNotFound extends React.Component {
    private parallax: any;

    constructor(props: any) {
        super(props);
        this.onResize = this.onResize.bind(this);
    }

    componentDidMount() {
        this.parallax = new Parallax(document.querySelector('#scene'));
        document.body.style.backgroundColor = '#005d8f';
        window.addEventListener('resize', this.onResize, { passive: true });
    }

    componentWillUnmount() {
        this.parallax.destroy();
        document.body.style.backgroundColor = null;
        window.removeEventListener('resize', this.onResize);
    }

    render() {
        const width = document.body.clientWidth;
        const height = document.body.clientHeight - 130;
        return (
            <div id="scene" className="d-flex align-items-center" style={{ height }}>
                <div className="layer" data-depth="0.3">
                    <h3 className="subtitle" style={{ top: Math.max(height / 2 - width * 0.8 / 3, -20) }}>
                        Mira si te has equvocado al poner la URL...
                    </h3>
                </div>
                <div className="layer" data-depth="0.5">
                    <img width="100%"
                         style={{ position: 'absolute', top: height / 2 - width * 0.8 / 4 }}
                         src={`${process.env.PUBLIC_URL}/img/404.png`} />
                </div>
                <div className="layer" data-depth="0.8">
                    <h1 className="title" style={{ top: height / 2 }}>Uooo, esta página no existe</h1>
                </div>
            </div>
        );
    }

    private onResize() {
        this.forceUpdate();
    }
}
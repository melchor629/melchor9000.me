import * as React from 'react';

export const DefaultContainer = (props: React.HTMLProps<HTMLDivElement>) => (
    <div className="container default-container">
        { props.children }
    </div>
);

export const withDefaultContainer = (Element: React.ComponentType) => (
    (props: any) => <DefaultContainer><Element {...props} /></DefaultContainer>
);

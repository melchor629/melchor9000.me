import React from 'react'

export const DefaultContainer = ({ children }: React.HTMLProps<HTMLDivElement>) => (
  <div className="container default-container">
    {children}
  </div>
)

export const withDefaultContainer = (Element: React.ComponentType) => (
  (props: any) => <DefaultContainer>{React.createElement(Element, props)}</DefaultContainer>
)

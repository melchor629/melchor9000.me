import React from 'react'

export const DefaultContainer = ({ children }: React.HTMLProps<HTMLDivElement>) => (
  <div className="container default-container">
    {children}
  </div>
)

export function withDefaultContainer<P>(Element: React.ComponentType<P>) {
  return (props: any) => <DefaultContainer>{React.createElement(Element, props)}</DefaultContainer>
}

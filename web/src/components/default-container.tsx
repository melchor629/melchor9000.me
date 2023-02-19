import React from 'react'

export const DefaultContainer = ({ children }: React.HTMLProps<HTMLDivElement>) => (
  <div className="container default-container">
    {children}
  </div>
)

export function withDefaultContainer<P extends {} = {}>(Element: React.FC<P>) {
  const WithDefaultContainer = (props: P) => (
    <DefaultContainer>{React.createElement(Element, props)}</DefaultContainer>
  )
  return WithDefaultContainer
}

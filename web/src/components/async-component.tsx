import React, { Component } from 'react'
import LoadSpinner from './load-spinner'

// https://serverless-stack.com/chapters/code-splitting-in-create-react-app.html
export default function asyncComponent(importComponent: () => any) {
  class AsyncComponent extends Component<any, { component: React.ComponentType | any | null }> {
    constructor(props: any) {
      super(props)

      this.state = { component: null }
    }

    async componentDidMount() {
      const { default: component, Component: comp } = await importComponent()

      this.setState({ component: comp || component })
    }

    render() {
      const { component } = this.state
      return component
        ? React.createElement(component, this.props)
        : <div className="d-flex justify-content-center mt-4"><LoadSpinner /></div>
    }
  }

  return AsyncComponent
}

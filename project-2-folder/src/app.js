import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

import Header from './common/Header'

class App extends React.Component {
  render() {
    return (
      <Header />
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
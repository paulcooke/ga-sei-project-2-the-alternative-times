import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

import Header from './common/Header'
import DisplayRealNews from './components/DisplayRealNews'

class App extends React.Component {
  render() {
    return (
      <>
        <Header />
        <DisplayRealNews />
      </>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
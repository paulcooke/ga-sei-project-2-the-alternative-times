import React from 'react'
import ReactDOM from 'react-dom'

import './style.scss'

import Header from './common/Header'
import DisplayNews from './components/DisplayNews'


class App extends React.Component {
  render() {
    return (
      <>
        <Header />
        <DisplayNews />
      </>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
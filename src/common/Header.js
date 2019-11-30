import React from 'react'
import moment from 'moment'

const today = moment().format('dddd, MMMM Do')

const Header = () => (
  <>
    <h1>The Alternative Times</h1>
    <div className="dateBar">
      <p>Volume: MMXIX</p>
      <p>{today}</p>
      <p>£2.50</p>
    </div>
  </>
)

export default Header
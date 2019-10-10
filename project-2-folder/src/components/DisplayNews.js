import React from 'react'
import axios from 'axios'

class DisplayNews extends React.Component {
  constructor() {
    super()

    this.state = {
      articles: null,
      shuffleIndex: 0,
      error: ''
    }
    this.handleShuffle = this.handleShuffle.bind(this)
  }

  componentDidMount() {
    this.getStory()
  }

  getStory() {
    const newsKey = process.env.NEWSAPI_ACCESS_KEY
    axios.get(`https://newsapi.org//v2/top-headlines?country=gb&apiKey=${newsKey}`)
      .then(res => this.setState({ articles: res.data.articles }))
      .catch(err => this.setState({ error: err.message }))
  }

  handleShuffle() {
    this.setState({ shuffleIndex: Math.floor(Math.random() * this.state.articles.length) })
  }

  render() {
    const { articles, shuffleIndex } = this.state
    console.log(this.state)
    return (
      <article>
        <button onClick={this.handleShuffle}>Shuffle</button>
        {!articles && !this.error && <h1>Loading...</h1>}
        {articles &&
          <>
            <h2>{articles[shuffleIndex].title}</h2>
            <div>
              <div>{articles[shuffleIndex].description}</div>
              <img src={articles[shuffleIndex].urlToImage} alt="Image not available"/>
            </div>
          </>
        }

      </article>
    )
  }
}

export default DisplayNews
import React from 'react'
import axios from 'axios'

class DisplayNews extends React.Component {
  constructor() {
    super()

    this.state = {
      articles: null,
      shuffleIndex: 0,
      error: '',
      fakeHeadline: ''
    }
    this.handleShuffle = this.handleShuffle.bind(this)
    this.handleFake = this.handleFake.bind(this)
  }

  componentDidMount() {
    this.getStory()
  }

  getStory() {
    const newsKey = process.env.NEWSAPI_ACCESS_KEY
    axios.get(`https://newsapi.org//v2/top-headlines?country=gb&apiKey=${newsKey}`)
      .then(res => this.setState({ articles: res.data.articles, fakeHeadline: res.data.articles[0].title })) // has [0] to match the shuffle index start
      .catch(err => this.setState({ error: err.message }))
  }

  handleShuffle() {
    const shuffleValue = Math.floor(Math.random() * this.state.articles.length)
    this.setState({ shuffleIndex: shuffleValue, fakeHeadline: this.state.articles[shuffleValue].title })
  }

  handleFake() {
    const wordsKey = process.env.WORDSAPI_ACCESS_KEY
    const originalHeadline = this.state.fakeHeadline
    const fakeHeadline = originalHeadline.split(' ')
    console.log(fakeHeadline)
    fakeHeadline.map(word => (
      axios.get(`https://wordsapiv1.p.rapidapi.com/words/${word}`, {
        headers: { 
          'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
          'x-rapidapi-key': wordsKey
        } })
        .then(res => console.log(res.data.results[0].definition))
    ))
      
    console.log('faked', fakeHeadline)
  }


    

  render() {
    const { articles, shuffleIndex } = this.state
    console.log(this.state)
    return (
      <>
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
        <article>
          <button onClick={this.handleFake}>change news</button>
          <h2>placehoilder</h2>
        </article>
      </>
    )
  }
}

export default DisplayNews
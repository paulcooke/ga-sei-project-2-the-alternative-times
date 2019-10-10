import React from 'react'
import axios from 'axios'

class DisplayNews extends React.Component {
  constructor() {
    super()

    this.state = {
      articles: null,
      shuffleIndex: 0,
      error: '',
      originalHeadline: '',
      fakeHeadlineObject: {},
      fakeHeadlineArray: []
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
      .then(res => this.setState({ articles: res.data.articles, originalHeadline: res.data.articles[0].title })) // has [0] to match the shuffle index start
      .catch(err => this.setState({ error: err.message }))
  }

  handleShuffle() {
    const shuffleValue = Math.floor(Math.random() * this.state.articles.length)
    this.setState({ shuffleIndex: shuffleValue, originalHeadline: this.state.articles[shuffleValue].title })
  }

  // handleFake maps the split normal headline and makes a new object in state. we'll then use that new object to get the words for the new headline
  
  
  handleFake() {
    
    
    const originalHeadline = this.state.originalHeadline
    const fakeHeadline = originalHeadline.toLowerCase().split(/[. ,:;\-_']+/)
    console.log(fakeHeadline)
    const wordsKey = process.env.WORDSAPI_ACCESS_KEY
    
    return Promise.all(fakeHeadline.map(word => {
      return axios.get(`https://wordsapiv1.p.rapidapi.com/words/${word}`, {
        headers: { 
          'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
          'x-rapidapi-key': wordsKey
        } })
    }))
      .then(res => this.setState({ fakeHeadlineArray: res }))
      .catch(err => console.log(err))
  }
  
  
  

/* 
  
  handleFake() { 
    let fakeHeadlineObject = { ...this.state.fakeHeadlineObject }
    
    const originalHeadline = this.state.originalHeadline
    originalHeadline.toLowerCase().split(/[. ,!:;-_']/).forEach(word => (
      fakeHeadlineObject[word] = this.getTheWords(word)
    ))
    
    // console.log(fakeHeadlineObject)
    // fakeHeadlineObject = { ...this.state.fakeHeadlineObject }
    this.setState({ fakeHeadlineObject })
    // console.log('what about the faked array?', fakeHeadlineArray)
    // console.log('faked', fakeHeadlineObject)
  }

  getTheWords(word) {
    const wordsKey = process.env.WORDSAPI_ACCESS_KEY
    return axios.get(`https://wordsapiv1.p.rapidapi.com/words/${word}`, {
      headers: { 
        'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
        'x-rapidapi-key': wordsKey
      } })
      // .then((res) => console.log('here\'s the data', word, res.data.results[0].typeOf[0]))
      .then((res) => (res.data.results[0]))   
      .catch(() => 'not found')
  }
     */

  render() {
    const { articles, shuffleIndex } = this.state
    console.log('checking state', this.state)
    return (
      <>
        <article>
          <button onClick={this.handleShuffle}>Shuffle</button>
          {!articles && !this.error && <h1>Loading...</h1>}
          {articles &&
            <>
              <h2>{articles[shuffleIndex].title}</h2>
              <div className="article-wrapper">
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
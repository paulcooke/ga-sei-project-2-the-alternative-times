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
    const wordsKey = process.env.WORDSAPI_ACCESS_KEY
    
    const originalHeadline = this.state.originalHeadline
    const fakeHeadline = originalHeadline.toLowerCase().split(/[. ,:;\-_']+/)
      
    const fakeHeadlineObject = {}

    Promise.all(fakeHeadline.map(word => {
      if (word.length > 5) {
        axios.get(`https://wordsapiv1.p.rapidapi.com/words/${word}`, {
          headers: { 
            'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
            'x-rapidapi-key': wordsKey
          } })
          .then(res => fakeHeadlineObject[word] = res.data)
      } else {
        return word
      }
    }))
      .then(() => this.setState({ fakeHeadlineObject }))
      .catch(err => console.log(err))
    console.log('checking the object', fakeHeadlineObject)
  }
  
  // makeFakeHeadline(choice) {
  //   const tempArr = []
  //   for (let word in this.state.fakeHeadlineObject) {
  //     const firstRoll = Math.floor(Math.random() * word.results.length)
  //     const secondRoll = Math.floor(Math.random() * word.results[firstRoll][choice].length)
  //     if (word.results[firstRoll][choice]) {
  //       tempArr.push(word.results[firstRoll][choice][secondRoll])
  //     }         
  //   }
  //   console.log('temp arr',tempArr)
  // }  

  render() {
    const { articles, shuffleIndex } = this.state
    console.log('checking state', this.state/* , this.makeFakeHeadline('synonyms') */)
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
          <button onClick={this.handleFake} value="synonyms">change news</button>
          <h2>placehoilder</h2>
        </article>
      </>
    )
  }
}

export default DisplayNews
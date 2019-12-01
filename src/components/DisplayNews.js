import React from 'react'
import axios from 'axios'

class DisplayNews extends React.Component {
  constructor() {
    super()

    this.state = {
      articles: null,
      shuffleIndex: 0,
      error: '',
      originalHeadline: [],
      fakeHeadlineObject: {},
      fakeHeadline: ''
    }

    this.handleShuffle = this.handleShuffle.bind(this)
    this.handleFake = this.handleFake.bind(this)
    this.makeFakeHeadLine = this.makeFakeHeadLine.bind(this)
  }

  componentDidMount() {
    this.getStory()
  }

  getStory() {
    const newsKey = process.env.NEWSAPI_ACCESS_KEY
    axios.get(`https://newsapi.org//v2/top-headlines?country=gb&apiKey=${newsKey}`)
      .then(res => this.setState({ articles: res.data.articles, originalHeadline: res.data.articles[0].title.toLowerCase().split(/[. ,:;\-_']+/) })) // has [0] to match the shuffle index start
      .catch(err => this.setState({ error: err.message }))
  }

  handleShuffle() {
    const shuffleValue = Math.floor(Math.random() * this.state.articles.length)
    this.setState({ shuffleIndex: shuffleValue, originalHeadline: this.state.articles[shuffleValue].title.toLowerCase().split(/[. ,:;\-_']+/) })
  }

  // handleFake maps the split normal headline and makes a new object in state. we'll then use that new object to get the words for the new headline
  handleFake() {
    const wordsKey = process.env.WORDSAPI_ACCESS_KEY
    
    const originalHeadline = this.state.originalHeadline
    // const fakeHeadline = originalHeadline.toLowerCase().split(/[. ,:;\-_']+/)
      
    const fakeHeadlineObject = {}

    Promise.all(this.state.originalHeadline.map(word => {
      if (word.length < 3) {
        fakeHeadlineObject[word] = word
      } else {
        axios.get(`https://wordsapiv1.p.rapidapi.com/words/${word}`, {
          headers: { 
            'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
            'x-rapidapi-key': wordsKey
          } })
          .then(res => fakeHeadlineObject[word] = res.data)
          .catch(() => fakeHeadlineObject[word] = word)
      } 
    }))
      .then(() => this.setState({ fakeHeadlineObject }))
      .catch(err => console.log(err))
    this.setState({ fakeHeadline: 'YOUR FAKE NEWS WILL APPEAR HERE' })
  }

  makeFakeHeadLine({ target: { value } }) {
    
    const fakeHeadline = this.state.originalHeadline.map(word => {
      
      if (typeof this.state.fakeHeadlineObject[word] === 'string') {
        // console.log('string:',word)
        return word
      } else if (typeof this.state.fakeHeadlineObject[word] === 'undefined') {
        // console.log('undefined:',word)
        return word
      } else {
        return this.state.fakeHeadlineObject[word].results[0][value] ? this.state.fakeHeadlineObject[word].results[0][value][0] : word
      }
    })

    // console.log('fake headline array',fakeHeadline)

    this.setState({ fakeHeadline: fakeHeadline.join(' ').toUpperCase() })

  }


  render() {
    const { articles, shuffleIndex, fakeHeadline } = this.state
    console.log('checking state', this.state)
    return (
      <>
        <article>
          <div className="button-div">
            <button onClick={this.handleShuffle}>Shuffle News</button>
          </div>
          {!articles && !this.error && <h1>Loading...</h1>}
          {articles &&
            <>
              <h2>{articles[shuffleIndex].title.toUpperCase()}</h2>
              <div className="article-wrapper">
                <div>{articles[shuffleIndex].content}</div>
                <img src={articles[shuffleIndex].urlToImage} alt="Image not available"/>
              </div>
            </>
          }
        </article>
        <div>
          <div className="button-div">
            <button onClick={this.handleFake}>Randomise</button>
          </div>
          <div className="button-wrapper">
            <button onClick={this.makeFakeHeadLine} value="synonyms">Altered News</button>
            <button onClick={this.makeFakeHeadLine} value="typeOf">Edited News</button>
            <button onClick={this.makeFakeHeadLine} value="similarTo">Revised News</button>
          </div>
          <h2>{fakeHeadline}</h2>
        </div>
      </>
    )
  }
}

export default DisplayNews
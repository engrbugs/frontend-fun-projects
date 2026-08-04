import React, { Component } from 'react';
import $ from 'jquery';
import 'animate.css/animate.css';

import logo from './wheel.svg';
import './App.css';

const QUOTES = 'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json'
const tweetURL = 'https://twitter.com/intent/tweet?hashtags=quotes&hashtags=freecodecamp&text='
const COLOR = [ '#ee5253', '#ff9f43', '#c8d6e5', '#576574', '#ff6b6b', '#8395a7', '#feca57', 
                '#48dbfb', '#10ac84', '#01a3a4', '#2e86de', '#54a0ff', '#7f8c8d', '#e67e22',
                '#2ecc71', '#16a085', '#2c3e50', '#f1c40f', '#8e44ad', '#6c5ce7', '#2d3436',
                '#0984e3', '#fab1a0', '#ffeaa7', '#00b894', '#e84393', '#40739e', '#c23616']


class App extends Component {
  state = {
    quotes: [],
    index: 0,
    color: "#282c34",
    animationEnter: 'bounceIn',
    animationLeave: 'bounceOut',
    durationEnter: 1000,
    durationLeave: 1000,
  }

  componentDidMount() {
    fetch(QUOTES).then(res => res.json())
    .then(res => {
      this.setState({
        quotes: res.quotes
      }, this.RandomizeIndex);
    })
  }
  
  RandomizeIndex = () => {
    const { quotes } = this.state;
    if (quotes.length > 0) {
      let ci = Math.floor(Math.random() * COLOR.length);
      let index = Math.floor(Math.random() * quotes.length);
      this.setState({
        index: index,
        color: COLOR[ci]
      });
      $("#text").addClass('animate__animated animate__zoomIn');
    }
  }

  onAnimationEnd = () => {
    $("#text").removeClass('animate__animated animate__zoomIn');
  };

  render (){
    const { quotes, index, color } = this.state;
    let quote = quotes[index];
    return (
      <div className="App">
        <header className="App-header">
          <p>
            <img src={logo} className="App-logo" alt="logo" />    
            FCC: Random Quote Machine
          </p>
        </header>

        <div id="quote-box" className="wrapper"
        style={{ background: color }}>

          <div className="col-6 box p-5 rounded"
          onChange={this.handleChange}>
            { quote && (
              <div id="text" className="mb-4" onAnimationEnd={this.onAnimationEnd}>
                <cite><p>{quote.quote}</p></cite>
                <p id="author" className="d-block text-right">—{quote.author}</p>
              </div>
            )}
            <div className="d-flex justify-content-between">
              <a id="tweet-quote" className="btn btn-primary"
              href={quote&&`${tweetURL}"${quote.quote}"—${quote.author} `} 
              target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i> Tweet</a>
              <button id="new-quote" className="btn btn-primary" 
              onClick={this.RandomizeIndex}
              >New Quote</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

$(document).ready(function () {
  $('.App-logo').css({
    'transform' : 'rotate(9373deg)',
  });
  setTimeout(() => {
    $('.App-logo').css({
    'animation' : 'App-logo-spin infinite 10s linear' 		
    });
  }, 5500);
});

export default App;

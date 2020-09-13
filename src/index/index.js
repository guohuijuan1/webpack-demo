'use strict'
import hello from './hello'
import './hello.less'
import React, { Component } from 'react'
import ghjImg from '../img/ghj2-s.jpg'
import ReactDOM from 'react-dom'

// function component() {
//   const element = document.createElement('div');
//   element.innerHTML = hello();
//   return element;
// }

// document.body.appendChild(component());

class Hello extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      Text: null,
    }
  }
  loadComponent () {
    import('./text').then((Text) => {
      this.setState({
        Text: Text.default,
      })
    })
  }
  a = () => {
    
  }
  render(){
    const { Text } = this.state;
    return (
      <div className="hello-div">
        <figure>
          <figcaption onClick={this.loadComponent.bind(this)}>{hello()}</figcaption>
          <img style={{ width: 200}} src={ghjImg} />
          {
            Text ? <Text /> : null
          }
        </figure>
      </div>
    )
  }
}

ReactDOM.render(<Hello/>, document.getElementById('root'))
import hello from './hello'
import './hello.less'
import React, { Component } from 'react'
import ghjImg from './img/ghj2-s.jpg'
import ReactDOM from 'react-dom'

// function component() {
//   const element = document.createElement('div');
//   element.innerHTML = hello();
//   return element;
// }

// document.body.appendChild(component());

class Hello extends Component {
  render(){
    return (
      <div className="hello-div">
        <figure>
          <figcaption>{hello()}</figcaption>
          <img style={{ width: 200}} src={ghjImg} />
        </figure>
      </div>
    )
  }
}

ReactDOM.render(<Hello/>, document.getElementById('root'))
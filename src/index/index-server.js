'use strict'
const React = require('react');
const ghjImg = require('../img/ghj2-s.jpg').default;
require('./hello.less')

class Hello extends React.Component {
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
          <figcaption onClick={this.loadComponent.bind(this)}>{'ghj'}</figcaption>
          <img style={{ width: 200}} src={ghjImg} />
          {
            Text ? <Text /> : null
          }
        </figure>
      </div>
    )
  }
}

module.exports = <Hello />;
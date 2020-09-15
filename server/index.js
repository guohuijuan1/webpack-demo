if (typeof window === 'undefined') {
  global.window = {};
}

const fs = require('fs')
const path = require('path')
const express = require('express');
const { renderToString } = require('react-dom/server')

const SSR = require('../dist/index-server')
const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8')
console.log(template)
const server = (port) => {
  const app = express();
  app.use(express.static('dist'));
  app.get('/index', (req, res) => {
    const html = renderMarkup(renderToString(SSR));
    console.log(html)
    res.status(200).send(html)
  })
  app.listen(port, () => {
    console.log(`Server is Running on localhost:${port}`)
  })
}

server(process.env.PORT || 3000)

const renderMarkup = (str) => {
  return template.replace('<!--HTML_SSR-->', str)
}
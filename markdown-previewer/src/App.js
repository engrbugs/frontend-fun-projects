import React from 'react';
import './App.css';
import marked from 'marked';
import 'bootstrap/dist/css/bootstrap.min.css';

const initialMarkdown =
`# Welcome to my React Markdown Previewer!
## by ENGRBUGS

## This is a sub-heading...
### And here's some other cool stuff:
  
Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`
  
You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.com), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | ------------- 
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want! 
1. But the list goes on...
- Even if you use dashes or asterisks.
* And last but not least, let's not forget embedded images:

![freeCodeCamp](https://upload.wikimedia.org/wikipedia/commons/3/39/FreeCodeCamp_logo.png)
`


class App extends React.Component {
  state = {
    text: initialMarkdown
  }

  handleChange = (e) => {
    this.setState({
      text: e.target.value
    })
  }

  clearInput = () => {
    this.setState({
      text: ''
    })
  }
  render() {
    let { text } = this.state;
    let markdown = marked(text, { breaks: true });
    return (
      <div className="App container-fluid h-100">
        <div className="App-header row">
          <h1>Markdown Editor</h1>
        </div>
      <div className="main row">
        <div className="col pr-2">
          <div className="row" style={{ height: "40px" }}>
            <h5 className="ml-3" style={{ marginTop: "12px" }}>Input</h5>
            <button className="btn btn-clear btn-outline-info btn-sm"
              onClick={this.clearInput}>Clear</button>
          </div>
          <textarea id="editor" spellCheck="false" 
            className="form-control" value={text} 
            onChange={this.handleChange} />
        </div>
        <div className="col pl-2">
          <div className="row" style={{ height: "40px" }}>
            <h5 className="ml-3" style={{ marginTop: "12px" }}>Markdown</h5>
          </div>
          <div id="preview" className="preview rounded" 
            dangerouslySetInnerHTML={{__html: markdown}} contenteditable>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

export default App;

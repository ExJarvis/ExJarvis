import Input from 'antd/lib/input/Input'
import React from 'react'
import { render } from 'react-dom'
import { createUseStyles } from 'react-jss'


const mainElement = document.createElement('div')
mainElement.setAttribute('id', 'root')
document.body.appendChild(mainElement)

const useStyles = createUseStyles((theme) => ({
  root: {
    height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center'
  }
}));

interface AppProps {
}

const App: React.FC<AppProps> = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Input placeholder="Chaakar Searchs" style={{
        margin: 'auto'
      }}/>
    </div>
  )
}

render(<App />, mainElement)

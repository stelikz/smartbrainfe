import React from 'react';
import Navigation from './Components/Navigation/Navigation'
import Logo from './Components/Logo/Logo'
import ImageForm from './Components/ImageForm/ImageForm'
import Rank from './Components/Rank/Rank'
import FaceRecog from './Components/FaceRecog/FaceRecog'
import SignIn from './Components/SignIn/SignIn'
import Register from './Components/Register/Register'
import Particles from 'react-particles-js'
import './App.css';



const particleOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
    input: "",
    imgUrl: "",
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
    }
}

class App extends React.Component {
  constructor(){
    super()
    this.state = initialState
  }

loadUser = (data) =>{
  this.setState({
    user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }
  })
}

calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
  const image = document.getElementById('inputImage')
  const width = Number(image.width)
  const height = Number(image.height)

  const leftCol = width * clarifaiFace.left_col
  const rightCol = width - (width * clarifaiFace.left_col)
  const topRow = height * clarifaiFace.top_row
  const bottomRow =  height - (height * clarifaiFace.top_row)
  return {
    leftCol: leftCol,
    width: rightCol-leftCol+"px",
    topRow: topRow,
    height: bottomRow-topRow+"px"
  }
}

displayFaceBox = (box) => {
  this.setState({box})
}

  onInputChange = (event) => {
    this.setState({
      input: event.target.value
    })
  }

  onButtonSubmit = () => {
    this.setState({imgUrl: this.state.input})
    fetch('http://localhost:3000/imageurl', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            input: this.state.input
          })
      })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('http://localhost:3000/image', {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  render() {
    return (
      <div className="App">
        <Particles params={particleOptions} className="particles"/>
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        {this.state.route==='home' 
          ? <div>
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
          <ImageForm 
            onInputChange={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecog 
            box={this.state.box} 
            imgUrl={this.state.imgUrl}/>
          </div>
         : (this.state.route === 'signin' ?
           <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
           : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
         )
         
        }
      </div>
    );
  }
}

export default App;

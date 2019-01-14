import React, { Component } from 'react';
import {Router, navigate} from '@reach/router'
import firebase from './Firebase';

import Home from './Home';
import Welcome from './Welcome';
import Navigation from './Navigation';
import Login from './Login';
import Settings from './Settings';
import Meals from './Meals';
import Register from './Register';

class App extends Component {
  state={
    user: null,
    displayName: null,
    userID: null
  }
  componentDidMount(){
    firebase.auth().onAuthStateChanged(FBUser =>{
      if(FBUser){
        this.setState({
          user: FBUser,
          displayName: FBUser.displayName,
          userID: FBUser.uid          
        })

        const mealsRef = firebase
          .database()
          .ref('meals/'+FBUser.uid);

        mealsRef.on('value', snapshot => {
          let meals = snapshot.val();
          let mealsList = []

          for(let item in meals) {
            mealsList.push({
              mealID: item,
              mealName: meals[item].mealName
            })
          }

          this.setState({
            meals: mealsList,
            howManyMeals: mealsList.length
          })
        })
      } else {
        this.setState({user: null})
      }
    })
  }
  registerUser=(userName)=>{
    firebase.auth().onAuthStateChanged(FBUser => {
      FBUser.updateProfile({
        displayName: userName
      })
      .then(()=>{
        this.setState({
          user: FBUser,
          displayName: FBUser.displayName,
          userID: FBUser.uid
        })
        navigate('/meals')
      })
    })
  } 
  logOutUser=(e)=>{
    e.preventDefault();
    this.setState({
      user: null,
      displayName: null,
      userID:  null,
    })
    firebase.auth().signOut().then(()=>{
      navigate('/')
    })
  }   
  addMeal = mealName =>{
    const ref = firebase
      .database()
      .ref(`meals/${this.state.user.uid}`);
      ref.push({mealName: mealName})
  }

  render() {
    return (
      <div>
        <Navigation 
          user={this.state.user}
          logOutUser={this.logOutUser}
        />          
        {this.state.user && 
          <Welcome 
            userName={this.state.displayName}
            logOutUser={this.logOutUser}
        />}     
        <Router>
          <Home path="/" user={this.state.user}/>
          <Login path="/login" />
          <Settings path="/settings" />
          <Meals path="/meals" 
            addMeal={this.addMeal}
            meals={this.state.meals}
            userID={this.state.userID}
          />
          <Register path="/register" registerUser={this.registerUser}/>
        </Router>                 
      </div>
    );
  }
}

export default App;

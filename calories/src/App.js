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
import Manage from './Manage'

class App extends Component {
  state={
    user: null,
    displayName: null,
    userID: null,
    users: [],
    manager: false
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged(FBUser =>{
      if(FBUser){
        this.setState({
          user: FBUser,
          displayName: FBUser.displayName,
          userID: FBUser.uid,
          manager: (FBUser.email==='daseif7@gmail.com' || FBUser.email==='xrao@163.com')          
        })

        this.generateMeals(FBUser.uid)

        const userRef = firebase.database().ref('users')
        userRef.on('value', snapshot => {
          let users = snapshot.val();
          let userList = []
          for(let user in users){
            userList.push({
              userName: users[user].userName,
              userEmail: users[user].userEmail,
              userID: user,
              manager: users[user].manager,
            })
          }

          this.setState({
            users: userList,
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
        const ref = firebase.database().ref(`users/${FBUser.uid}`)
        ref.set({
          userName: userName,
          userEmail: FBUser.email,
          manager: false,
        })
        this.setState({
          user: FBUser,
          displayName: FBUser.displayName,
          userID: FBUser.uid
        })
        if(FBUser.email==='daseif7@gmail.com' || FBUser.email==='xrao@163.com'){
          navigate('/manage')
        }else{
          navigate('/meals')
        }
      })
    })
  } 

  generateMeals=(whichUser)=>{
      const mealsRef = firebase
      .database()
      .ref('users/'+whichUser+'/meals');

    mealsRef.on('value', snapshot => {
      let meals = snapshot.val();
      let mealsList = []

      for(let item in meals) {
        mealsList.push({
          mealID: item,
          mealInfo: meals[item].mealInfo,
        })
      }

      this.setState({
        meals: mealsList,
      })
    })
  }

  logOutUser=(e)=>{
    e.preventDefault();
    this.setState({
      user: null,
      displayName: null,
      userID:  null,
      users: [],
      meals: [],
    })
    firebase.auth().signOut().then(()=>{
      navigate('/')
    })
  }   

  render() {
    return (
      <div>
        <Navigation 
          user={this.state.user}
          logOutUser={this.logOutUser}
          manager={this.state.manager}
        />          
        {this.state.user && 
          <Welcome 
            userName={this.state.displayName}
        />}     
        <Router>
          <Home path="/" 
            user={this.state.user}
            manager={this.state.manager}
          />
          <Login path="/login" />
          <Manage path="/manage" 
            users={this.state.users}
            currentUserID={this.state.userID}
            generateMeals={this.generateMeals}
            />
          <Settings path="/settings" />
          <Meals path="/meals/:userID" 
            meals={this.state.meals}
            users={this.state.users}
          />
          <Register path="/register" registerUser={this.registerUser}/>
        </Router>                 
      </div>
    );
  }
}

export default App;

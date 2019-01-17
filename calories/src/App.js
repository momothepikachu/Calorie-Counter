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
              userPassword: users[user].userPassword,
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

  registerUser=(registrationInfo)=>{
    const FBUser = firebase.auth().currentUser;
    FBUser.updateProfile({
      displayName: registrationInfo.displayName
    })
      .then(()=>{
        console.log('profile upgradede?')
        const ref = firebase.database().ref(`users/${FBUser.uid}`)
        ref.set({
          userName: registrationInfo.displayName,
          userEmail: FBUser.email,
          userPassword: registrationInfo.password,
          manager: false,
        })
        this.setState({
          user: FBUser,
          displayName: registrationInfo.displayName,
          userID: FBUser.uid
        })
        if(FBUser.email==='daseif7@gmail.com' || FBUser.email==='xrao@163.com'){
          navigate('/manage')
        }else{
          navigate('/meals/'+FBUser.uid)
        }
      })
      .catch(()=>{
        console.log('fail to upgrade')
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
      manager:false,
    })
    firebase.auth().signOut().then(()=>{
      navigate('/')
      console.log('log out properly')
    }).catch(()=>{
      console.log('fail to log out')
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
            logOutUser={this.logOutUser}
        />}     
        <Router>
          <Home path="/" 
            user={this.state.user}
            manager={this.state.manager}
          />
          <Login path="/login" />
          <Manage path="/manage" 
            users={this.state.users}
            currentUser={this.state.user}
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

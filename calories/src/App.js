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
    manager: false,
    startDate: '', 
    endDate: '', 
    startTime: '', 
    endTime: '',
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
        const {startDate, endDate, startTime, endTime} = this.state
        this.generateMeals(FBUser.uid, startDate, endDate, startTime, endTime)

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
              userBudget: users[user].userBudget,
            })
          }

          this.setState({
            users: userList,
            userBudget: users[FBUser.uid].userBudget,
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
          userBudget: 1500,
          userName: registrationInfo.displayName,
          userEmail: FBUser.email,
          userPassword: registrationInfo.password,
          manager: false,
        })
        this.setState({
          user: FBUser,
          displayName: registrationInfo.displayName,
          userID: FBUser.uid,
          userBudget: 1500,
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

  generateMeals=(whichUser, startDate, endDate, startTime, endTime)=>{
    this.setState({startDate, endDate, startTime, endTime}, ()=>{
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
      mealsList = mealsList.sort((b,a)=>{
        if(a.mealInfo.mealDate===b.mealInfo.mealDate){
          return +a.mealInfo.mealTime.split(':').join('') - +b.mealInfo.mealTime.split(':').join('')
        } else {
          return +a.mealInfo.mealDate.split('-').join('') - +b.mealInfo.mealDate.split('-').join('')
        }
      })

      const greenDays = {}
      mealsList.forEach(i=>{
        const mealDate=i.mealInfo.mealDate
        if(greenDays[mealDate]){
          greenDays[mealDate]+= +i.mealInfo.mealCal
        }else{
          greenDays[mealDate] = +i.mealInfo.mealCal
        }
      })
      let {startDate, endDate, startTime, endTime} = this.state
      startDate= +startDate.split('-').join('')
      endDate= +endDate.split('-').join('')
      startTime = +startTime.split(':').join('')
      endTime = +endTime.split(':').join('')    
      let arr=mealsList.slice()
      if(startDate){
        arr = arr.filter(i=>{
          const date = +i.mealInfo.mealDate.split('-').join('')
          return date<=endDate && date>=startDate
        })
      }
      if(startTime){
        arr = arr.filter(i=>{
          const time = +i.mealInfo.mealTime.split(':').join('')
          return time<=endTime && time>=startTime
        })      
      }

      this.setState({
        meals: mealsList,
        greenDays: greenDays,
        filteredMeals: arr,     
      })
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
      filteredMeals:null,
      greenDays: {},
      userBudget: 0,
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
          <Settings path="/settings/:userID"
          />
          <Meals path="/meals/:userID" 
            meals={this.state.filteredMeals}
            users={this.state.users}
            generateMeals={this.generateMeals}
            greenDays={this.state.greenDays}
            userBudget={this.state.userBudget}
          />
          <Register path="/register" registerUser={this.registerUser}/>
        </Router>                 
      </div>
    );
  }
}

export default App;

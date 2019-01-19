import React, {Component} from 'react';
import firebase from './Firebase';

import MealsList from './MealsList'
import { FaCalendarAlt, FaRegClock, FaUtensils } from "react-icons/fa";


class Meals extends Component {
  state={
    startDate:'',
    endDate:'',
    startTime:'',
    endTime:'',
    mealInfo:{
      mealName: '',
      mealCal:'',
      mealDate: '',
      mealTime: '',
    }
  }
  handleChange= (e) =>{
    const itemName = e.target.name;
    const itemValue = e.target.value;
    this.setState(prevState=>({
      mealInfo:{
          ...prevState.mealInfo,
          [itemName]: itemValue
      }
    }))
  }

  handleFilterChange = (e) =>{
    const itemName = e.target.name;
    const itemValue = e.target.value;
    this.setState({[itemName]: itemValue})
  }

  handleSubmit=(e)=>{
    e.preventDefault();
    const ref = firebase
      .database()
      .ref(`users/${this.props.userID}/meals`);
      ref.push({mealInfo: this.state.mealInfo})

    this.setState({mealInfo:{
      mealName: '',
      mealCal:'',
      mealDate: '',
      mealTime: '',
    }}); //empty the input box
  }

  submitFilters=(e)=>{
    e.preventDefault();
    const {startDate, endDate, startTime, endTime} = this.state
    this.props.generateMeals(this.props.userID, startDate, endDate, startTime, endTime)
  }

  render(){
    const mealsOwner=this.props.users.filter(i=>i.userID===this.props.userID)
    return(
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <h2 className="font-weight-light">{mealsOwner.length && mealsOwner[0].userName}'s Meals</h2>
            <div className="card bg-light">
              <div className="card-body text-center p-3">
                <form
                  onSubmit={this.handleSubmit}
                >
                  <div className="form-row">
                    <div className="col-sm-8 input-group">
                      <input 
                        className="form-control" 
                        type="text" 
                        placeholder="Meal name" 
                        name="mealName"
                        value={this.state.mealInfo.mealName}
                        onChange={this.handleChange}
                        required/>
                      <div className="input-group-append">
                        <span className="input-group-text bg-light">
                          <FaUtensils />
                        </span>
                      </div>                        
                    </div>
                    <div className="col-sm-4 input-group mt-3 mt-sm-auto">
                      <input
                        type="number"
                        className="form-control"
                        name="mealCal"
                        placeholder="100"
                        value={this.state.mealInfo.mealCal}
                        onChange={this.handleChange}
                        required
                      />
                      <div className="input-group-append">
                        <span className="input-group-text bg-light">Cals</span>
                      </div>
                    </div>
                  </div>
                  <div className="form-row mt-3">
                    <div className="col-6 input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-light">
                          <FaCalendarAlt />
                        </span>
                      </div>                           
                        <input 
                          className="form-control" 
                          type="date" 
                          placeholder="" 
                          name="mealDate"
                          value={this.state.mealInfo.mealDate}
                          onChange={this.handleChange}
                          required/>                         
                    </div>          
                    <div className="col-6 input-group">
                      <div className="input-group-prepend">
                          <span className="input-group-text bg-light">
                            <FaRegClock />
                          </span>
                      </div>                         
                      <input 
                          className="form-control" 
                          type="time" 
                          placeholder="" 
                          name="mealTime"
                          value={this.state.mealInfo.mealTime}
                          onChange={this.handleChange}
                          required/>                         
                    </div>                                    
                  </div>
                  <div className="form-row justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-info mt-3 align-content-end"
                    >
                      Add Meal
                    </button>                     
                  </div>                   
                </form>
              </div>
            </div>
          </div>
          <div className="col col-md-8 text-center">
            <div className="card border-top-0 rounded-0">
              <div className="card-body row">
                <form className="col-md-6" onSubmit={this.submitFilters}>
                  <div className="form-row mb-3">
                    <div className="form-group col-sm-6 text-left">
                      <label className="font-weight-bolder" htmlFor="startDate">Start Date</label>
                      <input 
                        type="date" 
                        id="startDate" 
                        required 
                        className="form-control"
                        value={this.state.startDate}
                        name="startDate"
                        onChange={this.handleFilterChange}
                      />      
                    </div>
                    <div className="form-group col-sm-6 text-left">
                      <label className="font-weight-bolder" htmlFor="endDate">End Date</label>
                      <input 
                        type="date" 
                        required 
                        id="endDate" 
                        className="form-control"
                        value={this.state.endDate}
                        name="endDate"
                        onChange={this.handleFilterChange}
                      />
                    </div>
                    <button className="btn btn-secondary">Filter Date</button>
                  </div>
                </form>
                <form className="col-md-6" onSubmit={this.submitFilters}>
                  <div className="form-row">
                    <div className="form-group col-sm-6 text-left">
                      <label className="font-weight-bolder" htmlFor="startTime">Start Time</label>
                      <input 
                        type="time" 
                        id="startTime" 
                        required 
                        className="form-control"
                        value={this.state.startTime}
                        name="startTime"
                        onChange={this.handleFilterChange}
                      />      
                    </div>
                    <div className="form-group col-sm-6 text-left">
                      <label className="font-weight-bolder" htmlFor="endtime">End Time</label>
                      <input 
                        type="time" 
                        required 
                        id="endtime" 
                        className="form-control"
                        value={this.state.endTime}
                        name="endTime"
                        onChange={this.handleFilterChange}
                      />
                    </div>
                    <button className="btn btn-secondary">Filter Time</button>
                  </div>
                </form>
              </div>
              {this.props.meals && this.props.meals.length? (
                  <table className="table table-sm card-body mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Meal</th>
                        <th scope="col">Cals</th>
                        <th scope="col">Date</th>
                        <th scope="col">Time</th>
                        <th scope="col">Edit</th>
                      </tr>
                    </thead>
                      <MealsList 
                        meals={this.props.meals} 
                        userID={this.props.userID}
                        greenDays={this.props.greenDays}
                        userBudget={this.props.userBudget}
                      />                      
                  </table>
              ) : null }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Meals;
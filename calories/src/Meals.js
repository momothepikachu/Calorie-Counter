import React, {Component} from 'react';
import firebase from './Firebase';

import MealsList from './MealsList'
import { FaCalendarAlt, FaRegClock, FaUtensils } from "react-icons/fa";


class Meals extends Component {
  state={
    mealName: '',
    mealCal: '',
    mealDate: '',
    mealTime: '',
  }
  handleChange= (e) =>{
    const itemName = e.target.name;
    const itemValue = e.target.value;
    this.setState({[itemName]: itemValue})
  }
  handleSubmit=(e)=>{
    e.preventDefault();
    const ref = firebase
      .database()
      .ref(`users/${this.props.userID}/meals`);
      ref.push({mealInfo: this.state})

    this.setState({mealName: '', mealCal:'', mealDate:'', mealTime:''}); //empty the input box
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
                        value={this.state.mealName}
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
                        value={this.state.mealCal}
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
                          value={this.state.mealDate}
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
                          value={this.state.mealTime}
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
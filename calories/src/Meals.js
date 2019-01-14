import React, {Component} from 'react';
import MealsList from './MealsList'

class Meals extends Component {
  state={
    mealName: ''
  }
  handleChange= (e) =>{
    const itemName = e.target.name;
    const itemValue = e.target.value;
    this.setState({[itemName]: itemValue})
  }
  handleSubmit=(e)=>{
    e.preventDefault();
    this.props.addMeal(this.state.mealName);
    this.setState({mealName: ''}); //empty the input box
  }
  render(){
      return(
        <div className="container mt-4">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h1 className="font-weight-light">Add a Meal</h1>
              <div className="card bg-light">
                <div className="card-body text-center">
                  <form
                    className="formgroup"
                    onSubmit={this.handleSubmit}
                  >
                    <div className="input-group input-group-lg">
                      <input
                        type="text"
                        className="form-control"
                        name="mealName"
                        placeholder="Meal name"
                        aria-describedby="buttonAdd"
                        value={this.state.mealName}
                        onChange={this.handleChange}
                      />
                      <div className="input-group-append">
                        <button
                          type="submit"
                          className="btn btn-sm btn-info"
                          id="buttonAdd"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-11 col-md-6 text-center">
              <div className="card border-top-0 rounded-0">
                {this.props.meals && this.props.meals.length? (
                  <section>
                    <div className="card-body py-2">
                      <h4 className="card-title font-weight-light m-0">
                        Your Meals
                      </h4>
                    </div>
                    <div className="list-group list-group-flush">
                      <MealsList 
                        meals={this.props.meals} 
                        userID={this.props.userID}
                      />
                    </div>
                  </section>
                ) : null }
              </div>
            </div>
          </div>
        </div>
      )
  }
}

export default Meals;
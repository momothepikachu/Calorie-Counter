import React, {Component} from 'react';
import firebase from './Firebase'
import {GoTrashcan} from 'react-icons/go'

class MealsList extends Component {
    deleteMeal = (e, whichMeal)=>{
        e.preventDefault()
        const ref = firebase
                        .database()
                        .ref( `meals/${this.props.userID}/${whichMeal}`)
        ref.remove()
    }
    render(){
        const {meals} = this.props;
        const myMeals = meals.map(item=>{
            return(
                <div className="list-group-item d-flex justify-content-between" key={item.mealID}>
                    <section className="pl-3 text-left align-self-center">
                        {item.mealName}
                    </section>
                    <section className="btn-group align-self-center" role="group" aria-label="meal options">
                        <button 
                            className="btn btn-sm btn-outline-secondary"
                            title="Delete Meal"
                            onClick={e=>this.deleteMeal(e, item.mealID)}
                        >
                            <GoTrashcan />
                        </button>
                    </section>                    
                </div>
            )
        })

        return(
          <div>{myMeals}</div>
        )
    }
}

export default MealsList;
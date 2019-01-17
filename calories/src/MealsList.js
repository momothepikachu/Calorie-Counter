import React, {Component} from 'react';
import firebase from './Firebase'
import $ from 'jquery';

import {GoTrashcan} from 'react-icons/go'
import { FaEdit } from "react-icons/fa";

class MealsList extends Component {
    state={
        mealName: '',
        mealCal:'',
        mealDate: '',
        mealTime: '',
    }
    toggleModal=(e, name, cal, date, time)=>{
        e.preventDefault();
        this.setState({
            mealName: name,
            mealCal: cal,
            mealDate: date,
            mealTime: time,
        })
    }
    handleChange= (e) =>{
        const itemName = e.target.name;
        const itemValue = e.target.value;
        this.setState({[itemName]: itemValue})
    }     
    handleSubmit=(e, whichMeal)=>{
        e.preventDefault();
        const ref = firebase
            .database()
            .ref( `users/${this.props.userID}/meals/${whichMeal}/mealInfo`)
        ref.set(this.state)

        $('#'+whichMeal+'Modal').modal('toggle');
    }
    deleteMeal = (e, whichMeal)=>{
        e.preventDefault()
        const ref = firebase
                        .database()
                        .ref( `users/${this.props.userID}/meals/${whichMeal}`)
        ref.remove()
    } 

    render(){
        
        const {meals} = this.props;
        const myMeals = meals.map(item=>{
            return(
                <tr key={item.mealID}>
                    <td className="py-2">{item.mealInfo.mealName}</td>
                    <td className="py-2">{item.mealInfo.mealCal}</td>
                    <td className="py-2">{item.mealInfo.mealDate}</td>
                    <td className="py-2">{item.mealInfo.mealTime}</td>
                    <td className="py-2 btn-group border-top-0">
                        <button 
                            className="btn btn-sm btn-outline-secondary pt-0"
                            data-toggle="modal"
                            data-target={'#'+item.mealID+'Modal'}
                            title="Edit Meal"
                            onClick={e=>this.toggleModal(e, item.mealInfo.mealName,item.mealInfo.mealCal,item.mealInfo.mealDate,item.mealInfo.mealTime)}
                        >
                            <FaEdit />
                        </button>

                        {/*Bootstrap Modal*/}
                        <div className="modal fade" id={item.mealID+'Modal'} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLongTitle">Edit your meal</h5>
                                    </div>
                                    <div className="modal-body">
                                        <form id={item.mealID+'form'} onSubmit={e=>this.handleSubmit(e, item.mealID)}>
                                            <div className="form-group">
                                                <label htmlFor={item.mealID+'mealName'}>Name</label>
                                                <input 
                                                    className="form-control" 
                                                    type="text" 
                                                    value={this.state.mealName} 
                                                    id={item.mealID+'mealName'} 
                                                    name="mealName"
                                                    onChange={this.handleChange}
                                                    />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor={item.mealID+'mealCal'}>Calories</label>
                                                <input 
                                                    className="form-control" 
                                                    type="number" 
                                                    value={this.state.mealCal} 
                                                    id={item.mealID+'mealCal'} 
                                                    name="mealCal"
                                                    onChange={this.handleChange}/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor={item.mealID+'mealDate'}>Date</label>
                                                <input 
                                                    className="form-control" 
                                                    type="date" 
                                                    value={this.state.mealDate} 
                                                    id={item.mealID+'mealDate'}
                                                    name="mealDate"
                                                    onChange={this.handleChange}/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor={item.mealID+'mealTime'}>Time</label>
                                                <input 
                                                    className="form-control" 
                                                    type="time" 
                                                    value={this.state.mealTime} 
                                                    id={item.mealID+'mealTime'}
                                                    name="mealTime"
                                                    onChange={this.handleChange}/>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-primary"
                                                >Save changes
                                                </button>
                                            </div>                                            
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>  


                        <button 
                            className="btn btn-sm btn-outline-secondary pt-0"
                            title="Delete Meal"
                            onClick={e=>this.deleteMeal(e, item.mealID)}
                        >
                            <GoTrashcan />
                        </button>                        
                    </td>                    
                </tr>
            )
        })

        return(
          <tbody>{myMeals}</tbody>
        )
    }
}

export default MealsList;
import React, {Component} from 'react';
import {navigate} from '@reach/router'

class Accounts extends Component {
    handleClick=(whichUser)=>{
        this.props.generateMeals(whichUser)
        navigate('/meals/'+whichUser)               
    }

    render(){
        const {users, currentUserID} = this.props;
        const myUsers = users.map(item=>{
            return(
                <div className="card" key={item.userID}>
                    <div className="card-body text-left">
                        <h5 className="card-title">{item.userName}</h5>
                        <p className="card-text">{item.userEmail}</p>
                        {item.manager? null:(
                            <div>
                                {currentUserID==='xDRDDy4eipd42mWuYoCBSY9GidA3'? (<button 
                                    className="btn btn-info mr-2"
                                    onClick={e=>this.handleClick(item.userID)}
                                >
                                    Records
                                </button>): null}
                                <button className="btn btn-info mr-2">Edit</button>
                                <button className="btn btn-info mr-2">Delete</button>
                            </div>
                        )}
                    </div>
                </div>
            )
        })

        return(
          <div>{myUsers}</div>
        )
    }
}

export default Accounts;
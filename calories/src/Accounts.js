import React, {Component} from 'react';
import firebase from './Firebase'
import $ from 'jquery';

import {navigate} from '@reach/router'

class Accounts extends Component {
    handleClick=(whichUser)=>{
        this.props.generateMeals(whichUser)
        navigate('/meals/'+whichUser)               
    }

    deleteUser=(e, whichUser)=>{
        e.preventDefault();
        const {users, currentUser} = this.props;
        firebase.auth().signOut().then(()=>{
            console.log('logout succesfully, ready to delete!')
            firebase 
            .auth()
            .signInWithEmailAndPassword(
              whichUser.userEmail,
              whichUser.userPassword
            ).then(()=>{
                const ref = firebase
                    .database()
                    .ref( `users/${whichUser.userID}`)
                ref.remove()            
                const user = firebase.auth().currentUser;
                user.delete()
                    .then(()=>{
                        console.log('deleted!')
                        const password = users.filter(i=>i.userEmail===currentUser.email)[0].userPassword
                        return password
                    })
                    .then((password)=>{
                        console.log('try to sign in!')
                        firebase 
                        .auth()
                        .signInWithEmailAndPassword(
                          currentUser.email,
                          password
                        ).then(()=>{
                            console.log('sign in again!')
                        }).catch(()=>{
                            console.log('fail to sign in again!')
                        })
                    })
                    .catch((error)=>{console.log(error)})
            }) 
        }).catch(()=>{
            console.log('fail to logout')
        })   
    }

    editUser=(e, whichUser)=>{
        e.preventDefault();
        const {users, currentUser} = this.props;
        firebase.auth().signOut().then(()=>{
            console.log('logout succesfully, ready to update!')
            firebase 
            .auth()
            .signInWithEmailAndPassword(
              whichUser.userEmail,
              whichUser.userPassword
            ).then(()=>{
                const ref = firebase
                    .database()
                    .ref( `users/${whichUser.userID}`)
                ref.update(this.state)           
                const user = firebase.auth().currentUser;
                user.updatePassword(this.state.userPassword)
                    .then(()=>{
                        console.log('change password succesfully!')
                        user.updateEmail(this.state.userEmail)
                            .then(()=>{
                                console.log('change email succesfully!')
                                user.updateProfile({
                                    displayName: this.state.userName,
                                    email: this.state.userEmail,
                                })
                                .then(()=>{
                                    console.log('updated!')
                                    const password = users.filter(i=>i.userEmail===currentUser.email)[0].userPassword
                                    return password
                                })
                                .then((password)=>{
                                    console.log('try to sign in!')
                                    firebase 
                                    .auth()
                                    .signInWithEmailAndPassword(
                                        currentUser.email,
                                        password
                                    ).then(()=>{
                                        console.log('sign in again!')
                                    }).catch(()=>{
                                        console.log('fail to sign in again!')
                                    })
                                })
                                .catch((error)=>{console.log(error)})
                            })
                            .catch(()=>{
                                console.log('fail to change email')
                            })
                    }).catch(()=>{
                        console.log('fail to change the password')
                    })
            }) 
        }).catch(()=>{
            console.log('fail to logout')
        })
        $('#'+whichUser.userID+'Modal').modal('toggle');          
    }
    state={
        userName: '',
        userEmail:'',
        userPassword: '',
    }
    toggleModal=(e, name, email, password)=>{
        e.preventDefault();
        this.setState({
            userName: name,
            userEmail: email,
            userPassword: password,
        })
    }
    handleChange= (e) =>{
        const itemName = e.target.name;
        const itemValue = e.target.value;
        this.setState({[itemName]: itemValue})
    }     

    render(){
        const {users, currentUser} = this.props;
        const myUsers = users.map(item=>{
            return(
                <div className="card" key={item.userID}>
                    <div className="card-body text-left">
                        <h5 className="card-title">{item.userName}</h5>
                        <p className="card-text">{item.userEmail}</p>
                        {item.manager? null:(
                            <div>
                                {currentUser &&currentUser.email==="daseif7@gmail.com"? (<button 
                                    className="btn btn-info mr-2"
                                    title="Edit user's records"
                                    onClick={e=>this.handleClick(item.userID)}
                                >
                                    Records
                                </button>): null}
                                <button 
                                    className="btn btn-info mr-2"
                                    title="Edit User"
                                    data-toggle="modal"
                                    data-target={'#'+item.userID+'Modal'}
                                    onClick={e=>this.toggleModal(e, item.userName,item.userEmail,item.userPassword)}
                                >
                                    Edit
                                </button>

                                {/*Bootstrap Modal*/}
                                <div className="modal fade" id={item.userID+'Modal'} tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLongTitle">Edit User Account</h5>
                                            </div>
                                            <div className="modal-body">
                                                <form id={item.userID+'form'} onSubmit={e=>this.editUser(e, item)}>
                                                    <div className="form-group">
                                                        <label htmlFor={item.userID+'userName'}>Name</label>
                                                        <input 
                                                            className="form-control" 
                                                            type="text" 
                                                            value={this.state.userName} 
                                                            id={item.userID+'userName'} 
                                                            name="userName"
                                                            onChange={this.handleChange}
                                                            />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor={item.userID+'userEmail'}>Email</label>
                                                        <input 
                                                            className="form-control" 
                                                            type="email" 
                                                            value={this.state.userEmail} 
                                                            id={item.userID+'userEmail'} 
                                                            name="userEmail"
                                                            onChange={this.handleChange}/>
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor={item.userID+'userPassword'}>Password</label>
                                                        <input 
                                                            className="form-control" 
                                                            type="password" 
                                                            value={this.state.userPassword} 
                                                            id={item.userID+'userPassword'}
                                                            name="userPassword"
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
                                    className="btn btn-info mr-2"
                                    title="Delete User"
                                    onClick={e=>this.deleteUser(e, item)}
                                >
                                    Delete
                                </button>
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
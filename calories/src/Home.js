import React, {Component} from 'react';
import {Link} from '@reach/router'

//home page 
class Home extends Component {
    render(){
        const {user, manager} = this.props;
        //customized style for the introduction paragraph
        const biggerLead = {
            fontSize: 1.4 + 'em',
            fontWeight: 200
        }
        return(
            <div className="container text-center">
                <div className="row justify-content-center">
                    <div className="col-10 col-md-10 col-lg-8 col-xl-7">
                        <div className="display-4 text-primary mt-3 mb-2" style={{fontSize: 2.8+'em'}}>
                        Calorie Counter
                        </div>
                        <p className="lead" style={biggerLead}>
                        This simple app helps you watch your diets, allows people to check
                        in, add/edit/delete meals and check if you have exceeded your daily budget of calories.  
                        </p>
                        {/*check if there is a signed-in user; if yes, show option to Add Meals for regular users, or Manage Accounts for manager/admin; if no, show options to register or Login*/}
                        {user == null? (
                            <span>
                                <Link to="/register" className="btn btn-outline-primary mr-2">
                                Register
                                </Link>
                                <Link to="/login" className="btn btn-outline-primary mr-2">
                                Log In
                                </Link>                                
                            </span>
                        ): (
                            <span>
                                {/*check if signed-in user is a regular user or manager/admin */}
                                {manager?(
                                    <Link to={`/manage/${user && user.uid}`} className="btn btn-primary">
                                        Manage Accounts
                                    </Link>
                                ):(
                                    <Link to={`/meals/${user && user.uid}`} className="btn btn-primary">
                                        Add Meals
                                    </Link>
                                )}

                            </span>
                        )}
                    </div> {/* columns */}
                </div> {/* rows */}
          </div>          
        )
    }
}

export default Home;
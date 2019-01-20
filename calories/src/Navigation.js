import React, {Component} from 'react';
import {Link} from '@reach/router'
import {FaCalculator} from 'react-icons/fa';

class Navigation extends Component {

    render(){
        const {user, logOutUser} = this.props;

        return(
            <nav className="site-nav family-sans navbar navbar-expand-sm bg-dark navbar-dark higher">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">
                    <FaCalculator className="mr-1" /> Calorie Counter
                </Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <div className="navbar-nav ml-auto">
                        {(user && this.props.manager) &&
                        (
                            <Link className="nav-item nav-link" to={`manage/${user.uid}`}>
                            Manage
                            </Link>
                        )}
                        {(user && user.email!=='daseif7@gmail.com' && user.email!=='xrao@163.com') && (
                            <Link className="nav-item nav-link" to={`meals/${user.uid}`}>
                            Meals
                            </Link>
                        )}
                        {(user && user.email!=='daseif7@gmail.com' && user.email!=='xrao@163.com') && (
                            <Link className="nav-item nav-link" to={`settings/${user.uid}`}>
                            Settings
                            </Link>
                        )}
                        {!user && (
                            <Link className="nav-item nav-link" to="/login">
                            log in
                            </Link>
                        )}
                        {!user && (
                            <Link className="nav-item nav-link" to="/register">
                            register
                            </Link>
                        )}
                        {user && (
                            <Link className="nav-item nav-link" to="" onClick={e=>logOutUser(e)}>
                            log out
                            </Link>
                        )}
                    </div>
                </div>

            </div>
            </nav>
        )
    }
}

export default Navigation;
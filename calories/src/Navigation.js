import React, {Component} from 'react';
import {Link} from '@reach/router'
import {FaCalculator} from 'react-icons/fa';

class Navigation extends Component {

    render(){
        const {user, logOutUser} = this.props;

        return(
            <nav className="site-nav family-sans navbar navbar-expand bg-dark navbar-dark higher">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">
                    <FaCalculator className="mr-1" /> Calorie Counter
                </Link>
                <div className="navbar-nav ml-auto">
                    {(user && this.props.manager) &&
                    (
                        <Link className="nav-item nav-link" to="/manage">
                        Manage
                        </Link>
                    )}
                    {user && (
                        <Link className="nav-item nav-link" to="/settings">
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
            </nav>
        )
    }
}

export default Navigation;
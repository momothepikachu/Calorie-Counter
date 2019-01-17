import React, {Component} from 'react';
import {Link} from '@reach/router'

class Welcome extends Component {

    render(){
        const {userName, logOutUser} = this.props;

        return(
          <div className="text-center mt-4">
              <span className="text-secondary font-weight-bold pl-1">
                Welcome <span className="text-success">{userName}</span>
              </span>, 
              <Link className="font-weight-bold text-primary pl-1" to="/" onClick={logOutUser}>log out</Link>
          </div>

        )
    }
}

export default Welcome;
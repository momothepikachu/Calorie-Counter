import React, {Component} from 'react';

class Welcome extends Component {

    render(){
        const {user} = this.props;

        return(
          <div className="text-center mt-4">
              <span className="text-secondary font-weight-bold pl-1">
                Welcome <span className="text-success">{user.displayName}</span>
              </span>
          </div>
        )
    }
}

export default Welcome;
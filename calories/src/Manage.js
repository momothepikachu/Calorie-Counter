import React, {Component} from 'react';
import Accounts from './Accounts'

class Manage extends Component {
  render(){
      return(
        <div className="container mt-4">
          <div className="row justify-content-center">
            <div className="col col-md-8 text-center">
              <h1 className="font-weight-light">Manage Accounts</h1>

                <Accounts 
                    users={this.props.users}
                    currentUserID={this.props.currentUserID}
                    generateMeals={this.props.generateMeals}
                />

            </div>
          </div>
        </div>
      )
  }
}

export default Manage;
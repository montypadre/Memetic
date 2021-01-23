import React, { Component } from "react";
// import logo from './logo.svg';
import "./App.scss";
import Box from "3box";
import EditProfile from "3box-profile-edit-react";

export default class Profile extends Component {
  state = {
    needToAWeb3Browser : false
  };
  async getAddressFromMetaMask() {
    if (typeof window.ethereum == "undefined") {
      this.setState({ needToAWeb3Browser: true });
    } else {
      window.ethereum.autoRefreshOnNetworkChange = false; //silences warning about no autofresh on network change
      const accounts = await window.ethereum.enable();
      this.setState({ accounts });
      const box = await Box.openBox(this.state.accounts[0], window.ethereum);
      this.setState({box});
      const space = await box.openSpace('user-profile');
      this.setState({space});
    }
  }
  
  async componentDidMount() {
    await this.getAddressFromMetaMask();
  }
  render() {

    if(this.state.needToAWeb3Browser){
      return <h1>Please install metamask</h1>
    }

    return (
      <div>
      <h1>User Profile</h1>

      {this.state.box && this.state.space && 
     <EditProfile 
     // required
     box={this.state.box}
     space={this.state.space}
     currentUserAddr={this.state.accounts[0]}

     // optional
     /* customFields={customFields}
     currentUser3BoxProfile={myProfile}
     redirectFn={redirectFn} */
     />}
     </div>
    );
  }
}
import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import Identicon from 'identicon.js';
import Profile from './Profile';

class Navbar extends Component {

    render() {
        return (
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
           <NavLink to="/" style={{textDecoration: 'none'}}>
              Memetic
            </NavLink>
            <ul className="navbar-nav px-3">
              <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                <small className="text-secondary">
                 <small id="account">{this.props.account}</small>
                </small>
                { this.props.account 
                  ? 
                      <NavLink to="/profile">
                        <img 
                          className='ml-2' 
                          width='30' 
                          height='30' 
                          src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`} 
                        />
                      </NavLink>
                     
                  : <span></span>
                }
              </li>
            </ul>
          </nav>
        );
    }
}

export default Navbar;
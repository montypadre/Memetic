import React from 'react';
import ReactDOM from 'react-dom';
import "@patternfly/react-core/dist/styles/base.css";
import '../fonts.css';
import 'bootstrap/dist/css/bootstrap.css'
import {
    Dropdown,
    DropdownToggle,
    DropdownItem,
    DropdownSeparator,
    DropdownPosition,
    DropdownDirection,
    KebabToggle
  } from '@patternfly/react-core';
import { ThIcon } from '@patternfly/react-icons';

class NewsFeedMenuDropdown extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isOpen: false
      };
      this.onToggle = isOpen => {
        this.setState({
          isOpen
        });
      };
      this.onSelect = event => {
        this.setState({
          isOpen: !this.state.isOpen
        });
        this.onFocus();
      };
      this.onFocus = () => {
        const element = document.getElementById('toggle-id-6');
        element.focus();
      };
    }
  
    render() {
      const { isOpen } = this.state;
      const dropdownItems = [
        <DropdownItem key="save">Save</DropdownItem>,
        <DropdownItem key="hide">Hide</DropdownItem>
      ];
      return (
        <Dropdown
          className="float-right"
          onSelect={this.onSelect}
          toggle={<KebabToggle onToggle={this.onToggle} id="toggle-id-6" />}
          isOpen={isOpen}
          isPlain
          dropdownItems={dropdownItems}
        />
      );
    }
  }

  const rootElement = document.getElementById("root");
  ReactDOM.render(<NewsFeedMenuDropdown />, rootElement);
  export default NewsFeedMenuDropdown;
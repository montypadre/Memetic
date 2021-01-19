import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.scss';
import Memetic from '../abis/Memetic.json';
import Navbar from './Navbar';
import Main from './Main';


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = Memetic.networks[networkId]
    if(networkData) {
      const memetic = web3.eth.Contract(Memetic.abi, networkData.address)
      this.setState({ memetic })
      const postCount = await memetic.methods.postCount().call()
      this.setState({ postCount })
      // Load Posts
      for (var i = 1; i <= postCount; i++) {
        const post = await memetic.methods.posts(i).call()
        this.setState({
          posts: [...this.state.posts, post]
        })
      }
      // Sort posts. Show highest tipped post first
      this.setState({
        posts: this.state.posts.sort((a, b) => b.tipAmount - a.tipAmount )
      })
      this.setState({ loading: false })
    } else {
      window.alert('Memetic contract not deployed to detected network.')
    }
    // Address
    // ABI
  }

  createPost(content) {
    this.setState({ loading: true })
    this.state.memetic.methods.createPost(content).send({ from: this.state.account })
    .once('confirmation', (n, receipt) => {
      this.setState({ loading: false })
      window.location.reload()
    })
  }

  tipPost(id, tipAmount) {
    this.setState({ loading: true })
    this.state.memetic.methods.tipPost(id).send({ from: this.state.account, value: tipAmount })
    .once('confirmation', (n, receipt) => {
      this.setState({ loading: false })
      window.location.reload()
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      memetic: null,
      postCount: 0,
      posts: [],
      loading: true
    }

    this.createPost = this.createPost.bind(this)
    this.tipPost = this.tipPost.bind(this)
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
            ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
            : <Main 
                posts={this.state.posts} 
                createPost={this.createPost}
                tipPost={this.tipPost}
              />
        }
      </div>
    );
  }
}

export default App;

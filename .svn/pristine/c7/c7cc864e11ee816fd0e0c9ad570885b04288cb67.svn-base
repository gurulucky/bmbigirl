import React, { useState} from 'react';
import { Button, Container } from '@material-ui/core';
import {NotificationContainer, NotificationManger} from 'react-notifications';

function App() {
  const [account, setAccount] = useState("");

  const connectWallet = async() => {
    if (window.ethereum) {
      try {
        // const addressArray = await window.ethereum.request({
        //   method: "eth_requestAccounts",
        // });
        // window.web3 = new Web3(window.ethereum);
        //   console.log("account",addressArray[0]);
        const chainId = await window.ethereum.request({
          method: "eth_chainId"
        });
        if (Number(chainId) !== 97) {
          NotificationManger.warning(`Select BSC testnet.`);
          setAccount("");
          return;
        }
        const accounts = await window.ethereum.enable();
        console.log(accounts);
        setAccount(accounts[0] !== undefined ? accounts[0] : "");
      } catch (err) {
      }
    } else {
      NotificationManger.warning('Metamask not installed.');
    }

  }

  return (
    <Container>
      <Button variant='contained' color='primary' onClick={connectWallet}>Connect</Button>
      <NotificationContainer/>
    </Container>
  );
}

export default App;

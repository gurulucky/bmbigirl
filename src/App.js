import React, { useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Container, Stack, Button, Typography, Box } from '@mui/material';
import 'react-notifications/lib/notifications.css';
import Web3 from 'web3';
import api from './api'

import { token_abi } from './abi';

const TOKEN_ADDRESS = "0xbD5099BC6aD5c2E20D37E90D44A01e67d864344b";
// const NFT_ADDRESS = "0x21408b8108a721fB417F293c36025CF50a8Db0A0";
const PRICE = "150000000000000";

function App() {
  const [account, setAccount] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        const chainId = await window.ethereum.request({
          method: "eth_chainId"
        });
        if (Number(chainId) !== 97) {
          NotificationManager.warning(`Select BSC testnet.`);
          setAccount("");
          return;
        }
        const accounts = await window.ethereum.enable();
        console.log(accounts);
        setAccount(accounts[0] !== undefined ? accounts[0] : "");
      } catch (err) {
      }
    } else {
      NotificationManager.warning('Metamask not installed.');
    }
  }

  const shortAddress = (address) => {
    if (address !== "" || address !== undefined) {
      let lowCase = address.toLowerCase();
      return "0x" + lowCase.charAt(2).toUpperCase() + lowCase.substr(3, 3) + "..." + lowCase.substr(-4);
    }
    return address;
  }

  const buy = async () => {
    if (!account) {
      NotificationManager.error('Please connect wallet.');
      return;
    }
    try {
      let balance = getTokenBalance(account);
      if (isBigger(String(balance), PRICE) === -1) {
        NotificationManager.error(`Your IGIRL isn't enough.`);
        return;
      }
      const res = await api.post('/buy');
      console.log(res.data);
      setImageUrl("");
    } catch (err) {
      console.log(err.message);
    }
  }

  const isBigger = (x, y) => {
    x = x || "0";
    y = y || "0";
    if (x.length > y.length) y = "0".repeat(x.length - y.length) + y;
    else if (y.length > x.length) x = "0".repeat(y.length - x.length) + x;

    for (let i = 0; i < x.length; i++) {
      if (x[i] < y[i]) return -1;
      if (x[i] > y[i]) return 1;
    }
    return 0;
  }

  const getTokenBalance = async (account) => {
    if (!account) {
      return 0;
    }
    let tokenContract = new window.web3.eth.Contract(token_abi, TOKEN_ADDRESS);
    let balance = await tokenContract.methods.balanceOf(account).call();
    console.log(typeof (balance));
    return balance;
  }

  return (
    <Container sx={{ p: "20px" }}>
      <Stack direction='row' justifyContent='flex-end'>
        <Button variant='contained' color='primary' onClick={connectWallet}>{account ? shortAddress(account) : `Connect`}</Button>
      </Stack>
      <Stack direction='row' justifyContent='center'>
        <Container sx={{ width: "50%" }}>
          <Box
            component='img'
            src={imageUrl || '/empty.png'}
            sx={{
              width: "300px",
              height: "300px",
              border: "2px solid"
            }} />
        </Container>
        <Stack direction='column' sx={{ width: "50%" }} spacing={1}>
          <Typography variant="h4" color="blue">Binance mystery box - Island Girl</Typography>
          <Typography variant='h5' color="red">Price: 150,000 IGIRL</Typography>

          <Typography variant='h6'>
            1. Basic — 79.99% (7,999 pieces)
          </Typography>
          <Typography variant='h6'>
            2. Rare — 11% (1,100 pieces)
          </Typography>
          <Typography variant='h6'>
            3. Epic — 5% (500 pieces)
          </Typography>
          <Typography variant='h6'>
            4. Legndry —3% (300 pieces)
          </Typography>
          <Typography variant='h6'>
            5. Mythical — 1% (100 pices)
          </Typography>
          <Typography variant='h6'>
            6. God - 0.01% (1 piece)
          </Typography>

          <Button variant="contained" color="warning" onClick={buy}>Buy</Button>
        </Stack>
      </Stack>

      <NotificationContainer />
    </Container>
  );
}

export default App;

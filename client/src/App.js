/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Container, Stack, Button, Typography, Box, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import 'react-notifications/lib/notifications.css';
import Web3 from 'web3';
import api from './api';
import axios from 'axios';
import { token_abi, nft_abi } from './abi';

const TOKEN_ADDRESS = "0xbD5099BC6aD5c2E20D37E90D44A01e67d864344b";
const NFT_ADDRESS = "0x3625a46A91286BCCBd66Be1bfA9e0eC5b14134c3";
const PRICE = "100000000000000";

function App() {
  const [account, setAccount] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rarity, setRarity] = useState("");
  const [tokenId, setTokenId] = useState(0);
  const [myNFTs, setMyNFTs] = useState([]);
  const [total, setTotal] = useState(0);

  const RULES = [
    {
      image: '/nfts/0.jpg',
      desc: 'Common - 79.99% (7,999 pieces)'
    },
    {
      image: '/nfts/1.jpg',
      desc: 'Rare - 11% (1,100 pieces)'
    },
    {
      image: '/nfts/2.jpg',
      desc: 'Epic - 5% (500 pieces)'
    },
    {
      image: '/nfts/3.jpg',
      desc: 'Legendary - 3% (300 pieces)'
    },
    {
      image: '/nfts/4.jpg',
      desc: 'Mythical - 1% (100 pieces)'
    },
    {
      image: '/nfts/5.jpg',
      desc: 'God - 0.01% (1 piece)'
    }
  ]

  useEffect(() => {
    // window.web3 = new Web3('https://bsc-dataseed1.ninicoin.io');
    // window.web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');

    if (account) {
      getNFTs(account);
      getTotalCount();
    }
  }, [account]);

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

  const getNFTs = async () => {
    try {
      console.log('getNFTs');
      let res = await api.post('/nfts', { account });
      let nfts = res.data.nfts;
      let newNfts = [];
      for (let i = 0; i < nfts.length; i++) {
        let response = await axios.get(`https://gateway.pinata.cloud/ipfs/${nfts[i].tokenUri}`);
        let date = new Date(nfts[i].mintDate);

        newNfts.push({ id: nfts[i].tokenId, image: response.data.image, name: response.data.name, description: response.data.description, rarity: nfts[i].rarity, date: date.toLocaleDateString() + ' ' + date.toLocaleTimeString() });
      }
      console.log(newNfts);
      setMyNFTs(newNfts);
    } catch (err) {
      console.log(err.message);
    }
  }

  const buy = async () => {
    if (!account) {
      NotificationManager.error('Please connect wallet.');
      return;
    }
    try {
      let balance = await getTokenBalance(account);
      if (isBigger(String(balance), PRICE) === -1) {
        NotificationManager.error(`Your IGIRL isn't enough.`);
        return;
      }
      let res = await api.post('/buy');
      let uri = res.data.uri;
      let id = res.data.id;
      let rarity = res.data.rarity;
      let msg = res.data.msg;
      console.log(res.data);
      if (uri) {
        res = await mint(id, uri);
        if (res.status) {
          await getTotalCount();
          const tokenUri = await getTokenUri(id);
          let response = await axios.get(tokenUri);
          // let response = await axios.get(`https://gateway.pinata.cloud/ipfs/${uri}`);
          console.log(response);
          setName(response.data.name);
          setDescription(response.data.description);
          setImageUrl(response.data.image);

          setRarity(rarity);
          setTokenId(id);
          let mintDate = new Date();
          res = await api.post('/mint', { id, account, mintDate });
          if (res.data.minted) {
            NotificationManager.success(`You minted IGIRL NFT successfully!. TokenId is ${id}.`);
          }
          setMyNFTs([{ id, image: response.data.image, name: response.data.name, description: response.data.description, rarity, date: mintDate.toLocaleDateString() + ' ' + mintDate.toLocaleTimeString() }, ...myNFTs]);
        } else {
          NotificationManager.error('Minting failed.');
        }
      } else {
        NotificationManager.error(msg);
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  const mint = async (id, uri) => {
    let res;
    let igirlNFT = new window.web3.eth.Contract(nft_abi, NFT_ADDRESS);
    let igirlToken = new window.web3.eth.Contract(token_abi, TOKEN_ADDRESS);
    // const seller = await igirlNFT.methods.owner().call();
    let allowance = await igirlToken.methods.allowance(account, NFT_ADDRESS).call();
    if (isBigger(String(allowance), PRICE) == -1) {
      res = await igirlToken.methods.approve(NFT_ADDRESS, PRICE).send({ from: account });
      console.log("approve", res.status);
    }
    res = await igirlNFT.methods.mint(id, uri).send({ from: account });
    console.log("mint", res.status);
    return res;
  }

  const getTokenUri = async (tokenId) => {
    let igirlNFT = new window.web3.eth.Contract(nft_abi, NFT_ADDRESS);
    const res = await igirlNFT.methods.tokenURI(tokenId).call();
    console.log(`${tokenId} : ${res}`);
    return res;
  }

  const getTotalCount = async () => {
    let igirlNFT = new window.web3.eth.Contract(nft_abi, NFT_ADDRESS);
    const res = await igirlNFT.methods.totalSupply().call();
    console.log(`${totalSupply} : ${res}`);
    setTotal(res);
    return res;
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
    try {
      let tokenContract = new window.web3.eth.Contract(token_abi, TOKEN_ADDRESS);
      let balance = await tokenContract.methods.balanceOf(account).call();
      // console.log(typeof (balance));
      console.log('balance', balance);
      return balance;
    } catch (err) {
      console.log(err.message);
      return 0;
    }
  }

  return (
    <Container sx={{ p: "20px" }} >
      <Stack direction='row' justifyContent='flex-end'>
        <Button variant='contained' color='primary' onClick={connectWallet}>{account ? shortAddress(account) : `Connect`}</Button>
      </Stack>
      <Stack direction='row' justifyContent='center'>
        <Container sx={{ width: "50%" }}>
          <Box
            component='img'
            src={imageUrl || '/box.png'}
            sx={{
              width: "300px",
              height: "300px",
              border: "2px solid"
            }} />
          {
            imageUrl && <>
              <Typography variant='h6' color='blue'>Name:<a href={`https://testnet.bscscan.com/token/${NFT_ADDRESS}?a=${tokenId}`} target="_blank">{`${name} #${tokenId}`}</a></Typography>
              <Typography variant='h6' color='blue'>{`Description: ${description}`}</Typography>
              <Typography variant='h6' color='blue'>{`Rarity: ${rarity}`}</Typography>
            </>
          }
        </Container>
        <Stack direction='column' sx={{ width: "50%" }} spacing={1}>
          <Typography variant="h4" color="blue">Binance mystery box - Island Girl</Typography>
          <Stack direction='row' justifyContent='space-between'>
            <Typography variant='h5' color="red">{`Price: ${PRICE.slice(0, -9)} IGIRL`}</Typography>
            <Typography variant='h5' color='black'>{account && `Left: ${10000 - total}`}</Typography>
            <Typography variant='h5' color='black'>{`Total supply: 10000`}</Typography>
          </Stack>

          <Table aria-label="simple table">
            <TableBody>
              {RULES.map((row, index) => (
                <TableRow
                  key={row.image}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="left"><img src={row.image} width="50px" height="50px" /> </TableCell>
                  <TableCell align="left">{row.desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {
            total < 10000 ?
              <Button variant="contained" color="warning" onClick={buy} disabled={!account}>Buy</Button>
              :
              <Typography variant='h5' color="black" textAlign='center'>Sold out</Typography>
          }
        </Stack>
      </Stack>
      <Typography variant="h6" color="primary">{`You have ${myNFTs.length} IGIRL NFTs.`}</Typography>
      <TableContainer component={Paper} sx={{ mt: "20px" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">No</TableCell>
              <TableCell align="left">Thumbnail</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell align="left">Rarity</TableCell>
              <TableCell align="left">Buy Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {myNFTs.map((row, index) => (
              <TableRow
                key={row.mintDate}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell align="left"><img src={row.image} width="50px" height="50px" /> </TableCell>
                <TableCell align="left"><a href={`https://testnet.bscscan.com/token/${NFT_ADDRESS}?a=${row.id}`} target="_blank">{`${row.name} #${row.id}`}</a></TableCell>
                <TableCell align="left">{row.description}</TableCell>
                <TableCell align="left">{row.rarity}</TableCell>
                <TableCell align="left">{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <NotificationContainer />
    </Container>
  );
}

export default App;

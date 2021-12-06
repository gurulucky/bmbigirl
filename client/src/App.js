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
const NFT_ADDRESS = "0x13Cd33C72188C76074E307Bae4717D0be0A63524";
const PRICE = "100000000000000";

function App() {
  const [account, setAccount] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rarity, setRarity] = useState("");
  const [tokenId, setTokenId] = useState(0);
  const [myNFTs, setMyNFTs] = useState([]);

  useEffect(() => {
    if (account) {
      getNFTs(account);
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
      console.log(balance);
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
          res = await api.post('/mint', { tokenUri: uri, account, mintDate });
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
            src={imageUrl || '/empty.png'}
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
          <Typography variant='h5' color="red">{`Price: ${PRICE.slice(0, -9)} IGIRL`}</Typography>

          <Typography variant='h6'>
            1. Basic — 28.57% (6 pieces)
          </Typography>
          <Typography variant='h6'>
            2. Rare — 23.81% (5 pieces)
          </Typography>
          <Typography variant='h6'>
            3. Epic — 19.05% (4 pieces)
          </Typography>
          <Typography variant='h6'>
            4. Legndry —14.29% (3 pieces)
          </Typography>
          <Typography variant='h6'>
            5. Mythical — 9.52% (2 pices)
          </Typography>
          <Typography variant='h6'>
            6. God - 4.76% (1 piece)
          </Typography>

          <Button variant="contained" color="warning" onClick={buy}>Buy</Button>
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

/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Container, Stack, Backdrop, Button, Typography, Box, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import 'react-notifications/lib/notifications.css';
import Web3 from 'web3';
import api from './api';
import axios from 'axios';
import { token_abi, nft_abi } from './abi';

// const TOKEN_ADDRESS = "0xbD5099BC6aD5c2E20D37E90D44A01e67d864344b";
const TOKEN_ADDRESS = "0x85469cb22c5e8a063106c987c36c7587810e4bf1"; //main
// const NFT_ADDRESS = "0xBC7fdd211FA0AD02AC8e498E6699Ee1E18827976";
const NFT_ADDRESS = "0xfEF837932900e499CF48eB3c83EEFcff3A42526C"; //main
const PRICE = "100000000000000";
const TOTAL = 10000;

function Mysterybox({ account }) {
  const [selIndex, setSelIndex] = useState(-1);
  const [myNFTs, setMyNFTs] = useState([]);
  const [mintedCount, setMintedCount] = useState(0);
  const [playing, setPlaying] = useState(false);

  const RARITIES = [
    "Common",
    "Rare",
    "Epic",
    "Legendary",
    "Mythical",
    "God"
  ]

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
  ];

  const VIDEOS = [
    "/video/0.mp4",
    "/video/1.mp4",
    "/video/2.mp4",
    "/video/3.mp4",
    "/video/4.mp4",
    "/video/5.mp4",
  ]

  useEffect(() => {


    if (account) {
      getNFTs(account);
    }
    getTotalCount();
  }, [account]);

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
          playVideo(rarity);
          await getTotalCount();
          const tokenUri = await getTokenUri(id);
          let response = await axios.get(tokenUri);

          // let response = await axios.get(`https://gateway.pinata.cloud/ipfs/${uri}`);
          console.log(response);
          let mintDate = new Date();
          res = await api.post('/mint', { id, account, mintDate });
          if (res.data.minted) {
            NotificationManager.success(`You minted IGIRL NFT successfully!. TokenId is ${id}.`);
          }
          setMyNFTs([{ id, image: response.data.image, name: response.data.name, description: response.data.description, rarity, date: mintDate.toLocaleDateString() + ' ' + mintDate.toLocaleTimeString() }, ...myNFTs]);
          setSelIndex(0);
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
    console.log(`${mintedCount} : ${res}`);
    setMintedCount(Number(res));
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

  const playVideo = (rarity) => {
    try {
      let video = document.getElementById('video');
      let source = document.getElementById('source');
      source.setAttribute('src', VIDEOS[RARITIES.indexOf(rarity) || 0]);
      setPlaying(true);
      video.currentTime = 0;
      video.load();
      video.play();
      video.onended = () => setPlaying(false);
      // console.log('play', source.getAttribute('src'));
    } catch (err) {
      console.log(err.message);
    }
  }

  return (
    <Container sx={{ pt: "80px" }} >

      <Stack direction='row' justifyContent='center'>
        <Container sx={{ width: "50%" }}>
          {
            !playing &&
            <>
              <Box
                component='img'
                src={myNFTs[selIndex]?.image || '/box.png'}
                sx={{
                  width: "400px",
                  height: "auto",
                  border: "2px solid brown"
                }} />
                
              {
                myNFTs[selIndex] && <>
                  <Typography variant='h6' color='blue'>Name:<a href={`https://bscscan.com/token/${NFT_ADDRESS}?a=${myNFTs[selIndex].id}`} target="_blank">{`${myNFTs[selIndex].name} #${myNFTs[selIndex].id}`}</a></Typography>
                  <Typography variant='h6' color='blue'>{`Description: ${myNFTs[selIndex].description}`}</Typography>
                </>
              }

            </>
          }
          {/* <video id="video" width="400px" height="auto" hidden={!playing}>
            <source src={VIDEOS[RARITIES.indexOf(rarity) || 0]} type="video/mp4" />
            Your browser does not support the video tag.
          </video> */}
        </Container>
        <Stack direction='column' sx={{ width: "50%" }} spacing={1}>
          <Typography variant="h4" color="blue">Binance mystery box - Island Girl</Typography>
          <Stack direction='row' justifyContent='space-between'>
            <Typography variant='h5' color="red">{`Price: ${PRICE.slice(0, -9)} IGIRL`}</Typography>
            <Typography variant='h5' color='black'>{account && `Left: ${TOTAL - mintedCount}`}</Typography>
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
            mintedCount < 10000 ?
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
                onClick={() => setSelIndex(index)}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell align="left"><img src={row.image} width="50px" height="50px" /> </TableCell>
                <TableCell align="left"><a href={`https://bscscan.com/token/${NFT_ADDRESS}?a=${row.id}`} target="_blank">{`${row.name} #${row.id}`}</a></TableCell>
                <TableCell align="left">{row.description}</TableCell>
                <TableCell align="left">{row.rarity}</TableCell>
                <TableCell align="left">{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={playing}
        onClick={() => setPlaying(false)}
      >
        <video id="video" width="70%">
          <source id='source' src={VIDEOS[0]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Backdrop>
      <NotificationContainer />
    </Container>
  );
}

const mapStateToProps = (state) => ({
  account: state.mystery.account
})

export default connect(mapStateToProps)(Mysterybox);

/* eslint-disable */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { setAccount } from '../actions/mystery';
import Web3 from 'web3';

const BSC_TEST_ID = 97;
const BSC_MAIN_ID = 56;

const Navbar = ({ account, setAccount }) => {
    useEffect(() => {
        window.web3 = new Web3('https://bsc-dataseed1.ninicoin.io'); // main
        // window.web3 = new Web3('https://data-seed-prebsc-1-s3.binance.org:8545/');
        if (window.ethereum) {
            // window.web3 = new Web3(window.ethereum);
            window.ethereum.on('accountsChanged', function (accounts) {
                // if (accounts[0] !== account) {
                console.log("change", accounts[0]);
                connectWallet();
                // }
            });
            window.ethereum.on('networkChanged', function (networkId) {
                if (Number(networkId) !== BSC_MAIN_ID) {
                    NotificationManager.warning(`Select BSC mainnet.`);
                    setAccount("");
                    return;
                }
                connectWallet();
            });
            connectWallet();
        }
    }, [setAccount, account]);

    const connectWallet = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            try {
                const chainId = await window.ethereum.request({
                    method: "eth_chainId"
                });
                if (Number(chainId) !== BSC_MAIN_ID) {
                    NotificationManager.warning(`Select BSC mainnet.`);
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

    return (
        <header className="page-header">
            <nav className="main-menu static-top navbar-dark navbar navbar-expand-lg fixed-top mb-1"><div className="container">
                <a className="navbar-brand animated" data-animation="fadeInDown" data-animation-delay="1s" href="https://islandgirltoken.com/#head-area">
                    <img src="images/logo.png" alt="Crypto Logo" width="70" /><span className="brand-text"><span className="font-weight-bold">ISLAND</span> GIRL</span></a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <div id="navigation" className="navbar-nav ml-auto">
                        <ul className="navbar-nav mt-1">
                            <li className="nav-item animated" data-animation="fadeInDown" data-animation-delay="1.1s" style={{ marginRight: "20px" }}>
                                <a style={{ color: "green", fontSize: "0.8rem" }} href="https://islandgirltoken.com/#head-area">ABOUT</a>
                            </li>
                            <li className="nav-item animated" data-animation="fadeInDown" data-animation-delay="1.2s" style={{ marginRight: "20px" }}>
                                <a style={{ color: "green", fontSize: "0.8rem" }} href="https://islandgirltoken.com/#token-sale-mobile-app">TOKENOMICS</a>
                            </li>
                            <li className="nav-item animated" data-animation="fadeInDown" data-animation-delay="1.3s" style={{ marginRight: "20px" }}>
                                <a href="" style={{ color: "green", fontSize: "0.8rem" }}>MYSTERYBOX</a>
                            </li>
                            <li className="nav-item animated" data-animation="fadeInDown" data-animation-delay="1.4s" style={{ marginRight: "20px" }}>
                                <a style={{ color: "green", fontSize: "0.8rem" }} href="https://islandgirltoken.com/#roadmap">ROADMAP</a>
                            </li>
                            <li className="nav-item animated" data-animation="fadeInDown" data-animation-delay="1.5s" style={{ marginRight: "20px" }}>
                                <a style={{ color: "green", fontSize: "0.8rem" }} href="https://islandgirltoken.com/#merchandise">VIDEOS</a>
                            </li>
                            <li className="nav-item animated" data-animation="fadeInDown" data-animation-delay="1.5s" style={{ marginRight: "20px" }}>
                                <a style={{ color: "green", fontSize: "0.8rem" }} href="https://islandgirltoken.com/#contact">CONTACT</a>
                            </li>

                        </ul>
                        <span id="slide-line"></span>
                        <form className="form-inline mt-2 mt-md-0" style={{ marginLeft: "20px" }}>
                            <p className="btn btn-sm btn-gradient-purple btn-glow my-2 my-sm-0 animated" data-animation="fadeInDown" data-animation-delay="1.8s" onClick={connectWallet}>{account ? shortAddress(account) : `Connect`}</p>
                        </form>
                    </div>
                </div>
            </div>
            </nav>
            <NotificationContainer />
        </header>
    )
}

const mapStateToProps = (state) => ({
    account: state.mystery.account
})

export default connect(mapStateToProps, { setAccount })(Navbar);
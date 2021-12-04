import React, { useState } from 'react';
import { Stack, Button } from '@mui/material';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

const Navbar = () => {
    const [account, setAccount] = useState("");

    const connectWallet = async () => {
        if (window.ethereum) {
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

    return (
        <Stack direction='row' justifyContent='flex-end'>
            <Button variant='contained' color='primary' onClick={connectWallet}>{account ? shortAddress(account) : `Connect`}</Button>
            <NotificationContainer />
        </Stack>
    )
}

export default Navbar;
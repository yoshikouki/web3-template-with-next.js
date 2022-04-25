import { useCallback, useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

const AccountStatus = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const disconnectWallet = useCallback(() => {
    setAccount(null);
  }, []);
  const connectWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      const web3Modal = new Web3Modal({
        cacheProvider: true,
      });
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      provider.on("disconnect", disconnectWallet);
      const accounts = await provider.send("eth_accounts", []);
      setAccount(accounts[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  }, []);

  return isLoading ? (
    <button className="btn btn-ghost loading"></button>
  ) : account ? (
    <div className="dropdown dropdown-hover">
      <label className="btn btn-ghost">{account}</label>
      <ul
        className="p-4 shadow dropdown-content menu bg-base-100 rounded-box"
        tabIndex={0}
      >
        <li>
          <label className="btn btn-ghost" onClick={disconnectWallet}>
            Disconnect
          </label>
        </li>
      </ul>
    </div>
  ) : (
    <button className="btn btn-ghost" onClick={() => void connectWallet()}>
      Connect Wallet
    </button>
  );
};

export default AccountStatus;
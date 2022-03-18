import {ethers} from 'ethers';

import networkUrls from '../../constants/networkUrls';

let NETWORK_URL =
  networkUrls.ENV === 'development'
    ? networkUrls.TEST_NETWORK_URL
    : networkUrls.PRODUCTION_NETWORK_URL;

const ABI = {
  TOKEN: require(`../../assets/contracts/aidToken.json`),
  RAHAT: require(`../../assets/contracts/rahat.json`),
  ERC20: require(`../../assets/contracts/erc20.json`),
  ERC721: require(`../../assets/contracts/erc721.json`),
};

// const DefaultProvider = new ethers.providers.JsonRpcProvider(
//   getDefaultNetwork(),
// );
const getAgencyDetails = async (agencyAddress, tokenAddress) => {
  //   const details = await DataService.getAgency(agencyAddress);
  //   if (!details) throw Error('Agency does not exists');
  //   const provider = details.network
  //     ? new ethers.providers.JsonRpcProvider(details.network)
  //     : DefaultProvider;
  const details = agencyAddress;

  const provider = new ethers.providers.JsonRpcProvider(NETWORK_URL);
  const rahatContract = new ethers.Contract(agencyAddress, ABI.RAHAT, provider);
  const tokenContract = new ethers.Contract(
    // details.tokenAddress,
    tokenAddress,
    ABI.TOKEN,
    provider,
  );
  return {
    details,
    provider,
    rahatContract,
    tokenContract,
  };
};

const RahatService = (agencyAddress, wallet, tokenAddress) => {
  return {
    async getContract() {
      const agency = await getAgencyDetails(agencyAddress, tokenAddress);
      return agency.rahatContract.connect(wallet);
    },
    async chargeCustomer(phone, amount) {
      const contract = await this.getContract();
      let benBalance = await contract.tokenBalance(phone);
      if (amount > benBalance.toNumber()) {
        // error token amount is greater than remaining blance
        // alert('token amount is greater than remaining blance');
        return;
      }
      const tx = await contract.createClaim(Number(phone), Number(amount));
      return tx.wait();
    },
    async verifyCharge(phone, otp) {
      const contract = await this.getContract();
      const tx = await contract.getTokensFromClaim(Number(phone), otp);
      return tx.wait();
    },
  };
};

const TokenService = (agencyAddress, wallet, tokenAddress) => {
  return {
    async getContract() {
      const agency = await getAgencyDetails(agencyAddress, tokenAddress);
      return agency.tokenContract.connect(wallet);
      // return agency.tokenContract.connect(wallet)
    },

    async getBalance(address) {
      const contract = await this.getContract();
      return contract.balanceOf(address);
    },
    async transfer(address, amount) {
      const contract = await this.getContract();
      const tx = await contract.transfer(address, Number(amount));
      return tx.wait();
    },
  };
};

export {RahatService, TokenService};

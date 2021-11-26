import {ethers} from 'ethers';
// import { getDefaultNetwork } from '../constants/networks';

// const DEFAULT_NETWORK = 'https://testnetwork.esatya.io';
// const DEFAULT_NETWORK = {
//   name: 'rumsan_test',
//   url: 'https://testnetwork.esatya.io',
//   display: 'Rumsan Test Network',
//   default: true,
// };
const TOKEN_ADDRESS = '0xc367a378CE8358885CA6ea23c6311366F5707176';

const ABI = {
  TOKEN: require(`../../assets/contracts/aidToken.json`),
  RAHAT: require(`../../assets/contracts/rahat.json`),
  ERC20: require(`../../assets/contracts/erc20.json`),
  ERC721: require(`../../assets/contracts/erc721.json`),
};

// const DefaultProvider = new ethers.providers.JsonRpcProvider(
//   getDefaultNetwork(),
// );
const getAgencyDetails = async agencyAddress => {
  //   const details = await DataService.getAgency(agencyAddress);
  //   if (!details) throw Error('Agency does not exists');
  //   const provider = details.network
  //     ? new ethers.providers.JsonRpcProvider(details.network)
  //     : DefaultProvider;
  const details = agencyAddress;

  const provider = new ethers.providers.JsonRpcProvider(
    'https://testnetwork.esatya.io',
  );
  const rahatContract = new ethers.Contract(agencyAddress, ABI.RAHAT, provider);
  const tokenContract = new ethers.Contract(
    // details.tokenAddress,
    TOKEN_ADDRESS,
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

const RahatService = (agencyAddress, wallet) => {
  return {
    async getContract() {
      const agency = await getAgencyDetails(agencyAddress);
      return agency.rahatContract.connect(wallet);
    },
    async chargeCustomer(phone, amount) {
      const contract = await this.getContract();
      //let benBalance = await contract.tokenBalance(phone);
      // if (amount > benBalance.toNumber()) {
      // 	// waring token amount is greater than remaining blance
      // }
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

const TokenService = (agencyAddress, wallet) => {
  return {
    async getContract() {
      const agency = await getAgencyDetails(agencyAddress);
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

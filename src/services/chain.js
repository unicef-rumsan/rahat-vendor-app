import {ethers} from 'ethers';

const ABI = {
  TOKEN: require('../../assets/contracts/RahatERC20.json'),
  RAHAT: require('../../assets/contracts/Rahat.json'),
};

const getAgencyDetails = async (agencyAddress, tokenAddress) => {
  const details = agencyAddress;
  const provider = new ethers.providers.JsonRpcProvider(
    'https://testnetwork.esatya.io',
  );
  const rahatContract = new ethers.Contract(
    agencyAddress,
    ABI.RAHAT.abi,
    provider,
  );
  const tokenContract = new ethers.Contract(
    tokenAddress,
    ABI.TOKEN.abi,
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

    async getErc20Balance(phone) {
      const contract = await this.getContract();
      let usersBalance = await contract.erc20Balance(phone);
      return usersBalance.toNumber();
    },

    async chargeCustomerERC20(phone, amount) {
      const contract = await this.getContract();
      const tx = await contract.createERC20Claim(Number(phone), Number(amount));
      return tx.wait();
    },
    async verifyChargeForERC20(phone, otp) {
      const contract = await this.getContract();
      const tx = await contract.getERC20FromClaim(Number(phone), otp);
      return tx.wait();
    },
  };
};

const TokenService = (agencyAddress, wallet, tokenAddress, nftAddress) => {
  return {
    async getContract() {
      const agency = await getAgencyDetails(
        agencyAddress,
        tokenAddress,
        nftAddress,
      );
      return agency.tokenContract;
    },

    async getBalance(address) {
      const contract = await this.getContract();
      return contract.connect(wallet)?.balanceOf(address);
    },
    async transfer(address, amount) {
      const contract = await this.getContract();
      const tx = await contract
        .connect(wallet)
        ?.transfer(address, Number(amount));
      return tx.wait();
    },
  };
};

export {RahatService, TokenService};

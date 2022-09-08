import {ethers} from 'ethers';

const ABI = {
  // TOKEN: require(`../../assets/contracts/aidToken.json`),
  TOKEN: require(`../../assets/contracts/RahatERC20.json`),
  RAHAT: require(`../../assets/contracts/Rahat.json`),
  ERC20: require(`../../assets/contracts/RahatERC20.json`),
  ERC721: require(`../../assets/contracts/erc721.json`),
  ERC1155: require('../../assets/contracts/RahatERC1155.json'),
};

const getAgencyDetails = async (agencyAddress, tokenAddress, nftAddress) => {
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

  const nftContract = new ethers.Contract(
    nftAddress,
    ABI.ERC1155.abi,
    provider,
  );

  return {
    details,
    provider,
    rahatContract,
    tokenContract,
    nftContract,
  };
};

const RahatService = (agencyAddress, wallet, tokenAddress, nftAddress) => {
  return {
    async getContract() {
      const agency = await getAgencyDetails(
        agencyAddress,
        tokenAddress,
        nftAddress,
      );
      return agency.rahatContract.connect(wallet);
    },

    async getErc20Balance(phone) {
      const contract = await this.getContract();
      let usersBalance = await contract.erc20Balance(phone);
      return usersBalance.toNumber();
    },

    async getTotalERC1155Balance(phone) {
      const contract = await this.getContract();
      return contract.getTotalERC1155Balance(Number(phone));
    },

    async chargeCustomerERC20(phone, amount) {
      const contract = await this.getContract();
      const tx = await contract.createERC20Claim(Number(phone), Number(amount));
      return tx.wait();
    },
    async verifyChargeForERC20(phone, otp) {
      const contract = await this.getContract();
      // const tx = await contract.getTokensFromClaim(Number(phone), otp);
      const tx = await contract.getERC20FromClaim(Number(phone), otp);
      return tx.wait();
    },

    async chargeCustomerERC1155(phone, amount, tokenId) {
      const contract = await this.getContract();

      const tx = await contract.createERC1155Claim(
        Number(phone),
        Number(amount),
        Number(tokenId),
      );

      return tx.wait();
    },
    async verifyChargeForERC1155(phone, otp, tokenId) {
      const contract = await this.getContract();
      const tx = await contract.getERC1155FromClaim(
        Number(phone),
        otp,
        Number(tokenId),
      );

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
      // return agency.tokenContract.connect(wallet)
    },

    async getBalance(address) {
      const contract = await this.getContract();
      return contract.connect(wallet)?.balanceOf(address);
      // const test = contract.
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

const ERC1155_Service = (agencyAddress, tokenAddress, nftAddress, wallet) => {
  return {
    async getContract() {
      const agency = await getAgencyDetails(
        agencyAddress,
        tokenAddress,
        nftAddress,
      );
      return wallet ? agency.nftContract.connect(wallet) : agency.nftContract;
    },

    async getBatchBalance(walletAddress, tokenIds) {
      const address = Array.isArray(walletAddress)
        ? walletAddress
        : [walletAddress];
      const ids = Array.isArray(tokenIds) ? tokenIds : [tokenIds];
      if (address.length !== ids.length) return null;
      const contract = await this.getContract();
      return contract.balanceOfBatch(address, ids);
    },
    async batchRedeem(from, to, tokenIds = [], amounts = [], data = []) {
      if (!tokenIds?.length) return;
      if (!amounts?.length) return;
      if (tokenIds.length !== amounts.length) return;
      const contract = await this.getContract();
      const tx = await contract.safeBatchTransferFrom(
        from,
        to,
        tokenIds,
        amounts,
        data,
      );
      return tx.wait();
    },
  };
};

export {RahatService, TokenService, ERC1155_Service};

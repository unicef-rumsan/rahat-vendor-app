import axios from "axios";

export const getPackageDetail = async (obj, type) => {
    let tokenIds;
    if (type === 'getPackages') {
      tokenIds = obj.tokenIds?.map(t => t);
    } else {
      tokenIds = obj.tokenIds?.map(t => t?.toNumber());
    }
    try {
      let packages = [];
      await Promise.all(
        tokenIds?.map(async (item, index) => {
          let balance;
          if (type === 'getPackages') {
            balance = obj.balances[index];
          } else {
            balance = obj.balances[index].toNumber();
          }
          const response = await axios.get(
            `https://agency-nft.rahat.io/api/v1/nft/token/${item}`,
          );
          const data = response.data;
          // balance = (type = 'getPackages'
          //   ? obj.balances[index]
          //   : obj.balances[index].toNumber());
          const pkg = {
            tokenId: data.tokenId,
            name: data.name,
            symbol: data.symbol,
            description:
              data.metadata && data.metadata.description
                ? data.metadata.description
                : '',
            value:
              data.metadata && data.metadata.fiatValue
                ? data.metadata.fiatValue
                : '',
            imageUri:
              data.metadata && data.metadata.packageImgURI
                ? data.metadata.packageImgURI
                : '',
            balance,
          };
          packages = [...packages, pkg];
        }),
      );
      return packages;
    } catch (_) {
      //
    }
  };
  
  export const getPackages = async (data, dataType) => {
    try {
      let packages = await getPackageDetail(data, dataType);
      let temp = [];
      packages?.map(res => {
        if (temp.length > 0) {
          if (temp.some(i => i.tokenId === res.tokenId)) {
            temp.map(tempItem => {
              if (res.tokenId === tempItem.tokenId) {
                return (tempItem.balance = tempItem.balance + res.balance);
              }
            });
            return;
          }
        }
        temp = [...temp, res];
      });
      return temp;
    } catch (e) {
      // alert(e);
    }
  };
  
  export const getCombinedPackages = packages => {
    let temp = [];
    packages?.map(res => {
      if (temp.length > 0) {
        if (temp.some(i => i.tokenId === res.tokenId)) {
          temp.map(tempItem => {
            if (res.tokenId === tempItem.tokenId) {
              return (tempItem.amount = tempItem.amount + res.amount);
            }
          });
          return;
        }
      }
      temp = [...temp, res];
    });
    return temp;
  };
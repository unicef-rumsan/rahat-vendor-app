export const getActiveAgencyTransactions = (activeAppSettings, transactions) => {
    try {
      if (transactions?.length) {
        const filteredTransactions = transactions?.filter(
          item => item?.agencyUrl === activeAppSettings?.agencyUrl,
        );
        return filteredTransactions;
      }
      return [];
    } catch (e) {
      // alert(e);
    }
  };
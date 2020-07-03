const ScrapFunctions = {
  getTheObject: (
    Success = true,
    Message,
    pageTitle,
    PageLink,
    screenPath,
    dateTime,
    proxy
  ) => {
    return {
      Success: Success,
      Message: Message,
      PageTitle: pageTitle,
      PageLink: PageLink,
      screenPath: screenPath,
      dateTime: dateTime,
      proxy
    };
  },
  fullDate: () => {
    const today = new Date();
    const date =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();
    const time =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const fullDate = date + ' ' + time;
    return fullDate.toString();
  }
};

module.exports = ScrapFunctions;

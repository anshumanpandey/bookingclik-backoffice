export default {
  header: {
    self: {},
    items: []
  },
  aside: {
    self: {},
    items: [
      {
        title: "Transactions",
        root: true,
        icon: "flaticon2-architecture-and-city",
        page: "transactions",
        roles: ['broker', 'supplier'],
        desc: 'Map your codes to an IATA code'
      },
      {
        title: "Clicks",
        root: true,
        icon: "flaticon2-architecture-and-city",
        page: "click",
        roles: ['broker', 'supplier'],
        desc: 'Map your codes to an IATA code'
      },
      {
        title: "Suppliers",
        root: true,
        icon: "flaticon2-architecture-and-city",
        page: "supplier",
        roles: ['super_admin'],
        desc: 'Map your codes to an IATA code'
      },
    ]
  }
};

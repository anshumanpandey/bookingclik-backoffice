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
        title: "Banner Advertising",
        root: true,
        icon: "flaticon2-architecture-and-city",
        page: "bannerAdvertising",
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
      {
        title: "Visitors",
        root: true,
        icon: "flaticon2-architecture-and-city",
        page: "visitors",
        roles: ['super_admin'],
        desc: 'Map your codes to an IATA code'
      },
      {
        title: "Banners Config",
        root: true,
        icon: "flaticon2-architecture-and-city",
        page: "banner-meta",
        roles: ['super_admin'],
        desc: 'Map your codes to an IATA code'
      },
      {
        title: "Location Review",
        root: true,
        icon: "flaticon2-architecture-and-city",
        page: "valuatedLocations",
        roles: ['super_admin'],
        desc: 'Map your codes to an IATA code'
      },
      {
        title: "Website Settings",
        bullet: "dot",
        roles: ['super_admin'],
        submenu: [
          {
            title: "Top Locations",
            root: true,
            icon: "flaticon2-architecture-and-city",
            page: "top-locations",
            roles: ['super_admin'],
            desc: 'Map your codes to an IATA code'
          },
          {
            title: "About",
            root: true,
            icon: "flaticon2-architecture-and-city",
            page: "about",
            roles: ['super_admin'],
            desc: 'Map your codes to an IATA code'
          },
        ]
      }
    ]
  }
};

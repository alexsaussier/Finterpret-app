export const mockBalances = [
  {
    currency: {
      id: "87b24961-b51e-4db8-9226-f198f6518a89",
      code: "USD",
      name: "US Dollar",
    },
    cash: 300.71,
    buying_power: 410.71,
  },
];

export const mockPositions = [
  {
    symbol: {
      id: "2bcd7cc3-e922-4976-bce1-9858296801c3",
      description: "VANGUARD CDN AGGREGATE BOND INDEX ETF",
      symbol: {
        id: "2bcd7cc3-e922-4976-bce1-9858296801c3",
        symbol: "VAB.TO",
        raw_symbol: "VAB",
        description: "VANGUARD CDN AGGREGATE BOND INDEX ETF",
        figi_code: "BBG000B9XRY4",
      },
      local_id: "3291231",
      is_quotable: true,
      is_tradable: true,
    },
    units: 40,
    price: 113.15,
    open_pnl: 0.44,
    fractional_units: 1.44,
    average_purchase_price: 108.3353,
  },
  {
    symbol: {
      id: "c2cd7cc3-e922-4976-bce1-9858296801c3",
      description: "APPLE INC",
      symbol: {
        id: "c2cd7cc3-e922-4976-bce1-9858296801c3",
        symbol: "AAPL",
        raw_symbol: "AAPL",
        description: "APPLE INC",
        figi_code: "BBG000B9XRY4",
      },
      local_id: "3291232",
      is_quotable: true,
      is_tradable: true,
    },
    units: 20,
    price: 130.45,
    open_pnl: -5.3,
    fractional_units: 0.5,
    average_purchase_price: 128.35,
  },
  {
    symbol: {
      id: "e2cd7cc3-e922-4976-bce1-9858296801c3",
      description: "TESLA INC",
      symbol: {
        id: "e2cd7cc3-e922-4976-bce1-9858296801c3",
        symbol: "TSLA",
        raw_symbol: "TSLA",
        description: "TESLA INC",
        figi_code: "BBG000B9XRY4",
      },
      local_id: "3291233",
      is_quotable: true,
      is_tradable: true,
    },
    units: 10,
    price: 660.2,
    open_pnl: 32.1,
    fractional_units: 0.2,
    average_purchase_price: 650.15,
  },
];

export const mockOption_positions = [
  {
    symbol: {
      id: "2bcd7cc3-e922-4976-bce1-9858296801c3",
      description: "VANGUARD CDN AGGREGATE BOND INDEX ETF",
      allows_fractional_units: true,
      option_symbol: {
        id: "2bcd7cc3-e922-4976-bce1-9858296801c3",
        ticker: "SPY 220819P00200000",
        option_type: "PUT",
        strike_price: 200,
        expiration_date: "2017-07-17T15:13:07.177712+00:00",
        is_mini_option: false,
        local_id: "40817960",
        exchange_id: "6e73ee7b-fdf3-44c2-947d-260c3ee72506",
      },
    },
    price: 31.33,
    units: 10,
    currency: {
      id: "87b24961-b51e-4db8-9226-f198f6518a89",
      code: "USD",
      name: "US Dollar",
    },
    average_purchase_price: 108.3353,
  },
  {
    symbol: {
      id: "c2cd7cc3-e922-4976-bce1-9858296801c3",
      description: "MICROSOFT CORPORATION",
      allows_fractional_units: true,
      option_symbol: {
        id: "c2cd7cc3-e922-4976-bce1-9858296801c3",
        ticker: "MSFT 220819C00250000",
        option_type: "CALL",
        strike_price: 250,
        expiration_date: "2017-07-17T15:13:07.177712+00:00",
        is_mini_option: false,
        local_id: "40817961",
        exchange_id: "6e73ee7b-fdf3-44c2-947d-260c3ee72506",
      },
    },
    price: 12.5,
    units: 5,
    currency: {
      id: "87b24961-b51e-4db8-9226-f198f6518a89",
      code: "USD",
      name: "US Dollar",
    },
    average_purchase_price: 11.75,
  },
  {
    symbol: {
      id: "e2cd7cc3-e922-4976-bce1-9858296801c3",
      description: "ALPHABET INC",
      allows_fractional_units: true,
      option_symbol: {
        id: "e2cd7cc3-e922-4976-bce1-9858296801c3",
        ticker: "GOOGL 220819C03000000",
        option_type: "CALL",
        strike_price: 3000,
        expiration_date: "2017-07-17T15:13:07.177712+00:00",
        is_mini_option: false,
        local_id: "40817962",
        exchange_id: "6e73ee7b-fdf3-44c2-947d-260c3ee72506",
      },
    },
    price: 700.25,
    units: 2,
    currency: {
      id: "87b24961-b51e-4db8-9226-f198f6518a89",
      code: "USD",
      name: "US Dollar",
    },
    average_purchase_price: 695.5,
  },
];

export const mockOrders = [
  {
    brokerage_order_id: "string",
    status: "NONE",
    symbol: "2bcd7cc3-e922-4976-bce1-9858296801c3",
    universal_symbol: {
      /* your universal symbol data */
    },
    option_symbol: {
      /* your option symbol data */
    },
    action: "BUY",
    total_quantity: 0,
    open_quantity: 0,
    canceled_quantity: 0,
    filled_quantity: 0,
    execution_price: 31.33,
    limit_price: 31.33,
    stop_price: 31.33,
    order_type: "Limit",
    time_in_force: "string",
    time_placed: "2022-01-21T20:11:19.217Z",
    time_updated: "2022-01-21T20:11:19.217Z",
    time_executed: "2022-01-21T20:11:19.217Z",
    expiry_date: "2022-01-21T20:11:19.217Z",
  },
];

export const mockTotalValue = {
  value: 32600.71,
  currency: "USD",
};

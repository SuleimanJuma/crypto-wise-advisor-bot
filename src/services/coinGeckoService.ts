
interface CoinGeckoPrice {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
    usd_market_cap?: number;
  };
}

interface LiveCryptoData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap?: number;
  trend: string;
}

const COINGECKO_IDS: { [key: string]: string } = {
  'BTC': 'bitcoin',
  'BITCOIN': 'bitcoin',
  'ETH': 'ethereum',
  'ETHEREUM': 'ethereum',
  'ADA': 'cardano',
  'CARDANO': 'cardano',
  'SOL': 'solana',
  'SOLANA': 'solana',
  'DOT': 'polkadot',
  'POLKADOT': 'polkadot',
  'BNB': 'binancecoin',
  'BINANCE': 'binancecoin',
  'XRP': 'ripple',
  'RIPPLE': 'ripple',
  'DOGE': 'dogecoin',
  'DOGECOIN': 'dogecoin',
  'MATIC': 'matic-network',
  'POLYGON': 'matic-network',
  'AVAX': 'avalanche-2',
  'AVALANCHE': 'avalanche-2',
};

const COIN_NAMES: { [key: string]: string } = {
  'bitcoin': 'Bitcoin',
  'ethereum': 'Ethereum',
  'cardano': 'Cardano',
  'solana': 'Solana',
  'polkadot': 'Polkadot',
  'binancecoin': 'Binance Coin',
  'ripple': 'XRP',
  'dogecoin': 'Dogecoin',
  'matic-network': 'Polygon',
  'avalanche-2': 'Avalanche',
};

export const fetchLiveCryptoPrice = async (symbol: string): Promise<LiveCryptoData | null> => {
  try {
    const upperSymbol = symbol.toUpperCase();
    const coinId = COINGECKO_IDS[upperSymbol];
    
    if (!coinId) {
      throw new Error(`Cryptocurrency ${symbol} not supported`);
    }

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CoinGeckoPrice = await response.json();
    const coinData = data[coinId];

    if (!coinData) {
      throw new Error(`No data found for ${symbol}`);
    }

    const change24h = coinData.usd_24h_change || 0;
    const trend = change24h > 0 ? '📈' : change24h < 0 ? '📉' : '➡️';

    return {
      symbol: upperSymbol,
      name: COIN_NAMES[coinId] || symbol,
      price: coinData.usd,
      change24h,
      marketCap: coinData.usd_market_cap,
      trend,
    };
  } catch (error) {
    console.error('Error fetching live crypto price:', error);
    return null;
  }
};

export const getSupportedCryptocurrencies = (): string[] => {
  return Object.keys(COINGECKO_IDS);
};


import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LivePriceData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap?: number;
  trend: string;
}

interface LivePriceDisplayProps {
  data: LivePriceData;
}

const LivePriceDisplay: React.FC<LivePriceDisplayProps> = ({ data }) => {
  const formatPrice = (price: number) => {
    if (price >= 1) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return `$${price.toFixed(6)}`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  const isPositive = data.change24h >= 0;

  return (
    <Card className="bg-slate-700/50 border-slate-600 mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="text-green-400" size={20} />
            <span>{data.name} ({data.symbol})</span>
          </div>
          <span className="text-2xl">{data.trend}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Current Price */}
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-1">Current Price</p>
            <p className="text-white text-2xl font-bold">{formatPrice(data.price)}</p>
          </div>

          {/* 24h Change */}
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-1">24h Change</p>
            <div className="flex items-center justify-center gap-1">
              {isPositive ? (
                <TrendingUp size={16} className="text-green-400" />
              ) : (
                <TrendingDown size={16} className="text-red-400" />
              )}
              <Badge 
                className={`text-lg font-semibold ${
                  isPositive ? 'bg-green-600 hover:bg-green-600' : 'bg-red-600 hover:bg-red-600'
                }`}
              >
                {isPositive ? '+' : ''}{data.change24h.toFixed(2)}%
              </Badge>
            </div>
          </div>

          {/* Market Cap */}
          {data.marketCap && (
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-1">Market Cap</p>
              <p className="text-white text-lg font-semibold">{formatMarketCap(data.marketCap)}</p>
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <p className="text-slate-400 text-xs">
            Live data from CoinGecko • Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LivePriceDisplay;

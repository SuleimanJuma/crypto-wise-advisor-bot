
import React from 'react';
import { TrendingUp, TrendingDown, Leaf, DollarSign, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import CryptoChart from './CryptoChart';

interface CryptoAnalysisProps {
  data: {
    symbol: string;
    name: string;
    price: number;
    change24h: number;
    volume: number;
    marketCap: number;
    priceHistory: number[];
    profitabilityScore: number;
    sustainabilityScore: number;
    recommendation: 'BUY' | 'HOLD' | 'SELL';
    analysis: string;
  };
}

const CryptoAnalysis: React.FC<CryptoAnalysisProps> = ({ data }) => {
  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'BUY': return 'bg-green-600';
      case 'HOLD': return 'bg-yellow-600';
      case 'SELL': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-4 mt-4">
      {/* Price Overview */}
      <Card className="bg-slate-700/50 border-slate-600">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="text-green-400" />
              {data.name} ({data.symbol})
            </CardTitle>
            <Badge className={getRecommendationColor(data.recommendation)}>
              {data.recommendation}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-slate-400 text-sm">Current Price</p>
              <p className="text-white text-xl font-bold">{formatNumber(data.price)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">24h Change</p>
              <p className={`text-lg font-semibold flex items-center gap-1 ${
                data.change24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {data.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {data.change24h.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Volume</p>
              <p className="text-white text-lg font-semibold">{formatNumber(data.volume)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Market Cap</p>
              <p className="text-white text-lg font-semibold">{formatNumber(data.marketCap)}</p>
            </div>
          </div>
          
          {/* Price Chart */}
          <div className="mt-4">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <BarChart3 className="text-blue-400" size={16} />
              30-Day Price Trend
            </h4>
            <CryptoChart data={data.priceHistory} symbol={data.symbol} />
          </div>
        </CardContent>
      </Card>

      {/* Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-700/50 border-slate-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="text-green-400" />
              Profitability Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Overall Score</span>
                <span className={`font-bold text-xl ${getScoreColor(data.profitabilityScore)}`}>
                  {data.profitabilityScore.toFixed(0)}/100
                </span>
              </div>
              <Progress 
                value={data.profitabilityScore} 
                className="h-2"
              />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-slate-400">
                  <p>Price Momentum</p>
                  <p>Trading Activity</p>
                </div>
                <div className="text-slate-300 text-right">
                  <p>{data.change24h >= 0 ? 'Positive' : 'Negative'}</p>
                  <p>{data.volume > 100000000 ? 'High' : 'Moderate'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-700/50 border-slate-600">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center gap-2">
              <Leaf className="text-blue-400" />
              Sustainability Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Overall Score</span>
                <span className={`font-bold text-xl ${getScoreColor(data.sustainabilityScore)}`}>
                  {data.sustainabilityScore.toFixed(0)}/100
                </span>
              </div>
              <Progress 
                value={data.sustainabilityScore} 
                className="h-2"
              />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-slate-400">
                  <p>Energy Efficiency</p>
                  <p>Project Viability</p>
                </div>
                <div className="text-slate-300 text-right">
                  <p>{data.sustainabilityScore > 60 ? 'Good' : 'Concerning'}</p>
                  <p>{data.sustainabilityScore > 70 ? 'Strong' : 'Moderate'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis */}
      <Card className="bg-slate-700/50 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Investment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 leading-relaxed">{data.analysis}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoAnalysis;

import React, { useState, useRef, useEffect } from 'react';
import { Send, TrendingUp, Leaf, DollarSign, BarChart3, Zap, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import CryptoChart from '@/components/CryptoChart';
import CryptoAnalysis from '@/components/CryptoAnalysis';
import { fetchLiveCryptoPrice, getSupportedCryptocurrencies } from '@/services/coinGeckoService';
import LivePriceDisplay from '@/components/LivePriceDisplay';
import { getGlossary } from '@/glossary';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  cryptoData?: any;
  livePriceData?: any;
}

interface CryptoData {
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
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your cryptocurrency investment advisor. I analyze both profitability and sustainability factors to provide you with informed investment recommendations. Try asking me about Bitcoin, Ethereum, or any other cryptocurrency!",
      isBot: true,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if user is asking for live price data
    const priceKeywords = ['price', 'cost', 'worth', 'value', 'current', 'live', 'real-time'];
    const isPriceQuery = priceKeywords.some(keyword => 
      currentInput.toLowerCase().includes(keyword)
    );

    // Extract cryptocurrency symbol from user input
    const cryptoSymbols = ['BTC', 'ETH', 'ADA', 'SOL', 'DOT', 'BITCOIN', 'ETHEREUM', 'CARDANO', 'SOLANA', 'POLKADOT', 'BNB', 'BINANCE', 'XRP', 'RIPPLE', 'DOGE', 'DOGECOIN', 'MATIC', 'POLYGON', 'AVAX', 'AVALANCHE'];
    const input = currentInput.toLowerCase();
    let detectedCrypto = '';

    for (const symbol of cryptoSymbols) {
      if (input.includes(symbol.toLowerCase())) {
        detectedCrypto = symbol.substring(0, 3).toUpperCase();
        if (detectedCrypto === 'BIT') detectedCrypto = 'BTC';
        if (detectedCrypto === 'ETH') detectedCrypto = 'ETH';
        if (detectedCrypto === 'CAR') detectedCrypto = 'ADA';
        if (detectedCrypto === 'SOL') detectedCrypto = 'SOL';
        if (detectedCrypto === 'POL') detectedCrypto = 'DOT';
        if (detectedCrypto === 'BNB' || detectedCrypto === 'BIN') detectedCrypto = 'BNB';
        if (detectedCrypto === 'XRP' || detectedCrypto === 'RIP') detectedCrypto = 'XRP';
        if (detectedCrypto === 'DOG') detectedCrypto = 'DOGE';
        if (detectedCrypto === 'MAT') detectedCrypto = 'MATIC';
        if (detectedCrypto === 'AVA') detectedCrypto = 'AVAX';
        break;
      }
    }

    let botResponse: Message;

    if (detectedCrypto && isPriceQuery) {
      // Fetch live price data
      try {
        const livePriceData = await fetchLiveCryptoPrice(detectedCrypto);
        
        if (livePriceData) {
          botResponse = {
            id: (Date.now() + 1).toString(),
            text: `Here's the current live price for ${livePriceData.name}:`,
            isBot: true,
            timestamp: new Date(),
            livePriceData,
          };
        } else {
          botResponse = {
            id: (Date.now() + 1).toString(),
            text: `Sorry, I couldn't fetch the current price for ${detectedCrypto}. Please try again or ask about a different cryptocurrency.`,
            isBot: true,
            timestamp: new Date(),
          };
        }
      } catch (error: any) {
        let errorMsg = 'There was an error fetching the live price data. Please check your internet connection and try again.';
        if (error instanceof Error) {
          errorMsg += `\nDetails: ${error.message}`;
        }
        toast({
          title: 'API Error',
          description: errorMsg,
          variant: 'destructive',
        });
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: errorMsg,
          isBot: true,
          timestamp: new Date(),
        };
      }
    } else if (detectedCrypto && !isPriceQuery) {
      // Generate analysis data (existing functionality)
      const cryptoData = generateCryptoData(detectedCrypto);
      botResponse = {
        id: (Date.now() + 1).toString(),
        text: `Here's my analysis for ${cryptoData.name} (${cryptoData.symbol}):`,
        isBot: true,
        timestamp: new Date(),
        cryptoData,
      };
    } else {
      const supportedCoins = getSupportedCryptocurrencies().slice(0, 8).join(', ');
      botResponse = {
        id: (Date.now() + 1).toString(),
        text: `I can help you with cryptocurrency analysis and live price lookups! 

For **live prices**, try asking: "What's the price of Bitcoin?" or "Show me Ethereum's current value"

For **detailed analysis**, ask: "Analyze Bitcoin" or "Tell me about Ethereum"

Supported cryptocurrencies: ${supportedCoins}, and more!`,
        isBot: true,
        timestamp: new Date(),
      };
    }

    // Check for glossary/jargon queries
    const glossaryKeywords = ['what is', 'define', 'explain', 'meaning of'];
    const isGlossaryQuery = glossaryKeywords.some(keyword => input.startsWith(keyword));
    if (isGlossaryQuery) {
      // Extract the term after the keyword
      let term = input;
      for (const keyword of glossaryKeywords) {
        if (term.startsWith(keyword)) {
          term = term.replace(keyword, '').trim();
        }
      }
      // Remove punctuation and extra spaces
      term = term.replace(/[^a-zA-Z0-9 ]/g, '').trim();
      // Capitalize first letter of each word for matching
      term = term.replace(/\b\w/g, c => c.toUpperCase());
      // Try to find the term in the glossary
      const glossary = getGlossary();
      const entry = glossary.find((e: any) => e.term.toLowerCase() === term.toLowerCase());
      if (entry) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: `**${entry.term}**: ${entry.definition}`,
          isBot: true,
          timestamp: new Date(),
        };
      } else {
        botResponse = {
          id: (Date.now() + 1).toString(),
          text: `Sorry, I couldn't find a definition for "${term}" in the glossary.`,
          isBot: true,
          timestamp: new Date(),
        };
      }
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
      return;
    }

    setMessages(prev => [...prev, botResponse]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  function generateCryptoData(symbol: string): CryptoData {
    // Dummy data for demonstration; replace with real analysis logic as needed
    const upper = symbol.toUpperCase();
    return {
      symbol: upper,
      name: upper === 'BTC' ? 'Bitcoin' : upper === 'ETH' ? 'Ethereum' : upper === 'ADA' ? 'Cardano' : upper === 'SOL' ? 'Solana' : upper,
      price: Math.random() * 50000 + 1000,
      change24h: (Math.random() - 0.5) * 10,
      volume: Math.random() * 100000000,
      marketCap: Math.random() * 1000000000,
      priceHistory: Array.from({ length: 30 }, () => Math.random() * 50000 + 1000),
      profitabilityScore: Math.floor(Math.random() * 100),
      sustainabilityScore: Math.floor(Math.random() * 100),
      recommendation: ['BUY', 'HOLD', 'SELL'][Math.floor(Math.random() * 3)] as 'BUY' | 'HOLD' | 'SELL',
      analysis: 'This is a sample analysis. Replace with real data for production.'
    };
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <BarChart3 className="text-blue-400" />
            CryptoAdvisor AI
          </h1>
          <p className="text-gray-300 text-lg">
            Real-time cryptocurrency prices and advanced investment analysis
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-green-400">
              <TrendingUp size={20} />
              <span className="text-sm">Live Price Data</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <Leaf size={20} />
              <span className="text-sm">Sustainability Metrics</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <ShieldCheck size={20} />
              <span className="text-sm">Investment Analysis</span>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-[600px] flex flex-col">
              <CardHeader className="border-b border-slate-700">
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="text-blue-400" />
                  Chat Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-4">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div key={message.id}>
                      <div
                        className={`flex ${
                          message.isBot ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.isBot
                              ? 'bg-slate-700 text-white'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.text}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      
                      {message.livePriceData && (
                        <div className="mt-4">
                          <LivePriceDisplay data={message.livePriceData} />
                        </div>
                      )}
                      
                      {message.cryptoData && (
                        <div className="mt-4">
                          <CryptoAnalysis data={message.cryptoData} />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-700 text-white p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                          <span>Fetching live cryptocurrency data...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about live prices or analysis: 'What's Bitcoin's price?' or 'Analyze Ethereum'"
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={isLoading || !inputValue.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with additional info */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="text-green-400" />
                  Quick Commands
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-green-400 font-semibold mb-2">Live Price Lookup</h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• "What's Bitcoin's price?"</li>
                    <li>• "Show me Ethereum value"</li>
                    <li>• "Current Solana cost"</li>
                    <li>• "Live Cardano price"</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-blue-400 font-semibold mb-2">Investment Analysis</h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• "Analyze Bitcoin"</li>
                    <li>• "Tell me about Ethereum"</li>
                    <li>• "Solana investment advice"</li>
                    <li>• "Should I buy Cardano?"</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Popular Cryptocurrencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Bitcoin (BTC)', 'Ethereum (ETH)', 'Cardano (ADA)', 'Solana (SOL)', 'Polkadot (DOT)'].map((crypto) => (
                    <Button
                      key={crypto}
                      variant="ghost"
                      className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700"
                      onClick={() => setInputValue(`What's the price of ${crypto}?`)}
                    >
                      {crypto}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

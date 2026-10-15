import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

type Currency = 'PKR' | 'USD';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  exchangeRate: number;
  formatPrice: (pricePKR: number, priceUSD: number) => string;
  formatValue: (amount: number, forceCurrency?: Currency) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem('markety_currency') as Currency) || 'PKR';
  });
  const [exchangeRate, setExchangeRate] = useState<number>(278.5);

  useEffect(() => {
    api.getSettings()
      .then(res => {
        if (res.settings?.exchangeRateUSDToPKR) {
          setExchangeRate(res.settings.exchangeRateUSDToPKR);
        }
      })
      .catch(() => {});
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('markety_currency', c);
  };

  const formatPrice = (pricePKR: number, priceUSD: number): string => {
    if (currency === 'PKR') {
      return `PKR ${pricePKR.toLocaleString()}`;
    }
    return `$${priceUSD.toLocaleString()}`;
  };

  const formatValue = (amount: number, forceCurrency?: Currency): string => {
    const cur = forceCurrency || currency;
    if (cur === 'PKR') {
      return `PKR ${amount.toLocaleString()}`;
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRate, formatPrice, formatValue }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

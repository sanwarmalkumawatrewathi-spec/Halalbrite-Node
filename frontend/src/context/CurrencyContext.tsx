'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface Currency {
    code: string;
    symbol: string;
    rate: number;
    isActive: boolean;
}

interface CurrencyContextType {
    currentCurrency: Currency;
    allCurrencies: Currency[];
    setCurrency: (code: string) => void;
    formatPrice: (amount: number) => string;
    convertPrice: (amount: number) => number;
    isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentCurrency, setCurrentCurrency] = useState<Currency>({
        code: 'EUR',
        symbol: '€',
        rate: 1,
        isActive: true
    });
    const [allCurrencies, setAllCurrencies] = useState<Currency[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchCurrencies = async () => {
            try {
                const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
                const response = await fetch(`${baseUrl}/api/admin/settings/currencies`);
                const data = await response.json();
                
                if (data.success && (data.data || data.currencies)) {
                    const activeCurrencies = data.data || data.currencies;
                    setAllCurrencies(activeCurrencies);

                    // 1. Check Cookie
                    const savedCode = Cookies.get('selected_currency');
                    
                    // 2. Fallback to default from settings if possible
                    const defaultCurrency = activeCurrencies.find((c: Currency) => c.code === 'EUR') || activeCurrencies[0];
                    
                    if (savedCode) {
                        const saved = activeCurrencies.find((c: Currency) => c.code === savedCode);
                        if (saved) setCurrentCurrency(saved);
                        else setCurrentCurrency(defaultCurrency);
                    } else {
                        setCurrentCurrency(defaultCurrency);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch currencies:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCurrencies();
    }, []);

    const setCurrency = (code: string) => {
        const selected = allCurrencies.find(c => c.code === code);
        if (selected) {
            setCurrentCurrency(selected);
            Cookies.set('selected_currency', code, { expires: 365 });
            // Optional: Reload to update all server components or use router.refresh()
            window.location.reload(); 
        }
    };

    const convertPrice = (amount: number) => {
        return amount * currentCurrency.rate;
    };

    const formatPrice = (amount: number) => {
        if (amount === 0) return 'Free';
        const converted = convertPrice(amount);
        return `${currentCurrency.symbol}${converted.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    return (
        <CurrencyContext.Provider value={{ currentCurrency, allCurrencies, setCurrency, formatPrice, convertPrice, isLoading }}>
            {mounted ? (
                children
            ) : (
                <div style={{ visibility: 'hidden' }}>{children}</div>
            )}
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

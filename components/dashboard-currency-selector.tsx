"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { fetchExchangeRates } from "@/lib/exchange-rates"

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
]

export function DashboardCurrencySelector({ 
  onCurrencyChange 
}: { 
  onCurrencyChange: (currency: string) => void 
}) {
  const [currency, setCurrency] = useState("USD")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load saved currency preference after mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("dashboard-currency")
      if (saved && CURRENCIES.find(c => c.code === saved)) {
        setCurrency(saved)
        onCurrencyChange(saved)
      } else {
        onCurrencyChange("USD")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setCurrency(value)
    if (typeof window !== 'undefined') {
      localStorage.setItem("dashboard-currency", value)
    }
    onCurrencyChange(value)
  }

  // Use native select to avoid hydration issues
  return (
    <div className="flex items-center gap-2 bg-card p-2 rounded-lg border shadow-sm">
      <Label htmlFor="currency" className="text-sm font-semibold whitespace-nowrap">
        Currency:
      </Label>
      <select
        id="currency"
        value={currency}
        onChange={handleChange}
        className="flex h-10 w-[150px] rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {CURRENCIES.map((curr) => (
          <option key={curr.code} value={curr.code}>
            {curr.code} ({curr.symbol})
          </option>
        ))}
      </select>
    </div>
  )
}

// Exchange rates cache (will be populated with real-time data)
let exchangeRatesCache: Record<string, number> | null = null

/**
 * Get exchange rates (with caching)
 */
async function getExchangeRates(): Promise<Record<string, number>> {
  if (!exchangeRatesCache) {
    exchangeRatesCache = await fetchExchangeRates()
  }
  return exchangeRatesCache
}

/**
 * Convert amount from one currency to another using real-time exchange rates
 */
export async function convertCurrency(
  amount: number, 
  targetCurrency: string, 
  baseCurrency: string = "USD"
): Promise<number> {
  if (targetCurrency === baseCurrency) {
    return amount
  }

  try {
    const rates = await getExchangeRates()
    
    // All rates are relative to USD
    const baseRate = rates[baseCurrency] || 1.0
    const targetRate = rates[targetCurrency] || 1.0
    
    // Convert: baseCurrency → USD → targetCurrency
    const amountInUSD = amount / baseRate
    return amountInUSD * targetRate
  } catch (error) {
    console.error('Error converting currency:', error)
    // Fallback to approximate rates
    const fallbackRates: Record<string, number> = {
      USD: 1.0,
      EUR: 0.92,
      GBP: 0.79,
      INR: 83.0,
      BDT: 110.0,
    }
    const baseRate = fallbackRates[baseCurrency] || 1.0
    const targetRate = fallbackRates[targetCurrency] || 1.0
    return (amount / baseRate) * targetRate
  }
}

/**
 * Synchronous version for use in React components (uses cached rates)
 */
export function convertCurrencySync(
  amount: number, 
  targetCurrency: string, 
  baseCurrency: string = "USD",
  rates?: Record<string, number>
): number {
  if (targetCurrency === baseCurrency) {
    return amount
  }

  const exchangeRates = rates || exchangeRatesCache || {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.79,
    INR: 83.0,
    BDT: 110.0,
  }
  
  const baseRate = exchangeRates[baseCurrency] || 1.0
  const targetRate = exchangeRates[targetCurrency] || 1.0
  
  const amountInUSD = amount / baseRate
  return amountInUSD * targetRate
}

export function formatCurrency(
  amount: number, 
  currency: string = "USD", 
  baseCurrency: string = "USD",
  rates?: Record<string, number>
): string {
  // Convert the amount to the target currency (sync version with rates)
  const convertedAmount = convertCurrencySync(amount, currency, baseCurrency, rates)
  
  const currencyMap: Record<string, { locale: string; currency: string }> = {
    USD: { locale: "en-US", currency: "USD" },
    EUR: { locale: "en-US", currency: "EUR" },
    GBP: { locale: "en-GB", currency: "GBP" },
    INR: { locale: "en-IN", currency: "INR" },
    BDT: { locale: "en-US", currency: "BDT" },
  }

  const config = currencyMap[currency] || currencyMap.USD

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convertedAmount)
}

// Export for use in other components
export { CURRENCIES }
export { fetchExchangeRates } from "@/lib/exchange-rates"


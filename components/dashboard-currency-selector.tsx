"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"

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

// Exchange rates relative to USD (base currency)
// These are approximate rates - in production, you'd fetch from an API
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,    // 1 USD = 0.92 EUR
  GBP: 0.79,    // 1 USD = 0.79 GBP
  INR: 83.0,    // 1 USD = 83 INR
  BDT: 110.0,   // 1 USD = 110 BDT
}

/**
 * Convert amount from USD (base currency) to target currency
 */
export function convertCurrency(amount: number, targetCurrency: string, baseCurrency: string = "USD"): number {
  if (targetCurrency === baseCurrency) {
    return amount
  }
  
  // Convert from base to USD first if needed
  let amountInUSD = amount
  if (baseCurrency !== "USD") {
    const baseToUSD = 1 / (EXCHANGE_RATES[baseCurrency] || 1)
    amountInUSD = amount * baseToUSD
  }
  
  // Convert from USD to target currency
  const rate = EXCHANGE_RATES[targetCurrency] || 1
  return amountInUSD * rate
}

export function formatCurrency(amount: number, currency: string = "USD", baseCurrency: string = "USD"): string {
  // Convert the amount to the target currency
  const convertedAmount = convertCurrency(amount, currency, baseCurrency)
  
  const currencyMap: Record<string, { locale: string; currency: string }> = {
    USD: { locale: "en-US", currency: "USD" },
    EUR: { locale: "de-DE", currency: "EUR" },
    GBP: { locale: "en-GB", currency: "GBP" },
    INR: { locale: "en-IN", currency: "INR" },
    BDT: { locale: "en-BD", currency: "BDT" },
  }

  const config = currencyMap[currency] || currencyMap.USD

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convertedAmount)
}


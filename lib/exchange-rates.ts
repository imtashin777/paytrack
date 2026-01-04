// Exchange rate API utility using exchangerate-api.com (free, no API key required)
// Alternatives: fixer.io, currencyapi.com

const EXCHANGE_RATE_CACHE_KEY = 'exchange-rates-cache'
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

interface ExchangeRates {
  [key: string]: number
  timestamp: number
}

interface ExchangeRateAPIResponse {
  rates: Record<string, number>
  base: string
  date: string
}

/**
 * Fetch real-time exchange rates from API
 * Uses exchangerate-api.com (free, no API key needed)
 * Optimized for fast loading with background refresh
 */
export async function fetchExchangeRates(): Promise<Record<string, number>> {
  // Check cache first - always return cached immediately if available
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(EXCHANGE_RATE_CACHE_KEY)
    if (cached) {
      try {
        const parsed: ExchangeRates = JSON.parse(cached)
        const now = Date.now()
        // Use cached rates if less than 1 hour old
        if (now - parsed.timestamp < CACHE_DURATION) {
          const { timestamp, ...rates } = parsed
          // Fetch new rates in background without blocking
          // This ensures rates stay fresh without delaying page load
          setTimeout(() => {
            fetch('https://api.exchangerate-api.com/v4/latest/USD', { cache: 'no-store' })
              .then(response => {
                if (response.ok) {
                  return response.json()
                }
                throw new Error('Failed to fetch')
              })
              .then(data => {
                const rates: Record<string, number> = {
                  USD: 1.0,
                  ...data.rates
                }
                const cacheData: ExchangeRates = {
                  ...rates,
                  timestamp: Date.now()
                }
                localStorage.setItem(EXCHANGE_RATE_CACHE_KEY, JSON.stringify(cacheData))
              })
              .catch(() => {
                // Silently fail, keep using cached rates
              })
          }, 2000) // Refresh after 2 seconds in background
          return rates
        }
      } catch (e) {
        // Invalid cache, fetch new rates
      }
    }
  }

  try {
    // Fetch from free API with timeout for fast failure
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout
    
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      signal: controller.signal,
      cache: 'no-store',
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates')
    }

    const data: ExchangeRateAPIResponse = await response.json()
    
    // Convert rates object to our format (all rates relative to USD)
    const rates: Record<string, number> = {
      USD: 1.0,
      ...data.rates
    }

    // Cache the rates
    if (typeof window !== 'undefined') {
      const cacheData: ExchangeRates = {
        ...rates,
        timestamp: Date.now()
      }
      localStorage.setItem(EXCHANGE_RATE_CACHE_KEY, JSON.stringify(cacheData))
    }

    return rates
  } catch (error) {
    // Silently handle errors - don't log in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching exchange rates:', error)
    }
    
    // Fallback to cached rates even if expired
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(EXCHANGE_RATE_CACHE_KEY)
      if (cached) {
        try {
          const parsed: ExchangeRates = JSON.parse(cached)
          const { timestamp, ...rates } = parsed
          return rates
        } catch (e) {
          // Ignore
        }
      }
    }

    // Final fallback to approximate rates
    return {
      USD: 1.0,
      EUR: 0.92,
      GBP: 0.79,
      INR: 83.0,
      BDT: 110.0,
    }
  }
}

/**
 * Get exchange rate for converting from one currency to another
 */
export async function getExchangeRate(
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return 1.0
  }

  const rates = await fetchExchangeRates()
  
  // All rates are relative to USD
  const fromRate = rates[fromCurrency] || 1.0
  const toRate = rates[toCurrency] || 1.0

  // Convert fromCurrency to USD, then USD to toCurrency
  return toRate / fromRate
}

/**
 * Convert amount from one currency to another using real-time rates
 */
export async function convertCurrencyWithAPI(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return amount
  }

  const rate = await getExchangeRate(fromCurrency, toCurrency)
  return amount * rate
}


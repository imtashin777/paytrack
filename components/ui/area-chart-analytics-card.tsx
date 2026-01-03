"use client"

import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const chartConfig: ChartConfig = {
  spend: {
    label: "Invoice Amount",
    color: "hsl(var(--primary))",
  },
};

interface AreaChartAnalyticsCardProps {
  data?: Array<{ day: string; spend: number }>;
  totalAmount?: number;
  period?: string;
  currency?: string;
}

export function AreaChartAnalyticsCard({ 
  data,
  totalAmount,
  period = "Last 28 days",
  currency = "USD"
}: AreaChartAnalyticsCardProps) {
  // Use provided data or empty array
  // Note: data should already be converted to the target currency by the parent component
  const campaignData = data && data.length > 0 ? data : Array.from({ length: 28 }, (_, i) => ({
    day: `Day ${i + 1}`,
    spend: 0,
  }));
  
  // totalAmount should already be converted to the target currency
  const displayAmount = totalAmount || 0;
  
  // Calculate days with invoices
  const daysWithInvoices = campaignData.filter(d => (d.spend || 0) > 0).length;
  const totalDays = campaignData.length || 28;
  const activityPercentage = totalDays > 0 ? Math.round((daysWithInvoices / totalDays) * 100) : 0;

  return (
    <Card className="flex h-full w-full max-w-[450px] flex-col gap-0 overflow-hidden p-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between px-5 pt-4.5 pb-0">
        <div className="flex flex-row items-center gap-1">
          <CardTitle className="text-base font-medium text-muted-foreground">
            Invoice Analytics
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <svg
                  width={20}
                  height={20}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5 text-muted-foreground/50"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 16.25a6.25 6.25 0 100-12.5 6.25 6.25 0 000 12.5zm1.116-3.041l.1-.408a1.709 1.709 0 01-.25.083 1.176 1.176 0 01-.308.048c-.193 0-.329-.032-.407-.095-.079-.064-.118-.184-.118-.359a3.514 3.514 0 01.118-.672l.373-1.318c.037-.121.062-.255.075-.4a3.73 3.73 0 00.02-.304.866.866 0 00-.292-.678c-.195-.174-.473-.26-.833-.26-.2 0-.412.035-.636.106-.224.07-.459.156-.704.256l-.1.409c.073-.028.16-.057.262-.087.101-.03.2-.045.297-.045.198 0 .331.034.4.1.07.066.105.185.105.354 0 .093-.01.197-.034.31a6.216 6.216 0 01-.084.36l-.374 1.325c-.033.14-.058.264-.073.374-.015.11-.022.22-.022.325 0 .272.1.496.301.673.201.177.483.265.846.265.236 0 .443-.03.621-.092s.417-.152.717-.27zM11.05 7.85a.772.772 0 00.26-.587.78.78 0 00-.26-.59.885.885 0 00-.628-.244.893.893 0 00-.63.244.778.778 0 00-.264.59c0 .23.088.426.263.587a.897.897 0 00.63.243.888.888 0 00.629-.243z"
                    fill="currentColor"
                  />
                </svg>
              </TooltipTrigger>
              <TooltipContent showArrow className="max-w-70">
                <p className="text-xs">
                  This chart shows your invoice amounts over time. Hover over each point
                  to see the exact amount. Use this data to track trends and optimize
                  your invoicing.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button variant="outline" size="sm" className="h-8 px-3 text-sm">
          Details
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-0">
        <div className="flex items-center gap-3 px-5">
          <span className="text-2xl font-medium tracking-tight tabular-nums">
            {(() => {
              const currencyMap: Record<string, { locale: string; currency: string }> = {
                USD: { locale: "en-US", currency: "USD" },
                EUR: { locale: "en-US", currency: "EUR" }, // Use en-US locale for EUR to get standard formatting
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
              }).format(displayAmount)
            })()}
          </span>
          <Badge className="rounded-full bg-green-100 text-xs text-green-800 dark:bg-green-950 dark:text-green-600">
            {period}
          </Badge>
        </div>
        <div className="grid h-[95px] grid-cols-[1fr_150px] border-t border-border">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-auto w-full"
          >
            <AreaChart
              accessibilityLayer
              data={campaignData}
              margin={{
                right: -5,
              }}
            >
              <XAxis hide />
              <YAxis hide domain={(() => {
                const values = campaignData.map(d => d.spend || 0)
                const min = Math.min(...values)
                const max = Math.max(...values)
                if (min === max && max === 0) {
                  return [0, 1000] // Default range when no data
                }
                return [
                  Math.max(0, min - (max * 0.1)),
                  max + (max * 0.1)
                ]
              })()} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => {
                      // Value is already converted in campaignData, just format it
                      const currencyMap: Record<string, { locale: string; currency: string }> = {
                        USD: { locale: "en-US", currency: "USD" },
                        EUR: { locale: "en-US", currency: "EUR" }, // Use en-US locale for EUR to get standard formatting
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
                      }).format(value as number)
                    }}
                  />
                }
                cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
              />
              <Area
                type="linear"
                dataKey="spend"
                stroke={chartConfig.spend.color}
                fill={chartConfig.spend.color}
                fillOpacity={0.2}
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: chartConfig.spend.color,
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ChartContainer>
          <div className="flex flex-col items-start justify-end border-l-2 border-primary px-4 pb-4">
            <div className="text-sm font-semibold tracking-[-0.006em] text-foreground">
              {activityPercentage}%
            </div>
            <div className="text-xs font-medium tracking-[-0.006em] text-muted-foreground">
              {daysWithInvoices} days
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Default export for dynamic imports
export default AreaChartAnalyticsCard;


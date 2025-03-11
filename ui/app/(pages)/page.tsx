"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bar, BarChart } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

const DashboardPage = () => {
  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  const recentSales = [
    { name: "Olivia Martin", email: "olivia.martin@email.com", amount: 1999 },
    { name: "Jackson Lee", email: "jackson.lee@email.com", amount: 39 },
    {
      name: "Isabella Nguyen",
      email: "isabella.nguyen@email.com",
      amount: 299,
    },
    { name: "William Kim", email: "will@email.com", amount: 99 },
    { name: "Sofia Davis", email: "sofia.davis@email.com", amount: 39 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <div className="flex flex-wrap gap-2">
          {/* Date Range Picker */}

          {/* Download Button */}
          <Button
            variant="default"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-bold">$45,231.89</p>
            <p className="text-xs text-green-600">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Subscriptions</h3>
            <p className="text-2xl font-bold">+2350</p>
            <p className="text-xs text-green-600">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Sales</h3>
            <p className="text-2xl font-bold">+12,234</p>
            <p className="text-xs text-green-600">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium text-gray-500">Active Now</h3>
            <p className="text-2xl font-bold">+573</p>
            <p className="text-xs text-green-600">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart & Recent Sales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sales Overview Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {/* ✅ Reduced Chart Height for Better Fit */}
            <ChartContainer
              config={chartConfig}
              className="min-h-[150px] h-[400px] w-full"
            >
              <BarChart accessibilityLayer data={chartData}>
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Sales</CardTitle>
            <p className="text-sm text-gray-500">
              You made 265 sales this month.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${sale.name}`}
                      />
                      <AvatarFallback>{sale.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{sale.name}</p>
                      <p className="text-xs text-gray-500">{sale.email}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">
                    ${sale.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

import React from 'react';
import {
  Package,
  Users,
  Receipt,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  Truck,
  Plus,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader as DialogModalHeader,
  DialogTitle as DialogModalTitle,
} from '@/components/ui/dialog';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
}

const statCards: StatCard[] = [
  {
    title: 'Total Parts',
    value: '1,234',
    change: '+12%',
    changeType: 'positive',
    icon: Package,
  },
  {
    title: 'Active Customers',
    value: '567',
    change: '+8%',
    changeType: 'positive',
    icon: Users,
  },
  {
    title: 'Monthly Sales',
    value: '$45,678',
    change: '+15%',
    changeType: 'positive',
    icon: Receipt,
  },
  {
    title: 'Low Stock Items',
    value: '23',
    change: '-5%',
    changeType: 'negative',
    icon: AlertTriangle,
  },
];

const recentActivities = [
  { id: 1, type: 'sale', description: 'New sale invoice #INV-001234', time: '2 min ago', icon: Receipt },
  { id: 2, type: 'stock', description: 'Stock updated for Air Filter AF-123', time: '15 min ago', icon: Package },
  { id: 3, type: 'customer', description: 'New customer registration: ABC Motors', time: '1 hour ago', icon: Users },
  { id: 4, type: 'delivery', description: 'Delivery completed for Order #ORD-5678', time: '2 hours ago', icon: Truck },
  { id: 5, type: 'purchase', description: 'Purchase order #PO-9876 received', time: '3 hours ago', icon: ShoppingCart },
];

const Dashboard: React.FC = () => {
  const getBadgeVariant = (type: string) => {
    if (type === 'positive') return 'default';
    if (type === 'negative') return 'destructive';
    return 'outline';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{card.value}</div>
                <Badge variant={getBadgeVariant(card.changeType)} className="mt-1 text-xs">
                  {card.change} from last month
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72 pr-2">
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted transition-colors"
                    >
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start space-x-3">
                  <Plus className="h-4 w-4" />
                  <span>Add New Part</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogModalHeader>
                  <DialogModalTitle>Add New Part</DialogModalTitle>
                </DialogModalHeader>
                <div>Form goes here...</div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="w-full justify-start space-x-3">
              <Receipt className="h-4 w-4" />
              <span>Create Invoice</span>
            </Button>

            <Button variant="outline" className="w-full justify-start space-x-3">
              <Users className="h-4 w-4" />
              <span>Add Customer</span>
            </Button>

            <Button variant="outline" className="w-full justify-start space-x-3">
              <TrendingUp className="h-4 w-4" />
              <span>View Reports</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                name: 'Engine Oil EO-456',
                stock: 'Only 2 units left',
                bg: 'bg-red-50',
                color: 'text-red-600',
              },
              {
                name: 'Brake Pads BP-789',
                stock: '5 units remaining',
                bg: 'bg-yellow-50',
                color: 'text-yellow-600',
              },
              {
                name: 'Air Filter AF-123',
                stock: '8 units remaining',
                bg: 'bg-orange-50',
                color: 'text-orange-600',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-md ${item.bg}`}
              >
                <div>
                  <p className={`text-sm font-medium ${item.color.replace('600', '900')}`}>{item.name}</p>
                  <p className={`text-xs ${item.color}`}>{item.stock}</p>
                </div>
                <AlertTriangle className={`h-5 w-5 ${item.color}`} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Top Selling Parts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                name: 'Oil Filter OF-123',
                sold: '45 units sold this month',
                bg: 'bg-green-50',
                color: 'text-green-600',
              },
              {
                name: 'Spark Plugs SP-456',
                sold: '38 units sold this month',
                bg: 'bg-blue-50',
                color: 'text-blue-600',
              },
              {
                name: 'Transmission Fluid TF-789',
                sold: '32 units sold this month',
                bg: 'bg-purple-50',
                color: 'text-purple-600',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-md ${item.bg}`}
              >
                <div>
                  <p className={`text-sm font-medium ${item.color.replace('600', '900')}`}>{item.name}</p>
                  <p className={`text-xs ${item.color}`}>{item.sold}</p>
                </div>
                <TrendingUp className={`h-5 w-5 ${item.color}`} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

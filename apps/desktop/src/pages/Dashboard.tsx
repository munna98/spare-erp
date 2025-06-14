import React from 'react';
import { 
  Package, 
  Users, 
  Receipt, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  ShoppingCart,
  Truck,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

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
  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                <p className={`text-xs ${getChangeColor(card.changeType)} mt-1`}>
                  {card.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Plus className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Add New Part</span>
              </div>
            </button>
            
            <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Receipt className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Create Invoice</span>
              </div>
            </button>
            
            <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Add Customer</span>
              </div>
            </button>
            
            <button className="w-full p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">View Reports</span>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-red-900">Engine Oil EO-456</p>
                  <p className="text-xs text-red-600">Only 2 units left</p>
                </div>
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-yellow-900">Brake Pads BP-789</p>
                  <p className="text-xs text-yellow-600">5 units remaining</p>
                </div>
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-orange-900">Air Filter AF-123</p>
                  <p className="text-xs text-orange-600">8 units remaining</p>
                </div>
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Top Selling Parts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-900">Oil Filter OF-123</p>
                  <p className="text-xs text-green-600">45 units sold this month</p>
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-900">Spark Plugs SP-456</p>
                  <p className="text-xs text-blue-600">38 units sold this month</p>
                </div>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-purple-900">Transmission Fluid TF-789</p>
                  <p className="text-xs text-purple-600">32 units sold this month</p>
                </div>
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
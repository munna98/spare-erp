import React, { useState } from 'react';
import { 
  Home,
  Plus,
  Search,
  ShoppingCart,
  AlertTriangle,
  Package,
  Warehouse,
  TrendingUp,
  FileText,
  Receipt,
  RefreshCw,
  Truck,
  Users,
  Building2,
  Car,
  Calculator,
  BookOpen,
  CreditCard,
  ArrowUpDown,
  BarChart3,
  FileBarChart,
  Settings,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface SidebarProps {
  isOpen: boolean;
  currentPage: string;
  onPageChange: (page: string) => void;
}

interface QuickAccessItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
  color?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  children?: MenuItem[];
}

const quickAccessItems: QuickAccessItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'quick-add-part', label: 'Quick Add Part', icon: Plus, color: 'text-green-600' },
  { id: 'search-parts', label: 'Search Parts', icon: Search },
  { id: 'new-sale', label: 'New Sale', icon: ShoppingCart, color: 'text-blue-600' },
  { id: 'stock-alerts', label: 'Stock Alerts', icon: AlertTriangle, badge: 5, color: 'text-orange-600' },
];

const menuItems: MenuItem[] = [
  {
    id: 'inventory',
    label: 'Inventory Management',
    icon: Package,
    children: [
      { id: 'parts-management', label: 'Parts Management', icon: Package },
      { id: 'warehouses', label: 'Warehouses & Bins', icon: Warehouse },
      { id: 'stock-movements', label: 'Stock Movements', icon: TrendingUp },
      { id: 'opening-stock', label: 'Opening Stock', icon: FileText },
      { id: 'damages', label: 'Damages', icon: AlertTriangle },
    ],
  },
  {
    id: 'sales',
    label: 'Sales',
    icon: Receipt,
    children: [
      { id: 'sales-quotations', label: 'Sales Quotations', icon: FileText },
      { id: 'sales-orders', label: 'Sales Orders', icon: Receipt },
      { id: 'sales-invoices', label: 'Sales Invoices', icon: Receipt },
      { id: 'sales-returns', label: 'Sales Returns', icon: RefreshCw },
      { id: 'delivery-notes', label: 'Delivery Notes', icon: Truck },
    ],
  },
  {
    id: 'purchases',
    label: 'Purchases',
    icon: ShoppingCart,
    children: [
      { id: 'purchase-quotations', label: 'Purchase Quotations', icon: FileText },
      { id: 'purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
      { id: 'purchase-invoices', label: 'Purchase Invoices', icon: Receipt },
      { id: 'purchase-returns', label: 'Purchase Returns', icon: RefreshCw },
      { id: 'goods-receipt', label: 'Goods Receipt Notes', icon: Truck },
    ],
  },
  {
    id: 'parties',
    label: 'Parties',
    icon: Users,
    children: [
      { id: 'customers', label: 'Customers', icon: Users },
      { id: 'suppliers', label: 'Suppliers', icon: Building2 },
      { id: 'vehicle-models', label: 'Vehicle Models', icon: Car },
    ],
  },
  {
    id: 'accounts',
    label: 'Accounts & Finance',
    icon: Calculator,
    children: [
      { id: 'ledger-groups', label: 'Ledger Groups', icon: BookOpen },
      { id: 'ledgers', label: 'Ledgers', icon: BookOpen },
      { id: 'journal-entries', label: 'Journal Entries', icon: FileText },
      { id: 'payments-receipts', label: 'Payments & Receipts', icon: CreditCard },
      { id: 'debit-credit-notes', label: 'Debit & Credit Notes', icon: FileText },
      { id: 'contra-vouchers', label: 'Contra Vouchers', icon: ArrowUpDown },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    children: [
      { id: 'stock-reports', label: 'Stock Reports', icon: FileBarChart },
      { id: 'sales-reports', label: 'Sales Reports', icon: BarChart3 },
      { id: 'purchase-reports', label: 'Purchase Reports', icon: FileBarChart },
      { id: 'financial-reports', label: 'Financial Reports', icon: Calculator },
      { id: 'party-reports', label: 'Party Reports', icon: Users },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    children: [
      { id: 'company-settings', label: 'Company Settings', icon: Building2 },
      { id: 'branch-management', label: 'Branch Management', icon: Building2 },
      { id: 'user-management', label: 'User Management', icon: Users },
      { id: 'roles-permissions', label: 'Roles & Permissions', icon: Settings },
      { id: 'print-templates', label: 'Print Templates', icon: FileText },
      { id: 'system-settings', label: 'System Settings', icon: Settings },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentPage, onPageChange }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['inventory']);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (itemId: string, hasChildren: boolean = false) => {
    if (hasChildren) {
      toggleExpanded(itemId);
    } else {
      onPageChange(itemId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Quick Access Section */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Quick Access
        </h3>
        <div className="space-y-1">
          {quickAccessItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-9 px-3",
                  currentPage === item.id 
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-100" 
                    : "hover:bg-gray-100"
                )}
                onClick={() => handleItemClick(item.id)}
              >
                <Icon className={cn("mr-3 h-4 w-4", item.color)} />
                <span className="text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Main Menu Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Main Menu
          </h3>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isExpanded = expandedItems.includes(item.id);
              const hasChildren = item.children && item.children.length > 0;

              return (
                <div key={item.id}>
                  {/* Parent Item */}
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-9 px-3",
                      !hasChildren && currentPage === item.id 
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-100" 
                        : "hover:bg-gray-100"
                    )}
                    onClick={() => handleItemClick(item.id, hasChildren)}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    <span className="text-sm font-medium flex-1 text-left">
                      {item.label}
                    </span>
                    {hasChildren && (
                      <div className="ml-auto">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </Button>

                  {/* Children Items */}
                  {hasChildren && isExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children!.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <Button
                            key={child.id}
                            variant="ghost"
                            className={cn(
                              "w-full justify-start h-8 px-3",
                              currentPage === child.id 
                                ? "bg-blue-50 text-blue-600 hover:bg-blue-50" 
                                : "hover:bg-gray-50 text-gray-700"
                            )}
                            onClick={() => handleItemClick(child.id)}
                          >
                            <ChildIcon className="mr-3 h-3.5 w-3.5" />
                            <span className="text-sm">{child.label}</span>
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-xs text-gray-500">
            UAE Spare Parts ERP
          </p>
          <p className="text-xs text-gray-400 mt-1">
            v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
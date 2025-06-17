import React, { useState } from "react"
import {
  Home, Plus, Search, ShoppingCart, AlertTriangle, Package, Warehouse,
  TrendingUp, FileText, Receipt, RefreshCw, Truck, Users, Building2,
  Car, Calculator, BookOpen, CreditCard, ArrowUpDown, BarChart3,
  FileBarChart, Settings, ChevronRight, ChevronDown, Banknote, ScrollText, User, Boxes,
  type LucideIcon,
} from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

interface SidebarProps {
  isOpen: boolean
  currentPage: string
  onPageChange: (page: string) => void
}

interface MenuItem {
  id: string
  label: string
  icon: LucideIcon
  children?: MenuItem[]
  badge?: number
  color?: string
}

const quickAccessItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "quick-add-part", label: "Quick Add Part", icon: Plus, color: "text-green-600" },
  { id: "search-parts", label: "Search Parts", icon: Search },
  { id: "new-sale", label: "New Sale", icon: ShoppingCart, color: "text-blue-600" },
  { id: "stock-alerts", label: "Stock Alerts", icon: AlertTriangle, badge: 5, color: "text-orange-600" },
]

const menuItems: MenuItem[] = [
  {
    id: "inventory",
    label: "Inventory Management",
    icon: Package,
        children: [
      { id: "parts-management", label: "Parts Management", icon: Package },
      { id: "part-units", label: "Part Units", icon: Boxes },
      { id: "warehouses", label: "Warehouses & Bins", icon: Warehouse },
      { id: "stock-movements", label: "Stock Movements", icon: TrendingUp },
      { id: "opening-stock", label: "Opening Stock", icon: FileText },
      { id: "damages", label: "Damages", icon: AlertTriangle },
      { id: "stock-lots", label: "Stock Lots", icon: Package },
      { id: "current-stock", label: "Current Stock", icon: Package },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    icon: Receipt,
    children: [
      { id: "sales-quotations", label: "Sales Quotations", icon: FileText },
      { id: "sales-orders", label: "Sales Orders", icon: Receipt },
      { id: "sales-invoices", label: "Sales Invoices", icon: Receipt },
      { id: "sales-returns", label: "Sales Returns", icon: RefreshCw },
      { id: "delivery-notes", label: "Delivery Notes", icon: Truck },
    ],
  },
  {
    id: "purchases",
    label: "Purchases",
    icon: ShoppingCart,
    children: [
      { id: "purchase-quotations", label: "Purchase Quotations", icon: FileText },
      { id: "purchase-orders", label: "Purchase Orders", icon: ShoppingCart },
      { id: "purchase-invoices", label: "Purchase Invoices", icon: Receipt },
      { id: "purchase-returns", label: "Purchase Returns", icon: RefreshCw },
      { id: "goods-receipt", label: "Goods Receipt Notes", icon: Truck },
    ],
  },
  {
    id: "parties",
    label: "Parties",
    icon: Users,
    children: [
      { id: "customers", label: "Customers", icon: Users },
      { id: "suppliers", label: "Suppliers", icon: Building2 },
      { id: "vehicle-models", label: "Vehicle Models", icon: Car },
      { id: "employees", label: "Employees", icon: User },
    ],
  },
  {
    id: "accounts",
    label: "Accounts & Finance",
    icon: Calculator,
    children: [
      { id: "ledger-groups", label: "Ledger Groups", icon: BookOpen },
      { id: "ledgers", label: "Ledgers", icon: BookOpen },
      { id: "journal-entries", label: "Journal Entries", icon: FileText },
      { id: "payments-receipts", label: "Payments & Receipts", icon: CreditCard },
      { id: "debit-credit-notes", label: "Debit & Credit Notes", icon: FileText },
      { id: "contra-vouchers", label: "Contra Vouchers", icon: ArrowUpDown },
      { id: "bank-accounts", label: "Bank Accounts", icon: Banknote },
      { id: "bank-reconciliations", label: "Bank Reconciliations", icon: BookOpen },
      { id: "cheques", label: "Cheques", icon: ScrollText },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    children: [
      { id: "stock-reports", label: "Stock Reports", icon: FileBarChart },
      { id: "sales-reports", label: "Sales Reports", icon: BarChart3 },
      { id: "purchase-reports", label: "Purchase Reports", icon: FileBarChart },
      { id: "financial-reports", label: "Financial Reports", icon: Calculator },
      { id: "party-reports", label: "Party Reports", icon: Users },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    children: [
      { id: "company-settings", label: "Company Settings", icon: Building2 },
      { id: "branch-management", label: "Branch Management", icon: Building2 },
      { id: "user-management", label: "User Management", icon: Users },
      { id: "roles-permissions", label: "Roles & Permissions", icon: Settings },
      { id: "print-templates", label: "Print Templates", icon: FileText },
      { id: "system-settings", label: "System Settings", icon: Settings },
    ],
  },
]

const Sidebar: React.FC<SidebarProps> = ({ isOpen, currentPage, onPageChange }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(["inventory"])

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleItemClick = (id: string, hasChildren?: boolean) => {
    if (hasChildren) toggleExpanded(id)
    else onPageChange(id)
  }

  if (!isOpen) return null

  return (
    <div className="h-full w-64 flex flex-col bg-background border-r shadow-sm">
      {/* Quick Access */}
      <div className="p-4 border-b">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
          Quick Access
        </h3>
        <div className="space-y-1">
          {quickAccessItems.map(({ id, label, icon: Icon, badge, color }) => (
            <Button
              key={id}
              variant={currentPage === id ? "secondary" : "ghost"}
              className="w-full justify-start px-3 h-9"
              onClick={() => handleItemClick(id)}
            >
              <Icon className={cn("mr-3 h-4 w-4", color)} />
              <span className="text-sm">{label}</span>
              {badge && (
                <Badge
                  variant="secondary"
                  className="ml-auto h-5 w-5 p-0 text-xs flex items-center justify-center rounded-full"
                >
                  {badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Menu */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">
          Main Menu
        </h3>
        <div className="space-y-1">
          {menuItems.map(({ id, label, icon: Icon, children }) => {
            const isExpanded = expandedItems.includes(id)
            const isActiveParent = children?.some((c) => c.id === currentPage)

            return (
              <div key={id}>
                <Button
                  variant={isActiveParent ? "secondary" : "ghost"}
                  className="w-full justify-start px-3 h-9"
                  onClick={() => handleItemClick(id, !!children)}
                  aria-expanded={isExpanded}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  <span className="flex-1 text-sm text-left">{label}</span>
                  {children &&
                    (isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    ))}
                </Button>

                {/* Children */}
                {children && isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {children.map(({ id, label, icon: ChildIcon }) => (
                      <Button
                        key={id}
                        variant={currentPage === id ? "secondary" : "ghost"}
                        className="w-full justify-start px-3 h-8"
                        onClick={() => onPageChange(id)}
                      >
                        <ChildIcon className="mr-3 h-3.5 w-3.5" />
                        <span className="text-sm">{label}</span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t text-center text-muted-foreground text-xs">
        <p>UAE Spare Parts ERP</p>
        <p>v1.0.0</p>
      </div>
    </div>
  )
}

export default Sidebar
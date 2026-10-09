export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Products</p>
          <p className="text-3xl font-bold text-[#112a46]">0</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-[#112a46]">0</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm font-medium text-gray-500 mb-1">Revenue</p>
          <p className="text-3xl font-bold text-[#112a46]">₹0.00</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 font-serif">Recent Orders</h3>
        <div className="text-center py-12 text-gray-500">
          No orders yet. They will appear here when customers check out!
        </div>
      </div>
    </div>
  );
}

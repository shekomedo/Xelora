import React, { useState, useMemo } from 'react';
import { ProductCost } from '../types';
import { generateProfitAnalysis } from '../lib/cost';
import { Plus, Trash2, DollarSign, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function CostCalculator() {
  const [products, setProducts] = useState<ProductCost[]>([
    { id: '1', name: 'Product A', materialCost: 120, laborCost: 50, operationalCost: 30, profitMarginPercentage: 25 },
    { id: '2', name: 'Product B', materialCost: 80, laborCost: 40, operationalCost: 20, profitMarginPercentage: 30 },
  ]);

  const addProduct = () => {
    setProducts([...products, { id: Date.now().toString(), name: `New Product ${products.length + 1}`, materialCost: 0, laborCost: 0, operationalCost: 0, profitMarginPercentage: 20 }]);
  };

  const updateProduct = (id: string, field: keyof ProductCost, value: string | number) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        return { ...p, [field]: typeof value === 'string' ? value : Number(value) };
      }
      return p;
    }));
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const analysis = useMemo(() => generateProfitAnalysis(products), [products]);

  const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'];

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Costing Engine</h2>
          <p className="text-slate-400 font-mono text-sm">Dynamic product cost and profit analysis.</p>
        </div>
        <button onClick={addProduct} className="flex items-center px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold rounded-lg transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Products List */}
        <div className="xl:col-span-2 space-y-4">
          {products.map((product) => (
            <div key={product.id} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-5 relative overflow-hidden group">
              <button onClick={() => removeProduct(product.id)} className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-5 h-5" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-1">
                  <label className="block text-xs text-slate-400 mb-1">Product Name</label>
                  <input type="text" value={product.name} onChange={(e) => updateProduct(product.id, 'name', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Material ($)</label>
                  <input type="number" value={product.materialCost || ''} onChange={(e) => updateProduct(product.id, 'materialCost', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm font-mono" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Labor ($)</label>
                  <input type="number" value={product.laborCost || ''} onChange={(e) => updateProduct(product.id, 'laborCost', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm font-mono" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Operational ($)</label>
                  <input type="number" value={product.operationalCost || ''} onChange={(e) => updateProduct(product.id, 'operationalCost', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm font-mono" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Margin (%)</label>
                  <input type="number" value={product.profitMarginPercentage || ''} onChange={(e) => updateProduct(product.id, 'profitMarginPercentage', e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm font-mono" />
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && (
             <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-12 flex flex-col items-center justify-center text-slate-500">
               <DollarSign className="w-12 h-12 mb-4 opacity-20" />
               <p>No products added. Add a product to begin analysis.</p>
             </div>
          )}
        </div>

        {/* Analytics Dashboard */}
        <div className="xl:col-span-1 space-y-6">
          {analysis && (
            <>
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-cyan-400"/> Financial KPIs</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Total Revenue</p>
                    <p className="text-xl font-bold text-white font-mono">${analysis.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Total Profit</p>
                    <p className="text-xl font-bold text-emerald-400 font-mono">${analysis.totalProfit.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Total Cost</p>
                    <p className="text-xl font-bold text-rose-400 font-mono">${analysis.totalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Avg Margin</p>
                    <p className="text-xl font-bold text-cyan-400 font-mono">{analysis.averageMargin.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center"><PieChartIcon className="w-5 h-5 mr-2 text-blue-400"/> Profit Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analysis.calculatedProducts}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="profit"
                        nameKey="name"
                      >
                        {analysis.calculatedProducts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                        itemStyle={{ color: '#e2e8f0' }}
                        formatter={(value: number) => `$${value.toFixed(2)}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {analysis.calculatedProducts.map((p, i) => (
                    <div key={p.id} className="flex items-center text-xs text-slate-300">
                      <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      {p.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                 <h3 className="text-lg font-bold text-white mb-4">Cost vs Profit</h3>
                 <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={analysis.calculatedProducts} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                       <XAxis type="number" hide />
                       <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                       <Tooltip 
                         cursor={{ fill: '#1e293b' }}
                         contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                         formatter={(value: number) => `$${value.toFixed(2)}`}
                       />
                       <Bar dataKey="totalCost" stackId="a" fill="#f43f5e" radius={[4, 0, 0, 4]} name="Cost" />
                       <Bar dataKey="profit" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} name="Profit" />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

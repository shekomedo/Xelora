import { ProductCost } from '../types';

export function calculateProductProfit(product: ProductCost): ProductCost {
  const totalCost = product.materialCost + product.laborCost + product.operationalCost;
  const profitMarginMultiplier = 1 + (product.profitMarginPercentage / 100);
  const sellingPrice = totalCost * profitMarginMultiplier;
  const profit = sellingPrice - totalCost;

  return {
    ...product,
    totalCost,
    sellingPrice,
    profit
  };
}

export function generateProfitAnalysis(products: ProductCost[]) {
  if (products.length === 0) return null;

  const calculated = products.map(calculateProductProfit);
  
  let totalRevenue = 0;
  let totalProfit = 0;
  let totalCost = 0;
  let highestProfitProduct = calculated[0];
  
  calculated.forEach(p => {
     totalRevenue += p.sellingPrice || 0;
     totalProfit += p.profit || 0;
     totalCost += p.totalCost || 0;
     if ((p.profit || 0) > (highestProfitProduct.profit || 0)) {
        highestProfitProduct = p;
     }
  });

  const averageMargin = (totalProfit / totalRevenue) * 100;

  return {
    calculatedProducts: calculated,
    totalRevenue,
    totalProfit,
    totalCost,
    averageMargin,
    highestProfitProduct
  };
}

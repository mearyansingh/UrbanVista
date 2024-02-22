//Format the number into indian currency format
export function formatIndianNumber(number) {
   const formattedNumber = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
   }).format(number);

   // Remove the currency symbol to display only the number
   return formattedNumber.replace('₹', '');
}
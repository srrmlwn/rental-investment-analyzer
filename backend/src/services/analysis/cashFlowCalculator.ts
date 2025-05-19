export interface CashFlowInput {
  price: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  rent: number;
  expenses: number;
}

export interface CashFlowResult {
  monthlyCashFlow: number;
  annualCashFlow: number;
  cashOnCashReturn: number;
}

export interface CashFlowCalculator {
  calculate(input: CashFlowInput): Promise<CashFlowResult>;
}

export class StandardCashFlowCalculator implements CashFlowCalculator {
  async calculate(input: CashFlowInput): Promise<CashFlowResult> {
    // Simple calculation for demonstration
    const loanAmount = input.price - input.downPayment;
    const monthlyInterest = input.interestRate / 12 / 100;
    const numPayments = input.loanTerm * 12;
    const monthlyPayment =
      (loanAmount * monthlyInterest) /
      (1 - Math.pow(1 + monthlyInterest, -numPayments));
    const monthlyCashFlow = input.rent - input.expenses - monthlyPayment;
    const annualCashFlow = monthlyCashFlow * 12;
    const cashOnCashReturn =
      input.downPayment > 0 ? (annualCashFlow / input.downPayment) * 100 : 0;
    return {
      monthlyCashFlow,
      annualCashFlow,
      cashOnCashReturn,
    };
  }
} 
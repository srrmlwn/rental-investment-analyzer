import { StandardCashFlowCalculator, CashFlowInput } from '../cashFlowCalculator';

describe('StandardCashFlowCalculator', () => {
  let calculator: StandardCashFlowCalculator;

  beforeEach(() => {
    calculator = new StandardCashFlowCalculator();
  });

  describe('calculate', () => {
    const baseInput: CashFlowInput = {
      price: 500000,
      downPayment: 100000,
      interestRate: 4.5,
      loanTerm: 30,
      rent: 2500,
      expenses: 500
    };

    it('calculates correct mortgage payment', async () => {
      const result = await calculator.calculate(baseInput);
      
      // Calculate expected mortgage payment
      const loanAmount = baseInput.price - baseInput.downPayment;
      const monthlyInterest = baseInput.interestRate / 12 / 100;
      const numPayments = baseInput.loanTerm * 12;
      const expectedPayment = (loanAmount * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -numPayments));
      
      // Monthly cash flow = rent - expenses - mortgage payment
      const expectedMonthlyCashFlow = baseInput.rent - baseInput.expenses - expectedPayment;
      
      expect(result.monthlyCashFlow).toBeCloseTo(expectedMonthlyCashFlow, 2);
    });

    it('calculates correct annual cash flow', async () => {
      const result = await calculator.calculate(baseInput);
      const expectedAnnualCashFlow = result.monthlyCashFlow * 12;
      
      expect(result.annualCashFlow).toBeCloseTo(expectedAnnualCashFlow, 2);
    });

    it('calculates correct cash-on-cash return', async () => {
      const result = await calculator.calculate(baseInput);
      const expectedCashOnCash = (result.annualCashFlow / baseInput.downPayment) * 100;
      
      expect(result.cashOnCashReturn).toBeCloseTo(expectedCashOnCash, 2);
    });

    it('handles zero down payment correctly', async () => {
      const input: CashFlowInput = {
        ...baseInput,
        downPayment: 0
      };
      
      const result = await calculator.calculate(input);
      expect(result.cashOnCashReturn).toBe(0);
    });

    it('handles high interest rates correctly', async () => {
      const input: CashFlowInput = {
        ...baseInput,
        interestRate: 7.5
      };
      
      const result = await calculator.calculate(input);
      expect(result.monthlyCashFlow).toBeLessThan(baseInput.rent - baseInput.expenses);
    });

    it('handles high expenses correctly', async () => {
      const input: CashFlowInput = {
        ...baseInput,
        expenses: 2000
      };
      
      const result = await calculator.calculate(input);
      expect(result.monthlyCashFlow).toBeLessThan(baseInput.rent - baseInput.expenses);
    });
  });
}); 
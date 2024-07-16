import {describe, it} from "mocha";
import {expect} from "chai";
import {exec} from "child_process";


function runCalculator(operation, num1, num2) {
    return new Promise((resolve, reject) => {
        exec(`docker run --rm public.ecr.aws/l4q9w4c5/loanpro-calculator-cli ${operation} ${num1} ${num2}`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            resolve(stdout.trim());
        });
    });
}

describe('LoanPro Calculator', function() {
    this.timeout(10000);

    it('should add two numbers correctly', async () => {
        const result = await runCalculator('add', 8, 5);
        expect(result).to.equal('Result: ' + '13.0');
    });

    it('should subtract two numbers correctly', async () => {
        const result = await runCalculator('subtract', 10, 3);
        expect(result).to.equal('Result: ' + '7.0');
    });

    it('should multiply two numbers correctly', async () => {
        const result = await runCalculator('multiply', 4, 6);
        expect(result).to.equal('Result: ' + '24.0');
    });

    it('should divide two numbers correctly', async () => {
        const result = await runCalculator('divide', 20, 5);
        expect(result).to.equal('Result: ' + '4.0');
    });

    it('should handle floating point precision correctly', async () => {
        const result = await runCalculator('add', 1.000000000000001, 1.000000000000001);
        expect(result).to.equal('Result: ' + '2.000000000000002');
    });

    it('should handle large numbers', async () => {
        const result = await runCalculator('multiply', 1e15, 1e15);
        expect(result).to.equal('Result: ' + '1.0E30');
    });

    it('should handle negative numbers', async () => {
        const result = await runCalculator('add', -10, -5);
        expect(result).to.equal('Result: ' + '-15.0');
    });

    it('should handle divide by zero', async () => {
        const result = await runCalculator('divide', 5, 0);
        expect(result).to.equal('Error: Cannot divide by zero');
    });
});
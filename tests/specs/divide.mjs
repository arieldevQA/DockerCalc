import {describe, it} from "mocha";
import {expect} from "chai";
import {exec} from "child_process";


function runCalculator(operation, num1, num2, num3=null) {
    return new Promise((resolve, reject) => {
        exec(`docker run --rm public.ecr.aws/l4q9w4c5/loanpro-calculator-cli ${operation} ${num1} ${num2} ${num3}`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            resolve(stdout.trim());
        });
    });
}

describe('LoanPro Calculator Divide Operation', function() {
    this.timeout(10000);

    it('TC01- Division of large integers with multiple operators.', async () => {
        const result = await runCalculator('divide', 10000000, 100000);
        expect(result).to.equal('Result: ' + '100');

    });    it('TC02- Dividing a large number, a small number, and another large number.', async () => {
        const result = await runCalculator('divide', 10000000, 0.0001);
        expect(result).to.equal('Result: ' + '100000000000');

    });    it('TC03- Mixing positive and negative numbers.', async () => {
        const result = await runCalculator('divide', -12345, 5);
        expect(result).to.equal('Result: ' + '-2469');

    });    it('TC04- Division with floating-point numbers.', async () => {
        const result = await runCalculator('divide', 0.3 , 0.1);
        expect(result).to.equal('Result: ' + '3');

    });    it('TC05- Dividing zero and negative zero from a number.', async () => {
        const result = await runCalculator('divide', 0, -1);
        expect(result).to.equal('Result: ' + '0');

    });    it('TC06- Division with scientific notation.', async () => {
        const result = await runCalculator('divide', 1.23e10, 4.56e-2);
        expect(result).to.equal('Result: ' + '269736842105.26315');

    });    it('TC07- Mixed signs and magnitudes in the division.', async () => {
        const result = await runCalculator('divide', 1000, -7);
        expect(result).to.equal('Result: ' + '-142.85714286');

    });    it('TC08- Division involving infinity', async () => {
        const result = await runCalculator('divide', 'Infinity', 'Infinity');
        expect(result).to.equal('Result: ' + 'NaN');

    });    it('TC09- Division involving NaN', async () => {
        const result = await runCalculator('divide', 1, 'NaN');
        expect(result).to.equal('Result: ' + 'NaN');

    });    it('TC10- Repeated small divisions leading to a larger quotient.', async () => {
        const result = await runCalculator('divide', 1.0, 1.0, 1.0);
        expect(result).to.equal('Result: ' + '1');

    });    it('TC11 Division near the maximum value of an integer with additional small values.', async () => {
        const result = await runCalculator('divide', 2147483, 2);
        expect(result).to.equal('Result: ' + '1073741.5');

    });    it('TC12- Division with integers, floats, and scientific notation.', async () => {
        const result = await runCalculator('divide', 1000, 2.5);
        expect(result).to.equal('Result: ' + '400');

    });    it('TC13- Division of several large and small numbers.', async () => {
        const result = await runCalculator('divide', 1e20 , 1e10);
        expect(result).to.equal('Result: ' + '10000000000');

    });    it('TC14- Division of multiple negative numbers.', async () => {
        const result = await runCalculator('divide', -100, -10);
        expect(result).to.equal('Result: ' + '10');

    });    it('TC15- Division involving zero.', async () => {
        const result = await runCalculator('divide', 100, 0);
        expect(result).to.equal('Error: ' + 'Cannot divide by zero');
    });
});

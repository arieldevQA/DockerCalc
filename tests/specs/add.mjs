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

describe('LoanPro Calculator add operator', function() {
    this.timeout(10000);

    it(' TC01- should add Addition of large integers with multiple operators', async () => {
        const result = await runCalculator('add', 99999999 , 88888888 );
        expect(result).to.equal('Result: ' + '188888887');
    });

    it('TC02- should add Adding a large number, a small number, and another large number.', async () => {
        const result = await runCalculator('add', 10000000, 0.0000001);
        expect(result).to.equal('Result: ' + '10000000.0000001');
    });

    it('TC03- should add Mixing positive and negative numbers.', async () => {
        const result = await runCalculator('add', 12345, -6789);
        expect(result).to.equal('Result: ' + '5556');
    });

    it('TC04- should add Addition with floating-point numbers.', async () => {
        const result = await runCalculator('add', 0.1, 0.2);
        expect(result).to.equal('Result: ' + '0.3');
    });

    it('TC05- should add Adding zero, negative zero, and a number.', async () => {
        const result = await runCalculator('add', -0 , 12345);
        expect(result).to.equal('Result: ' + '12345');
    });

    it('TC06- should Addition with scientific notation.', async () => {
        const result = await runCalculator('add', 1.23e10, 4.56e-10);
        expect(result).to.equal('Result: ' + '12300000000');
    });

    it('TC07- should add Mixed signs and magnitudes in the addition.', async () => {
        const result = await runCalculator('add', 1000 , -2000);
        expect(result).to.equal('Result: ' + '-1000');
    });

    it('TC08- should add Addition involving infinity.', async () => {
        const result = await runCalculator('add', 1, 'Infinity');
        expect(result).to.equal('Result: ' + '∞');
    });

    it('TC09- should add Addition involving NaN.', async () => {
        const result = await runCalculator('add', 1, 'NaN');
        expect(result).to.equal('Result: ' + 'NaN');
    });

    it('TC10- should add Repeated small additions leading to a larger sum.', async () => {
        const result = await runCalculator('add', 0.01, 0.01, 0.01);
        expect(result).to.equal('Result: ' + '0.02');
    });

    it('TC11- should add Addition near the maximum value of an integer with additional small values.', async () => {
        const result = await runCalculator('add', 2147483647 , -2);
        expect(result).to.equal('Result: ' + '2147483645');
    });

    it('TC12- should add Addition with integers, floats, and scientific notation.', async () => {
        const result = await runCalculator('add', 200.5  , 3.14e2);
        expect(result).to.equal('Result: ' + '514.5');
    });

    it('TC13- should add Addition of several large and small numbers', async () => {
        const result = await runCalculator('add', 1e20, 1);
        expect(result).to.equal('Result: ' + '100000000000000000000');
    });

    it('TC14- should add Addition of multiple negative numbers', async () => {
        const result = await runCalculator('add', -1000, -2000);
        expect(result).to.equal('Result: ' + '-3000');
    });

    it('TC15- should add Adding hexadecimal and decimal numbers.', async () => {
        const result = await runCalculator('add', 0xF, 1);
        expect(result).to.equal('Result: ' + '16');
    });

});

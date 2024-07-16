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

describe('LoanPro Calculator multiply', function() {
    this.timeout(10000);

    it('TC01- Multiplication of large integers with multiple operators.', async () => {
        const result = await runCalculator('multiply', 99999999, 88888888 );
        expect(result).to.equal('Result: ' + '8888888711111112');
    });

    it('TC02- Multiplying a large number, a small number, and another large number.', async () => {
        const result = await runCalculator('multiply', 10000000, 0.0000001);
        expect(result).to.equal('Result: ' + '1');
    });

    it('TC03- Mixing positive and negative numbers.', async () => {
        const result = await runCalculator('multiply', 12345, -6789);
        expect(result).to.equal('Result: ' + '-83810205');
    });

    it('TC04- Multiplication with floating-point numbers.', async () => {
        const result = await runCalculator('multiply', 0.1, 0.2);
        expect(result).to.equal('Result: ' + '0.02');
    });

    it('TC05- Multiplying zero, negative zero, and a number.', async () => {
        const result = await runCalculator('multiply', 12345, -0);
        expect(result).to.equal('Result: ' + '0');
    });

    it('TC06- Multiplication with scientific notation.', async () => {
        const result = await runCalculator('multiply', 1.23e10, 4.56e-10);
        expect(result).to.equal('Result: ' + '5.6088');
    });

    it('TC07- Mixed signs and magnitudes in the multiplication.', async () => {
        const result = await runCalculator('multiply', 1000, -5000);
        expect(result).to.equal('Result: ' + '-5000000');
    });

    it('TC08- Multiplication involving infinity.', async () => {
        const result = await runCalculator('multiply', 'Infinity', 'Infinity ');
        expect(result).to.equal('Result: ' + '∞');
    });

    it('TC09- Multiplication involving NaN.', async () => {
        const result = await runCalculator('multiply', 1, 'NaN');
        expect(result).to.equal('Result: ' + 'NaN');
    });

    it('TC10- Repeated small multiplications leading to a larger product.', async () => {
        const result = await runCalculator('multiply', 0.1, 0.1, 0.1);
        expect(result).to.equal('Result: ' + '0.01');
    });

    it('TC11- Multiplication near the maximum value of an integer with additional small values.', async () => {
        const result = await runCalculator('multiply', 2147483647, -1);
        expect(result).to.equal('Result: ' + '-2147483647');
    });

    it('TC12- Multiplication with integers, floats, and scientific notation.', async () => {
        const result = await runCalculator('multiply', 100, 3.14e2);
        expect(result).to.equal('Result: ' + '31400');
    });

    it('TC13- Multiplication of several large and small numbers.', async () => {
        const result = await runCalculator('multiply', 1e20, 1e-20);
        expect(result).to.equal('Result: ' + '1');
    });

    it('TC14- Multiplication of multiple negative numbers.', async () => {
        const result = await runCalculator('multiply', -2, -4);
        expect(result).to.equal('Result: ' + '8');
    });

    it('TC15- Multiplying hexadecimal and decimal numbers.', async () => {
        const result = await runCalculator('multiply', 10, 0xF);
        expect(result).to.equal('Result: ' + '150');
    });


});

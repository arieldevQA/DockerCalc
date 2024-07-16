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

describe('LoanPro Calculator subtract', function() {
    this.timeout(10000);

    it('TC01- Subtraction of large integers with multiple operators.', async () => {
        const result = await runCalculator('subtract', 99999999, 88888888);
        expect(result).to.equal('Result: ' + '11111111');
    });

    it('TC02- Subtracting a large number, a small number, and another large number.', async () => {
        const result = await runCalculator('subtract', 1000000000, 0.000000001);
        expect(result).to.equal('Result: ' + '1000000000');
    });

    it('TC03- Mixing positive and negative numbers.', async () => {
        const result = await runCalculator('subtract', 12345, -6789);
        expect(result).to.equal('Result: ' + '19134');
    });

    it('TC04- Subtraction with floating-point numbers.', async () => {
        const result = await runCalculator('subtract', 0.3, 0.3);
        expect(result).to.equal('Result: ' + '0');
    });

    it('TC05- Subtracting zero and negative zero from a number.', async () => {
        const result = await runCalculator('subtract', 12345, 0);
        expect(result).to.equal('Result: ' + '12345');
    });

    it('TC06- Subtraction with scientific notation.', async () => {
        const result = await runCalculator('subtract', 1.23e10, 4.56e-10);
        expect(result).to.equal('Result: ' + '12300000000');
    });

    it('TC07- Mixed signs and magnitudes in the subtraction.', async () => {
        const result = await runCalculator('subtract', 1000 , -2000 , 3000);
        expect(result).to.equal('Result: ' + '3000');
    });

    it('TC08- Subtraction involving infinity.', async () => {
        const result = await runCalculator('subtract', 'Infinity', 1);
        expect(result).to.equal('Result: ' + '∞');
    });

    it('TC09- Subtraction involving NaN.', async () => {
        const result = await runCalculator('subtract', 1, 'NaN');
        expect(result).to.equal('Result: ' + 'NaN');
    });

    it('TC10- Repeated small subtractions leading to a larger difference', async () => {
        const result = await runCalculator('subtract', 0.1, 0.1, 0.1);
        expect(result).to.equal('Result: ' + '0');
    });

    it('TC11- Subtraction near the minimum value of an integer with additional small values.', async () => {
        const result = await runCalculator('subtract', -2147483648 , -1, 2);
        expect(result).to.equal('Result: ' + '-2147483647');
    });

    it('TC12- Subtraction with integers, floats, and scientific notation.', async () => {
        const result = await runCalculator('subtract', 200.5, 3.14e2);
        expect(result).to.equal('Result: ' + '-113.5');
    });

    it('TC13- Subtraction of several large and small numbers.', async () => {
        const result = await runCalculator('subtract', 1e20, -1e-20, -1);
        expect(result).to.equal('Result: ' + '100000000000000000000');
    });

    it('TC14- Subtraction of multiple negative numbers.', async () => {
        const result = await runCalculator('subtract', -1000, -2000, -3000);
        expect(result).to.equal('Result: ' + '1000');
    });


    // This is another bug not able to pass Hexadecimal numbers
    // Error: Command failed: docker run --rm public.ecr.aws/l4q9w4c5/loanpro-calculator-cli subtract 26 0xF null
    it('TC15- Subtracting hexadecimal and decimal numbers.', async () => {
        const result = await runCalculator('subtract', 26, '0xF');
        expect(result).to.equal('Result: ' + '11');
    });


});

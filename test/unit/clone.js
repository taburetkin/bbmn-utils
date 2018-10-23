import '../setup';
import { clone } from '../../src';

describe('clone: ', function(){
	describe('when cloning not an object', function(){

		it('should return undefined if argument is function and functions disabled',function(){
			expect(clone(() => {})).to.be.undefined;
		});

		it('should return given function without change if functions enabled',function(){
			let test = () => {};
			expect(clone(test, { functions: true })).to.be.equal(test);
		});

		it('should return new date if argument is date',function(){
			let test = new Date();
			let cloned = clone(test);
			expect(cloned).to.be.not.equal(test);
			expect(cloned.valueOf()).to.be.equal(test.valueOf());
		});

		it('should clone array', function(){
			let test = [1,2,3];
			let cloned = clone(test);
			expect(cloned).to.be.not.equal(test);
			expect(cloned).to.be.eql(test);
		});

		it('should return non object values', function(){
			let test = [1,2,3];
			let cloned = clone(test);
			expect(clone('foo')).to.be.equal('foo');
			expect(clone(12)).to.be.equal(12);
		});

	});

	describe('when cloning an object',function(){
		it('should clone only own properties', function(){
			let Test = function(){
				this.foo = 'foo';
				this.baz = 12;
			};
			Test.prototype.bar = 'bar';
			let test = new Test();
			expect(clone(test)).to.be.eql({ foo: 'foo', baz: 12 });
		});

		it('should omit skipped properties', function(){
			let test = {
				foo: undefined,
				bar: () => {},
				baz: 123
			}
			let cloned = clone(test);
			expect(cloned).to.be.eql({ foo: undefined, baz: 123 });
			expect(_.size(cloned)).to.be.equal(2);
		});

		it('should avoid circular references', function(){
			let test = {
				foo: undefined,
				bar: () => {},
				baz: 123,				
			}
			test.test = test;
			let cloned = clone(test);
			expect(cloned).to.be.eql({ foo: undefined, baz: 123 });
			expect(_.size(cloned)).to.be.equal(2);
		});

		it('should clone nested arrays', function(){
			let testArr = [1,2];
			let test = {
				foo: 'foo',
				arr: testArr,
				deep: {
					arr: testArr
				}
			};
			let cloned = clone(test);
			
			expect(_.size(cloned)).to.be.equal(3);
			expect(cloned.arr).to.be.not.equal(cloned.deep.arr);
			expect(cloned.arr).to.be.eql(cloned.deep.arr);
			expect(cloned.arr).to.be.eql(testArr);

		});

		it('should clone with functions if functions enabled', function(){
			let fn = () => {};
			let test = {
				foo: 'foo',
				fn,
				deep: {
					fn
				}
			};
			let cloned = clone(test, { functions: true });
			
			expect(_.size(cloned)).to.be.equal(3);
			expect(cloned.fn).to.be.equal(cloned.deep.fn);
			expect(cloned.fn).to.be.equal(fn);
			
		});

		it('should act like underscore _.clone if deep is false', function(){
			let opts = { deep: false };
			let test = {
				foo:'foo',
				bar: {
					baz:'baz'
				}
			}
			expect(clone(123, opts)).to.be.equal(_.clone(123));
			expect(clone('asd', opts)).to.be.equal(_.clone('asd'));
			expect(clone(new Date(), opts)).to.be.eql(_.clone(new Date()));
			expect(clone(test, opts)).to.be.eql(_.clone(test));
		});

	});

});

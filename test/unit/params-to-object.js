import '../setup';
import { paramsToObject } from '../../src';

describe('paramsToObject: ', function(){
	it('should return undefined if its not a string and emptyObject option is set to false', function(){
		expect(paramsToObject(123, { emptyObject: false })).to.be.undefined;
	});
	it('should return empty object if its not a string and emptyObject option is set to true', function(){
		expect(paramsToObject(123, { emptyObject: true })).to.be.eql({});
	});
	it('should return empty object if its not a string and there is no emptyObject option', function(){
		expect(paramsToObject(123)).to.be.eql({});
	});
	it('should return empty object if given string is empty', function(){
		expect(paramsToObject('')).to.be.eql({});
	});
	it('should return undefined if given string is empty and emptyObject is set to false', function(){
		expect(paramsToObject('', { emptyObject: false })).to.be.undefined;
	});
	it('should return empty object if given string does not contain any valued keys', function(){
		expect(paramsToObject('key1=&key2=&=bar')).to.be.eql({});
	});
	it('should return undefined if it does not contain any valued keys and emptyObject is set to false', function(){
		let str = 'key1=&key2=';
		expect(paramsToObject(str, { emptyObject: false })).to.be.undefined;
	});
	it('should return array if asArray option passed', function(){
		let str = 'key1=asd&key2=asd';
		expect(paramsToObject(str, { asArray: true })).to.be.an('array');
	});	

	// it.only('test case', function(){
	// 	let str = 'key.x=asd&key[1].y=asd';
	// 	let result = paramsToObject(str);
	// 	console.log(result);
	// });

	describe('when string is valid', function(){
		let str = 'foo=foo&bar=bar&bar=bar2&bar=bar3';
		let result;
		let spyTransform;
		beforeEach(function(){
			let transform = (key, value) => value;
			spyTransform = this.sinon.spy(transform);
			result = paramsToObject(str, { transform: spyTransform });
		});
		it('should merge keys to an object', function(){
			let result = paramsToObject('foo=bar');
			expect(result).to.be.an('object');
			expect(result.foo).to.be.equal('bar');
			expect(_.size(result)).to.be.equal(1);
		});
		it('should merge same keys to array', function(){
			expect(_.size(result)).to.be.equal(2);
			expect(result.bar).to.be.eql(['bar','bar2','bar3']);
		});
		it('should return valued object', function(){
			expect(result.foo).to.be.equal('foo');
		});
		it('should call transform for each value', function(){
			expect(spyTransform).to.have.callCount(4);
		});
	});

	describe('when complex option is passed', function(){
		let str = '';
		const test = _.partial(paramsToObject, _, { complex: true });

		it('should return simple keys as usual paramsToObject', function(){
			str = 'zxc=1&asd=2&qwe=3';
			expect(test(str)).to.be.eql({zxc:'1',asd:'2',qwe:'3'});
		});

		it('should respect key tokens and return mixed objects instead of raw values', function(){
			str = 'test.foo=foo&test.bar=bar';
			expect(test(str)).to.be.eql({test:{ foo: 'foo', bar: 'bar' }});
		});

		it('should respect key indexes and return mixed arays instead of raw values', function(){
			str = 'test=foo&test[3]=bar&test[2]=baz';
			expect(test(str)).to.be.eql({test:['foo', undefined, 'baz', 'bar']});
		});

		it('should place similar key values to array', function(){
			str = 'test=foo&test=bar&test=baz';
			expect(test(str)).to.be.eql({test:['foo', 'bar', 'baz']});
		});

		it('should respect missed indexes', function(){
			str = 't.v=foo&t.v=bar&t[0].v=baz';
			expect(test(str)).to.be.eql({t:[{v:'baz'}, {v:'bar'}]});
		});
		it('should respect indexes', function(){
			str = 't[0].v=foo&t[1].v=bar&t[2].v=baz';
			expect(test(str)).to.be.eql({t:[{v:'foo'}, {v:'bar'}, {v:'baz'}]});
			expect(test('t[1]=foo')).to.be.eql({t:[undefined, 'foo']});
		});			
		it('should extend last value if there is no index and token not filled yet', function(){
			str = 't.v=foo&t.v=next&t.b=bar&t[1].v=last';
			expect(test(str)).to.be.eql({t: [ {v:'foo'}, {v:'last', b:'bar'}] });
		});
		it('should add new array item if there is no index and token already filled', function(){
			str = 't.v=foo&t.v=next&t.b=bar&t.v=last';
			expect(test(str)).to.be.eql({t: [ {v:'foo'}, {v:'next', b:'bar'}, {v:'last'}] });
		});		
	});

});

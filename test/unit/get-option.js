import '../setup';
import { getOption, instanceGetOption } from '../../src';
import { BackboneView } from 'bbmn-core';

describe('get-option: ', function(){
	describe('when second argument is an object', function(){
		it('should treat it as `alsoCheck`', function(){
			expect(getOption({}, {foo:'bar'}, 'foo')).to.be.equal('bar');
		});
	});
	describe('when first argument is undefined', function(){
		it('should return undefined', function(){
			expect(getOption(undefined, 'foo')).to.be.undefined;
		});
	});
	describe('when used inside constructor as instanceGetOption', function(){
		const Test = BackboneView.extend({
			constructor: function(options){
				this.bar = this.getOption(options, 'foo');
				BackboneView.apply(this, arguments);
				this.options = options;
			},
			getOption: instanceGetOption
		});
		let test;
		beforeEach(function(){
			test = new Test({ foo:'test ok'});
		});
		it('should be able handle not settled options', function(){
			expect(test.bar).to.be.equal('test ok');
		});
		it('should act as usual getOption', function(){
			expect(test.getOption('foo')).to.be.equal('test ok');
			expect(test.getOption('bar')).to.be.equal('test ok');
		});		
	});
});

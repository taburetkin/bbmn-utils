import '../setup';
import { triggerMethod, triggerMethodOn } from '../../src';
import { Model } from 'bbmn-core';

describe('triggerMethod:', function(){
	describe('when context is extended by Backbone.Events', function(){
		const MyModel = Model.extend({
			triggerMethod
		});
		let context;
		let trigger;
		let onTest;
		let options = {};
		let instanceStub;
		let optionsStub;
		let instanceStub2;
		let eventStub;
		let result;
		beforeEach(function(){
			instanceStub = this.sinon.stub();
			optionsStub = this.sinon.stub();
			instanceStub2 = this.sinon.stub();
			eventStub = this.sinon.stub();

			context = new MyModel();
			context.on('options:test', eventStub);
			context.onOptionsTest = instanceStub2;
			context.options = {
				onOptionsTest: optionsStub
			};
			context.onTest = instanceStub;

			context.triggerMethod('test', options, 1, 2, 3);
			context.triggerMethod('options:test', options, 1, 2, 3);
			result = context.triggerMethod('foo:bar');
		});

		it('should call `on` method', function(){
			expect(instanceStub).to.be.calledOnce.and.calledWith(options, 1, 2, 3);
			expect(eventStub).to.be.calledOnce.and.calledWith(options, 1, 2, 3);
		});

		it('should call `on` method from options', function(){
			expect(optionsStub).to.be.calledOnce.and.calledWith(options, 1, 2, 3);
			expect(instanceStub2).to.be.not.called;
			expect(eventStub).to.be.calledOnce.and.calledWith(options, 1, 2, 3);
		});

		it('should return undefined if there is no `on` hook', function(){
			expect(result).to.be.undefined;
		});

	});

	describe('when context not extended with Backbone.Events (in fact has no trigger method)', function(){
		const context = {
			triggerMethod
		};
		let result;
		beforeEach(function(){
			result = context.triggerMethod('foo:bar');
		});
		it('should return undefined if there is no `on` hook', function(){
			expect(result).to.be.undefined;
		});		
		
	});

});

describe('trigger-method-on: ', function(){
	it('should return undefined if context is not object', function(){
		expect(triggerMethodOn()).to.be.undefined;
	});
	it('should return result of trigger method', function(){
		let context = {
			onTest: () => 'abc'
		}
		let result = triggerMethodOn(context, 'test');
		expect(result).to.be.equal('abc');
	});
});

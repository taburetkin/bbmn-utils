import '../setup';
import { buildViewByKey, isView } from '../../src/index.js';
import { BackboneView } from 'bbmn-core';

describe('build-view-by-key',function(){
	const testView = new BackboneView();
	const context = {
		text: 'this is a text',
		testViewClass: BackboneView,
		testView,				
	}
	it('should return undefined if key is not a string', function(){
		expect(buildViewByKey()).to.be.undefined;
		expect(buildViewByKey(() => {})).to.be.undefined;
		expect(buildViewByKey([1,2])).to.be.undefined;
		expect(buildViewByKey({})).to.be.undefined;
		expect(buildViewByKey(1)).to.be.undefined;
	});

	it('should return undefined if TextView not passed and value is a string', function(){
		expect(buildViewByKey.call(context, 'text')).to.be.undefined;
	});

	it('should return view if TextView is passed and value is a string', function(){
		expect(buildViewByKey.call(context, 'text', { TextView: BackboneView })).to.be.instanceOf(BackboneView);
	});	

	it('should return view if TextView is passed and value is a string', function(){
		expect(buildViewByKey.call(context, 'text', { TextView: BackboneView })).to.be.instanceOf(BackboneView);
	});		

	it('should return view if value is a view', function(){
		expect(buildViewByKey.call(context, 'testView')).to.be.equal(testView);
	});	

	it('should return view if value is a viewClass and there is no options for view in context ', function(){
		expect(buildViewByKey.call(context, 'testViewClass')).to.be.instanceOf(BackboneView);
	});	

	describe('when ViewClass and ViewClassOptions supplied', function(){
		let context;
		let view;
		const viewClass = BackboneView.extend({
			constructor(options){
				BackboneView.apply(this, options);
				this.options = options;					
			}
		});
		const viewClassOptions = { foo: 'bar' };
		context = {
			viewClass,
			viewClassOptions
		}
		view = buildViewByKey.call(context, 'viewClass');

		it('should return instance of context class', function(){
			expect(view).to.be.instanceOf(BackboneView);
		});	
		it('should take options from context', function(){
			expect(view.options).to.be.eql(viewClassOptions);
		});
	});

});

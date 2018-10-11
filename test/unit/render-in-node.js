import '../setup';
import { View } from 'backbone.marionette';
import { renderInNode } from '../../src/index.js';


describe('renderInNode: ', function(){
	const MyView = View.extend({
		template:() => 'hello',
	});
	
	const selector = '.my-region';
	const cssclass = selector.substring(1);

	const Region = renderInNode.config.Region;
	let view;

	describe('given el:', function(){
		let show;
		beforeEach(function(){
			show = this.sinon.stub();
			renderInNode.config.Region = Region.extend({
				show
			});
			view = new MyView();
		});
		afterEach(function(){
			renderInNode.config.Region = Region;
			document.body.innerHTML = '';
		});
		it('should call NodeRegion show with given view', function(){		
			renderInNode(view);
			expect(show).to.be.calledOnce.and.calledWith(view);
		});
		it('should throw if el is not resolved', function(){
			
			expect(renderInNode.bind(null, view, { el: {} })).to.throw();
		});
		it('should call NodeRegion show with given view if el is element', function(){
			
			renderInNode(view, { el: document.body });
			expect(show).to.be.calledOnce.and.calledWith(view);
		});	
		it('should call NodeRegion show with given view if el is jQuery', function(){
			let $el = $('<div>').appendTo(document.body);
			renderInNode(view, { el: $el });
			expect(show).to.be.calledOnce.and.calledWith(view);
		});
		it('should call NodeRegion show with given view if el is string selector', function(){
			let $el = $('<div class="' + cssclass + '">').appendTo(document.body);
			renderInNode(view, { el: selector });
			expect(show).to.be.calledOnce.and.calledWith(view);
		});
	});



	describe('when view destroyed', function(){
		
		
		let $el;
		let myTestFunc;
		let region;
		beforeEach(function(){
			$el = $('<div class="'+ cssclass + '">').appendTo(document.body);
			view = new MyView();
			myTestFunc = (myview, opts) => {

				let options = _.extend({ el: selector, replaceElement: false }, opts);
				region = renderInNode(myview, options);
				myview.destroy();

				return region;
			};			
		});
		afterEach(function(){
			document.body.innerHTML = '';
		});
		it('should not remove region el from the dom by default', function(){
			myTestFunc(view);
			expect($(selector).length).to.be.equal(1);
		});
		it('should destroy self if destroySelfOnEmpty is true', function(){
			myTestFunc(view, { destroySelfOnEmpty: true });
			expect(region.isDestroyed()).to.be.true;
		});
		it('should not remove dom element if destroyed and destroyOnEmpty is false', function(){
			myTestFunc(view, { destroySelfOnEmpty: true });
			expect($(selector).length).to.be.equal(1);
		});
		it('should destroy self  if destroyOnEmpty is true', function(){
			myTestFunc(view, { destroyOnEmpty: true });
			expect(region.isDestroyed()).to.be.true;
		});
		it('should remove node if destroyOnEmpty is true', function(){
			myTestFunc(view, { destroyOnEmpty: true });			
			expect($(selector).length).to.be.equal(0);
		});						
	});
});

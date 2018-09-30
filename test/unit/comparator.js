import '../setup';
import { comparator } from '../../src/index.js';
import { Model } from 'bbmn-core';



describe('comparator',function(){
	

	describe('simple compare', function(){
		it('should return 0 if no argument passed',() => {
			expect(comparator()).to.equal(0);
		});
		it('should act like compareAB if there is a three arguments',() => {
			expect(comparator(1,2)).to.equal(-1);
			expect(comparator('abc','abc')).to.equal(0);
			expect(comparator(-2, 2, function(){ return this * -1; })).to.equal(1);
		});
	});

	describe('multiple comparing', function(){
		let compares;
		let compareBy;
		let items;
		const sort = () => {
			let newitems = items.slice(0);
			return newitems.sort(compareBy);
		}
		const getCompares = (a,b) => _.map(compares, getter => _.isFunction(getter) && [a,b, getter] || getter); 
		beforeEach(function(){
			items = [
				new Model({id:1, order: 1, name: 'bcd'}),
				new Model({id:2, order: 1, name: 'abc'}),
				new Model({id:3, order: 0, name: 'aaa'})
			];			
			compares = [
				model => model.get('order'),
				model => model.get('name')
			];
			compareBy = (a,b) => {
				let compareItems = getCompares(a,b);
				return comparator(...compareItems);
			}
		});
		it('should apply multiple comparators if all arguments correct',() => {
			let sorted = sort();
			expect(sorted[0]).to.equal(items[2]);
			expect(sorted[2]).to.equal(items[0]);
		});
		it('should skip nonArray arguments while processing multiple comparators',() => {
			compares.splice(1,0, undefined);
			let sorted = sort();
			expect(sorted[0]).to.equal(items[2]);
			expect(sorted[2]).to.equal(items[0]);
		});			
	});

});

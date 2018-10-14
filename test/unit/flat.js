import '../setup';

import { flat } from '../../src/index.js';
import { privateApi } from '../../src/flat/index.js';
import { Model } from 'bbmn-core';

describe('flat: ',function(){
	


	describe('passed arguments', function(){
		it('should return undefined if passed argument is null', () => {
			expect(flat(undefined)).to.be.equal(undefined);
		});
		it('should return undefined if passed argument is not an object', () => {
			expect(flat(123)).to.be.equal(undefined);
		});
		it('should return different object if passed argument is an object', () => {
			const testObject = {};
			expect(flat(testObject)).to.be.a('object').and.not.equal(testObject);
		});
	});

	describe('internal traverse', function(){
		describe('when traverse argument has nested objects', function(){
			let traverse;
			beforeEach(function(){
				traverse = this.sinon.spy(privateApi, 'traverse');
			});

			it('should recursively call privateApi.traverse', function(){
				flat({
					one:{
						two:{

						}
					}
				});
				expect(traverse).to.be.calledThrice;
			});

		});

		describe('when traverse argument is an object', function(){

			const testArr = [1,2,3];
			const bazValue = 'hello';
			const simple = {
				baz: bazValue,
				tesUndef: undefined,
				testNull: null,
				testZero: 0,
				testEmpty: '',
				testEmptyArray: [],
			}

			describe(': empty arguments ', function(){
				let result = flat(simple);				
				it('should omit undefined values', function(){
					expect('testUndef' in result).to.be.false;
				});
				it('should not omit null values', function(){
					expect('testNull' in result).to.be.true;
				});
				it('should not omit empty string values', function(){
					expect('testEmpty' in result).to.be.true;
				});
				it('should not omit zero values', function(){
					expect('testZero' in result).to.be.true;
				});
				it('should not omit empty arrays values', function(){
					expect('testEmptyArray' in result).to.be.true;
				});
			});

			describe('flattening', function(){
				let result;
				const simpleSize = _.size(simple) - 1; //excluding one undefined key
				let expectedKeyLength;
				const testDate = new Date();
				beforeEach(function(){

					result = flat({
						foo: simple,
						bar: simple,
						baz: {
							one: simple,
							two: simple,
							trhee: testArr
						},
						arr: testArr,
						date: testDate
					});

					expectedKeyLength = simpleSize * 4 + 3; // two arrays too.
				});

				it('should have expected key length', function(){
					expect(_.size(result)).to.be.equal(expectedKeyLength);
				});

				it('should not have nested objects', function(){
					let anyObject = _.some(result, value => !_.isArray(value) && !_.isDate(value) && _.isObject(value));
					expect(anyObject).to.be.false;
				});				

				it('should clone all arrays inside', function(){
					let anyNotClonedArray = _.some(result, value => value === testArr);
					expect(anyNotClonedArray).to.be.false;
				});					

				it('should clone dates', function(){
					expect(result.date).to.be.instanceOf(Date).and.not.equal(testDate);
				});	

				it('should flat properties', function(){
					expect(result['foo.baz']).to.be.equal(bazValue);
				});	

			});

		});	

		describe('when traverse argument is a Backbone.Model', function(){
			const model = new Model({
				foo:'foo',
				bar: {
					baz:'baz'
				},
				model: new Model({
					foo:'foo',
					bar: {
						baz:'baz',
						shmaz: 123
					}
				})
			});
			let result;
			const expectedSize = 5;
			beforeEach(function(){
				result = flat(model);
			});

			it('should not have nested objects', function(){
				let anyObject = _.some(result, value => !_.isArray(value) && !_.isDate(value) && _.isObject(value));
				expect(anyObject).to.be.false;
			});	
			it('should have expected key length', function(){
				expect(_.size(result)).to.be.equal(expectedSize);
			});
			it('should have given values', function(){
				expect(result['model.bar.baz']).to.be.equal('baz');
			});
		});

		describe('when traverse argument is wrong', function(){
			it('should return undefined if traverse argument is global', function(){
				expect(flat(global)).to.be.undefined;
			});
			it('should return undefined if traverse argument is null', function(){
				expect(flat(null)).to.be.undefined;
			});
			it('should return undefined if traverse argument is undefined', function(){
				expect(flat(undefined)).to.be.undefined;
			});
			it('should return undefined if traverse argument is missing', function(){
				expect(flat(window)).to.be.undefined;
			});				
		});

	});


	// it('should return flatten object', () => {
		
	// 	let value = flat(test);
	// 	expect(_.isObject(value)).to.be.equal(true);
	// 	expect(_.size(value)).to.be.equal(2);
	// 	expect('foo.bar.baz' in value).to.be.equal(true);
	// 	expect(value['foo.bar.baz']).to.be.equal('hello');
	// 	expect(value['foo.qwe']).to.be.equal(testArr);

	// });

});

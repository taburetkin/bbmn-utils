import '../setup';
import { getByPath } from '../../src/index.js';
import getByPathArray from '../../src/get-by-path/get-by-path-array';
import getProperty from '../../src/get-by-path/get-property';
describe('get-by-path',function(){
	
	it('should return undefined if context is not object',() => {
		expect(getByPath(null, 'path.path')).to.undefined;
		expect(getByPath(undefined, 'path.path')).to.undefined;
		expect(getByPathArray(null)).to.be.undefined;
		expect(getProperty(null)).to.be.undefined;
	});

	it('should return undefined if path is empty',() => {
		expect(getByPath({a:'a'}, '')).to.undefined;
	});	

	it('should return undefined if path is not exists',() => {
		expect(getByPath({a:'a'}, 'path.path')).to.undefined;
	});	
	
	it('should return undefined if path is incorrect',() => {
		expect(getByPath({a:'a'}, {})).to.undefined;
	});	

	it('should return value if path is exists',() => {
		expect(getByPath({foo:{bar:{baz:'test value'}}}, 'foo.bar.baz')).to.equal('test value');
		expect(getByPath({foo:{bar:{baz:'test value'}}}, ['foo','bar','baz'])).to.equal('test value');
	});
});

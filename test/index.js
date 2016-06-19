/**
 * Created by Samuel on 6/4/2016.
 */

var assert = require('assert');
var short = require('../index');

var validUUIDRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('short-uuid', function(){

    it('should be a constructor function', function(){

        var b90;
        assert.ok(typeof short === 'function');

        assert.doesNotThrow(function(){
            b90 = short(short.constants.cookieBase90);
        }, "Calling does not throw an error");

        assert.equal(typeof b90, 'object', "constructor returns an object");
    });

    it('should use the b58 argument as default', function(){

        var b58default;

        assert.doesNotThrow(function(){
            b58default = short();
        });

        assert.equal(b58default.alphabet, short.constants.flickrBase58, 'Default provides the flickrBase58 alphabet');

        var new58short = b58default.new();
        var new58long = b58default.toUUID(new58short);

        assert.ok(validUUIDRegex.test(new58long), 'default produces valid output');
    });

    describe('constants', function(){

        it('should contain a "constants" object', function(){
            assert.ok(short.hasOwnProperty('constants') && typeof short.constants === 'object');
        });

        it('should contain constant values', function(){
            assert.equal(short.constants.flickrBase58, '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ');
            assert.equal(short.constants.cookieBase90, "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%&'()*+-./:<=>?@[]^_`{|}~");
        });
    });

    describe('operation', function(){

        var b90 = short(short.constants.cookieBase90);
        var b58 = short(short.constants.flickrBase58);

        var uu, f58, f90;

        for (var i = 0; i < 10; i++) {
            uu = short.uuid();

            it('should generate valid UUIDs', function(){
                assert.ok(validUUIDRegex.test(uu), 'UUID is valid');
            });

            f58 = b58.fromUUID(uu);
            f90 = b90.fromUUID(uu);

            it('should translate back from multiple bases', function(){

                assert.equal(b58.toUUID(f58), uu, 'Translated b58 matches original');
                assert.ok(validUUIDRegex.test(b58.toUUID(f58)), 'Translated UUID is valid');

                assert.equal(b90.toUUID(f90), uu, 'Translated b90 matches original');
                assert.ok(validUUIDRegex.test(b90.toUUID(f90)), 'Translated UUID is valid');
            });

            it('should return a standard v4 uuid from instance.uuid()', function(){
                assert.ok(validUUIDRegex.test(b58.uuid()), '.uuid() is a valid UUID');
            });
        }
        
        it('should handle UUIDs that begin with zeros', function(){
            var someZeros = '00000000-a70c-4ebd-8f2b-540f7e709092';

            // Support even invalid UUIDs, for completeness
            var allZeros = '00000000-0000-0000-0000-000000000000';

            assert.equal(someZeros, b58.toUUID(b58.fromUUID(someZeros)),'Supports starting zeroes');
            assert.equal(someZeros, b90.toUUID(b90.fromUUID(someZeros)),'Supports starting zeroes');

            assert.equal(allZeros, b58.toUUID(b58.fromUUID(allZeros)),'Supports starting zeroes');
            assert.equal(allZeros, b90.toUUID(b90.fromUUID(allZeros)),'Supports starting zeroes');
        });

    });
    
    describe('new', function(){
        it('should create a shortened UUID', function(){
            var b58 = short(short.constants.flickrBase58);

            var shorter = b58.new();
            var expanded = b58.toUUID(shorter);
            var shortened = b58.fromUUID(expanded);

            assert.equal(shorter, shortened, 'Generated Short ID is the same as re-shortened ID');

            assert.ok(validUUIDRegex.test(expanded), 'UUID is valid');

        })

    });

});
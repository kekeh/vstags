describe('vstags', function () {
    var elm, scope;

    beforeEach(module('vstags'));

    beforeEach(inject(function ($rootScope, $compile) {

        scope = $rootScope;

        scope.selectedTags = ['Item #2', 'Item #4'];

        elm = angular.element('<vstags ng-model="selectedTags"></vstags>');

        $compile(elm)(scope);
        scope.$digest();

    }));

    it('is vstags', function () {
        expect(elm[0].querySelectorAll('.vstags').length).toBe(1);
    });

    it('is vstagsgroup', function () {
        expect(elm[0].querySelectorAll('.vstagsgroup').length).toBe(1);
    });

    it('is vsselectedtags', function () {
        expect(elm[0].querySelectorAll('.vsselectedtags').length).toBe(2);
    });

    it('is vstagtext', function () {
        expect(elm[0].querySelectorAll('.vstagtext').length).toBe(2);
    });

    it('is vsiconcross', function () {
        expect(elm[0].querySelectorAll('.vsiconcross').length).toBe(2);
    });

    it('is icon-plus', function () {
        expect(elm[0].querySelectorAll('.icon-plus').length).toBe(1);
    });

    it('is vstagsinput', function () {
        expect(elm[0].querySelectorAll('.vstagsinput').length).toBe(1);
    });

    it('is content', function () {
        var tElem = elm[0].querySelectorAll('.vstagtext');
        expect(angular.element(tElem[0]).text()).toEqual('Item #2');
        expect(angular.element(tElem[1]).text()).toEqual('Item #4');
    });

    it('is vstagsloader', function () {
        expect(elm[0].querySelectorAll('.vstagsloader').length).toBe(1);
    });

});
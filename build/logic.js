'use strict';
var root = {
    que1: {
        yes: {
            que2: {
                sure: {
                    que3: {
                        confirm: {
                            ans1: '1.jpg'
                        },
                        denied: {
                            ans2: '1.jpg'
                        }
                    }
                },
                nope: {
                    ans3: '1.jpg'
                }
            }
        },
        no: {
            que2: {
                okay: {
                    ans4: '1.jpg'
                },
                'uh no': {
                    ans5: '1.jpg'
                }
            }
        }
    }
};
var titles = [
    'que1',
    'que2',
    'que3',
    'ans1',
    'ans2',
    'ans3',
    'ans4',
    'ans5'
];
window.onload = function () {
    var container = document.getElementById('container');
    var AI = (function () {
        function AI(titleArr, root) {
            this.cnt = 0;
            this.rootInfo = root;
            this.titleArr = titleArr;
        }
        AI.prototype.renderer = function () {
            if (this.rootInfo === null || this.rootInfo === undefined) {
                console.log('--');
            }
            else if (typeof this.rootInfo === 'string') {
                console.log(this.rootInfo, 'End of nodes');
            }
            else {
                this.createNextElement();
            }
        };
        AI.prototype.createNextElement = function () {
            var _this = this;
            this.cnt++;
            var rootLevel = Object.keys(this.rootInfo);
            console.log(rootLevel);
            var isTitle = rootLevel.every(function (elem) { return _this.titleArr.indexOf(elem) > -1; });
            isTitle ? this.createTitle(rootLevel) : this.createQuestion(rootLevel);
        };
        AI.prototype.createTitle = function (rootLevel) {
            var title = document.createElement('h1');
            title.id = String(this.cnt);
            title.classList.add('tag');
            title.innerHTML = rootLevel[0];
            if (container !== null) {
                container.appendChild(title);
            }
            this.rootInfo = this.rootInfo[rootLevel[0]];
            this.renderer();
        };
        AI.prototype.createQuestion = function (rootLevel) {
            var currLvl = this.rootInfo;
            var opt = this.createOption;
            var selectTag = document.createElement('SELECT');
            selectTag.id = String(this.cnt);
            selectTag.classList.add('tag');
            opt('--', selectTag);
            rootLevel.forEach(function (x) { return opt(x, selectTag); });
            if (container !== null) {
                container.appendChild(selectTag);
            }
            selectTag.addEventListener('change', function (e) {
                var prev = e.target.previousSibling;
                var trg = e.target;
                if (prev !== null) {
                    console.log('Log: ' + prev + ': ' + trg.value);
                    this.cnt = Number(trg.id);
                    this.removeNextChildren(e);
                    this.rootInfo = currLvl[trg.value];
                    this.renderer();
                }
            }.bind(this), false);
        };
        AI.prototype.createOption = function (value, target) {
            var opt = document.createElement('OPTION');
            opt.innerHTML = value;
            opt.value = value;
            target.appendChild(opt);
        };
        AI.prototype.removeNextChildren = function (e) {
            Array.from(document.getElementsByClassName('tag'))
                .filter(function (element) { return parseInt(element.id) > parseInt(e.target.id); })
                .forEach(function (element) {
                if (element.parentNode !== null) {
                    element.parentNode.removeChild(element);
                }
            });
        };
        return AI;
    }());
    var chatBot = new AI(titles, root);
    chatBot.renderer();
};

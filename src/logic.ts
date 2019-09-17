/* eslint-disable prettier/prettier */

'use strict';
const root = {
    que1: {
        yes: {
            que2: {
                sure: {
                    que3: {
                        confirm: {
                            ans1: '1.jpg',
                        },
                        denied: {
                            ans2: '1.jpg',
                        },
                    },
                },
                nope: {
                    ans3: '1.jpg',
                },
            },
        },
        no: {
            que2: {
                okay: {
                    ans4: '1.jpg',
                },
                'uh no': {
                    ans5: '1.jpg',
                },
            },
        },
    },
};

const titles = [
    'que1',
    'que2', 
    'que3',
    'ans1',
    'ans2', 
    'ans3',
    'ans4', 
    'ans5'
];

window.onload = function():void {
    /**
     * ------------------------------------------------------------------------------
     *
     * @desc class for transversing a decision tree
     * @namespace AI
     * 
     * @param { object } pattern: question/answer/question/../result as string
     * @param { array } names: questions
     * 
     */

    const container = document.getElementById('container');

    type RootType = typeof root

    class AI {
        
        cnt: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rootInfo: any;
        titleArr: string[];

        constructor(titleArr: string[], root:  RootType) {
            this.cnt = 0;
            this.rootInfo = root;
            this.titleArr = titleArr;
        }

        renderer(): void {
            if (this.rootInfo === null || this.rootInfo === undefined) {
                console.log('--');
            } else if (typeof this.rootInfo === 'string') {
                console.log(this.rootInfo, 'End of nodes');
            } else {
                this.createNextElement();
            }
        }

        createNextElement(): void {
            this.cnt++;
            const rootLevel = Object.keys(this.rootInfo);
            console.log(rootLevel)
            const isTitle = rootLevel.every(elem => this.titleArr.indexOf(elem) > -1);
            isTitle ? this.createTitle(rootLevel) : this.createQuestion(rootLevel);
        }

        createTitle(rootLevel: string[]): void {
            const title = document.createElement('h1') as HTMLInputElement;
            title.id = String(this.cnt);
            title.classList.add('tag');
            title.innerHTML = rootLevel[0];
            if(container !== null){
                container.appendChild(title);
            }
            this.rootInfo = this.rootInfo[rootLevel[0]];
            this.renderer();
        }

        createQuestion(rootLevel: string[]): void {
            const currLvl = this.rootInfo;
            const opt = this.createOption;
            const selectTag = document.createElement('SELECT')  as HTMLInputElement;
            selectTag.id = String(this.cnt);
            selectTag.classList.add('tag');
            opt('--', selectTag);

            rootLevel.forEach((x: string) => opt(x, selectTag));

            if(container !== null){
                container.appendChild(selectTag);
            }
            
            selectTag.addEventListener('change',function(this:AI, e: { target: HTMLElement }):void {
                    const prev:Node|null = e.target.previousSibling;
                    const trg =e.target as HTMLInputElement

                    if(prev !== null){
                        console.log('Log: ' + prev + ': ' + trg.value);
                        this.cnt = Number(trg.id);
                        this.removeNextChildren(e);
                        this.rootInfo = currLvl[trg.value];
                        this.renderer();
                    }
                }.bind(this),
                false,
            );
        }
        createOption(value: string, target: { appendChild: (arg0: HTMLElement) => void; }):void {
            const opt = document.createElement('OPTION') as HTMLInputElement;
            opt.innerHTML = value;
            opt.value = value;
            target.appendChild(opt);
        }

        removeNextChildren(e: { target: { id: string; }; }):void {
            Array.from(document.getElementsByClassName('tag'))
                .filter(element => parseInt(element.id) > parseInt(e.target.id))
                .forEach(element => {
                    if(element.parentNode !== null){
                            element.parentNode.removeChild(element)
                    }
                });
        }

    }
    const chatBot = new AI(titles, root);
    chatBot.renderer();
};
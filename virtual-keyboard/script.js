import KEYS from './keys.js';

class Keyboard {
    constructor() {
        this.keyboard = document.createElement('div');
        this.textArea = document.createElement('textarea');
        this.whatLang = document.createElement('button');
        this.character = '';
        this.shift = false;
        this.altLeft = false;
        this.altRight = false;
        this.ctrlLeft = false;
        this.ctrlRight = false;
    }
    createDOM() {
        const wrapper = document.createElement('div');
        wrapper.className = 'wrapper';
        document.body.append(wrapper);

        this.textArea.className = 'textarea';
        wrapper.append(this.textArea);
        this.textArea.setAttribute('type', 'textarea');
        this.textArea.focus();

        this.keyboard.className = 'keyboard';
        wrapper.append(this.keyboard);

        if (localStorage.getItem('Lang') === null) {
            localStorage.setItem('Lang', 'EN');
        }
        
        this.whatLang.className = 'language';
        wrapper.append(this.whatLang);
        this.whatLang.innerText = localStorage.getItem(
            'Lang'
        );
    }

    createKeys() {
        const nums = [14, 15, 13, 13, 9];
        for (let i = 0; i < 5; i++) {
            const keysRow = document.createElement('div');
            keysRow.className = 'row';
            this.keyboard.append(keysRow);

            for (let j = 0; j < nums[i]; j++) {
                const key = document.createElement('button');
                key.className = `key ${KEYS[i][j][0]}`;
                keysRow.append(key);

                let [langOn, langOff] = [' on', ' off'];
                
                if (localStorage.getItem('Lang') === 'EN') {
                    langOn = ' on';
                    langOff = ' off';
                } else {
                    langOn = ' off';
                    langOff = ' on';
                }

                const spanEn = document.createElement('span');
                const spanEnUp = document.createElement('span');
                const spanEnDown = document.createElement('span');
                const spanRu = document.createElement('span');
                const spanRuUp = document.createElement('span');
                const spanRuDown = document.createElement('span');
                spanEn.className = KEYS[i][j][1] + langOn;
                spanRu.className = KEYS[i][j][1] + langOff;

                key.append(spanEn);
                key.append(spanRu);

                spanRuDown.className = 'case-shown';
                spanRu.append(spanRuDown);
                spanRuDown.insertAdjacentText(
                    'afterbegin',
                    KEYS[i][j][2]
                );

                spanRuUp.className = 'case-hidden';
                spanRu.append(spanRuUp);
                spanRuUp.insertAdjacentText(
                    'afterbegin',
                    KEYS[i][j][3]
                );

                spanEnDown.className = 'case-shown';
                spanEn.append(spanEnDown);
                spanEnDown.insertAdjacentText(
                    'afterbegin',
                    KEYS[i][j][4]
                );

                spanEnUp.className = 'case-hidden';
                spanEn.append(spanEnUp);
                spanEnUp.insertAdjacentText(
                    'afterbegin',
                    KEYS[i][j][5]
                );
            }
        }
    }

    caseUp() {
        this.shift = true;

        document.querySelectorAll('.on').forEach(key => {
            key.children[0].classList.remove('case-shown');
            key.children[0].classList.add('case-hidden');
            key.children[1].classList.add('case-shown');
            key.children[1].classList.remove('case-hidden');
        });
    }

    caseDown() {
        this.shift = false;
        document.querySelectorAll('.on').forEach(key => {
            key.children[0].classList.add('case-shown');
            key.children[0].classList.remove('case-hidden');
            key.children[1].classList.remove('case-shown');
            key.children[1].classList.add('case-hidden');
        });
    }

    setCaretPosition(pos) {
        if (this.textArea.setSelectionRange) {
            this.textArea.focus();
            this.textArea.setSelectionRange(pos, pos);
        } else if (this.textArea.createTextRange) {
            const range = this.textArea.createTextRange();
            range.collapse(true);
            range.moveEnd('', pos);
            range.moveStart('', pos);
            range.select();
        }
    }

    highlight(activeKey) {
        if (this.shift) {
            this.shift = true;
            activeKey.classList.add('active');
        } else {
            this.shift = false;
            activeKey.classList.remove('active');
        }
    }

    changeLang() {
        if (localStorage.getItem('Lang') === 'EN') {
            localStorage.removeItem('Lang');
            localStorage.setItem('Lang', 'RU');
        } else if (localStorage.getItem('Lang') === 'RU') {
            localStorage.removeItem('Lang');
            localStorage.setItem('Lang', 'EN');
        }
        this.whatLang.innerText = localStorage.getItem(
            'Lang'
        );

        this.keyboard.querySelectorAll('.row').forEach(keysRow => {
            keysRow.querySelectorAll('.key').forEach(key => {
                const on = key.querySelector('.on');
                const off = key.querySelector('.off');
                on.classList.remove('on');
                on.classList.add('off');
                off.classList.remove('off');
                off.classList.add('on');
            });
        });
    }

    chooseChar(el) {
        const [, , ruLowerCase, ruUpperCase, enLowerCase, enUpperCase] = el;
        if (
            localStorage.getItem('Lang') === 'RU' &&
            this.shift
        ) {
            this.character = ruUpperCase;
        } else if (
            localStorage.getItem('Lang') === 'RU' &&
            !this.shift
        ) {
            this.character = ruLowerCase;
        } else if (
            localStorage.getItem('Lang') === 'EN' &&
            this.shift
        ) {
            this.character = enUpperCase;
        } else if (
            localStorage.getItem('Lang') === 'EN' &&
            !this.shift
        ) {
            this.character = enLowerCase;
        }
    }

    output(event) {
        this.character = '';
        const target_button = event.target.closest('button');

        if (target_button) {
            const target_span = target_button.querySelector('.on');
            const target_buttonName = target_span.className.split(' ')[0];
            const active_button = target_button.classList[1];

            KEYS.forEach(keysRow => {
                keysRow.forEach(el => {
                    if (
                        el[1] === target_buttonName &&
                        (active_button === undefined ||
                            active_button === 'space' ||
                            active_button === 'tab' ||
                            active_button === 'enter')
                    ) {
                        const [
                            ,
                            ,
                            ruLowerCase,
                            ruUpperCase,
                            enLowerCase,
                            enUpperCase
                        ] = el;
                        if (
                            localStorage.getItem('Lang') ===
                            'RU' &&
                            this.shift
                        ) {
                            this.character = ruUpperCase;
                        } else if (
                            localStorage.getItem('Lang') ===
                            'RU' &&
                            !this.shift
                        ) {
                            this.character = ruLowerCase;
                        } else if (
                            localStorage.getItem('Lang') ===
                            'EN' &&
                            this.shift
                        ) {
                            this.character = enUpperCase;
                        } else if (
                            localStorage.getItem('Lang') ===
                            'EN' &&
                            !this.shift
                        ) {
                            this.character = enLowerCase;
                        }
                    }
                });
            });

            if (active_button === 'tab') {
                this.character = '  ';
            }

            if (active_button === 'enter') {
                this.character = '\n';
            }

            this.textArea.setRangeText(
                this.character,
                this.textArea.selectionStart,
                this.textArea.selectionEnd,
                'end'
            );

            if (active_button === 'backspace') {
                if (this.textArea.selectionStart > 0) {
                    const pos = this.textArea.selectionStart;
                    this.textArea.value =
                        this.textArea.value.slice(0, pos - 1) +
                        this.textArea.value.slice(
                            pos,
                            this.textArea.value.length
                        );
                    this.textArea.setRangeText('', pos - 1, pos - 1, 'end');
                }
            }

            if (active_button === 'del') {
                const pos = this.textArea.selectionStart;
                if (
                    this.textArea.selectionStart <= this.textArea.value.length
                ) {
                    this.textArea.value =
                        this.textArea.value.slice(0, pos) +
                        this.textArea.value.slice(
                            pos,
                            this.textArea.value.length
                        );
                    this.textArea.setRangeText('', pos, pos + 1, 'end');
                }
            }

            const activeKey = document.querySelector(`.${active_button}`);
            if (
                active_button === 'shift-left' ||
                active_button === 'shift-right' ||
                active_button === 'capslock'
            ) {
                if (!this.shift) {
                    activeKey.classList.add('active');
                    this.caseUp();
                } else {
                    activeKey.classList.remove('active');
                    this.caseDown();
                }
            }

            if (active_button === 'arrow') {
                const pos = this.textArea.selectionStart;

                if (target_buttonName === 'ArrowUp') {
                    this.setCaretPosition(pos - 70);
                } else if (target_buttonName === 'ArrowRight') {
                    this.setCaretPosition(pos + 1);
                } else if (target_buttonName === 'ArrowDown') {
                    this.setCaretPosition(pos + 70);
                } else if (target_buttonName === 'ArrowLeft') {
                    if (this.textArea.selectionStart > 0)
                        this.setCaretPosition(pos - 1);
                }
            }

            if (active_button === 'alt-left') {
                this.AltLeft = this.highlight(
                    this.AltLeft,
                    activeKey
                );
            }

            if (active_button === 'alt-right') {
                this.altRight = this.highlight(
                    this.altRight,
                    activeKey
                );
            }

            if (active_button === 'ctrl-left') {
                this.ctrlLeft = this.highlight(
                    this.ctrlLeft,
                    activeKey
                );
            }

            if (active_button === 'ctrl-right') {
                this.ctrlRight = this.highlight(
                    this.ctrlRight,
                    activeKey
                );
            }
        }
        this.textArea.focus();
    }

    keyDownOnRealKeyboard(event) {
        if (event.shiftKey) {
            this.caseUp();
        }

        if (event.shiftKey && event.altKey) this.changeLang();

        this.textArea.focus();
        this.character = '';

        KEYS.forEach(keysRow => {
            keysRow.forEach(el => {
                if (
                    el[1] === event.code &&
                    event.key !== 'Backspace' &&
                    event.key !== 'Delete' &&
                    event.key !== 'CapsLock' &&
                    event.key !== 'shift' &&
                    event.key !== 'Control' &&
                    event.key !== 'Meta' &&
                    event.key !== 'Enter' &&
                    event.key !== 'Alt' &&
                    event.key !== 'Tab' &&
                    event.key !== 'ArkeysRowUp' &&
                    event.key !== 'ArkeysRowRight' &&
                    event.key !== 'ArkeysRowDown' &&
                    event.key !== 'ArkeysRowLeft'
                ) {
                    event.preventDefault();
                    const [
                        ,
                        ,
                        ruLowerCase,
                        ruUpperCase,
                        enLowerCase,
                        enUpperCase
                    ] = el;
                    if (
                        localStorage.getItem('Lang') === 'RU' &&
                        this.shift
                    ) {
                        this.character = ruUpperCase;
                    } else if (
                        localStorage.getItem('Lang') === 'RU' &&
                        !this.shift
                    ) {
                        this.character = ruLowerCase;
                    } else if (
                        localStorage.getItem('Lang') === 'EN' &&
                        this.shift
                    ) {
                        this.character = enUpperCase;
                    } else if (
                        localStorage.getItem('Lang') === 'EN' &&
                        !this.shift
                    ) {
                        this.character = enLowerCase;
                    }
                }
            });
        });

        this.textArea.setRangeText(
            this.character,
            this.textArea.selectionStart,
            this.textArea.selectionEnd,
            'end'
        );

        this.keyboard.querySelectorAll('.row').forEach(keysRow => {
            keysRow.querySelectorAll('.key').forEach(symb => {
                if (event.code === symb.children[0].classList[0]) {
                    if (event.key === 'CapsLock') {
                        if (symb.classList.contains('active')) {
                            symb.classList.remove('active');
                            this.caseDown();
                            this.shift = false;
                        } else {
                            symb.classList.add('active');
                            this.caseUp();
                            this.shift = true;
                        }
                    } else {
                        symb.classList.add('active');
                    }
                }
            });
        });
    }

    keyUpOnRealKeyboard(event) {
        this.caseDown();

        this.keyboard.querySelectorAll('.row').forEach(keysRow => {
            keysRow.querySelectorAll('.key').forEach(key => {
                if (
                    event.code === key.children[0].classList[0] &&
                    event.key !== 'CapsLock'
                ) {
                    key.classList.remove('active');
                }
            });
        });
    }
}

const virtualKeyboard = new Keyboard();
virtualKeyboard.createDOM();
virtualKeyboard.createKeys();

document.addEventListener('click', event => {
    if (event.target.classList.contains('language')) {
        virtualKeyboard.changeLang(event);
    } else {
        virtualKeyboard.output(event);
    }
});

document.addEventListener('keydown', event => {
    virtualKeyboard.keyDownOnRealKeyboard(event);
});

document.addEventListener('keyup', event => {
    virtualKeyboard.keyUpOnRealKeyboard(event);
});

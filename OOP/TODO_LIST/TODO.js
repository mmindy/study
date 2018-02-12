const TODO = (() => {
	const DATA = [];
	const MODE_HTML = "html";
	const MODE_CONSOLE = "console";
	const STATE = ["예정", "진행", "완료"];
	Object.freeze(STATE);

	const module = (() => {
		const checkIdx = idx =>{
			let validIdx = false;
			DATA.forEach( v => {
				if ( v.idx === idx ) validIdx = true;
			})

			if (!validIdx) {
				view.warning("유효하지 않은 idx값 : " + idx);
				return false;
			}
		}

		const add = (() => {
			let idx = 0;
			return value => {
				if (!value) {
					view.warning("내용 누락!");
					return false;
				}
				DATA.push({
					idx : idx++,
					state : STATE[0],
					value : value
				});
			}
		})();

		const edit = (idx) => {
			let inputData = {
				idx : null,
				state : null,
				// value : null
			}
			let stateIdx = 0;
			checkIdx(idx);
			if (DATA.length <= 0) return false;

			inputData.idx = idx;

			// 변경될 state 설정
			DATA.filter(obj => {
				if (obj.idx === inputData.idx) {
					STATE.forEach((state, i) => {
						if (state === obj.state) stateIdx = ++i;
					})
					if ( stateIdx === STATE.length ) stateIdx = 0;
					inputData.state = STATE[stateIdx];
				}
			});

			if ( inputData.idx >= 0 && inputData.state ) {
				DATA.filter(obj => {
					if ( obj.idx === inputData.idx ) {
						obj.state = inputData.state;
					}
				})
			}
		};

		const remove = (idx) => {
			checkIdx(idx);
			if (DATA.length <= 0) return false;

			DATA.forEach((v, i) => {
				if ( v.idx === idx ) DATA.splice(i, 1);
				// break;
			})
		};

		return {
			add : add,
			edit : edit,
			remove : remove
		}
	})();

	const view = (() => {
		const modePrint = () => {
			const modeTextBox = document.getElementById("mode");
			let text = "MODE : " + controller.getMode();
			modeTextBox.innerText = text;
			console.log(text);
		}

		const render = (() => {
			const renderHtml = stateNum => {
				const element = document.getElementById("dataList");
				const inputBox = document.getElementById('dataValue');
				let state;
				if ( !isNaN(stateNum) ) state = STATE[stateNum];

				let dataList = "<dt><span class='index'>번호</span>내용<span class='option'><span class='state'>진행상황</span><span class='remove'>삭제</span></span></dt>";
				if ( DATA.length > 0 ) {
					DATA.forEach( v => {
						if ( state ){
							if ( state === v.state ) {
								dataList += `<dd><span class="index">${v.idx}</span> ${v.value} <span class="option"><button class="state" onclick="TODO.edit(${v.idx})">${v.state}</button><button class="remove" onclick="TODO.remove(${v.idx})">삭제</button></span></dd>`;
							}
						} else {
							dataList += `<dd><span class="index">${v.idx}</span> ${v.value} <span class="option"><button class="state" onclick="TODO.edit(${v.idx})">${v.state}</button><button class="remove" onclick="TODO.remove(${v.idx})">삭제</button></span></dd>`;
						}
					})
				}
				element.innerHTML = dataList;
				inputBox.value = null;
				inputBox.focus();
			};

			const renderConsole = stateNum => {
				let state;
				if ( !isNaN(stateNum) ) state = STATE[stateNum];

				if ( DATA.length > 0 ) DATA.forEach( v => {
					if ( state ){
						if ( state === v.state ) {
							console.log(`${v.idx} - [ ${v.state} ] - ${v.value}`);
						}
					} else {
						console.log(`${v.idx} - [ ${v.state} ] - ${v.value}`);
					}
				});
			};

			return num => {
				let stateNum;
				if ( (num >= 0 && num < STATE.length) && !isNaN(num)) stateNum = num;
				if ( controller.getMode() === MODE_HTML ) renderHtml(stateNum);
				else renderConsole(stateNum);
			}
		})();

		const warning = (() => {
			const warningHtml = msg => {
				const printBox = document.getElementById("notice");
				printBox.innerText = msg;
			}

			const warningConsole = msg => {
				console.log(msg);
			}

			return msg => {
				if ( controller.getMode() === MODE_HTML ) warningHtml(msg);
				else warningConsole(msg);
			}
		})();

		return {
			render : render,
			warning : warning,
			modePrint : modePrint
		}
	})();

	const controller = (() => {
		let MODE = MODE_HTML;

		const render = () => { view.render(); };

		const add = value => {
			module.add(value);
			render();
		};

		const edit = idx => {
			module.edit(idx);
			render();
		};

		const remove = idx => {
			module.remove(idx);
			render();
		};

		const sort = num => { view.render(num); };

		const changeMode = () => {
			MODE = ( MODE === MODE_HTML ) ? MODE_CONSOLE : MODE_HTML;
			view.modePrint()
		};

		return {
			add : add,
			edit : edit,
			remove : remove,
			sort : sort,
			changeMode : changeMode,
			getMode : () => MODE
		}
	})();

	view.render();
	view.modePrint();

	return {
		add : controller.add,
		edit : controller.edit,
		remove : controller.remove,
		sort : controller.sort,
		changeMode : controller.changeMode
	}
})();

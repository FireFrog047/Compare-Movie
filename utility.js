const debounce = (func, delay = 1000) => {
    let timeoutID;
    return (...args) => {
        if (timeoutID) {
            clearTimeout(timeoutID);
        };
        timeoutID = setTimeout(() => {
            func.apply(null, args);
        }, delay)
    }
};

const autoComplete = ({
    fetchData,
    root,
    renderOption,
    onOptionSelect,
    inputValue,
}) => {
    root.innerHTML = `
        <label><b>Search</b></label>
        <input class = "input" />
         <div class = "dropdown">
             <div class = "dropdown-menu" >
                <div class = "dropdown-content results" > </div>
            </div> 
        </div>           
`;

    const input = root.querySelector('.input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWraper = root.querySelector('.results');

    const onInput = async (event) => {
        let items = await fetchData(event.target.value);

        resultsWraper.innerHTML = '';
        dropdown.classList.add('is-active');

        if (items.length == 0) {
            const option = document.createElement('a');
            option.classList.add('dropdown-item');
            option.innerHTML = `<span>Nothing found with "${event.target.value.bold()}"</span>`;
            resultsWraper.appendChild(option);
            option.addEventListener('click', async () => {
                onOptionSelect(items[0] = {
                    searchStatus: 'Nothing found',
                });
                dropdown.classList.remove('is-active');
            });
        } else {
            for (let item of items) {
                const option = document.createElement('a');

                option.classList.add('dropdown-item');
                option.innerHTML = renderOption(item);
                resultsWraper.appendChild(option);

                option.addEventListener('click', async () => {
                    input.value = inputValue(item);
                    onOptionSelect(item);
                    dropdown.classList.remove('is-active');
                });
            };
        }

        if (input.value.length == 0) {
            dropdown.classList.remove('is-active');
        };
    };

    input.addEventListener('input', debounce(onInput));

    document.addEventListener('click', (event) => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove('is-active');
        }
    });

    input.addEventListener('click', () => {

        if (input.value.length !== 0) {
            dropdown.classList.add('is-active');
        } else {
            dropdown.classList.remove('is-active');
        }
    });
};
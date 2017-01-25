export default function counter(state:number = 0, action = {type: ''}) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DICREMENT':
            return state - 1;
        default:
            return state;   
    }
}


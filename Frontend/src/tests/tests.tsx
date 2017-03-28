import * as REDUCER from '../reducers/reducers'
import * as deepFreeze from 'deep-freeze'
import * as expect from 'expect'
import * as K from '../constants/constants'

function IMAGE_RECORD_REMOTE_DEFAULT() {
    let BEFORE = undefined

    let AFTER:any = {
        isRequesting:false,
        records:[]
    }
    let ACTION:any = {}
    //deepFreeze(BEFORE)
    expect(REDUCER.processSubdata(BEFORE, ACTION)).toEqual(AFTER)
} 

function IMAGE_RECORD_REMOTE_RECIEVE() {
    let BEFORE:any = {
        isRequesting:false, 
        records:[1, 2, 3, 4]
    }
    let AFTER:any = {
        isRequesting:false, 
        records:[4, 3, 2, 1]
    }
    let ACTION:any = {
        type:K.RECIEVE,
        records:[4, 3, 2, 1]
    }

    deepFreeze(BEFORE)
    expect(REDUCER.processSubdata(BEFORE, ACTION)).toEqual(AFTER)
}

function IMAGE_RECORD_REMOTE_REQUEST() {
    let BEFORE:any = {
        isRequesting:false, 
        records:[1, 2, 3, 4]
    }
    let AFTER:any = {
        isRequesting:true, 
        records:[1, 2, 3, 4]
    }
    let ACTION:any = {
        type:K.REQUEST
    }
    deepFreeze(BEFORE)
    expect(REDUCER.processSubdata(BEFORE, ACTION)).toEqual(AFTER)
}

function IMAGE_RECORD_REMOTE_ADD() {
    let BEFORE:any = {
        isRequesting:false, 
        records:[{name:"1"}, {name:"2"}, {name:"3"}, {name:"4"}]
    }
    let AFTER_1:any = {
        isRequesting:false, 
        records:[{name:"1"}, {name:"2"}, {name:"3"}, {name:"4"}, {name:"5"}]
    }
    let AFTER_2:any = {
        isRequesting:false, 
        records:[{name:"1"}, {name:"2"}, {name:"3"}, {name:"4"}]
    }
    let AFTER_3:any = {
        isRequesting:false, 
        records:[{name:"1"}, {name:"2", changed:true}, {name:"3"}, {name:"4"}]
    }
    let ACTION_1:any = {
        type:K.ADD,
        record: {
            name:"5"
        }
    }
    let ACTION_2:any = {
        type:K.ADD,
        record: {
            name:"2"
        }
    }

    let ACTION_3:any = {
        type:K.ADD,
        record: {
            name:"2",
            changed:true
        }
    }

    deepFreeze(BEFORE)
    expect(REDUCER.processSubdata(BEFORE, ACTION_1)).toEqual(AFTER_1)
    expect(REDUCER.processSubdata(BEFORE, ACTION_2)).toEqual(AFTER_2)
    expect(REDUCER.processSubdata(BEFORE, ACTION_3)).toEqual(AFTER_3)
}

function IMAGE_RECORD_REMOTE_REMOVE() {
    let BEFORE:any = {
        isRequesting:false, 
        records:[{name:"1"}, {name:"2"}, {name:"3"}]
    }
    let AFTER_1:any = {
        isRequesting:false, 
        records:[{name:"2"}, {name:"3"}]
    }
    let AFTER_2:any = {
        isRequesting:false, 
        records:[{name:"1"}, {name:"3"}]
    }
    let AFTER_3:any = {
        isRequesting:false, 
        records:[{name:"1"}, {name:"2"}]
    }
    let AFTER_4:any = {
        isRequesting:false, 
        records:[{name:"1"}, {name:"2"}, {name:"3"}]
    }
    let ACTION_1:any = {
        type:K.REMOVE,
        name: "1"
    }
    let ACTION_2:any = {
        type:K.REMOVE,
        name: "2"
    }
    let ACTION_3:any = {
        type:K.REMOVE,
        name: "3"
    }
    let ACTION_4:any = {
        type:K.REMOVE,
        name: "4"
    }
    deepFreeze(BEFORE)
    expect(REDUCER.processSubdata(BEFORE, ACTION_1)).toEqual(AFTER_1)
    expect(REDUCER.processSubdata(BEFORE, ACTION_2)).toEqual(AFTER_2)
    expect(REDUCER.processSubdata(BEFORE, ACTION_3)).toEqual(AFTER_3)
    expect(REDUCER.processSubdata(BEFORE, ACTION_4)).toEqual(AFTER_4)
}


function IMAGE_MANAGER_DEFAULT() {
    let BEFORE:any = undefined
    let AFTER:any = {}
    let ACTION:any = {}
    //deepFreeze(BEFORE)
    expect(REDUCER.dataManager(BEFORE, ACTION)).toEqual(AFTER)
}

function IMAGE_MANAGER_CAN_SWICTH() {
    let BEFORE:any = {
        something_1: {
            isRequesting:false,
            records:[{name:"1"}, {name:"2"}, {name:"3"}, {name:"4"}]
        },
        something_2:undefined,
        something_3:{} 
    }
    let AFTER_1:any = {
        something_1: {
            isRequesting:false,
            records:[{name:"1"}, {name:"2"}, {name:"3"}, {name:"4"}]
        },
        something_2: {
            isRequesting:false,
            records:[{name:"5"}]
        },
        something_3:{}
    }
    
    let AFTER_2:any = {
        something_1: {
            isRequesting:false,
            records:[{name:"1"}, {name:"2"}, {name:"3"}, {name:"4"}, {name:"5"}]
        },
        something_2:undefined,
        something_3:{}
    }
    let AFTER_3:any = {
        something_1: {
            isRequesting:false,
            records:[{name:"1"}, {name:"2"}, {name:"3"}, {name:"4"}]
        },
        something_2:undefined,
        something_3:{},
        something_4: {
            isRequesting:false,
            records:[{name:"5"}]
        }
    }
    let ACTION_1:any = {
        type: K.ADD,
        record: {name:"5"},
        imageType:"something_2"
    }
    let ACTION_2:any = {
        type: K.ADD,
        record: {name:"5"},
        imageType:"something_1"
    }
    let ACTION_3:any = {
        type: K.ADD,
        record: {name:"5"},
        imageType:"something_4"
    }
    deepFreeze(BEFORE)
    expect(REDUCER.dataManager(BEFORE, ACTION_1)).toEqual(AFTER_1)
    expect(REDUCER.dataManager(BEFORE, ACTION_2)).toEqual(AFTER_2)
    expect(REDUCER.dataManager(BEFORE, ACTION_3)).toEqual(AFTER_3)
}

function PRINTING_DEFAULT() {
    let BEFORE = undefined
    let AFTER = {
        status:K.PRINTING_NOTHING,
        name:"",
        picked:0
    }
    let ACTION = {}
    
    expect(REDUCER.printing(BEFORE, ACTION)).toEqual(AFTER)
}

///////////////////////////////////////
//not used anymore
function PRINTING_CHANGE_STATUS() {
    let BEFORE = {
        status: K.PRINTING_PRINT
    }
    let AFTER = {
        status:K.PRINTING_OK,
        name:"REFERENCE"
    }
    let ACTION = {
        type:K.PRINTING_COMPLETE,
        status:K.PRINTING_OK,
        name:"REFERENCE"
    }

    deepFreeze(BEFORE)
    expect(REDUCER.printing(BEFORE, ACTION)).toEqual(AFTER)
}
/////////////////////////////////////////

function PRINTING_PICK_PRINTER() {
    let BEFORE = {
        status: K.PRINTING_PRINT,
        name:"REFERENCE",
        picked: 0
    }
    let AFTER = {
        status: K.PRINTING_PRINT,
        name:"REFERENCE",
        picked: 10
    }
    let ACTION = {
        type:K.PRINTING_PICK_PRINTER,
        picked:10
    }
    deepFreeze(BEFORE)
    expect(REDUCER.printing(BEFORE, ACTION)).toEqual(AFTER)
}

function PRINTING_PREPARE_TO_PRINT() {
    let BEFORE = {
        status: K.PRINTING_PRINT,
        name:"",
        picked: 10
    }
    let AFTER = {
        status: K.PRINTING_PREPARE,
        name:"REFERENCE",
        picked: 0
    }
    let ACTION = {
        type:K.PRINTING_PREPARE_TO_PRINT,
        name:"REFERENCE"
    }
    deepFreeze(BEFORE)
    expect(REDUCER.printing(BEFORE, ACTION)).toEqual(AFTER)
}

function SELECTED_MENU_DEFAULT() {
    let BEFORE = undefined
    let AFTER = K.MAIN_MENU
    let ACTION = {}
    expect(REDUCER.selectedMenu(BEFORE, ACTION)).toEqual(AFTER)
}

function SELECTED_MENU_SELECT_MENU() {
    let BEFORE = K.MAIN_MENU
    let AFTER = K.IMAGE_REMOTE_MENU
    let ACTION = {
        type: K.SELECT_MENU,
        menu: K.IMAGE_REMOTE_MENU
    }
    deepFreeze(BEFORE)
    expect(REDUCER.selectedMenu(BEFORE, ACTION)).toEqual(AFTER)
}

export default function RUN_ALL_TESTS() {
    console.log("//RUN_ALL_TESTS()")

    console.log("!!!IMAGE_RECORD_REMOTE_TESTS!!!")
    IMAGE_RECORD_REMOTE_DEFAULT()
    console.log('//IMAGE_RECORD_REMOTE_DEFAULT SUCCESS')
    IMAGE_RECORD_REMOTE_RECIEVE()
    console.log('//IMAGE_RECORD_REMOTE_RECIEVE SUCCESS')
    IMAGE_RECORD_REMOTE_REQUEST()
    console.log('//IMAGE_RECORD_REMOTE_REQUEST SUCCESS')
    IMAGE_RECORD_REMOTE_ADD()
    console.log('//IMAGE_RECORD_REMOTE_ADD SUCCESS')
    IMAGE_RECORD_REMOTE_REMOVE()
    console.log('//IMAGE_RECORD_REMOTE_REMOVE SUCCESS')

    console.log("!!!IMAGE_MANAGER_TESTS!!!")
    IMAGE_MANAGER_DEFAULT()
    console.log("//IMAGE_MANAGER_DEFAULT SUCCESS")
    IMAGE_MANAGER_CAN_SWICTH()
    console.log("//IMAGE_MANAGER_CAN_SWITCH SUCCESS")

    console.log("!!!PRINTING_TESTS!!!")
    PRINTING_DEFAULT()
    console.log("///PRINTING_DEFAULT SUCCESS")
    //PRINTING_CHANGE_STATUS()
    //console.log("///PRINTING_CHANGE_STATUS SUCCESS")
    PRINTING_PICK_PRINTER()
    console.log("///PRINTING_PICK_PRINTER SUCCESS")
    PRINTING_PREPARE_TO_PRINT()
    console.log("///PRINTING_PREPARE_TO_PRINT SUCCESS")

    console.log("!!!SELECTED_MENU_TESTS!!!")
    SELECTED_MENU_DEFAULT()
    console.log("///SELECTED_MENU_DEFAULT SUCCESS")
    SELECTED_MENU_SELECT_MENU()
    console.log("///SELECTED_MENU_SELECT_MENU SUCCESS")
}
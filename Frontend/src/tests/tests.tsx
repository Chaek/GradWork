import * as REDUCER from '../reducers/reducers'
import * as deepFreeze from 'deep-freeze';
import * as expect from 'expect';
import * as K from '../constants/constants'

function IMAGE_RECORD_REMOTE_DEFAULT() {
    let BEFORE = undefined

    let AFTER:any = {
        isRequesting:false,
        records:[]
    }
    let ACTION:any = {}
    //deepFreeze(BEFORE)
    expect(REDUCER.imageRecordRemote(BEFORE, ACTION)).toEqual(AFTER)
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

    deepFreeze(BEFORE);
    expect(REDUCER.imageRecordRemote(BEFORE, ACTION)).toEqual(AFTER);
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
    deepFreeze(BEFORE);
    expect(REDUCER.imageRecordRemote(BEFORE, ACTION)).toEqual(AFTER);
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

    deepFreeze(BEFORE);
    expect(REDUCER.imageRecordRemote(BEFORE, ACTION_1)).toEqual(AFTER_1);
    expect(REDUCER.imageRecordRemote(BEFORE, ACTION_2)).toEqual(AFTER_2);
    expect(REDUCER.imageRecordRemote(BEFORE, ACTION_3)).toEqual(AFTER_3);
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
    deepFreeze(BEFORE);
    expect(REDUCER.imageRecordRemote(BEFORE, ACTION_1)).toEqual(AFTER_1);
    expect(REDUCER.imageRecordRemote(BEFORE, ACTION_2)).toEqual(AFTER_2);
    expect(REDUCER.imageRecordRemote(BEFORE, ACTION_3)).toEqual(AFTER_3);
    expect(REDUCER.imageRecordRemote(BEFORE, ACTION_4)).toEqual(AFTER_4);
}


function IMAGE_MANAGER_DEFAULT() {
    let BEFORE:any = undefined
    let AFTER:any = {}
    let ACTION:any = {}
    //deepFreeze(BEFORE);
    expect(REDUCER.imageManager(BEFORE, ACTION)).toEqual(AFTER);
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
    deepFreeze(BEFORE);
    expect(REDUCER.imageManager(BEFORE, ACTION_1)).toEqual(AFTER_1);
    expect(REDUCER.imageManager(BEFORE, ACTION_2)).toEqual(AFTER_2);
    expect(REDUCER.imageManager(BEFORE, ACTION_3)).toEqual(AFTER_3);
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
}
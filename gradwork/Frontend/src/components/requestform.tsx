// Remember to rename your file to Hello.tsx and
// place it within your src/ directory

import * as React from "react";

class RequestForm extends React.Component<IRequestFormProps, any> {
    
    constructor(props: IRequestFormProps){
        super(props);
    }

    public render() {
        return (
            <div>
                <button onClick = {this.props.clickHandler}>{this.props.buttonName}</button>
            </div>
        );
    }

}

export default RequestForm;
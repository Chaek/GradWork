import * as React from 'react';

 class RequestContent extends React.Component<IRequestContentProps, any> {
    constructor(props: IRequestContentProps){
        super(props);
    }

    public render() {
        return (
            <form>
                <div> { this.props.data } </div>
            </form>    
        );
    }
}

export default RequestContent
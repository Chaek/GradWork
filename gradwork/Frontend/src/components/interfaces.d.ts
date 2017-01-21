interface IRequestFormProps {
    clickHandler(): void;
    buttonName: string;
}

interface IRequestContentProps {
    name: string;
    data: string;
}

interface IRequestTabProps {   
    defaultName: string;
    urlRemotePost: string;
    urlRemote: string;
}

interface IOptiontabProps {
    label: string;
    options: string[];
}
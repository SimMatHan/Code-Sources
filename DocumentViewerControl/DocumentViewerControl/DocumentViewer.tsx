import * as React from "react";

export interface IDocumentViewerProps {
    documentUrl: string;
}

export const DocumentViewer: React.FC<IDocumentViewerProps> = (props) => {
    return (
        <div>
            <iframe
                src={props.documentUrl}
                width="100%"
                height="500px"
                frameBorder="0"
            />
        </div>
    );
};

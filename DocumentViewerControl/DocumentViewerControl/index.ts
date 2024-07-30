import {IInputs, IOutputs} from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { DocumentViewer, IDocumentViewerProps } from "./DocumentViewer";

export class DocumentViewerControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;
    private _props: IDocumentViewerProps = {
        documentUrl: ""
    };

    constructor() {}

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement) {
        this._container = container;
        this._props.documentUrl = context.parameters.documentUrl.raw || "";
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this._props.documentUrl = context.parameters.documentUrl.raw || "";
        ReactDOM.render(
            React.createElement(DocumentViewer, this._props),
            this._container
        );
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        ReactDOM.unmountComponentAtNode(this._container);
    }
}

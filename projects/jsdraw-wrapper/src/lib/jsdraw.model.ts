export interface JSDraw {
    options: JSDrawOptions;
    activated?: boolean;
    setMolfile(molfile: string): void;
    getMolfile(): string;
    getSmiles(): string;
    getXml(): string;
    setHtml(html: string): string;
}

export interface JSDrawOptions {
    biology?: boolean;
    btnsize?: number;
    buttonshape?: string;
    data?: string;
    dataformat?: string;
    fullscreen?: string;
    highlighterrors?: boolean;
    inktools?: boolean;
    monocolor?: boolean;
    ondatachange?: any;
    pastechemdraw?: any;
    popup?: boolean;
    query?: boolean;
    removehydrogens?: boolean;
    rxn?: boolean;
    scale?: number;
    sendquery?: boolean;
    showcarbon?: boolean;
    showcustomtemplates?: boolean;
    showimplicithydrogens?: boolean;
    showtoolbar?: boolean;
    skin?: any;
    usechemdraw?: boolean;
    viewonly?: boolean;
}

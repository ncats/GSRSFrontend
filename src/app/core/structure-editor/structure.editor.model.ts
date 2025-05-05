import { Observable } from 'rxjs';

export interface Editor {
    getMolfile(): Observable<string>;
    getSmiles(): Observable<string>;
    setMolecule(molfile: string): void;
    structureUpdated(): Observable<string>;
}

//overwriting ketcher-wrapper changes
//TODO: remove dependency on ketcher-wrapper entirely
export interface Ketcher {
    version: string;
    apiPath: string;
    buildDate: string;
    buildNumber?: string;
    editor?: any;
    getSmiles: () => string;
    saveSmiles: () => Promise<any>;
    getMolfile: (molfileFormat?:string) => any;
    setMolecule: (molString: any) => void;
    addFragment: (molString: any) => void;
    showMolfile: (clientArea: any, molString: any, options: any) => any;
}



export interface JSDraw {
    _undostack?: any;
    angleStop?: any;
    bondlength?: any;
    fontsize?: any;
    tor?: any;
    m?: any;
    options: JSDrawOptions;
    activated?: boolean;
    setMolfile(molfile: string): void;
    getMolfile(): string;
    getSmiles(): string;
    getXml(): string;
    pushundo(): any;
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
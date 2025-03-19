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
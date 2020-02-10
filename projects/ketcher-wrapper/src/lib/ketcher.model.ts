export interface Ketcher {
    version: string;
    apiPath: string;
    buildDate: string;
    buildNumber?: string;
    getSmiles: () => string;
    saveSmiles: () => Promise<any>;
    getMolfile: () => string;
    setMolecule: (molString: any) => void;
    addFragment: (molString: any) => void;
    showMolfile: (clientArea: any, molString: any, options: any) => any;
}

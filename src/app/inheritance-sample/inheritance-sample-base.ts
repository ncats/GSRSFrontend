import { SubstanceService } from '../substance/substance.service';

export class InheritanceSampleBase {
    message: string;

    constructor(
        public substanceService: SubstanceService
    ) {}
}

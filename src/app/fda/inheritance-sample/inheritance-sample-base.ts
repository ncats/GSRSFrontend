import { SubstanceService } from '../../core/substance/substance.service';

export class InheritanceSampleBase {
    message: string;

    constructor(
        public substanceService: SubstanceService
    ) {}
}

import { PagingResponse } from '../app/utils/paging-response.model';
import { SubstanceSummary } from '../app/substance/substance.model';

/* tslint:disable:max-line-length */
export const SubstanceSummaryListData: PagingResponse<SubstanceSummary> = {
    'id': 37192136,
    'version': 1,
    'created': 1539385812146,
    'etag': 'cfea9ae39706c8a1',
    'path': '/ginas/app/api/v1/substances/',
    'uri': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/',
    'nextPageUri': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/?skip=10',
    'method': 'GET',
    'sha1': 'da0732932e062af9c016250bb5be43f067e2c65d',
    'total': 102012,
    'count': 10,
    'skip': 0,
    'top': 10,
    'query': '',
    'content': [
        {
            'uuid': '00003571-8a34-49de-a980-267d6394cfa3',
            'created': 1520371508000,
            'createdBy': 'admin',
            'lastEdited': 1520371508000,
            'lastEditedBy': 'admin',
            'deprecated': false,
            'definitionType': 'PRIMARY',
            'definitionLevel': 'COMPLETE',
            'substanceClass': 'structurallyDiverse',
            'status': 'approved',
            'version': '1',
            'approvedBy': 'FDA_SRS',
            'approvalID': 'B71UA545DE',
            'structurallyDiverse': {
                'uuid': '672a9e8e-f5a9-4aec-ac12-79e1e4d24e6b',
                'created': 1520371508000,
                'createdBy': 'admin',
                'lastEdited': 1520371508000,
                'lastEditedBy': 'admin',
                'deprecated': false,
                'sourceMaterialClass': 'ORGANISM',
                'sourceMaterialType': 'PLANT',
                'part': [
                    'LEAF'
                ],
                'parentSubstance': {
                    'uuid': '10d60422-223a-4ca5-88f1-c541ac1461e1',
                    'created': 1520371508000,
                    'createdBy': 'admin',
                    'lastEdited': 1520371508000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'refPname': 'CYNARA SCOLYMUS WHOLE',
                    'refuuid': '20a5f29a-088d-4b16-93e1-2e1f536c50b7',
                    'substanceClass': 'reference',
                    'approvalID': '9N3437ZUU0',
                    'linkingID': '9N3437ZUU0',
                    'name': 'CYNARA SCOLYMUS WHOLE',
                    'references': [],
                    'access': []
                },
                'references': [
                    '792882b4-0c0f-4284-a8c5-95b891b276d4',
                    'c03a4470-3f2c-4742-b1ce-b412df65b84c'
                ],
                'access': []
            },
            '_names': {
                'count': 11,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(00003571-8a34-49de-a980-267d6394cfa3)/names'
            },
            '_modifications': {
                'count': 0,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(00003571-8a34-49de-a980-267d6394cfa3)/modifications'
            },
            '_references': {
                'count': 23,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(00003571-8a34-49de-a980-267d6394cfa3)/references'
            },
            '_codes': {
                'count': 4,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(00003571-8a34-49de-a980-267d6394cfa3)/codes'
            },
            '_relationships': {
                'count': 12,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(00003571-8a34-49de-a980-267d6394cfa3)/relationships'
            },
            '_approvalIDDisplay': 'B71UA545DE',
            '_name': 'CYNARA SCOLYMUS LEAF',
            'access': [],
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(00003571-8a34-49de-a980-267d6394cfa3)?view=full'
        },
        {
            'uuid': '00006626-ba3a-4949-a089-3263bac5e9e0',
            'created': 1520372205000,
            'createdBy': 'admin',
            'lastEdited': 1520372205000,
            'lastEditedBy': 'admin',
            'deprecated': false,
            'definitionType': 'PRIMARY',
            'definitionLevel': 'COMPLETE',
            'substanceClass': 'structurallyDiverse',
            'status': 'approved',
            'version': '1',
            'approvedBy': 'FDA_SRS',
            'approvalID': '535OQ68DO6',
            'structurallyDiverse': {
                'uuid': 'fc4c6163-a903-4610-9e01-6295c171f696',
                'created': 1520372205000,
                'createdBy': 'admin',
                'lastEdited': 1520372205000,
                'lastEditedBy': 'admin',
                'deprecated': false,
                'sourceMaterialClass': 'ORGANISM',
                'sourceMaterialType': 'PLANT',
                'part': [
                    'LATEX'
                ],
                'parentSubstance': {
                    'uuid': '422900b8-79d4-4984-9ee3-7522635e8993',
                    'created': 1520372205000,
                    'createdBy': 'admin',
                    'lastEdited': 1520372205000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'refPname': 'GARCINIA COWA WHOLE',
                    'refuuid': '1495bf80-c2eb-4dbe-9871-57d7f26bd332',
                    'substanceClass': 'reference',
                    'approvalID': 'HXM9Q42R95',
                    'linkingID': 'HXM9Q42R95',
                    'name': 'GARCINIA COWA WHOLE',
                    'references': [],
                    'access': []
                },
                'references': [
                    '914b038c-a377-47b6-8d85-01254cdede5a',
                    '23e3100f-f243-4483-b5a3-8dc5760a4fd4'
                ],
                'access': []
            },
            '_names': {
                'count': 6,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(00006626-ba3a-4949-a089-3263bac5e9e0)/names'
            },
            '_modifications': {
                'count': 0,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(00006626-ba3a-4949-a089-3263bac5e9e0)/modifications'
            },
            '_references': {
                'count': 6,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(00006626-ba3a-4949-a089-3263bac5e9e0)/references'
            },
            '_approvalIDDisplay': '535OQ68DO6',
            '_name': 'GARCINIA COWA LATEX',
            'access': [],
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(00006626-ba3a-4949-a089-3263bac5e9e0)?view=full'
        },
        {
            'uuid': '0002f7ba-e0bc-40f4-a8d0-e7319124bfd9',
            'created': 1520351189000,
            'createdBy': 'admin',
            'lastEdited': 1520351189000,
            'lastEditedBy': 'admin',
            'deprecated': false,
            'definitionType': 'PRIMARY',
            'definitionLevel': 'COMPLETE',
            'substanceClass': 'chemical',
            'status': 'approved',
            'version': '5',
            'approvedBy': 'FDA_SRS',
            'approvalID': 'OPM23UN90U',
            'structure': {
                'id': 'f74e4343-7ad0-4bce-8949-8ffea5f351e6',
                'created': 1520351189000,
                'lastEdited': 1520351189000,
                'deprecated': false,
                'digest': 'b646a5903e1b1bb86af0ba99af3c10222a975f2b',
                'molfile': '\n  Symyx   04271719552D 1   1.00000     0.00000     0\n\n 37 41  0     1  0            999 V2000\n    5.7370   -6.4799    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.0933   -6.1090    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.0933   -5.3674    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.7370   -4.9965    0.0000 C   0  0  0  0  0  0           0  0  0\n    6.3807   -5.3674    0.0000 C   0  0  0  0  0  0           0  0  0\n    7.0242   -4.9965    0.0000 C   0  0  2  0  0  0           0  0  0\n    7.0242   -4.2549    0.0000 C   0  0  0  0  0  0           0  0  0\n    7.6679   -3.8840    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.3116   -4.2549    0.0000 C   0  0  1  0  0  0           0  0  0\n    8.3116   -4.9965    0.0000 C   0  0  0  0  0  0           0  0  0\n    7.6679   -5.3674    0.0000 C   0  0  1  0  0  0           0  0  0\n    7.6679   -6.1090    0.0000 C   0  0  0  0  0  0           0  0  0\n    7.0242   -6.4799    0.0000 C   0  0  0  0  0  0           0  0  0\n    6.3807   -6.1090    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.3116   -5.7382    0.0000 H   0  0  0  0  0  0           0  0  0\n    8.9511   -3.8840    0.0000 C   0  0  3  0  0  0           0  0  0\n    9.5946   -3.5132    0.0000 F   0  0  0  0  0  0           0  0  0\n    8.9511   -3.1382    0.0000 F   0  0  0  0  0  0           0  0  0\n    9.5946   -4.2549    0.0000 F   0  0  0  0  0  0           0  0  0\n    8.3116   -3.5132    0.0000 O   0  0  0  0  0  0           0  0  0\n    6.3807   -4.6257    0.0000 C   0  0  0  0  0  0           0  0  0\n    6.3807   -3.8840    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.7370   -3.5132    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.7370   -2.7674    0.0000 C   0  0  0  0  0  0           0  0  0\n    6.3807   -2.3965    0.0000 C   0  0  0  0  0  0           0  0  0\n    7.0242   -2.7674    0.0000 C   0  0  0  0  0  0           0  0  0\n    7.0242   -3.5132    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.4498   -6.4799    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.4498   -7.2257    0.0000 O   0  0  0  0  0  0           0  0  0\n    3.8061   -6.1090    0.0000 N   0  0  0  0  0  0           0  0  0\n    3.1666   -6.4799    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.1666   -7.2257    0.0000 C   0  0  0  0  0  0           0  0  0\n    2.5229   -7.5965    0.0000 N   0  0  0  0  0  0           0  0  0\n    1.8794   -7.2257    0.0000 C   0  0  0  0  0  0           0  0  0\n    1.8794   -6.4799    0.0000 C   0  0  0  0  0  0           0  0  0\n    2.5229   -6.1090    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.8061   -7.5965    0.0000 C   0  0  0  0  0  0           0  0  0\n  1  2  1  0     0  0\n  2  3  2  0     0  0\n  3  4  1  0     0  0\n  4  5  2  0     0  0\n  5  6  1  0     0  0\n  6  7  1  0     0  0\n  7  8  1  0     0  0\n  8  9  1  0     0  0\n  9 10  1  0     0  0\n 10 11  1  0     0  0\n  6 11  1  0     0  0\n 11 12  1  0     0  0\n 12 13  1  0     0  0\n 13 14  1  0     0  0\n  1 14  2  0     0  0\n  5 14  1  0     0  0\n 11 15  1  6     0  0\n  9 16  1  0     0  0\n 16 17  1  0     0  0\n 16 18  1  0     0  0\n 16 19  1  0     0  0\n  9 20  1  1     0  0\n  6 21  1  1     0  0\n 21 22  1  0     0  0\n 22 23  1  0     0  0\n 23 24  2  0     0  0\n 24 25  1  0     0  0\n 25 26  2  0     0  0\n 26 27  1  0     0  0\n 22 27  2  0     0  0\n  2 28  1  0     0  0\n 28 29  2  0     0  0\n 28 30  1  0     0  0\n 30 31  1  0     0  0\n 32 31  1  0     0  0\n 32 33  2  0     0  0\n 34 33  1  0     0  0\n 35 34  2  0     0  0\n 36 35  1  0     0  0\n 31 36  2  0     0  0\n 32 37  1  0     0  0\nM  END\n',
                'smiles': 'CC1=NC=CC=C1NC(=O)C2=CC=C3C(CC[C@@H]4C[C@](O)(CC[C@@]34CC5=CC=CC=C5)C(F)(F)F)=C2',
                'formula': 'C29H29F3N2O2',
                'opticalActivity': 'UNSPECIFIED',
                'atropisomerism': 'No',
                'stereoCenters': 3,
                'definedStereo': 3,
                'ezCenters': 0,
                'charge': 0,
                'mwt': 494.548,
                'count': 1,
                'createdBy': 'admin',
                'lastEditedBy': 'admin',
                'hash': '83LAKBVTGMRS',
                'stereochemistry': 'ABSOLUTE',
                'references': [
                    'd3c57475-2310-4795-a641-deb48431e9ab',
                    '6830b700-4de6-4aeb-8ac8-48ca3124f01b'
                ],
                'access': [],
                'uuid': 'f74e4343-7ad0-4bce-8949-8ffea5f351e6',
                '_properties': {
                    'count': 5,
                    'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(f74e4343-7ad0-4bce-8949-8ffea5f351e6)/properties'
                },
                '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(f74e4343-7ad0-4bce-8949-8ffea5f351e6)?view=full'
            },
            '_moieties': {
                'count': 1,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0002f7ba-e0bc-40f4-a8d0-e7319124bfd9)/moieties'
            },
            '_names': {
                'count': 9,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0002f7ba-e0bc-40f4-a8d0-e7319124bfd9)/names'
            },
            '_references': {
                'count': 14,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0002f7ba-e0bc-40f4-a8d0-e7319124bfd9)/references'
            },
            '_codes': {
                'count': 5,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0002f7ba-e0bc-40f4-a8d0-e7319124bfd9)/codes'
            },
            '_relationships': {
                'count': 4,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0002f7ba-e0bc-40f4-a8d0-e7319124bfd9)/relationships'
            },
            '_approvalIDDisplay': 'OPM23UN90U',
            '_name': 'DAGROCORAT',
            'access': [],
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0002f7ba-e0bc-40f4-a8d0-e7319124bfd9)?view=full'
        },
        {
            'uuid': '0003289f-c4e4-4813-9820-519fa66a7db9',
            'created': 1520374239000,
            'createdBy': 'admin',
            'lastEdited': 1520374239000,
            'lastEditedBy': 'admin',
            'deprecated': false,
            'definitionType': 'PRIMARY',
            'definitionLevel': 'COMPLETE',
            'substanceClass': 'chemical',
            'status': 'approved',
            'version': '1',
            'approvedBy': 'FDA_SRS',
            'approvalID': 'HUH663DN8F',
            'structure': {
                'id': '5a2779eb-4e72-4ab4-8e72-a4d7989fd7a9',
                'created': 1520374239000,
                'lastEdited': 1520374239000,
                'deprecated': false,
                'digest': 'f7fbe7a6c7118b67016e90af45b4e59e5ecc7b25',
                'molfile': '\n  Symyx   04271719052D 1   1.00000     0.00000     0\n\n 18 18  0     0  0            999 V2000\n    4.4635   -1.9556    0.0000 N   0  0  0  0  0  0           0  0  0\n    3.7457   -2.3528    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.0375   -1.9297    0.0000 C   0  0  0  0  0  0           0  0  0\n    2.3140   -2.3363    0.0000 C   0  0  0  0  0  0           0  0  0\n    1.6022   -1.9111    0.0000 C   0  0  0  0  0  0           0  0  0\n    1.6174   -1.0814    0.0000 C   0  0  0  0  0  0           0  0  0\n    2.3364   -0.6820    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.0483   -1.1072    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.1753   -2.3808    0.0000 C   0  0  3  0  0  0           0  0  0\n    5.8987   -1.9741    0.0000 C   0  0  0  0  0  0           0  0  0\n    6.6105   -2.3993    0.0000 C   0  0  0  0  0  0           0  0  0\n    7.3283   -2.0021    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.0401   -2.4274    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.7601   -2.0265    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.1645   -3.2033    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.7788   -0.7049    0.0000 C   0  0  0  0  0  0           0  0  0\n    0.9091   -0.6583    0.0000 C   0  0  0  0  0  0           0  0  0\n    2.3061   -3.1703    0.0000 C   0  0  0  0  0  0           0  0  0\n  2  3  1  0     0  0\n  3  4  1  0     0  0\n  4  5  2  0     0  0\n  5  6  1  0     0  0\n  6  7  2  0     0  0\n  7  8  1  0     0  0\n  3  8  2  0     0  0\n  1  2  1  0     0  0\n  9 10  1  0     0  0\n 10 11  1  0     0  0\n 11 12  1  0     0  0\n 12 13  1  0     0  0\n 13 14  1  0     0  0\n  9 15  1  0     0  0\n  1  9  1  0     0  0\n  8 16  1  0     0  0\n  6 17  1  0     0  0\n  4 18  1  0     0  0\nM  END\n',
                'smiles': 'CCCCCC(C)NCC1=C(C)C=C(C)C=C1C',
                'formula': 'C17H29N',
                'opticalActivity': '( + / - )',
                'atropisomerism': 'No',
                'stereoCenters': 1,
                'definedStereo': 0,
                'ezCenters': 0,
                'charge': 0,
                'mwt': 247.4189,
                'count': 1,
                'createdBy': 'admin',
                'lastEditedBy': 'admin',
                'hash': '1WNNH7QR6V46',
                'stereochemistry': 'RACEMIC',
                'references': [
                    'bda36493-6ba5-4389-9fb1-10ba1ea0cdf8',
                    '2b6def0a-772c-45f2-824e-1e865183d444'
                ],
                'access': [],
                'uuid': '5a2779eb-4e72-4ab4-8e72-a4d7989fd7a9',
                '_properties': {
                    'count': 5,
                    'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(5a2779eb-4e72-4ab4-8e72-a4d7989fd7a9)/properties'
                },
                '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(5a2779eb-4e72-4ab4-8e72-a4d7989fd7a9)?view=full'
            },
            '_moieties': {
                'count': 1,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0003289f-c4e4-4813-9820-519fa66a7db9)/moieties'
            },
            '_names': {
                'count': 2,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0003289f-c4e4-4813-9820-519fa66a7db9)/names'
            },
            '_references': {
                'count': 6,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0003289f-c4e4-4813-9820-519fa66a7db9)/references'
            },
            '_codes': {
                'count': 6,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0003289f-c4e4-4813-9820-519fa66a7db9)/codes'
            },
            '_relationships': {
                'count': 1,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0003289f-c4e4-4813-9820-519fa66a7db9)/relationships'
            },
            '_approvalIDDisplay': 'HUH663DN8F',
            '_name': 'TRIMEXILINE',
            'access': [],
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0003289f-c4e4-4813-9820-519fa66a7db9)?view=full'
        },
        {
            'uuid': '00036c7f-2978-44e2-bd52-dce7f69d0926',
            'created': 1520365567000,
            'createdBy': 'admin',
            'lastEdited': 1520365567000,
            'lastEditedBy': 'admin',
            'deprecated': false,
            'definitionType': 'PRIMARY',
            'definitionLevel': 'COMPLETE',
            'substanceClass': 'chemical',
            'status': 'approved',
            'version': '1',
            'approvedBy': 'FDA_SRS',
            'approvalID': 'EM7G900253',
            'structure': {
                'id': '0cc4474c-774f-4100-a04b-5e6b873a4fd4',
                'created': 1520365567000,
                'lastEdited': 1520365567000,
                'deprecated': false,
                'digest': '65d6925262244a5216a4d46a6c51040f4c436cc7',
                'molfile': '\n  Symyx   04271720532D 1   1.00000     0.00000     0\n\n 25 27  0     0  0            999 V2000\n    6.1492   -4.4115    0.0000 O   0  0  0  0  0  0           0  0  0\n    5.5965   -4.9101    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.6741   -5.6514    0.0000 C   0  0  0  0  0  0           0  0  0\n    6.3178   -6.0211    0.0000 N   0  0  0  0  0  0           0  0  0\n    6.9615   -5.6514    0.0000 N   0  0  0  0  0  0           0  0  0\n    7.6052   -6.0211    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.2530   -5.6514    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.8968   -6.0210    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.8968   -6.7647    0.0000 C   0  0  0  0  0  0           0  0  0\n    9.5405   -7.1386    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.2530   -7.1386    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.2530   -7.8822    0.0000 N   0  3  0  0  0  0           0  0  0\n    8.8968   -8.2561    0.0000 O   0  5  0  0  0  0           0  0  0\n    7.6052   -8.2561    0.0000 O   0  0  0  0  0  0           0  0  0\n    7.6052   -6.7647    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.9951   -5.9526    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.8412   -6.6787    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.4965   -5.3999    0.0000 N   0  0  0  0  0  0           0  0  0\n    4.8703   -4.7562    0.0000 N   0  0  3  0  0  0           0  0  0\n    4.5649   -4.0772    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.0008   -3.4717    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.6996   -2.7927    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.9625   -2.7150    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.5224   -3.3164    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.8237   -3.9954    0.0000 C   0  0  0  0  0  0           0  0  0\n  1  2  1  0     0  0\n  2  3  2  0     0  0\n  3  4  1  0     0  0\n  4  5  2  0     0  0\n  5  6  1  0     0  0\n  6  7  1  0     0  0\n  7  8  2  0     0  0\n  8  9  1  0     0  0\n  9 10  1  0     0  0\n 11  9  2  0     0  0\n 11 12  1  0     0  0\n 12 13  1  0     0  0\n 12 14  2  0     0  0\n 15 11  1  0     0  0\n  6 15  2  0     0  0\n  3 16  1  0     0  0\n 16 17  1  0     0  0\n 18 16  2  0     0  0\n 19 18  1  0     0  0\n  2 19  1  0     0  0\n 19 20  1  0     0  0\n 20 21  1  0     0  0\n 21 22  2  0     0  0\n 22 23  1  0     0  0\n 24 23  2  0     0  0\n 25 24  1  0     0  0\n 20 25  2  0     0  0\nM  CHG  2  12   1  13  -1\nM  END\n',
                'smiles': 'CC1=NN(C(O)=C1\\N=N\\C2=CC(=C(C)C=C2)[N+]([O-])=O)C3=CC=CC=C3',
                'formula': 'C17H15N5O3',
                'opticalActivity': 'UNSPECIFIED',
                'atropisomerism': 'No',
                'stereoCenters': 0,
                'definedStereo': 0,
                'ezCenters': 1,
                'charge': 0,
                'mwt': 337.3327,
                'count': 1,
                'createdBy': 'admin',
                'lastEditedBy': 'admin',
                'hash': 'LR7KV6PJW6Y1',
                'stereochemistry': 'ACHIRAL',
                'references': [
                    'c4113515-5610-4786-ba34-f642c2492e4b',
                    '07fc31a7-8048-4552-9784-71dca14fc798'
                ],
                'access': [],
                'uuid': '0cc4474c-774f-4100-a04b-5e6b873a4fd4',
                '_properties': {
                    'count': 5,
                    'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(0cc4474c-774f-4100-a04b-5e6b873a4fd4)/properties'
                },
                '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(0cc4474c-774f-4100-a04b-5e6b873a4fd4)?view=full'
            },
            '_moieties': {
                'count': 1,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(00036c7f-2978-44e2-bd52-dce7f69d0926)/moieties'
            },
            '_names': {
                'count': 4,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(00036c7f-2978-44e2-bd52-dce7f69d0926)/names'
            },
            '_references': {
                'count': 5,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(00036c7f-2978-44e2-bd52-dce7f69d0926)/references'
            },
            '_codes': {
                'count': 3,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(00036c7f-2978-44e2-bd52-dce7f69d0926)/codes'
            },
            '_approvalIDDisplay': 'EM7G900253',
            '_name': 'SOLVENT YELLOW 23',
            'access': [],
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(00036c7f-2978-44e2-bd52-dce7f69d0926)?view=full'
        },
        {
            'uuid': '0003df78-b174-4ca7-99e0-2e11781244ab',
            'created': 1520354842000,
            'createdBy': 'admin',
            'lastEdited': 1520354842000,
            'lastEditedBy': 'admin',
            'deprecated': false,
            'definitionType': 'PRIMARY',
            'definitionLevel': 'COMPLETE',
            'substanceClass': 'chemical',
            'status': 'approved',
            'version': '2',
            'approvedBy': 'FDA_SRS',
            'approvalID': 'AV0X7V6CSE',
            'structure': {
                'id': '2a2570d3-c1b8-4edb-a7c8-a36d55a3ab17',
                'created': 1520354842000,
                'lastEdited': 1520354842000,
                'deprecated': false,
                'digest': '39afc597f229a098b44ec9021ee75ae192665b60',
                'molfile': '\n  Symyx   04271719012D 1   1.00000     0.00000     0\n\n 20 22  0     0  0            999 V2000\n   -0.4169   -5.7559    0.0000 C   0  0  0  0  0  0           0  0  0\n    0.2431   -6.2509    0.0000 C   0  0  0  0  0  0           0  0  0\n   -0.3255   -4.9396    0.0000 C   0  0  0  0  0  0           0  0  0\n    0.4375   -4.6167    0.0000 C   0  0  3  0  0  0           0  0  0\n    1.0981   -5.1109    0.0000 N   0  0  3  0  0  0           0  0  0\n    1.9513   -3.9703    0.0000 C   0  0  0  0  0  0           0  0  0\n    1.2907   -3.4761    0.0000 C   0  0  0  0  0  0           0  0  0\n    0.5287   -3.7984    0.0000 C   0  0  0  0  0  0           0  0  0\n   -2.4042   -2.1500    0.0000 C   0  0  0  0  0  0           0  0  0\n   -1.6917   -1.7334    0.0000 C   0  0  0  0  0  0           0  0  0\n   -0.9750   -2.1450    0.0000 C   0  0  0  0  0  0           0  0  0\n   -0.2630   -1.7291    0.0000 C   0  0  0  0  0  0           0  0  0\n   -0.2672   -0.9028    0.0000 C   0  0  0  0  0  0           0  0  0\n   -0.9893   -0.4943    0.0000 C   0  0  0  0  0  0           0  0  0\n   -1.6983   -0.9126    0.0000 C   0  0  0  0  0  0           0  0  0\n    0.4458   -2.1375    0.0000 C   0  0  0  0  0  0           0  0  0\n   -0.9833   -2.9667    0.0000 N   0  0  0  0  0  0           0  0  0\n   -0.2708   -3.3792    0.0000 C   0  0  0  0  0  0           0  0  0\n   -0.2750   -4.2042    0.0000 C   0  0  0  0  0  0           0  0  0\n    0.4417   -2.9625    0.0000 O   0  0  0  0  0  0           0  0  0\n  9 10  1  0     0  0\n 10 11  2  0     0  0\n  4  3  1  0     0  0\n 11 12  1  0     0  0\n  3  1  1  0     0  0\n 12 13  2  0     0  0\n  2  5  1  0     0  0\n 13 14  1  0     0  0\n  6  7  1  0     0  0\n 14 15  2  0     0  0\n 15 10  1  0     0  0\n  7  8  1  0     0  0\n 12 16  1  0     0  0\n  8  4  1  0     0  0\n 11 17  1  0     0  0\n  5  6  1  0     0  0\n 17 18  1  0     0  0\n  4  5  1  0     0  0\n 18 19  1  0     0  0\n 19  4  1  0     0  0\n  1  2  1  0     0  0\n 18 20  2  0     0  0\nM  END\n',
                'smiles': 'CC1=CC=CC(C)=C1NC(=O)CC23CCCN2CCC3',
                'formula': 'C17H24N2O',
                'opticalActivity': 'UNSPECIFIED',
                'atropisomerism': 'No',
                'stereoCenters': 0,
                'definedStereo': 0,
                'ezCenters': 0,
                'charge': 0,
                'mwt': 272.3853,
                'count': 1,
                'createdBy': 'admin',
                'lastEditedBy': 'admin',
                'hash': 'WJ9LJGCF28AV',
                'stereochemistry': 'ACHIRAL',
                'references': [
                    'e6aa8123-df1c-4f49-82ab-466336aadc86',
                    '01a96b50-61fd-47a2-b853-1df1bea589ed'
                ],
                'access': [],
                'uuid': '2a2570d3-c1b8-4edb-a7c8-a36d55a3ab17',
                '_properties': {
                    'count': 5,
                    'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(2a2570d3-c1b8-4edb-a7c8-a36d55a3ab17)/properties'
                },
                '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(2a2570d3-c1b8-4edb-a7c8-a36d55a3ab17)?view=full'
            },
            '_moieties': {
                'count': 1,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0003df78-b174-4ca7-99e0-2e11781244ab)/moieties'
            },
            '_names': {
                'count': 5,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0003df78-b174-4ca7-99e0-2e11781244ab)/names'
            },
            '_references': {
                'count': 13,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0003df78-b174-4ca7-99e0-2e11781244ab)/references'
            },
            '_codes': {
                'count': 10,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0003df78-b174-4ca7-99e0-2e11781244ab)/codes'
            },
            '_relationships': {
                'count': 2,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0003df78-b174-4ca7-99e0-2e11781244ab)/relationships'
            },
            '_approvalIDDisplay': 'AV0X7V6CSE',
            '_name': 'PILSICAINIDE',
            'access': [],
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0003df78-b174-4ca7-99e0-2e11781244ab)?view=full'
        },
        {
            'uuid': '000490d0-3890-4382-87d3-0c7687cbbecf',
            'created': 1520365054000,
            'createdBy': 'admin',
            'lastEdited': 1520365054000,
            'lastEditedBy': 'admin',
            'deprecated': false,
            'definitionType': 'PRIMARY',
            'definitionLevel': 'COMPLETE',
            'substanceClass': 'protein',
            'status': 'approved',
            'version': '1',
            'approvedBy': 'FDA_SRS',
            'approvalID': 'PG244BS39U',
            'protein': {
                'uuid': 'e901bfd3-16ec-4fee-9962-eb9adf228633',
                'created': 1520365054000,
                'createdBy': 'admin',
                'lastEdited': 1520365054000,
                'lastEditedBy': 'admin',
                'deprecated': false,
                'proteinSubType': '',
                'sequenceType': 'COMPLETE',
                'subunits': [
                    {
                        'uuid': '0c089142-6d22-41f1-9bc2-599545dca78e',
                        'created': 1520365054000,
                        'createdBy': 'admin',
                        'lastEdited': 1520365054000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'sequence': 'MAPWPHENSSLAPWPDLPTLAPNTANTSGLPGVPWEAALAGALLALAVLATVGGNLLVIVAIAWTPRLQTMTNVFVTSLAAADLVMGLLVVPPAATLALTGHWPLGATGCELWTSVDVLCVTASIETLCALAVDRYLAVTNPLRYGALVTKRCARTAVVLVWVVSAAVSFAPIMSQWWRVGADAEAQRCHSNPRCCAFASNMPYVLLSSSVSFYLPLLVMLFVYARVFVVATRQLRLLRGELGRFPPEESPPAPSRSLAPAPVGTCAPPEGVPACGRRPARLLPLREHRALCTLGLIMGTFTLCWLPFFLANVLRALGGPSLVPGPAFLALNWLGYANSAFNPLIYCRSPDFRSAFRRLLCRCGRRLPPEPCAAARPALFPSGVPAARSSPAQPRLCQRLDGASWGVS',
                        'subunitIndex': 1,
                        'length': 408,
                        'references': [],
                        'access': []
                    }
                ],
                'otherLinks': [],
                '_disulfideLinks': {
                    'count': 2,
                    'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(000490d0-3890-4382-87d3-0c7687cbbecf)/protein/disulfideLinks',
                    'shorthand': '1_110->1_196;1_189->1_195'
                },
                '_glycosylation': {
                    'type': 'HUMAN',
                    'nsites': 0,
                    'osites': 0,
                    'csites': 0,
                    'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(000490d0-3890-4382-87d3-0c7687cbbecf)/protein/glycosylation'
                },
                'references': [
                    '8c1c9810-ae2a-4df8-8d74-c48a1912c87d',
                    '4c9b5ba4-7731-4c6e-bb0c-f4e5380edc20'
                ],
                'access': []
            },
            '_properties': {
                'count': 1,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(000490d0-3890-4382-87d3-0c7687cbbecf)/properties'
            },
            '_names': {
                'count': 3,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(000490d0-3890-4382-87d3-0c7687cbbecf)/names'
            },
            '_modifications': {
                'count': 0,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(000490d0-3890-4382-87d3-0c7687cbbecf)/modifications'
            },
            '_references': {
                'count': 5,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(000490d0-3890-4382-87d3-0c7687cbbecf)/references'
            },
            '_codes': {
                'count': 3,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(000490d0-3890-4382-87d3-0c7687cbbecf)/codes'
            },
            '_relationships': {
                'count': 5,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(000490d0-3890-4382-87d3-0c7687cbbecf)/relationships'
            },
            '_approvalIDDisplay': 'PG244BS39U',
            '_name': 'BETA-3 ADRENERGIC RECEPTOR',
            'access': [],
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(000490d0-3890-4382-87d3-0c7687cbbecf)?view=full'
        },
        {
            'uuid': '00087c9a-9129-44db-9d25-91f8f812d3b1',
            'created': 1520369888000,
            'createdBy': 'admin',
            'lastEdited': 1520369888000,
            'lastEditedBy': 'admin',
            'deprecated': false,
            'definitionType': 'PRIMARY',
            'definitionLevel': 'COMPLETE',
            'substanceClass': 'chemical',
            'status': 'approved',
            'version': '1',
            'approvedBy': 'FDA_SRS',
            'approvalID': '182179586B',
            'structure': {
                'id': 'af264cd0-8322-46d2-ba12-5c6479acf95c',
                'created': 1520369888000,
                'lastEdited': 1520369888000,
                'deprecated': false,
                'digest': '0925b97b4a82d0f871aab768f912ee4a5e6837d7',
                'molfile': '\n  Symyx   04271720382D 1   1.00000     0.00000     0\n\n 42 45  0     0  0            999 V2000\n    5.0670  -10.0493    0.0000 N   0  0  0  0  0  0           0  0  0\n    4.4276   -9.6785    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.7840  -10.0493    0.0000 O   0  0  0  0  0  0           0  0  0\n    4.4276   -8.9326    0.0000 N   0  0  0  0  0  0           0  0  0\n    5.0670   -8.5618    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.0670   -7.8201    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.7107   -7.4493    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.7107   -6.7076    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.0670   -6.3368    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.4276   -6.7076    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.4276   -7.4493    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.7840   -6.3368    0.0000 F   0  0  0  0  0  0           0  0  0\n    6.3544   -7.8201    0.0000 O   0  0  0  0  0  0           0  0  0\n    6.9980   -7.4493    0.0000 C   0  0  0  0  0  0           0  0  0\n    7.6416   -7.8201    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.2853   -7.4493    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.9907   -7.6792    0.0000 C   0  0  0  0  0  0           0  0  0\n    9.4256   -7.0785    0.0000 N   0  0  0  0  0  0           0  0  0\n    8.9907   -6.4776    0.0000 N   0  0  3  0  0  0           0  0  0\n    8.2853   -6.7076    0.0000 C   0  0  0  0  0  0           0  0  0\n    7.6416   -6.3368    0.0000 C   0  0  0  0  0  0           0  0  0\n    6.9980   -6.7076    0.0000 C   0  0  0  0  0  0           0  0  0\n    9.2207   -5.7722    0.0000 C   0  0  0  0  0  0           0  0  0\n    9.9484   -5.6174    0.0000 C   0  0  0  0  0  0           0  0  0\n   10.1743   -4.9119    0.0000 O   0  0  0  0  0  0           0  0  0\n    5.0670  -10.7910    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.4663  -11.2259    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.6962  -11.9355    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.4420  -11.9355    0.0000 N   0  0  0  0  0  0           0  0  0\n    5.6679  -11.2259    0.0000 N   0  0  3  0  0  0           0  0  0\n    6.3775  -10.9960    0.0000 C   0  0  0  0  0  0           0  0  0\n    6.9281  -11.4938    0.0000 C   0  0  0  0  0  0           0  0  0\n    7.6335  -11.2639    0.0000 C   0  0  0  0  0  0           0  0  0\n    7.7883  -10.5402    0.0000 C   0  0  0  0  0  0           0  0  0\n    7.2377  -10.0423    0.0000 C   0  0  0  0  0  0           0  0  0\n    6.5323  -10.2723    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.4939  -10.3102    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.2613  -12.5363    0.0000 C   0  0  3  0  0  0           0  0  0\n    3.8264  -13.1329    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.5636  -13.2107    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.5241  -12.4583    0.0000 C   0  0  0  0  0  0           0  0  0\n   11.4063   -8.8438    0.0000 Cl  0  0  0  0  0  0           0  0  0\n  1  2  1  0     0  0\n  2  3  2  0     0  0\n  2  4  1  0     0  0\n  4  5  1  0     0  0\n  5  6  1  0     0  0\n  6  7  1  0     0  0\n  7  8  2  0     0  0\n  8  9  1  0     0  0\n  9 10  2  0     0  0\n 10 11  1  0     0  0\n  6 11  2  0     0  0\n 10 12  1  0     0  0\n  7 13  1  0     0  0\n 13 14  1  0     0  0\n 15 14  2  0     0  0\n 16 15  1  0     0  0\n 17 16  1  0     0  0\n 18 17  2  0     0  0\n 19 18  1  0     0  0\n 19 20  1  0     0  0\n 21 20  1  0     0  0\n 22 21  2  0     0  0\n 14 22  1  0     0  0\n 16 20  2  0     0  0\n 19 23  1  0     0  0\n 23 24  1  0     0  0\n 24 25  1  0     0  0\n  1 26  1  0     0  0\n 27 26  2  0     0  0\n 28 27  1  0     0  0\n 29 28  2  0     0  0\n 30 29  1  0     0  0\n 30 26  1  0     0  0\n 30 31  1  0     0  0\n 31 32  1  0     0  0\n 32 33  2  0     0  0\n 33 34  1  0     0  0\n 34 35  2  0     0  0\n 35 36  1  0     0  0\n 31 36  2  0     0  0\n 34 37  1  0     0  0\n 28 38  1  0     0  0\n 38 39  1  0     0  0\n 38 40  1  0     0  0\n 38 41  1  0     0  0\nM  END\n',
                'smiles': 'Cl.CC1=CC=C(C=C1)N2N=C(C=C2NC(=O)NCC3=CC(F)=CC=C3OC4=CC5=C(C=C4)N(CCO)N=C5)C(C)(C)C',
                'formula': 'C31H33FN6O3.ClH',
                'opticalActivity': 'UNSPECIFIED',
                'atropisomerism': 'No',
                'stereoCenters': 0,
                'definedStereo': 0,
                'ezCenters': 0,
                'charge': 0,
                'mwt': 593.091,
                'count': 1,
                'createdBy': 'admin',
                'lastEditedBy': 'admin',
                'hash': 'GD9DSJHTA716',
                'stereochemistry': 'ACHIRAL',
                'references': [
                    '724cf31a-157a-45b0-8f3a-3e8f6ac274e6',
                    'dcdb09f3-42aa-4c4e-a5fb-a785e23c8775'
                ],
                'access': [],
                'uuid': 'af264cd0-8322-46d2-ba12-5c6479acf95c',
                '_properties': {
                    'count': 5,
                    'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(af264cd0-8322-46d2-ba12-5c6479acf95c)/properties'
                },
                '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(af264cd0-8322-46d2-ba12-5c6479acf95c)?view=full'
            },
            '_moieties': {
                'count': 2,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(00087c9a-9129-44db-9d25-91f8f812d3b1)/moieties'
            },
            '_names': {
                'count': 3,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(00087c9a-9129-44db-9d25-91f8f812d3b1)/names'
            },
            '_references': {
                'count': 5,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(00087c9a-9129-44db-9d25-91f8f812d3b1)/references'
            },
            '_codes': {
                'count': 2,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(00087c9a-9129-44db-9d25-91f8f812d3b1)/codes'
            },
            '_relationships': {
                'count': 1,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(00087c9a-9129-44db-9d25-91f8f812d3b1)/relationships'
            },
            '_approvalIDDisplay': '182179586B',
            '_name': 'PEXMETINIB HYDROCHLORIDE',
            'access': [],
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(00087c9a-9129-44db-9d25-91f8f812d3b1)?view=full'
        },
        {
            'uuid': '0008a64e-2ebc-432c-8b7a-35f129fdc9c5',
            'created': 1520358629000,
            'createdBy': 'admin',
            'lastEdited': 1520358629000,
            'lastEditedBy': 'admin',
            'deprecated': false,
            'definitionType': 'PRIMARY',
            'definitionLevel': 'COMPLETE',
            'substanceClass': 'protein',
            'status': 'FAILED',
            'version': '3',
            'approvedBy': 'FDA_SRS',
            'approvalID': '6YI1L648RH',
            'protein': {
                'uuid': '1ccb414d-eb3b-4057-87bf-802cd19523ee',
                'created': 1520358629000,
                'createdBy': 'admin',
                'lastEdited': 1520358629000,
                'lastEditedBy': 'admin',
                'deprecated': false,
                'proteinType': 'MONOCLONAL ANTIBODY',
                'proteinSubType': 'IGG1',
                'sequenceOrigin': 'HUMANIZED MOUSE',
                'sequenceType': 'COMPLETE',
                'subunits': [
                    {
                        'uuid': 'c29eb96b-54d1-4957-acb8-166b25c94c74',
                        'created': 1520358629000,
                        'createdBy': 'admin',
                        'lastEdited': 1520358629000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'sequence': 'QVQLQESGPGLVKPSETLSLTCTVSGYSITGGYLWNWIRQPPGKGLEWIGYISYDGTNNYKPSLKDRVTISRDTSKNQFSLKLSSVTAADTAVYYCARYGRVFFDYWGQGTLVTVSSASTKGPSVFPLAPSSKSTSGGTAALGCLVKDYFPEPVTVSWNSGALTSGVHTFPAVLQSSGLYSLSSVVTVPSSSLGTQTYICNVNHKPSNTKVDKRVEPKSCDKTHTCPPCPAPELLGGPSVFLFPPKPKDTLMISRTPEVTCVVVDVSHEDPEVKFNWYVDGVEVHNAKTKPREEQYNSTYRVVSVLTVLHQDWLNGKEYKCKVSNKALPAPIEKTISKAKGQPREPQVYTLPPSREEMTKNQVSLTCLVKGFYPSDIAVEWESNGQPENNYKTTPPVLDSDGSFFLYSKLTVDKSRWQQGNVFSCSVMHEALHNHYTQKSLSLSPGK',
                        'subunitIndex': 1,
                        'length': 447,
                        'references': [],
                        'access': []
                    },
                    {
                        'uuid': 'add08e03-41b9-42e0-b067-c61277d0f0fb',
                        'created': 1520358629000,
                        'createdBy': 'admin',
                        'lastEdited': 1520358629000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'sequence': 'QVQLQESGPGLVKPSETLSLTCTVSGYSITGGYLWNWIRQPPGKGLEWIGYISYDGTNNYKPSLKDRVTISRDTSKNQFSLKLSSVTAADTAVYYCARYGRVFFDYWGQGTLVTVSSASTKGPSVFPLAPSSKSTSGGTAALGCLVKDYFPEPVTVSWNSGALTSGVHTFPAVLQSSGLYSLSSVVTVPSSSLGTQTYICNVNHKPSNTKVDKRVEPKSCDKTHTCPPCPAPELLGGPSVFLFPPKPKDTLMISRTPEVTCVVVDVSHEDPEVKFNWYVDGVEVHNAKTKPREEQYNSTYRVVSVLTVLHQDWLNGKEYKCKVSNKALPAPIEKTISKAKGQPREPQVYTLPPSREEMTKNQVSLTCLVKGFYPSDIAVEWESNGQPENNYKTTPPVLDSDGSFFLYSKLTVDKSRWQQGNVFSCSVMHEALHNHYTQKSLSLSPGK',
                        'subunitIndex': 2,
                        'length': 447,
                        'references': [],
                        'access': []
                    },
                    {
                        'uuid': '43ec5ce2-936d-497b-8f3d-a671e00431e3',
                        'created': 1520358629000,
                        'createdBy': 'admin',
                        'lastEdited': 1520358629000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'sequence': 'DIVMTQSPLSLPVTPGEPASISCRSSQSIVHSNGNTYLQWYLQKPGQSPQLLIYKVSNRLYGVPDRFSGSGSGTDFTLKISRVEAEDVGVYYCFQGSHVPWTFGQGTKVEIKRTVAAPSVFIFPPSDEQLKSGTASVVCLLNNFYPREAKVQWKVDNALQSGNSQESVTEQDSKDSTYSLSSTLTLSKADYEKHKVYACEVTHQGLSSPVTKSFNRGEC',
                        'subunitIndex': 3,
                        'length': 219,
                        'references': [],
                        'access': []
                    },
                    {
                        'uuid': '31c4beec-ec96-465e-b9e0-da432cc27627',
                        'created': 1520358629000,
                        'createdBy': 'admin',
                        'lastEdited': 1520358629000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'sequence': 'DIVMTQSPLSLPVTPGEPASISCRSSQSIVHSNGNTYLQWYLQKPGQSPQLLIYKVSNRLYGVPDRFSGSGSGTDFTLKISRVEAEDVGVYYCFQGSHVPWTFGQGTKVEIKRTVAAPSVFIFPPSDEQLKSGTASVVCLLNNFYPREAKVQWKVDNALQSGNSQESVTEQDSKDSTYSLSSTLTLSKADYEKHKVYACEVTHQGLSSPVTKSFNRGEC',
                        'subunitIndex': 4,
                        'length': 219,
                        'references': [],
                        'access': []
                    }
                ],
                'otherLinks': [],
                '_disulfideLinks': {
                    'count': 16,
                    'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0008a64e-2ebc-432c-8b7a-35f129fdc9c5)/protein/disulfideLinks',
                    'shorthand': '1_22->1_96;1_144->1_200;1_220->3_219;1_226->2_226;1_261->1_321;1_367->1_425;2_22->2_96;2_144->2_200;2_220->4_219;2_261->2_321;2_367->2_425;3_23->3_93;3_139->3_199;4_23->4_93;4_139->4_199;1_229->2_229'
                },
                '_glycosylation': {
                    'type': 'MAMMALIAN',
                    'nsites': 0,
                    'osites': 0,
                    'csites': 0,
                    'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0008a64e-2ebc-432c-8b7a-35f129fdc9c5)/protein/glycosylation'
                },
                'references': [
                    '63bf6dc6-faa1-4279-bf02-130cb0c0b534',
                    '7447c726-87cc-454d-b422-b1bbaf364812'
                ],
                'access': []
            },
            '_properties': {
                'count': 1,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0008a64e-2ebc-432c-8b7a-35f129fdc9c5)/properties'
            },
            '_names': {
                'count': 8,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0008a64e-2ebc-432c-8b7a-35f129fdc9c5)/names'
            },
            '_modifications': {
                'count': 0,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0008a64e-2ebc-432c-8b7a-35f129fdc9c5)/modifications'
            },
            '_references': {
                'count': 12,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0008a64e-2ebc-432c-8b7a-35f129fdc9c5)/references'
            },
            '_codes': {
                'count': 8,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0008a64e-2ebc-432c-8b7a-35f129fdc9c5)/codes'
            },
            '_relationships': {
                'count': 2,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0008a64e-2ebc-432c-8b7a-35f129fdc9c5)/relationships'
            },
            '_approvalIDDisplay': '6YI1L648RH',
            '_name': 'DALOTUZUMAB',
            'access': [],
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(0008a64e-2ebc-432c-8b7a-35f129fdc9c5)?view=full'
        },
        {
            'uuid': '000a0d70-e785-4b99-8e00-284d840c903b',
            'created': 1520353057000,
            'createdBy': 'admin',
            'lastEdited': 1520353057000,
            'lastEditedBy': 'admin',
            'deprecated': false,
            'definitionType': 'PRIMARY',
            'definitionLevel': 'COMPLETE',
            'substanceClass': 'structurallyDiverse',
            'status': 'approved',
            'version': '2',
            'approvedBy': 'FDA_SRS',
            'approvalID': 'V61766RQ02',
            'structurallyDiverse': {
                'uuid': '41fb8ed7-a6ad-4ca5-838f-8c180ac92aef',
                'created': 1520353057000,
                'createdBy': 'admin',
                'lastEdited': 1520353057000,
                'lastEditedBy': 'admin',
                'deprecated': false,
                'sourceMaterialClass': 'ORGANISM',
                'sourceMaterialType': 'PLANT',
                'part': [
                    'BARK'
                ],
                'parentSubstance': {
                    'uuid': '5bb4f97b-67ee-4b89-b842-d55ac83378b8',
                    'created': 1520353057000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353057000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'refPname': 'ALSTONIA SCHOLARIS WHOLE',
                    'refuuid': '97f7098c-dbd1-40af-b9ff-abcdfbb2ba09',
                    'substanceClass': 'reference',
                    'approvalID': '076CRI9LYQ',
                    'linkingID': '076CRI9LYQ',
                    'name': 'ALSTONIA SCHOLARIS WHOLE',
                    'references': [],
                    'access': []
                },
                'references': [
                    '05dffb0b-0955-4df3-8bf9-afb3886c71cd',
                    '867744f6-be44-4a71-a2e9-c4b70ceef2c5'
                ],
                'access': []
            },
            '_names': {
                'count': 12,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(000a0d70-e785-4b99-8e00-284d840c903b)/names'
            },
            '_modifications': {
                'count': 0,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(000a0d70-e785-4b99-8e00-284d840c903b)/modifications'
            },
            '_references': {
                'count': 12,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(000a0d70-e785-4b99-8e00-284d840c903b)/references'
            },
            '_codes': {
                'count': 2,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(000a0d70-e785-4b99-8e00-284d840c903b)/codes'
            },
            '_relationships': {
                'count': 1,
                'href': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(000a0d70-e785-4b99-8e00-284d840c903b)/relationships'
            },
            '_approvalIDDisplay': 'V61766RQ02',
            '_name': 'ALSTONIA SCHOLARIS BARK',
            'access': [],
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(000a0d70-e785-4b99-8e00-284d840c903b)?view=full'
        }
    ]
};

import { PagingResponse } from '../app/utils/paging-response.model';
import { SubstanceDetail, SubstanceSummary } from '../app/substance/substance.model';

export const SubstanceDetailsListData: PagingResponse<SubstanceDetail> = {
    'id': 36883704,
    'version': 1,
    'created': 1537196119623,
    'etag': '3424d60f0cdd9915',
    'path': '/ginas/app/api/v1/substances/search',
    'uri': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search?q=aspirin&view=full',
    'nextPageUri': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search?q=aspirin&view=full&skip=10',
    'method': 'GET',
    'sha1': '929b8c2ccf192719e5b3589729baf7f9e9b20af1',
    'total': 39,
    'count': 10,
    'skip': 0,
    'top': 10,
    'query': 'q=aspirin&view=full',
    'sideway': [],
    'facets': [
        {
            'name': 'Approved By',
            'values': [
                {
                    'label': 'FDA_SRS',
                    'count': 39
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Approved+By&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'CAS',
            'values': [
                {
                    'label': '23413-80-1',
                    'count': 1
                },
                {
                    'label': '343776-67-0',
                    'count': 1
                },
                {
                    'label': '37466-21-0',
                    'count': 1
                },
                {
                    'label': '53230-06-1',
                    'count': 1
                },
                {
                    'label': '56-40-6',
                    'count': 1
                },
                {
                    'label': '62952-06-1',
                    'count': 1
                },
                {
                    'label': '636-46-4',
                    'count': 1
                },
                {
                    'label': '70-54-2',
                    'count': 1
                },
                {
                    'label': '9002-01-1',
                    'count': 1
                },
                {
                    'label': '921943-73-9',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=CAS&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Code System',
            'values': [
                {
                    'label': 'CAS',
                    'count': 39
                },
                {
                    'label': 'PUBCHEM',
                    'count': 34
                },
                {
                    'label': 'EPA CompTox',
                    'count': 29
                },
                {
                    'label': 'ECHA (EC/EINECS)',
                    'count': 28
                },
                {
                    'label': 'EVMPD',
                    'count': 28
                },
                {
                    'label': 'MERCK INDEX',
                    'count': 24
                },
                {
                    'label': 'RXCUI',
                    'count': 16
                },
                {
                    'label': 'MESH',
                    'count': 15
                },
                {
                    'label': 'NCI_THESAURUS',
                    'count': 15
                },
                {
                    'label': 'WIKIPEDIA',
                    'count': 13
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Code+System&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Created By',
            'values': [
                {
                    'label': 'admin',
                    'count': 39
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Created+By&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Definition Level',
            'values': [
                {
                    'label': 'COMPLETE',
                    'count': 39
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Definition+Level&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Definition Level Access',
            'values': [
                {
                    'label': 'public',
                    'count': 39
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Definition+Level+Access&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Definition Type',
            'values': [
                {
                    'label': 'PRIMARY',
                    'count': 39
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Definition+Type&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Display Name Level Access',
            'values': [
                {
                    'label': 'public',
                    'count': 39
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Display+Name+Level+Access&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'GInAS Document Tag',
            'values': [
                {
                    'label': 'AUTO_SELECTED',
                    'count': 39
                },
                {
                    'label': 'NOMEN',
                    'count': 39
                },
                {
                    'label': 'PUBLIC_DOMAIN_RELEASE',
                    'count': 39
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=GInAS+Document+Tag&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'GInAS Language',
            'values': [
                {
                    'label': 'en',
                    'count': 39
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=GInAS+Language&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Modifications',
            'values': [
                {
                    'label': 'No Modifications',
                    'count': 39
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Modifications&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Molecular Weight',
            'values': [
                {
                    'label': '0:200',
                    'count': 30
                },
                {
                    'label': '200:400',
                    'count': 20
                },
                {
                    'label': '400:600',
                    'count': 5
                },
                {
                    'label': '>1000',
                    'count': 2
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Molecular+Weight&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Name Count',
            'values': [
                {
                    'label': '10',
                    'count': 5
                },
                {
                    'label': '9',
                    'count': 5
                },
                {
                    'label': '4',
                    'count': 4
                },
                {
                    'label': '8',
                    'count': 4
                },
                {
                    'label': '13',
                    'count': 2
                },
                {
                    'label': '15',
                    'count': 2
                },
                {
                    'label': '23',
                    'count': 2
                },
                {
                    'label': '3',
                    'count': 2
                },
                {
                    'label': '7',
                    'count': 2
                },
                {
                    'label': '12',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Name+Count&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Record Level Access',
            'values': [
                {
                    'label': 'public',
                    'count': 39
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Record+Level+Access&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Record Status',
            'values': [
                {
                    'label': 'approved',
                    'count': 39
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Record+Status&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Reference Count',
            'values': [
                {
                    'label': '10',
                    'count': 5
                },
                {
                    'label': '6',
                    'count': 5
                },
                {
                    'label': '12',
                    'count': 4
                },
                {
                    'label': '7',
                    'count': 4
                },
                {
                    'label': '8',
                    'count': 4
                },
                {
                    'label': '19',
                    'count': 3
                },
                {
                    'label': '18',
                    'count': 2
                },
                {
                    'label': '41',
                    'count': 2
                },
                {
                    'label': '22',
                    'count': 1
                },
                {
                    'label': '28',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Reference+Count&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Reference Type',
            'values': [
                {
                    'label': 'BATCH_IMPORT',
                    'count': 39
                },
                {
                    'label': 'SRS',
                    'count': 39
                },
                {
                    'label': 'SRS_LOCATOR',
                    'count': 30
                },
                {
                    'label': 'WEBSITE',
                    'count': 30
                },
                {
                    'label': 'VALIDATION_MESSAGE',
                    'count': 19
                },
                {
                    'label': 'EUROPEAN PHARMACOPEIA',
                    'count': 8
                },
                {
                    'label': 'SYSTEM',
                    'count': 7
                },
                {
                    'label': 'JOURNAL ARTICLE',
                    'count': 6
                },
                {
                    'label': 'BOOK',
                    'count': 2
                },
                {
                    'label': 'JA',
                    'count': 2
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Reference+Type&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Substance Class',
            'values': [
                {
                    'label': 'chemical',
                    'count': 38
                },
                {
                    'label': 'protein',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Substance+Class&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'SubstanceDeprecated',
            'values': [
                {
                    'label': 'false',
                    'count': 39
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=SubstanceDeprecated&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'ix.Class',
            'values': [
                {
                    'label': 'ix.core.models.Keyword',
                    'count': 39
                },
                {
                    'label': 'ix.ginas.models.v1.Code',
                    'count': 39
                },
                {
                    'label': 'ix.ginas.models.v1.Name',
                    'count': 39
                },
                {
                    'label': 'ix.ginas.models.v1.Reference',
                    'count': 39
                },
                {
                    'label': 'ix.core.models.Text',
                    'count': 38
                },
                {
                    'label': 'ix.ginas.models.v1.ChemicalSubstance',
                    'count': 38
                },
                {
                    'label': 'ix.ginas.models.v1.GinasChemicalStructure',
                    'count': 38
                },
                {
                    'label': 'ix.ginas.models.v1.Moiety',
                    'count': 38
                },
                {
                    'label': 'ix.ginas.models.v1.Relationship',
                    'count': 31
                },
                {
                    'label': 'ix.ginas.models.v1.SubstanceReference',
                    'count': 31
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=ix.Class&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'root_codes_lastEditedBy',
            'values': [
                {
                    'label': 'admin',
                    'count': 39
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=root_codes_lastEditedBy&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'root_lastEditedBy',
            'values': [
                {
                    'label': 'admin',
                    'count': 39
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=root_lastEditedBy&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'root_names_lastEditedBy',
            'values': [
                {
                    'label': 'admin',
                    'count': 39
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=root_names_lastEditedBy&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'root_references_lastEditedBy',
            'values': [
                {
                    'label': 'admin',
                    'count': 39
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=root_references_lastEditedBy&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Defined Stereocenters',
            'values': [
                {
                    'label': '0:1',
                    'count': 34
                },
                {
                    'label': '1:2',
                    'count': 4
                },
                {
                    'label': '2:3',
                    'count': 1
                },
                {
                    'label': '4:5',
                    'count': 1
                },
                {
                    'label': '8:9',
                    'count': 1
                },
                {
                    'label': '>10',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Defined+Stereocenters&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Last Edited By',
            'values': [
                {
                    'label': 'admin',
                    'count': 38
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Last+Edited+By&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'LyChI_L1',
            'values': [
                {
                    'label': 'G1Y4LNJVN',
                    'count': 18
                },
                {
                    'label': '9B21H2CLV',
                    'count': 11
                },
                {
                    'label': 'C976ZJKDN',
                    'count': 5
                },
                {
                    'label': 'GYNBC774G',
                    'count': 3
                },
                {
                    'label': '5KYQ3Q5YY',
                    'count': 2
                },
                {
                    'label': 'A2G1MJBDL',
                    'count': 2
                },
                {
                    'label': 'GHJ9R6HUU',
                    'count': 2
                },
                {
                    'label': 'L71CDPCCQ',
                    'count': 2
                },
                {
                    'label': '9CPX5AA8J',
                    'count': 1
                },
                {
                    'label': 'LM486GC2W',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=LyChI_L1&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'LyChI_L2',
            'values': [
                {
                    'label': 'NUZL6H3JLN',
                    'count': 18
                },
                {
                    'label': 'N4ZND8LF9Q',
                    'count': 5
                },
                {
                    'label': 'VF9HVC5NBQ',
                    'count': 3
                },
                {
                    'label': 'VKNSP6D456',
                    'count': 3
                },
                {
                    'label': 'VQP5L4C3SD',
                    'count': 3
                },
                {
                    'label': 'QUDYQSSGNX',
                    'count': 2
                },
                {
                    'label': 'UQ2SRUN7KH',
                    'count': 2
                },
                {
                    'label': 'VS2ZAZMV74',
                    'count': 2
                },
                {
                    'label': 'YALFJQSZWX',
                    'count': 2
                },
                {
                    'label': 'JQ4DJWJ2S8',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=LyChI_L2&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'LyChI_L3',
            'values': [
                {
                    'label': 'NNJZA2A29FQ',
                    'count': 18
                },
                {
                    'label': 'NQBW8VCR1PY',
                    'count': 5
                },
                {
                    'label': 'V6U3QU1SPWW',
                    'count': 3
                },
                {
                    'label': 'VDWT3TDSKNT',
                    'count': 3
                },
                {
                    'label': 'VQHC9NW6U4J',
                    'count': 3
                },
                {
                    'label': 'QXAYP1MKUU6',
                    'count': 2
                },
                {
                    'label': 'UH3HP6HA9QT',
                    'count': 2
                },
                {
                    'label': 'YXN8827YBLX',
                    'count': 2
                },
                {
                    'label': 'DKNZXMJV9LK',
                    'count': 1
                },
                {
                    'label': 'J8NF9R2HH5F',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=LyChI_L3&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'LyChI_L4',
            'values': [
                {
                    'label': 'NNQ793F142LD',
                    'count': 17
                },
                {
                    'label': 'V6WH9AARYJAJ',
                    'count': 3
                },
                {
                    'label': 'VDTT9FYX4XVV',
                    'count': 3
                },
                {
                    'label': 'VQJWYZ562M4C',
                    'count': 3
                },
                {
                    'label': 'NQYLK44FVG4U',
                    'count': 2
                },
                {
                    'label': 'NQYQCKZ2F4V6',
                    'count': 2
                },
                {
                    'label': 'QX6CAGTLSFJ7',
                    'count': 2
                },
                {
                    'label': 'YXX31QZ3CNMJ',
                    'count': 2
                },
                {
                    'label': '1L8FPB2SGALW',
                    'count': 1
                },
                {
                    'label': '2RCFGPM2X6M5',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=LyChI_L4&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Molecular Formula',
            'values': [
                {
                    'label': 'C9H7O4',
                    'count': 10
                },
                {
                    'label': 'C9H8O4',
                    'count': 8
                },
                {
                    'label': 'C6H14N2O2',
                    'count': 5
                },
                {
                    'label': 'Al',
                    'count': 3
                },
                {
                    'label': 'Ca',
                    'count': 3
                },
                {
                    'label': 'HO',
                    'count': 3
                },
                {
                    'label': 'C7H6O3',
                    'count': 2
                },
                {
                    'label': 'C9H8O4.C6H14N2O2',
                    'count': 2
                },
                {
                    'label': 'CH4N2O',
                    'count': 2
                },
                {
                    'label': 'Na',
                    'count': 2
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Molecular+Formula&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'StereoChemistry',
            'values': [
                {
                    'label': 'ACHIRAL',
                    'count': 33
                },
                {
                    'label': 'ABSOLUTE',
                    'count': 8
                },
                {
                    'label': 'RACEMIC',
                    'count': 2
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=StereoChemistry&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Stereocenters',
            'values': [
                {
                    'label': '0:1',
                    'count': 33
                },
                {
                    'label': '1:2',
                    'count': 6
                },
                {
                    'label': '2:3',
                    'count': 1
                },
                {
                    'label': '4:5',
                    'count': 1
                },
                {
                    'label': '8:9',
                    'count': 1
                },
                {
                    'label': '>10',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Stereocenters&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'SubstanceStereochemistry',
            'values': [
                {
                    'label': 'ACHIRAL',
                    'count': 28
                },
                {
                    'label': 'ABSOLUTE',
                    'count': 8
                },
                {
                    'label': 'RACEMIC',
                    'count': 2
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=SubstanceStereochemistry&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'PUBCHEM',
            'values': [
                {
                    'label': '12280114',
                    'count': 1
                },
                {
                    'label': '12490',
                    'count': 1
                },
                {
                    'label': '162666',
                    'count': 1
                },
                {
                    'label': '169926',
                    'count': 1
                },
                {
                    'label': '3032790',
                    'count': 1
                },
                {
                    'label': '5962',
                    'count': 1
                },
                {
                    'label': '68749',
                    'count': 1
                },
                {
                    'label': '866',
                    'count': 1
                },
                {
                    'label': '90478514',
                    'count': 1
                },
                {
                    'label': '9815560',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=PUBCHEM&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'GInAS Tag',
            'values': [
                {
                    'label': 'MI',
                    'count': 24
                },
                {
                    'label': 'WHO-DD',
                    'count': 24
                },
                {
                    'label': 'MART.',
                    'count': 14
                },
                {
                    'label': 'INN',
                    'count': 12
                },
                {
                    'label': 'VANDF',
                    'count': 11
                },
                {
                    'label': 'HSDB',
                    'count': 9
                },
                {
                    'label': 'USP-RS',
                    'count': 9
                },
                {
                    'label': 'EP',
                    'count': 7
                },
                {
                    'label': 'JAN',
                    'count': 7
                },
                {
                    'label': 'USP',
                    'count': 7
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=GInAS+Tag&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Relationships',
            'values': [
                {
                    'label': 'ACTIVE MOIETY',
                    'count': 26
                },
                {
                    'label': 'PARENT->IMPURITY',
                    'count': 7
                },
                {
                    'label': 'METABOLITE->PARENT',
                    'count': 3
                },
                {
                    'label': 'BINDER -> LIGAND',
                    'count': 2
                },
                {
                    'label': 'IMPURITY->PARENT',
                    'count': 2
                },
                {
                    'label': 'METABOLIC ENZYME->SUBSTRATE',
                    'count': 2
                },
                {
                    'label': 'METABOLITE INACTIVE->PARENT',
                    'count': 2
                },
                {
                    'label': 'PARENT->CONSTITUENT ALWAYS PRESENT',
                    'count': 2
                },
                {
                    'label': 'TRANSPORTER->INHIBITOR',
                    'count': 2
                },
                {
                    'label': 'TRANSPORTER->SUBSTRATE',
                    'count': 2
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Relationships&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'root_relationships_lastEditedBy',
            'values': [
                {
                    'label': 'admin',
                    'count': 31
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=root_relationships_lastEditedBy&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'root_relationships_relatedSubstance_lastEditedBy',
            'values': [
                {
                    'label': 'admin',
                    'count': 31
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=root_relationships_relatedSubstance_lastEditedBy&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'EPA CompTox',
            'values': [
                {
                    'label': '23325-63-5',
                    'count': 1
                },
                {
                    'label': '52080-78-1',
                    'count': 1
                },
                {
                    'label': '529-68-0',
                    'count': 1
                },
                {
                    'label': '530-75-6',
                    'count': 1
                },
                {
                    'label': '55482-89-8',
                    'count': 1
                },
                {
                    'label': '56-40-6',
                    'count': 1
                },
                {
                    'label': '56-87-1',
                    'count': 1
                },
                {
                    'label': '569-84-6',
                    'count': 1
                },
                {
                    'label': '69-46-5',
                    'count': 1
                },
                {
                    'label': '99-96-7',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=EPA+CompTox&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'ECHA (EC/EINECS)',
            'values': [
                {
                    'label': '200-272-2',
                    'count': 1
                },
                {
                    'label': '200-294-2',
                    'count': 1
                },
                {
                    'label': '200-740-6',
                    'count': 1
                },
                {
                    'label': '202-804-9',
                    'count': 1
                },
                {
                    'label': '208-467-4',
                    'count': 1
                },
                {
                    'label': '211-258-0',
                    'count': 1
                },
                {
                    'label': '245-645-0',
                    'count': 1
                },
                {
                    'label': '253-514-4',
                    'count': 1
                },
                {
                    'label': '259-663-1',
                    'count': 1
                },
                {
                    'label': '263-769-3',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=ECHA+%28EC%2FEINECS%29&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'EVMPD',
            'values': [
                {
                    'label': 'SUB34053',
                    'count': 2
                },
                {
                    'label': 'SUB01040MIG',
                    'count': 1
                },
                {
                    'label': 'SUB04589MIG',
                    'count': 1
                },
                {
                    'label': 'SUB07968MIG',
                    'count': 1
                },
                {
                    'label': 'SUB08629MIG',
                    'count': 1
                },
                {
                    'label': 'SUB118894',
                    'count': 1
                },
                {
                    'label': 'SUB12727MIG',
                    'count': 1
                },
                {
                    'label': 'SUB14772MIG',
                    'count': 1
                },
                {
                    'label': 'SUB183619',
                    'count': 1
                },
                {
                    'label': 'SUB36688',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=EVMPD&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'MERCK INDEX',
            'values': [
                {
                    'label': 'M2111',
                    'count': 2
                },
                {
                    'label': 'M2920',
                    'count': 2
                },
                {
                    'label': 'M10225',
                    'count': 1
                },
                {
                    'label': 'M145',
                    'count': 1
                },
                {
                    'label': 'M1575',
                    'count': 1
                },
                {
                    'label': 'M5703',
                    'count': 1
                },
                {
                    'label': 'M5796',
                    'count': 1
                },
                {
                    'label': 'M6120',
                    'count': 1
                },
                {
                    'label': 'M6136',
                    'count': 1
                },
                {
                    'label': 'M996',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=MERCK+INDEX&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Validation',
            'values': [
                {
                    'label': 'WARNING',
                    'count': 19
                },
                {
                    'label': 'Code Collision',
                    'count': 15
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Validation&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'root_notes_lastEditedBy',
            'values': [
                {
                    'label': 'admin',
                    'count': 19
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=root_notes_lastEditedBy&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'RXCUI',
            'values': [
                {
                    'label': '10106',
                    'count': 1
                },
                {
                    'label': '1368641',
                    'count': 1
                },
                {
                    'label': '1649527',
                    'count': 1
                },
                {
                    'label': '17393',
                    'count': 1
                },
                {
                    'label': '1858285',
                    'count': 1
                },
                {
                    'label': '314293',
                    'count': 1
                },
                {
                    'label': '4919',
                    'count': 1
                },
                {
                    'label': '611',
                    'count': 1
                },
                {
                    'label': '6536',
                    'count': 1
                },
                {
                    'label': '6902',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=RXCUI&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'MESH',
            'values': [
                {
                    'label': 'C002942',
                    'count': 1
                },
                {
                    'label': 'C010843',
                    'count': 1
                },
                {
                    'label': 'C010925',
                    'count': 1
                },
                {
                    'label': 'C023557',
                    'count': 1
                },
                {
                    'label': 'C038193',
                    'count': 1
                },
                {
                    'label': 'D005998',
                    'count': 1
                },
                {
                    'label': 'D008239',
                    'count': 1
                },
                {
                    'label': 'D008775',
                    'count': 1
                },
                {
                    'label': 'D013300',
                    'count': 1
                },
                {
                    'label': 'D020156',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=MESH&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'NCI_THESAURUS',
            'values': [
                {
                    'label': 'C29171',
                    'count': 1
                },
                {
                    'label': 'C524',
                    'count': 1
                },
                {
                    'label': 'C61934',
                    'count': 1
                },
                {
                    'label': 'C647',
                    'count': 1
                },
                {
                    'label': 'C65821',
                    'count': 1
                },
                {
                    'label': 'C76714',
                    'count': 1
                },
                {
                    'label': 'C76795',
                    'count': 1
                },
                {
                    'label': 'C82300',
                    'count': 1
                },
                {
                    'label': 'C83539',
                    'count': 1
                },
                {
                    'label': 'C91032',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=NCI_THESAURUS&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'root_names_nameOrgs_lastEditedBy',
            'values': [
                {
                    'label': 'admin',
                    'count': 15
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=root_names_nameOrgs_lastEditedBy&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'ATC Level 1',
            'values': [
                {
                    'label': 'NERVOUS SYSTEM',
                    'count': 7
                },
                {
                    'label': 'BLOOD AND BLOOD FORMING ORGANS',
                    'count': 6
                },
                {
                    'label': 'CARDIOVASCULAR SYSTEM',
                    'count': 2
                },
                {
                    'label': 'DERMATOLOGICALS',
                    'count': 2
                },
                {
                    'label': 'SENSORY ORGANS',
                    'count': 2
                },
                {
                    'label': 'ALIMENTARY TRACT AND METABOLISM',
                    'count': 1
                },
                {
                    'label': 'MUSCULO-SKELETAL SYSTEM',
                    'count': 1
                },
                {
                    'label': 'SYSTEMIC HORMONAL PREPARATIONS, EXCL. SEX HORMONES AND INSULINS',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=ATC+Level+1&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'ATC Level 2',
            'values': [
                {
                    'label': 'ANALGESICS',
                    'count': 5
                },
                {
                    'label': 'ANTITHROMBOTIC AGENTS',
                    'count': 4
                },
                {
                    'label': 'BLOOD SUBSTITUTES AND PERFUSION SOLUTIONS',
                    'count': 2
                },
                {
                    'label': 'LIPID MODIFYING AGENTS',
                    'count': 2
                },
                {
                    'label': 'OPHTHALMOLOGICALS',
                    'count': 2
                },
                {
                    'label': 'ANTI-ACNE PREPARATIONS',
                    'count': 1
                },
                {
                    'label': 'ANTIEPILEPTICS',
                    'count': 1
                },
                {
                    'label': 'ANTIFUNGALS FOR DERMATOLOGICAL USE',
                    'count': 1
                },
                {
                    'label': 'CORTICOSTEROIDS FOR SYSTEMIC USE',
                    'count': 1
                },
                {
                    'label': 'STOMATOLOGICAL PREPARATIONS',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=ATC+Level+2&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'ATC Level 3',
            'values': [
                {
                    'label': 'OTHER ANALGESICS AND ANTIPYRETICS',
                    'count': 5
                },
                {
                    'label': 'ANTITHROMBOTIC AGENTS',
                    'count': 4
                },
                {
                    'label': 'LIPID MODIFYING AGENTS, COMBINATIONS',
                    'count': 2
                },
                {
                    'label': 'ANTIINFLAMMATORY AGENTS AND ANTIINFECTIVES IN COMBINATION',
                    'count': 1
                },
                {
                    'label': 'CORTICOSTEROIDS FOR SYSTEMIC USE, PLAIN',
                    'count': 1
                },
                {
                    'label': 'CORTICOSTEROIDS, COMBINATIONS WITH ANTIBIOTICS',
                    'count': 1
                },
                {
                    'label': 'I.V. SOLUTION ADDITIVES',
                    'count': 1
                },
                {
                    'label': 'IRRIGATING SOLUTIONS',
                    'count': 1
                },
                {
                    'label': 'LIPID MODIFYING AGENTS, PLAIN',
                    'count': 1
                },
                {
                    'label': 'OTHER HEMATOLOGICAL AGENTS',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=ATC+Level+3&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'ATC Level 4',
            'values': [
                {
                    'label': 'Salicylic acid and derivatives',
                    'count': 5
                },
                {
                    'label': 'Platelet aggregation inhibitors excl. heparin',
                    'count': 3
                },
                {
                    'label': 'HMG CoA reductase inhibitors, other combinations',
                    'count': 2
                },
                {
                    'label': 'Amino acids',
                    'count': 1
                },
                {
                    'label': 'Antiinflammatory/antirheumatic agents in combination with corticosteroids',
                    'count': 1
                },
                {
                    'label': 'Carbamates',
                    'count': 1
                },
                {
                    'label': 'Corticosteroids, weak, combinations with antibiotics',
                    'count': 1
                },
                {
                    'label': 'Fatty acid derivatives',
                    'count': 1
                },
                {
                    'label': 'Hypnotics and sedatives in combination, excl. barbiturates',
                    'count': 1
                },
                {
                    'label': 'Other antifungals for topical use',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=ATC+Level+4&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'ChEMBL',
            'values': [
                {
                    'label': 'CHEMBL1496',
                    'count': 1
                },
                {
                    'label': 'CHEMBL2105097',
                    'count': 1
                },
                {
                    'label': 'CHEMBL2106782',
                    'count': 1
                },
                {
                    'label': 'CHEMBL2107562',
                    'count': 1
                },
                {
                    'label': 'CHEMBL2108147',
                    'count': 1
                },
                {
                    'label': 'CHEMBL2108222',
                    'count': 1
                },
                {
                    'label': 'CHEMBL424',
                    'count': 1
                },
                {
                    'label': 'CHEMBL650',
                    'count': 1
                },
                {
                    'label': 'CHEMBL773',
                    'count': 1
                },
                {
                    'label': 'CHEMBL8085',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=ChEMBL&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'WHO-ATC',
            'values': [
                {
                    'label': 'B01AC08',
                    'count': 2
                },
                {
                    'label': 'C10BX05',
                    'count': 2
                },
                {
                    'label': 'N02BA15',
                    'count': 2
                },
                {
                    'label': 'B01AC15',
                    'count': 1
                },
                {
                    'label': 'B05XB03',
                    'count': 1
                },
                {
                    'label': 'D07AA01',
                    'count': 1
                },
                {
                    'label': 'D10AA02',
                    'count': 1
                },
                {
                    'label': 'H02AB04',
                    'count': 1
                },
                {
                    'label': 'N02BA02',
                    'count': 1
                },
                {
                    'label': 'N02BA14',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=WHO-ATC&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'WHO-VATC',
            'values': [
                {
                    'label': 'QC10BX05',
                    'count': 2
                },
                {
                    'label': 'QA12AA09',
                    'count': 1
                },
                {
                    'label': 'QB01AC15',
                    'count': 1
                },
                {
                    'label': 'QB05CX03',
                    'count': 1
                },
                {
                    'label': 'QB05XB03',
                    'count': 1
                },
                {
                    'label': 'QB06AA55',
                    'count': 1
                },
                {
                    'label': 'QN02BA02',
                    'count': 1
                },
                {
                    'label': 'QN02BA14',
                    'count': 1
                },
                {
                    'label': 'QN02BA15',
                    'count': 1
                },
                {
                    'label': 'QN02BA65',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=WHO-VATC&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'WIKIPEDIA',
            'values': [
                {
                    'label': '4-HYDROXYBENZOIC ACID',
                    'count': 1
                },
                {
                    'label': 'ALOXIPRIN',
                    'count': 1
                },
                {
                    'label': 'ASPIRIN',
                    'count': 1
                },
                {
                    'label': 'GENTISIC ACID',
                    'count': 1
                },
                {
                    'label': 'GLYCINE',
                    'count': 1
                },
                {
                    'label': 'LYSINE',
                    'count': 1
                },
                {
                    'label': 'METHYLPREDNISOLONE',
                    'count': 1
                },
                {
                    'label': 'ROSUVASTATIN',
                    'count': 1
                },
                {
                    'label': 'SALICYLIC ACID',
                    'count': 1
                },
                {
                    'label': 'Streptokinase',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=WIKIPEDIA&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'GInAS Domain',
            'values': [
                {
                    'label': 'drug',
                    'count': 12
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=GInAS+Domain&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'INN',
            'values': [
                {
                    'label': '1373',
                    'count': 1
                },
                {
                    'label': '1656',
                    'count': 1
                },
                {
                    'label': '3267',
                    'count': 1
                },
                {
                    'label': '4512',
                    'count': 1
                },
                {
                    'label': '6166',
                    'count': 1
                },
                {
                    'label': '623',
                    'count': 1
                },
                {
                    'label': '630',
                    'count': 1
                },
                {
                    'label': '732',
                    'count': 1
                },
                {
                    'label': '756',
                    'count': 1
                },
                {
                    'label': '8021',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=INN&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'DRUG BANK',
            'values': [
                {
                    'label': 'DB00123',
                    'count': 1
                },
                {
                    'label': 'DB00145',
                    'count': 1
                },
                {
                    'label': 'DB00313',
                    'count': 1
                },
                {
                    'label': 'DB00371',
                    'count': 1
                },
                {
                    'label': 'DB00936',
                    'count': 1
                },
                {
                    'label': 'DB00945',
                    'count': 1
                },
                {
                    'label': 'DB00959',
                    'count': 1
                },
                {
                    'label': 'DB01098',
                    'count': 1
                },
                {
                    'label': 'DB01399',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=DRUG+BANK&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'HSDB',
            'values': [
                {
                    'label': '287714-41-4',
                    'count': 1
                },
                {
                    'label': '50-78-2',
                    'count': 1
                },
                {
                    'label': '56-40-6',
                    'count': 1
                },
                {
                    'label': '56-87-1',
                    'count': 1
                },
                {
                    'label': '57-53-4',
                    'count': 1
                },
                {
                    'label': '69-72-7',
                    'count': 1
                },
                {
                    'label': '83-43-2',
                    'count': 1
                },
                {
                    'label': '99-66-1',
                    'count': 1
                },
                {
                    'label': '99-96-7',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=HSDB&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'LactMed',
            'values': [
                {
                    'label': '287714-41-4',
                    'count': 1
                },
                {
                    'label': '50-78-2',
                    'count': 1
                },
                {
                    'label': '552-94-3',
                    'count': 1
                },
                {
                    'label': '57-53-4',
                    'count': 1
                },
                {
                    'label': '69-72-7',
                    'count': 1
                },
                {
                    'label': '83-43-2',
                    'count': 1
                },
                {
                    'label': '99-66-1',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=LactMed&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'CFR',
            'values': [
                {
                    'label': '21 CFR 172.320',
                    'count': 2
                },
                {
                    'label': '21 CFR 520.1409',
                    'count': 2
                },
                {
                    'label': '21 CFR 172.812',
                    'count': 1
                },
                {
                    'label': '21 CFR 310.532',
                    'count': 1
                },
                {
                    'label': '21 CFR 358.110',
                    'count': 1
                },
                {
                    'label': '21 CFR 358.510',
                    'count': 1
                },
                {
                    'label': '21 CFR 520.1060',
                    'count': 1
                },
                {
                    'label': '21 CFR 520.1408',
                    'count': 1
                },
                {
                    'label': '21 CFR 522.1410',
                    'count': 1
                },
                {
                    'label': '21 CFR 862.3830',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=CFR&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'IUPHAR',
            'values': [
                {
                    'label': '2954',
                    'count': 1
                },
                {
                    'label': '4139',
                    'count': 1
                },
                {
                    'label': '4306',
                    'count': 1
                },
                {
                    'label': '7009',
                    'count': 1
                },
                {
                    'label': '7088',
                    'count': 1
                },
                {
                    'label': '7225',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=IUPHAR&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'LIVERTOX',
            'values': [
                {
                    'label': '1017',
                    'count': 1
                },
                {
                    'label': '601',
                    'count': 1
                },
                {
                    'label': '626',
                    'count': 1
                },
                {
                    'label': '68',
                    'count': 1
                },
                {
                    'label': '864',
                    'count': 1
                },
                {
                    'label': '870',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=LIVERTOX&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'WHO-ESSENTIAL MEDICINES LIST',
            'values': [
                {
                    'label': '12.5',
                    'count': 2
                },
                {
                    'label': '05',
                    'count': 1
                },
                {
                    'label': '13.4',
                    'count': 1
                },
                {
                    'label': '2.1',
                    'count': 1
                },
                {
                    'label': '24.2.2',
                    'count': 1
                },
                {
                    'label': '7.1',
                    'count': 1
                },
                {
                    'label': '8.3',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=WHO-ESSENTIAL+MEDICINES+LIST&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Interaction Type',
            'values': [
                {
                    'label': 'MAJOR',
                    'count': 4
                },
                {
                    'label': 'MINOR',
                    'count': 2
                },
                {
                    'label': 'ASSAY (HPLC)',
                    'count': 1
                },
                {
                    'label': 'ASSAY (TITRATION)',
                    'count': 1
                },
                {
                    'label': 'CHROMATOGRAPHIC PURITY (HPLC/UV)',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Interaction+Type&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'JECFA EVALUATION',
            'values': [
                {
                    'label': '2-HYDROXYBENZOIC ACID',
                    'count': 1
                },
                {
                    'label': '4-HYDROXYBENZOIC ACID',
                    'count': 1
                },
                {
                    'label': 'GLYCINE',
                    'count': 1
                },
                {
                    'label': 'L-LYSINE',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=JECFA+EVALUATION&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'NDF-RT',
            'values': [
                {
                    'label': 'N0000000121',
                    'count': 1
                },
                {
                    'label': 'N0000000160',
                    'count': 1
                },
                {
                    'label': 'N0000008486',
                    'count': 1
                },
                {
                    'label': 'N0000008836',
                    'count': 1
                },
                {
                    'label': 'N0000175576',
                    'count': 1
                },
                {
                    'label': 'N0000175589',
                    'count': 1
                },
                {
                    'label': 'N0000175721',
                    'count': 1
                },
                {
                    'label': 'N0000175722',
                    'count': 1
                },
                {
                    'label': 'N0000175751',
                    'count': 1
                },
                {
                    'label': 'N0000175753',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=NDF-RT&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'root_relationships_amount_lastEditedBy',
            'values': [
                {
                    'label': 'admin',
                    'count': 3
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=root_relationships_amount_lastEditedBy&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'EPA PESTICIDE CODE',
            'values': [
                {
                    'label': '129061',
                    'count': 1
                },
                {
                    'label': '76602',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=EPA+PESTICIDE+CODE&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'WHO INTERNATIONAL PHARMACOPEIA',
            'values': [
                {
                    'label': 'ASPIRIN',
                    'count': 1
                },
                {
                    'label': 'SALICYLIC ACID',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=WHO+INTERNATIONAL+PHARMACOPEIA&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'root_relationships_mediatorSubstance_lastEditedBy',
            'values': [
                {
                    'label': 'admin',
                    'count': 2
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=root_relationships_mediatorSubstance_lastEditedBy&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'DEA NO.',
            'values': [
                {
                    'label': '2820',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=DEA+NO.&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'EMA ASSESSMENT REPORTS',
            'values': [
                {
                    'label': 'CLOPIDOGREL/ACETYLSALICYCLIC ACID (AUTHORIZED: MYOCARDIAL INFARCTION)',
                    'count': 1
                },
                {
                    'label': 'CLOPIDOGREL/ACETYLSALICYLIC ACID (AUTHORIZED: ACUTE CORONARY SYNDROME)',
                    'count': 1
                },
                {
                    'label': 'DUOCOVER (AUTHORIZED: ACUTE CORONARY SYNDROME)',
                    'count': 1
                },
                {
                    'label': 'DUOCOVER (AUTHORIZED: MYOCARDIAL INFARCTION)',
                    'count': 1
                },
                {
                    'label': 'DUOPLAVIN (AUTHORIZED: ACUTE CORONARY SYNDROME)',
                    'count': 1
                },
                {
                    'label': 'DUOPLAVIN (AUTHORIZED: MYOCARDIAL INFARCTION)',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=EMA+ASSESSMENT+REPORTS&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Glycosylation Site Count',
            'values': [
                {
                    'label': '0',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Glycosylation+Site+Count&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'MANUFACTURER PRODUCT INFORMATION',
            'values': [
                {
                    'label': 'ORG-42675',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=MANUFACTURER+PRODUCT+INFORMATION&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'Sequence Type',
            'values': [
                {
                    'label': 'COMPLETE',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=Sequence+Type&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'root_properties_lastEditedBy',
            'values': [
                {
                    'label': 'admin',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=root_properties_lastEditedBy&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'root_protein_glycosylation_lastEditedBy',
            'values': [
                {
                    'label': 'admin',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=root_protein_glycosylation_lastEditedBy&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'root_protein_lastEditedBy',
            'values': [
                {
                    'label': 'admin',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=root_protein_lastEditedBy&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'root_protein_modifications_lastEditedBy',
            'values': [
                {
                    'label': 'admin',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=root_protein_modifications_lastEditedBy&top=10&fskip=0&fetch=100'
        },
        {
            'name': 'root_protein_subunits_lastEditedBy',
            'values': [
                {
                    'label': 'admin',
                    'count': 1
                }
            ],
            'enhanced': true,
            'prefix': '',
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=10&q=aspirin&sideway=true&field=root_protein_subunits_lastEditedBy&top=10&fskip=0&fetch=100'
        }
    ],
    'content': [
        {
            'uuid': 'a05ec20c-8fe2-4e02-ba7f-df69e5e30248',
            'created': 1520353318000,
            'createdBy': 'admin',
            'lastEdited': 1520353318000,
            'lastEditedBy': 'admin',
            'deprecated': false,
            'definitionType': 'PRIMARY',
            'definitionLevel': 'COMPLETE',
            'substanceClass': 'chemical',
            'status': 'approved',
            'version': '5',
            'approvedBy': 'FDA_SRS',
            'names': [
                {
                    'uuid': '00e4cbad-f33b-43fa-894c-7e5d03ca9360',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF VICOPRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(00e4cbad-f33b-43fa-894c-7e5d03ca9360)?view=full'
                },
                {
                    'uuid': '069c37f0-4a19-4c8f-ad34-196556bb5037',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': true,
                    'references': [
                        'a2bacf49-c3ab-42b1-948e-4caf9d13dcc6',
                        'c2c31c52-cf50-477b-b020-aa85b4cfc4d4',
                        'd87b9521-c829-4f0c-8f66-101f6f3a67b5',
                        'fa052f29-7e10-4aab-a1b7-abeaaf7d7b12',
                        '81938fb2-747b-471f-a2a4-f82a1e2bf089',
                        '6b443371-95be-47a4-901e-9c314a8fb5db',
                        '747bac63-454a-481c-b7e2-6f6db0bee5c9',
                        '0fedf8bf-9112-4ae7-a876-63aab5fb0ac4',
                        '642e6dae-ab5f-4331-b46f-36e569a5dd63',
                        'c814e853-bd01-4f1f-b23a-38686fbf7c90',
                        'cdf3e379-17de-437e-9246-71b18dd5802e',
                        '021928c7-a306-4c64-8b4d-67924b411770',
                        '3f43d255-788b-4df8-b924-cc25dfedb171',
                        '098f0f09-2036-4008-a870-f473a32fc45b',
                        '8ed14aba-d149-49f7-bd9a-aca313488d9c'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(069c37f0-4a19-4c8f-ad34-196556bb5037)?view=full'
                },
                {
                    'uuid': '074b6229-be0f-4e2e-b610-f8c6b4031ad0',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'CLOPIDOGREL/ACETYLSALICYLIC ACID COMPONENT ASPIRIN',
                    'type': 'bn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '5ec89d1e-64a6-4148-8801-b5c0b4ad39fa'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(074b6229-be0f-4e2e-b610-f8c6b4031ad0)?view=full'
                },
                {
                    'uuid': '11514aae-94db-4099-8480-8814c8f4ea11',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'DUOCOVER COMPONENT ASPIRIN',
                    'type': 'bn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '64d12b0f-0d9d-4896-8770-b827ea3128ff'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(11514aae-94db-4099-8480-8814c8f4ea11)?view=full'
                },
                {
                    'uuid': '12897db8-c527-47c2-8fdc-fec5fa9d80a3',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF MICRAININ',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(12897db8-c527-47c2-8fdc-fec5fa9d80a3)?view=full'
                },
                {
                    'uuid': '17796a92-7d19-41dd-8a1d-85f7fc2602ac',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYL SALICYLATE',
                    'type': 'sys',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'b3548777-047f-44d3-9c55-4909a0fde423'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(17796a92-7d19-41dd-8a1d-85f7fc2602ac)?view=full'
                },
                {
                    'uuid': '17f4e481-cc3a-4f95-97a2-d6fc9f9cf6ee',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF EQUAGESIC',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(17f4e481-cc3a-4f95-97a2-d6fc9f9cf6ee)?view=full'
                },
                {
                    'uuid': '19144a23-5c43-4ad2-b894-761915330349',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': '2-ACETYLOXYBENZOIC ACID',
                    'type': 'sys',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '919c5a16-f3ac-4b69-8379-603f07c4d74e'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(19144a23-5c43-4ad2-b894-761915330349)?view=full'
                },
                {
                    'uuid': '1954eb62-e60a-4ea9-a0d5-65f9a7651d7c',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN [ORANGE BOOK]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'c814e853-bd01-4f1f-b23a-38686fbf7c90'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(1954eb62-e60a-4ea9-a0d5-65f9a7651d7c)?view=full'
                },
                {
                    'uuid': '1be56b2c-6884-4030-9650-5e78baef73f9',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF AGGRENOX',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(1be56b2c-6884-4030-9650-5e78baef73f9)?view=full'
                },
                {
                    'uuid': '1fd504db-8224-42f7-8086-3fbb9b7dec80',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'BAY1019036',
                    'type': 'cd',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '8a6afa6e-1bdb-4b33-b673-a1e239123a0e'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(1fd504db-8224-42f7-8086-3fbb9b7dec80)?view=full'
                },
                {
                    'uuid': '21ccf269-35c1-41e1-8c36-8f22bcac05ae',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'INVAGESIC FORTE COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(21ccf269-35c1-41e1-8c36-8f22bcac05ae)?view=full'
                },
                {
                    'uuid': '21e0df61-b81e-4ce8-be64-9100d953598f',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'DUOPLAVIN COMPONENT ASPIRIN',
                    'type': 'bn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'd059d77b-1f6c-4c77-9d67-7fa1c56deac5'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(21e0df61-b81e-4ce8-be64-9100d953598f)?view=full'
                },
                {
                    'uuid': '2361dffc-4786-4180-8cb0-abaf156cd427',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASA',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46a42348-c88b-408d-b596-a27280aff449'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(2361dffc-4786-4180-8cb0-abaf156cd427)?view=full'
                },
                {
                    'uuid': '2430a98c-a66c-472a-9432-07bd9d77d0f4',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF LANORINAL',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(2430a98c-a66c-472a-9432-07bd9d77d0f4)?view=full'
                },
                {
                    'uuid': '2e759d09-5e77-4de0-94e1-2dbc52c1dcd6',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLIC ACID [WHO-DD]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'd64e9fda-15d4-440e-b9b4-eaaeb6d61dd7'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(2e759d09-5e77-4de0-94e1-2dbc52c1dcd6)?view=full'
                },
                {
                    'uuid': '31071e18-01f5-4fb8-9c99-336e1b4883e7',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLIC ACID [EMA EPAR]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'dd19a315-71b2-45a2-a337-5c64b26e4586'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(31071e18-01f5-4fb8-9c99-336e1b4883e7)?view=full'
                },
                {
                    'uuid': '31293f9d-366d-4569-b1df-a40be9f6c8b2',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'NSC-27223',
                    'type': 'cd',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '6e4e22a6-0d29-4532-960e-9d99bda9fad8'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(31293f9d-366d-4569-b1df-a40be9f6c8b2)?view=full'
                },
                {
                    'uuid': '383cbe38-0335-4ebf-8371-77fb4c65e37d',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'AGGRENOX COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(383cbe38-0335-4ebf-8371-77fb4c65e37d)?view=full'
                },
                {
                    'uuid': '39277189-cb13-4597-b54a-8f27df05d08c',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'CODOXY COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(39277189-cb13-4597-b54a-8f27df05d08c)?view=full'
                },
                {
                    'uuid': '3a028eea-c8a8-45f3-ab46-7cfc936a551c',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'MEASURIN',
                    'type': 'bn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'f4dfdbd4-ea02-4b6b-a6ff-22ab95cb9bed'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(3a028eea-c8a8-45f3-ab46-7cfc936a551c)?view=full'
                },
                {
                    'uuid': '3df8408e-2b79-493c-a069-6c682eed165e',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF ROXIPRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(3df8408e-2b79-493c-a069-6c682eed165e)?view=full'
                },
                {
                    'uuid': '458a73b6-bb43-442b-b527-034d3c9ba323',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ROXIPRIN COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(458a73b6-bb43-442b-b527-034d3c9ba323)?view=full'
                },
                {
                    'uuid': '46b26be6-4030-41db-ae23-cb02780f1ee2',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLIC ACID [GREEN BOOK]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'b3e56dca-af76-4b98-a9b4-243cc1bf6eb6'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(46b26be6-4030-41db-ae23-cb02780f1ee2)?view=full'
                },
                {
                    'uuid': '48d89039-025b-4fe5-bd9a-c9a876c49ae6',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLIC ACID (WHO-IP)',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'a9fd4df5-0685-47c5-8cae-52b7564e7d54'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(48d89039-025b-4fe5-bd9a-c9a876c49ae6)?view=full'
                },
                {
                    'uuid': '4a5fab9a-a792-4c2a-bcd5-0adf341d684c',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'NORGESIC COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(4a5fab9a-a792-4c2a-bcd5-0adf341d684c)?view=full'
                },
                {
                    'uuid': '511b3cc4-7f72-49db-81fd-c2813cff5c8e',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF ROBAXISAL',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(511b3cc4-7f72-49db-81fd-c2813cff5c8e)?view=full'
                },
                {
                    'uuid': '52345a18-e066-4f91-94ee-35a10881c2db',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN [MART.]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '747bac63-454a-481c-b7e2-6f6db0bee5c9'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(52345a18-e066-4f91-94ee-35a10881c2db)?view=full'
                },
                {
                    'uuid': '5305ca9e-b986-421b-891e-893d793790ef',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF YOSPRALA',
                    'type': 'bn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '745256bc-b919-4ff3-b3f2-e6ff4c6c7e77'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(5305ca9e-b986-421b-891e-893d793790ef)?view=full'
                },
                {
                    'uuid': '546d4885-2b5c-4e29-ba6b-f4cee78f42c5',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF NORGESIC',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(546d4885-2b5c-4e29-ba6b-f4cee78f42c5)?view=full'
                },
                {
                    'uuid': '56718bee-ec8d-44c2-a3db-d8e61d45de1a',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'MEPRO-ASPIRIN COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(56718bee-ec8d-44c2-a3db-d8e61d45de1a)?view=full'
                },
                {
                    'uuid': '5c4114ab-e89c-464c-b265-8e3c5937a31f',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF CARISOPRODOL COMPOUND',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(5c4114ab-e89c-464c-b265-8e3c5937a31f)?view=full'
                },
                {
                    'uuid': '6084ad47-33ad-4b21-a522-da3ee583a7ef',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN [VANDF]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'c2c31c52-cf50-477b-b020-aa85b4cfc4d4'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(6084ad47-33ad-4b21-a522-da3ee583a7ef)?view=full'
                },
                {
                    'uuid': '6313fcf6-155b-4f56-8ced-8cc5023bd6fd',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ORPHENGESIC COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(6313fcf6-155b-4f56-8ced-8cc5023bd6fd)?view=full'
                },
                {
                    'uuid': '661b938f-7546-43f5-beff-5309730d3e00',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF SOMA COMPOUND',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(661b938f-7546-43f5-beff-5309730d3e00)?view=full'
                },
                {
                    'uuid': '66ab5393-897a-4839-8f1b-6794f0e8fe17',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'PRAVIGARD PAC COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(66ab5393-897a-4839-8f1b-6794f0e8fe17)?view=full'
                },
                {
                    'uuid': '674a1f56-3750-4cc5-a4cd-0af908fe84ea',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF AXOTAL',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(674a1f56-3750-4cc5-a4cd-0af908fe84ea)?view=full'
                },
                {
                    'uuid': '696dbcf8-e17a-4d37-9db8-bd3dc304881c',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'DARVON COMPOUND COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(696dbcf8-e17a-4d37-9db8-bd3dc304881c)?view=full'
                },
                {
                    'uuid': '6a5876f1-dda9-446b-babd-0c921a3e3bdc',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACIDUM ACETYLSALICYLICUM (WHO-IP)',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'a9fd4df5-0685-47c5-8cae-52b7564e7d54'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(6a5876f1-dda9-446b-babd-0c921a3e3bdc)?view=full'
                },
                {
                    'uuid': '6e3fc596-0dcc-42d6-93b8-52f21d8b3840',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'AXOTAL COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(6e3fc596-0dcc-42d6-93b8-52f21d8b3840)?view=full'
                },
                {
                    'uuid': '6fa468a1-2d88-4c9e-a63d-429a2943605b',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'INVAGESIC COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(6fa468a1-2d88-4c9e-a63d-429a2943605b)?view=full'
                },
                {
                    'uuid': '74a17639-8361-42bf-99b7-dfa7473d21ed',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF EXCEDRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(74a17639-8361-42bf-99b7-dfa7473d21ed)?view=full'
                },
                {
                    'uuid': '74efc5d9-9883-4f54-ba47-6e9f532b0f19',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF INVAGESIC',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(74efc5d9-9883-4f54-ba47-6e9f532b0f19)?view=full'
                },
                {
                    'uuid': '77c83fe2-bb6c-4d26-abf7-8fe701ee5347',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'MICRAININ COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(77c83fe2-bb6c-4d26-abf7-8fe701ee5347)?view=full'
                },
                {
                    'uuid': '7c554cb2-7738-4957-a58d-0a42f1017724',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF TALWIN COMPOUND',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(7c554cb2-7738-4957-a58d-0a42f1017724)?view=full'
                },
                {
                    'uuid': '7f98aa99-702a-4581-8d41-ced08a5a4de7',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'LANORINAL COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(7f98aa99-702a-4581-8d41-ced08a5a4de7)?view=full'
                },
                {
                    'uuid': '7fb117c4-bbe8-4b23-b92b-4d33ef7aa5be',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF INVAGESIC FORTE',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(7fb117c4-bbe8-4b23-b92b-4d33ef7aa5be)?view=full'
                },
                {
                    'uuid': '80361675-9c34-4f4a-8136-f808abe2f4c7',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'SYNALGOS-DC COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(80361675-9c34-4f4a-8136-f808abe2f4c7)?view=full'
                },
                {
                    'uuid': '83a35db3-f9c1-44c2-8958-e49faa20bd65',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN [JAN]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '88ce6680-a831-0fad-a42d-92aea8a62f00'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(83a35db3-f9c1-44c2-8958-e49faa20bd65)?view=full'
                },
                {
                    'uuid': '8561d9ea-a03a-4562-8bbf-baf8d27c3758',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF MEPRO-ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(8561d9ea-a03a-4562-8bbf-baf8d27c3758)?view=full'
                },
                {
                    'uuid': '8866741c-8a7a-446a-b127-b5919e78c09e',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN [USP-RS]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '098f0f09-2036-4008-a870-f473a32fc45b'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(8866741c-8a7a-446a-b127-b5919e78c09e)?view=full'
                },
                {
                    'uuid': '8981c0fd-dabd-493a-b5a0-1f5a3eb5efab',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'NSC-406186',
                    'type': 'cd',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '6e4e22a6-0d29-4532-960e-9d99bda9fad8'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(8981c0fd-dabd-493a-b5a0-1f5a3eb5efab)?view=full'
                },
                {
                    'uuid': '8ba58215-882e-4afb-9c1b-9b485cb12f71',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'BENZOIC ACID, 2-(ACETYLOXY)-',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '9bff8ba8-0ef5-4c4d-97de-48ec020106b7'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(8ba58215-882e-4afb-9c1b-9b485cb12f71)?view=full'
                },
                {
                    'uuid': '8edbdc39-9758-44c2-9555-87412c2a5c6b',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF PRAVIGARD PAC',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(8edbdc39-9758-44c2-9555-87412c2a5c6b)?view=full'
                },
                {
                    'uuid': '9049ca17-8a15-4614-aecc-bfd453c033b3',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'FIORINAL COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(9049ca17-8a15-4614-aecc-bfd453c033b3)?view=full'
                },
                {
                    'uuid': '91c7de2b-c537-4617-b040-674f42c98752',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF AZDONE',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(91c7de2b-c537-4617-b040-674f42c98752)?view=full'
                },
                {
                    'uuid': '941cac81-2eb6-4aa2-aa9c-306426d330b6',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACIDUM ACETYLSALICYLICUM',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'b795c9a5-b1e7-4092-9e4e-d167d97e73ef'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(941cac81-2eb6-4aa2-aa9c-306426d330b6)?view=full'
                },
                {
                    'uuid': '95e608da-e1ab-4dad-a03f-4572d18d7209',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF SYNALGOS-DC',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(95e608da-e1ab-4dad-a03f-4572d18d7209)?view=full'
                },
                {
                    'uuid': '983f73e8-56d4-4fb3-b32b-091f01dea75d',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF PERCODAN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(983f73e8-56d4-4fb3-b32b-091f01dea75d)?view=full'
                },
                {
                    'uuid': '98e5cc5b-2d1d-487e-995d-1432854e1f30',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'CARISOPRODOL COMPOUND COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(98e5cc5b-2d1d-487e-995d-1432854e1f30)?view=full'
                },
                {
                    'uuid': '9e36ce8a-89e5-4b17-9cbf-c8eb8cbf442b',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'SALICYLIC ACID ACETATE',
                    'type': 'sys',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '9bff8ba8-0ef5-4c4d-97de-48ec020106b7'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(9e36ce8a-89e5-4b17-9cbf-c8eb8cbf442b)?view=full'
                },
                {
                    'uuid': '9f28e8e0-ed43-42c7-9e42-201bb5d2d761',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'Q-GESIC COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(9f28e8e0-ed43-42c7-9e42-201bb5d2d761)?view=full'
                },
                {
                    'uuid': 'a0b52bae-9f24-4875-8e29-6ecf62b960da',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'PERCODAN-DEMI COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(a0b52bae-9f24-4875-8e29-6ecf62b960da)?view=full'
                },
                {
                    'uuid': 'a5404e9e-9116-4095-bb58-7767d3a31bee',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLIC ACID [EP]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'fda2dc61-1264-40af-8758-3390e4d60ad6'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(a5404e9e-9116-4095-bb58-7767d3a31bee)?view=full'
                },
                {
                    'uuid': 'a65349f3-a996-4ceb-aee3-24d1f1628d72',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'VICOPRIN COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(a65349f3-a996-4ceb-aee3-24d1f1628d72)?view=full'
                },
                {
                    'uuid': 'a7e7e621-3d19-4b7e-82f5-0e12fd147da5',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF DUOPLAVIN',
                    'type': 'bn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'd059d77b-1f6c-4c77-9d67-7fa1c56deac5'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(a7e7e621-3d19-4b7e-82f5-0e12fd147da5)?view=full'
                },
                {
                    'uuid': 'adcd0567-76a3-4ab6-b904-2261791ad3ab',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF DUOCOVER',
                    'type': 'bn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '64d12b0f-0d9d-4896-8770-b827ea3128ff'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(adcd0567-76a3-4ab6-b904-2261791ad3ab)?view=full'
                },
                {
                    'uuid': 'aee32803-50f2-41c3-abe4-509ff83c63cb',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'AZDONE COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(aee32803-50f2-41c3-abe4-509ff83c63cb)?view=full'
                },
                {
                    'uuid': 'b30ef17e-b9ac-4881-bedb-31e1b2d2a876',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'EXCEDRIN COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(b30ef17e-b9ac-4881-bedb-31e1b2d2a876)?view=full'
                },
                {
                    'uuid': 'b51beed2-5b0e-4b9f-ad9f-5fed3f301ba4',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'SOMA COMPOUND COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(b51beed2-5b0e-4b9f-ad9f-5fed3f301ba4)?view=full'
                },
                {
                    'uuid': 'b5781017-e1aa-46a9-9b60-590e16ef5c79',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF ORPHENGESIC',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(b5781017-e1aa-46a9-9b60-590e16ef5c79)?view=full'
                },
                {
                    'uuid': 'bdb98c87-6e03-462b-83b9-e5d01366c685',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLICUM ACIDUM [HPUS]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'd80b788d-5afd-46c9-b8d8-5fad1dd7d946'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(bdb98c87-6e03-462b-83b9-e5d01366c685)?view=full'
                },
                {
                    'uuid': 'be80c144-b8a4-4ad6-87e2-10f7f3553f4c',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN [HSDB]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '3f43d255-788b-4df8-b924-cc25dfedb171'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(be80c144-b8a4-4ad6-87e2-10f7f3553f4c)?view=full'
                },
                {
                    'uuid': 'bef3fe34-dc05-471e-8127-bab5eecd4fc9',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ROBAXISAL COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(bef3fe34-dc05-471e-8127-bab5eecd4fc9)?view=full'
                },
                {
                    'uuid': 'c5121134-4cd0-40ce-8d68-160951300713',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLIC ACID',
                    'type': 'of',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [
                        {
                            'uuid': '42570ec2-eb91-4775-980c-4ef40bf90108',
                            'created': 1520353318000,
                            'createdBy': 'admin',
                            'lastEdited': 1520353318000,
                            'lastEditedBy': 'admin',
                            'deprecated': false,
                            'nameOrg': 'INCI',
                            'references': [],
                            'access': []
                        }
                    ],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'fda2dc61-1264-40af-8758-3390e4d60ad6',
                        '92025853-d80d-4081-80ac-196d09e27303',
                        '164ecc00-1619-4fad-9ec4-0b10b6fe1e91',
                        'dd19a315-71b2-45a2-a337-5c64b26e4586',
                        '09efee30-c1a7-4d61-b4b9-92a52c95a2dd',
                        'b795c9a5-b1e7-4092-9e4e-d167d97e73ef',
                        'b3e56dca-af76-4b98-a9b4-243cc1bf6eb6',
                        'e7094fbb-05b7-4bb6-9165-0eefd2e8b1e7',
                        '18815669-0ccb-4d9f-b665-41bd6a024220',
                        'd64e9fda-15d4-440e-b9b4-eaaeb6d61dd7',
                        'c0646662-7ba2-480e-98eb-1d7c8c02ce07'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(c5121134-4cd0-40ce-8d68-160951300713)?view=full'
                },
                {
                    'uuid': 'c7069333-892e-4828-97aa-6ea06434cb34',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': '2-(ACETYLOXY)BENZOIC ACID',
                    'type': 'sys',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'b795c9a5-b1e7-4092-9e4e-d167d97e73ef'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(c7069333-892e-4828-97aa-6ea06434cb34)?view=full'
                },
                {
                    'uuid': 'cbd1b931-0d16-4c7c-b5fb-0318f7452b1f',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'EQUAGESIC COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(cbd1b931-0d16-4c7c-b5fb-0318f7452b1f)?view=full'
                },
                {
                    'uuid': 'cd065890-0ac3-416b-8bba-064671a8abbd',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'PERCODAN COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(cd065890-0ac3-416b-8bba-064671a8abbd)?view=full'
                },
                {
                    'uuid': 'ce4ac45c-51b0-40c3-a79f-7ae2f656627f',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF CODOXY',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(ce4ac45c-51b0-40c3-a79f-7ae2f656627f)?view=full'
                },
                {
                    'uuid': 'cf7067c8-f5d1-4aad-8873-f648bbf99cb7',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF PERCODAN-DEMI',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(cf7067c8-f5d1-4aad-8873-f648bbf99cb7)?view=full'
                },
                {
                    'uuid': 'd4695228-be02-41d9-a229-e5a340cc294d',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN [USP]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '6b443371-95be-47a4-901e-9c314a8fb5db'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(d4695228-be02-41d9-a229-e5a340cc294d)?view=full'
                },
                {
                    'uuid': 'd4e48596-b40d-45ba-b9ad-f0080a3d7fc7',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN [MI]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'a2bacf49-c3ab-42b1-948e-4caf9d13dcc6'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(d4e48596-b40d-45ba-b9ad-f0080a3d7fc7)?view=full'
                },
                {
                    'uuid': 'd573ac01-3c42-42ec-890c-4b0222780875',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'YOSPRALA COMPONENT ASPIRIN',
                    'type': 'bn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '745256bc-b919-4ff3-b3f2-e6ff4c6c7e77'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(d573ac01-3c42-42ec-890c-4b0222780875)?view=full'
                },
                {
                    'uuid': 'd7aa7807-2bdb-443d-bfc0-d04b14ee35f3',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ORPHENGESIC FORTE COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(d7aa7807-2bdb-443d-bfc0-d04b14ee35f3)?view=full'
                },
                {
                    'uuid': 'dbe5e546-0032-47ab-b364-b5f165b88731',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF Q-GESIC',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(dbe5e546-0032-47ab-b364-b5f165b88731)?view=full'
                },
                {
                    'uuid': 'dce81d96-2361-4335-9b6e-fc20ba102ade',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLICUM ACIDUM',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'dc38b753-2a77-4359-8b2f-d89f10cd7732',
                        'd80b788d-5afd-46c9-b8d8-5fad1dd7d946',
                        '7c51c2b1-c5f9-4c91-a806-69d7f24a4570'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(dce81d96-2361-4335-9b6e-fc20ba102ade)?view=full'
                },
                {
                    'uuid': 'dd744554-e6e1-485a-a6d0-def15acf9932',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF FIORINAL',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(dd744554-e6e1-485a-a6d0-def15acf9932)?view=full'
                },
                {
                    'uuid': 'e79cbb03-1e7c-4967-816d-6b9e9608bc12',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF ORPHENGESIC FORTE',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(e79cbb03-1e7c-4967-816d-6b9e9608bc12)?view=full'
                },
                {
                    'uuid': 'eebb1c08-cf62-450b-b5c6-e3aa24ee4de4',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF CLOPIDOGREL/ACETYLSALICYLIC ACID',
                    'type': 'bn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '5ec89d1e-64a6-4148-8801-b5c0b4ad39fa'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(eebb1c08-cf62-450b-b5c6-e3aa24ee4de4)?view=full'
                },
                {
                    'uuid': 'f2224172-9b8d-4a03-bdfd-49916546806c',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLIC ACID [INCI]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '18815669-0ccb-4d9f-b665-41bd6a024220'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(f2224172-9b8d-4a03-bdfd-49916546806c)?view=full'
                },
                {
                    'uuid': 'f7fa615e-43cd-4d6a-ab08-872dcab15553',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'DURLAZA',
                    'type': 'bn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '7da2f850-3e18-4d09-92c2-128028795de0'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(f7fa615e-43cd-4d6a-ab08-872dcab15553)?view=full'
                },
                {
                    'uuid': 'fb26bbaf-70b2-47ed-b2b5-f892793ae0ef',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'TALWIN COMPOUND COMPONENT ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(fb26bbaf-70b2-47ed-b2b5-f892793ae0ef)?view=full'
                },
                {
                    'uuid': 'fd712d79-a8ab-4341-aee7-244a01293773',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COMPONENT OF DARVON COMPOUND',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(fd712d79-a8ab-4341-aee7-244a01293773)?view=full'
                }
            ],
            'codes': [
                {
                    'uuid': '08f6f535-d27d-44d2-b50f-57d838de41c1',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'DRUG BANK',
                    'code': 'DB00945',
                    'type': 'PRIMARY',
                    'url': 'http://www.drugbank.ca/drugs/DB00945',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(08f6f535-d27d-44d2-b50f-57d838de41c1)?view=full'
                },
                {
                    'uuid': '0d10f32d-a67f-434b-9074-b3158112afad',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'CFR',
                    'code': '21 CFR 343.13',
                    'comments': 'PART 343 -- INTERNAL ANALGESIC, ANTIPYRETIC, AND ANTIRHEUMATIC DRUG PRODUCTS FOR OVER-THE-COUNTER HUMAN USE | Subpart B--Active Ingredients | Sec. 343.13 Rheumatologic active ingredients.',
                    'type': 'PRIMARY',
                    'url': 'http://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfCFR/CFRSearch.cfm?fr=343.13',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(0d10f32d-a67f-434b-9074-b3158112afad)?view=full'
                },
                {
                    'uuid': '0f4c868d-c8e4-462b-ab6a-6cd9dc5dd9a2',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'CFR',
                    'code': '21 CFR 343.12',
                    'comments': 'PART 343 -- INTERNAL ANALGESIC, ANTIPYRETIC, AND ANTIRHEUMATIC DRUG PRODUCTS FOR OVER-THE-COUNTER HUMAN USE | Subpart B--Active Ingredients | Sec. 343.12 Cardiovascular active ingredients.',
                    'type': 'PRIMARY',
                    'url': 'http://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfCFR/CFRSearch.cfm?fr=343.12',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(0f4c868d-c8e4-462b-ab6a-6cd9dc5dd9a2)?view=full'
                },
                {
                    'uuid': '155f7e8e-14f8-4352-ab80-f146f2f7ca36',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-VATC',
                    'code': 'QN02BA51',
                    'comments': 'VATC|ANALGESICS|OTHER ANALGESICS AND ANTIPYRETICS|Salicylic acid and derivatives|acetylsalicylic acid, combinations excl. psycholeptics',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atcvet/atcvet_index/?code=QN02BA51&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(155f7e8e-14f8-4352-ab80-f146f2f7ca36)?view=full'
                },
                {
                    'uuid': '17a4ac02-9c46-41b4-80c5-c544212cf562',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'MESH',
                    'code': 'D001241',
                    'type': 'PRIMARY',
                    'url': 'http://www.ncbi.nlm.nih.gov/mesh/68001241',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(17a4ac02-9c46-41b4-80c5-c544212cf562)?view=full'
                },
                {
                    'uuid': '1978181c-d544-4137-a5c4-f5fc6a6bdb50',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-ATC',
                    'code': 'C10BX01',
                    'comments': 'ATC|CARDIOVASCULAR SYSTEM|LIPID MODIFYING AGENTS|LIPID MODIFYING AGENTS, COMBINATIONS|HMG CoA reductase inhibitors, other combinations|simvastatin and acetylsalicylic acid',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atc_ddd_index/?code=C10BX01&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(1978181c-d544-4137-a5c4-f5fc6a6bdb50)?view=full'
                },
                {
                    'uuid': '1c7f6a62-8261-40c0-a9f6-d58260af2ffb',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-VATC',
                    'code': 'QB01AC56',
                    'comments': 'VATC|ANTITHROMBOTIC AGENTS|ANTITHROMBOTIC AGENTS|Platelet aggregation inhibitors, excl. heparin|acetylsalicylic acid and esomeprazole',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atcvet/atcvet_index/?code=QB01AC56&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(1c7f6a62-8261-40c0-a9f6-d58260af2ffb)?view=full'
                },
                {
                    'uuid': '20b69f52-03e9-48ff-97e7-f63572bd28b3',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'LIVERTOX',
                    'code': '68',
                    'comments': 'LiverTox |Analgesic|Mild-Moderate Pain|Salicylate',
                    'type': 'PRIMARY',
                    'url': 'https://livertox.nlm.nih.gov/Aspirin.htm',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(20b69f52-03e9-48ff-97e7-f63572bd28b3)?view=full'
                },
                {
                    'uuid': '257da66e-7b6f-4e9b-9f7d-ffe709a7423a',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-ATC',
                    'code': 'C10BX05',
                    'comments': 'ATC|CARDIOVASCULAR SYSTEM|LIPID MODIFYING AGENTS|LIPID MODIFYING AGENTS, COMBINATIONS|HMG CoA reductase inhibitors, other combinations|rosuvastatin and acetylsalicylic acid',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atc_ddd_index/?code=C10BX05&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(257da66e-7b6f-4e9b-9f7d-ffe709a7423a)?view=full'
                },
                {
                    'uuid': '2f6c5688-0631-4167-9a67-aa13398eae32',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-ATC',
                    'code': 'A01AD05',
                    'comments': 'ATC|ALIMENTARY TRACT AND METABOLISM|STOMATOLOGICAL PREPARATIONS|STOMATOLOGICAL PREPARATIONS|Other agents for local oral treatment|acetylsalicylic acid',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atc_ddd_index/?code=A01AD05&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(2f6c5688-0631-4167-9a67-aa13398eae32)?view=full'
                },
                {
                    'uuid': '3315fbe0-8a5e-476d-8f23-dca2d6087636',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-VATC',
                    'code': 'QM01BA03',
                    'comments': 'VATC|ANTIINFLAMMATORY AND ANTIRHEUMATIC PRODUCTS|ANTIINFLAMMATORY/ANTIRHEUMATIC AGENTS  IN  COMBINATION|Antiinflammatory/antirheumatic agents in combination with corticosteroids|acetylsalicylic acid and corticosteroids',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atcvet/atcvet_index/?code=QM01BA03&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(3315fbe0-8a5e-476d-8f23-dca2d6087636)?view=full'
                },
                {
                    'uuid': '334ec2ad-8a9b-46fb-86ff-61dd6dbe933d',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'EMA ASSESSMENT REPORTS',
                    'code': 'DUOCOVER (AUTHORIZED: MYOCARDIAL INFARCTION)',
                    'comments': 'EMA EPAR |DISEASES |CARDIOVASCULAR DISEASES |HEART DISEASES |MYOCARDIAL ISCHEMIA |MYOCARDIAL INFARCTION',
                    'type': 'PRIMARY',
                    'url': 'http://www.ema.europa.eu/ema/index.jsp?curl=pages/medicines/human/medicines/001144/human_med_001326.jsp&mid=WC0b01ac058001d124',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(334ec2ad-8a9b-46fb-86ff-61dd6dbe933d)?view=full'
                },
                {
                    'uuid': '349982d5-bb5d-4ccf-9744-45a5b2c8775b',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-ATC',
                    'code': 'M01BA03',
                    'comments': 'ATC|MUSCULO-SKELETAL SYSTEM|ANTIINFLAMMATORY AND ANTIRHEUMATIC PRODUCTS|ANTIINFLAMMATORY/ANTIRHEUMATIC AGENTS IN COMBINATION|Antiinflammatory/antirheumatic agents in combination with corticosteroids|acetylsalicylic acid and corticosteroids',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atc_ddd_index/?code=M01BA03&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(349982d5-bb5d-4ccf-9744-45a5b2c8775b)?view=full'
                },
                {
                    'uuid': '3fe6c6c9-4e95-4e3e-96fe-761412753c28',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-ATC',
                    'code': 'C10BX04',
                    'comments': 'ATC|CARDIOVASCULAR SYSTEM|LIPID MODIFYING AGENTS|LIPID MODIFYING AGENTS, COMBINATIONS|HMG CoA reductase inhibitors, other combinations|simvastatin, acetylsalicylic acid and ramipril',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atc_ddd_index/?code=C10BX04&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(3fe6c6c9-4e95-4e3e-96fe-761412753c28)?view=full'
                },
                {
                    'uuid': '43b256e7-398c-431d-9093-b2a7492b5619',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'EMA ASSESSMENT REPORTS',
                    'code': 'CLOPIDOGREL/ACETYLSALICYLIC ACID (AUTHORIZED: ACUTE CORONARY SYNDROME)',
                    'comments': 'EMA EPAR |DISEASES |CARDIOVASCULAR DISEASES |HEART DISEASES |MYOCARDIAL ISCHEMIA |ACUTE CORONARY SYNDROME',
                    'type': 'PRIMARY',
                    'url': 'http://www.ema.europa.eu/ema/index.jsp?curl=pages/medicines/human/medicines/002272/human_med_001791.jsp&mid=WC0b01ac058001d124',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(43b256e7-398c-431d-9093-b2a7492b5619)?view=full'
                },
                {
                    'uuid': '46992b86-c864-4ffe-a68b-c243cf5d60c5',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'EMA ASSESSMENT REPORTS',
                    'code': 'CLOPIDOGREL/ACETYLSALICYCLIC ACID (AUTHORIZED: MYOCARDIAL INFARCTION)',
                    'comments': 'EMA EPAR |DISEASES |CARDIOVASCULAR DISEASES |HEART DISEASES |MYOCARDIAL ISCHEMIA |MYOCARDIAL INFARCTION',
                    'type': 'PRIMARY',
                    'url': 'http://www.ema.europa.eu/ema/index.jsp?curl=pages/medicines/human/medicines/002272/human_med_001791.jsp&mid=WC0b01ac058001d124',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(46992b86-c864-4ffe-a68b-c243cf5d60c5)?view=full'
                },
                {
                    'uuid': '4b926c35-37e2-4c37-83a8-cd00f5297d83',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'ECHA (EC/EINECS)',
                    'code': '200-064-1',
                    'type': 'PRIMARY',
                    'url': 'https://echa.europa.eu/substance-information/-/substanceinfo/100.000.059',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(4b926c35-37e2-4c37-83a8-cd00f5297d83)?view=full'
                },
                {
                    'uuid': '51371efd-4172-480a-8db4-c3d38063957e',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-VATC',
                    'code': 'QN02BA71',
                    'comments': 'VATC|ANALGESICS|OTHER ANALGESICS AND ANTIPYRETICS|Salicylic acid and derivatives|acetylsalicylic acid, combinations with psycholeptics',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atcvet/atcvet_index/?code=QN02BA71&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(51371efd-4172-480a-8db4-c3d38063957e)?view=full'
                },
                {
                    'uuid': '51e4a060-1493-4555-a282-045dd71a6f68',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'PUBCHEM',
                    'code': '2244',
                    'type': 'PRIMARY',
                    'url': 'https://pubchem.ncbi.nlm.nih.gov/compound/2244',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(51e4a060-1493-4555-a282-045dd71a6f68)?view=full'
                },
                {
                    'uuid': '54df5748-2c03-4fff-a5a7-28a7b8734a9f',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-VATC',
                    'code': 'QB01AC06',
                    'comments': 'VATC|ANTITHROMBOTIC AGENTS|ANTITHROMBOTIC AGENTS|Platelet aggregation inhibitors, excl. heparin|acetylsalicylic acid',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atcvet/atcvet_index/?code=QB01AC06&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(54df5748-2c03-4fff-a5a7-28a7b8734a9f)?view=full'
                },
                {
                    'uuid': '583dca07-b3b1-4376-a8b1-c81e2eb04502',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'EMA ASSESSMENT REPORTS',
                    'code': 'DUOPLAVIN (AUTHORIZED: ACUTE CORONARY SYNDROME)',
                    'comments': 'EMA EPAR |DISEASES |CARDIOVASCULAR DISEASES |HEART DISEASES |MYOCARDIAL ISCHEMIA |ACUTE CORONARY SYNDROME',
                    'type': 'PRIMARY',
                    'url': 'http://www.ema.europa.eu/ema/index.jsp?curl=pages/medicines/human/medicines/001143/human_med_001325.jsp&mid=WC0b01ac058001d124',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(583dca07-b3b1-4376-a8b1-c81e2eb04502)?view=full'
                },
                {
                    'uuid': '596d82dc-decd-4650-b4bb-5cf30c656263',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-VATC',
                    'code': 'QC10BX05',
                    'comments': 'VATC|LIPID MODIFYING AGENTS|LIPID MODIFYING AGENTS, COMBINATIONS|HMG CoA reductase inhibitors, other combinations|rosuvastatin and acetylsalicylic acid',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atcvet/atcvet_index/?code=QC10BX05&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(596d82dc-decd-4650-b4bb-5cf30c656263)?view=full'
                },
                {
                    'uuid': '5d8a303b-b967-4b0d-b472-d5c5c1314c65',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'NDF-RT',
                    'code': 'N0000008836',
                    'comments': 'Physiological Effects [PE]|Generalized Systemic Effects [PE]|Immunologic Activity Alteration [PE]|Immunologically Active Molecule Production Alteration [PE]|Decreased Immunologically Active Molecule Production [PE]|Decreased Lipid Derived Immunologically Active Molecule Production [PE]|Decreased Eicosanoid Production [PE]|Decreased Prostaglandin Production [PE]',
                    'type': 'PRIMARY',
                    'url': 'https://nciterms.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=VA_NDFRT&code=N0000008836',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(5d8a303b-b967-4b0d-b472-d5c5c1314c65)?view=full'
                },
                {
                    'uuid': '640b0e93-2e7b-441d-8d64-4fd3fddb44e8',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'NDF-RT',
                    'code': 'N0000000160',
                    'comments': 'Cellular or Molecular Interactions [MoA]|Enzyme Interactions [MoA]|Enzyme Inhibitors [MoA]|Cyclooxygenase Inhibitors [MoA]',
                    'type': 'PRIMARY',
                    'url': 'https://nciterms.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=VA_NDFRT&code=N0000000160',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(640b0e93-2e7b-441d-8d64-4fd3fddb44e8)?view=full'
                },
                {
                    'uuid': '64e846a8-649d-439b-8edd-cc9f2a8f1d9a',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'EMA ASSESSMENT REPORTS',
                    'code': 'DUOPLAVIN (AUTHORIZED: MYOCARDIAL INFARCTION)',
                    'comments': 'EMA EPAR |DISEASES |CARDIOVASCULAR DISEASES |HEART DISEASES |MYOCARDIAL ISCHEMIA |MYOCARDIAL INFARCTION',
                    'type': 'PRIMARY',
                    'url': 'http://www.ema.europa.eu/ema/index.jsp?curl=pages/medicines/human/medicines/001143/human_med_001325.jsp&mid=WC0b01ac058001d124',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(64e846a8-649d-439b-8edd-cc9f2a8f1d9a)?view=full'
                },
                {
                    'uuid': '65dbf325-c6ec-4f5b-9ebd-b4bb22e0421b',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-ESSENTIAL MEDICINES LIST',
                    'code': '12.5',
                    'comments': 'WHO ESSENTIAL MEDICINES LIST| Cardiovascular medicines| Antithrombotic medicines',
                    'type': 'PRIMARY',
                    'url': 'http://prais.paho.org/medicine/19/?section=95#type63',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(65dbf325-c6ec-4f5b-9ebd-b4bb22e0421b)?view=full'
                },
                {
                    'uuid': '67de1aa0-d6b1-4fed-bf1f-9bfaafd0b76c',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'NDF-RT',
                    'code': 'N0000008836',
                    'comments': 'Physiological Effects [PE]|Generalized Systemic Effects [PE]|Immunologic Activity Alteration [PE]|Decreased Immunologic Activity [PE]|Decreased Immunologically Active Molecule Production [PE]|Decreased Lipid Derived Immunologically Active Molecule Production [PE]|Decreased Eicosanoid Production [PE]|Decreased Prostaglandin Production [PE]',
                    'type': 'PRIMARY',
                    'url': 'https://nciterms.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=VA_NDFRT&code=N0000008836',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(67de1aa0-d6b1-4fed-bf1f-9bfaafd0b76c)?view=full'
                },
                {
                    'uuid': '77febc39-7d32-42f3-a4fe-83a159ff5076',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'NCI_THESAURUS',
                    'code': 'C287',
                    'type': 'PRIMARY',
                    'url': 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=15.09d&ns=NCI_Thesaurus&code=C287',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(77febc39-7d32-42f3-a4fe-83a159ff5076)?view=full'
                },
                {
                    'uuid': '84d166cb-5654-403a-8a70-0a722a7b9803',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-ATC',
                    'code': 'N02BA71',
                    'comments': 'ATC|NERVOUS SYSTEM|ANALGESICS|OTHER ANALGESICS AND ANTIPYRETICS|Salicylic acid and derivatives|acetylsalicylic acid, combinations with psycholeptics',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atc_ddd_index/?code=N02BA71&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(84d166cb-5654-403a-8a70-0a722a7b9803)?view=full'
                },
                {
                    'uuid': '86021902-3725-4588-a490-6b3102b720fc',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-ATC',
                    'code': 'N02BA01',
                    'comments': 'ATC|NERVOUS SYSTEM|ANALGESICS|OTHER ANALGESICS AND ANTIPYRETICS|Salicylic acid and derivatives|acetylsalicylic acid',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atc_ddd_index/?code=N02BA01&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(86021902-3725-4588-a490-6b3102b720fc)?view=full'
                },
                {
                    'uuid': '877f7c9b-dd41-0d52-7456-84075af12807',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'LactMed',
                    'code': '50-78-2',
                    'type': 'PRIMARY',
                    'url': 'https://toxnet.nlm.nih.gov/cgi-bin/sis/search/r?dbs+lactmed:@term+@rel+@rn+50-78-2',
                    'references': [
                        '4b57ca01-374d-6da4-8084-8b29c1a1db30'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(877f7c9b-dd41-0d52-7456-84075af12807)?view=full'
                },
                {
                    'uuid': '8d1ae41f-8b5e-b96c-e8ae-b921a9facb2d',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'HSDB',
                    'code': '50-78-2',
                    'type': 'PRIMARY',
                    'url': 'https://toxnet.nlm.nih.gov/cgi-bin/sis/search2/r?dbs+hsdb:@term+@rn+@rel+50-78-2',
                    'references': [
                        'f823da75-6cf7-9b20-ab9f-21969eb0691d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(8d1ae41f-8b5e-b96c-e8ae-b921a9facb2d)?view=full'
                },
                {
                    'uuid': '9b238332-910a-4291-b9bf-a66aa079099b',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'RXCUI',
                    'code': '1191',
                    'type': 'PRIMARY',
                    'url': 'https://rxnav.nlm.nih.gov/REST/rxcui/1191/allProperties.xml?prop=all',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(9b238332-910a-4291-b9bf-a66aa079099b)?view=full'
                },
                {
                    'uuid': '9b2902d3-db93-4121-9bf7-7c5f18c9d8e5',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-VATC',
                    'code': 'QC10BX02',
                    'comments': 'VATC|LIPID MODIFYING AGENTS|LIPID MODIFYING AGENTS, COMBINATIONS|HMG CoA reductase inhibitors, other combinations|pravastatin and acetylsalicylic acid',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atcvet/atcvet_index/?code=QC10BX02&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(9b2902d3-db93-4121-9bf7-7c5f18c9d8e5)?view=full'
                },
                {
                    'uuid': '9ecfcafa-8aef-49a9-b21b-5a0f94866669',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'CAS',
                    'code': '50-78-2',
                    'type': 'PRIMARY',
                    'url': 'http://chem.sis.nlm.nih.gov/chemidplus/direct.jsp?regno=50-78-2&result=advanced',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(9ecfcafa-8aef-49a9-b21b-5a0f94866669)?view=full'
                },
                {
                    'uuid': 'a1c175d5-d0d7-4495-9c2f-46b5b84468ed',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'RXCUI',
                    'code': '91101',
                    'type': 'ALTERNATIVE',
                    'url': 'https://rxnav.nlm.nih.gov/REST/rxcui/91101/allProperties.xml?prop=all',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(a1c175d5-d0d7-4495-9c2f-46b5b84468ed)?view=full'
                },
                {
                    'uuid': 'a3a68501-19c9-4d1a-93a3-06f5c617ffd6',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-ATC',
                    'code': 'C10BX08',
                    'comments': 'ATC|CARDIOVASCULAR SYSTEM|LIPID MODIFYING AGENTS|LIPID MODIFYING AGENTS, COMBINATIONS|HMG CoA reductase inhibitors, other combinations|atorvastatin and acetylsalicylic acid',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atc_ddd_index/?code=C10BX08&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(a3a68501-19c9-4d1a-93a3-06f5c617ffd6)?view=full'
                },
                {
                    'uuid': 'aad35419-e7a5-4c7b-9519-85d1632c7dcf',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'NDF-RT',
                    'code': 'N0000175722',
                    'comments': 'Established Pharmacologic Class [EPC]|Nonsteroidal Anti-inflammatory Drug [EPC]',
                    'type': 'PRIMARY',
                    'url': 'https://nciterms.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=VA_NDFRT&code=N0000175722',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(aad35419-e7a5-4c7b-9519-85d1632c7dcf)?view=full'
                },
                {
                    'uuid': 'ae0ed312-d3fe-4cea-baf1-c549f7bda5c0',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'EVMPD',
                    'code': 'SUB12730MIG',
                    'type': 'PRIMARY',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(ae0ed312-d3fe-4cea-baf1-c549f7bda5c0)?view=full'
                },
                {
                    'uuid': 'ae21596a-bf48-45db-a0fa-d16907583cf6',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'MERCK INDEX',
                    'code': 'M2111',
                    'comments': 'Merck Index',
                    'type': 'PRIMARY',
                    'url': 'https://www.rsc.org/Merck-Index/monograph/M2111?q=authorize',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(ae21596a-bf48-45db-a0fa-d16907583cf6)?view=full'
                },
                {
                    'uuid': 'af9e4eff-197c-4533-afb5-a07f73b64277',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'CFR',
                    'code': '21 CFR 520.1409',
                    'comments': 'SUBCHAPTER E--ANIMAL DRUGS, FEEDS, AND RELATED PRODUCTS | PART 520 ORAL DOSAGE FORM NEW ANIMAL DRUGS |Sec. 520.1409 Methylprednisolone and aspirin.',
                    'type': 'PRIMARY',
                    'url': 'http://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfcfr/CFRSearch.cfm?fr=520.1409',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(af9e4eff-197c-4533-afb5-a07f73b64277)?view=full'
                },
                {
                    'uuid': 'b4928ada-9c88-42a6-bd09-b680c20c1c66',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-ATC',
                    'code': 'B01AC08',
                    'comments': 'ATC|BLOOD AND BLOOD FORMING ORGANS|ANTITHROMBOTIC AGENTS|ANTITHROMBOTIC AGENTS|Platelet aggregation inhibitors excl. heparin|carbasalate calcium',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atc_ddd_index/?code=B01AC08&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(b4928ada-9c88-42a6-bd09-b680c20c1c66)?view=full'
                },
                {
                    'uuid': 'b6e86d65-10af-4d6f-9fb5-6a699e2486cc',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'IUPHAR',
                    'code': '4139',
                    'type': 'PRIMARY',
                    'url': 'http://www.guidetopharmacology.org/GRAC/LigandDisplayForward?ligandId=4139',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(b6e86d65-10af-4d6f-9fb5-6a699e2486cc)?view=full'
                },
                {
                    'uuid': 'c244f724-f6d9-47ef-b9dd-053ba4241151',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-ATC',
                    'code': 'B01AC56',
                    'comments': 'ATC|BLOOD AND BLOOD FORMING ORGANS|ANTITHROMBOTIC AGENTS|ANTITHROMBOTIC AGENTS|Platelet aggregation inhibitors excl. heparin|acetylsalicylic acid and esomeprazole',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atc_ddd_index/?code=B01AC56&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(c244f724-f6d9-47ef-b9dd-053ba4241151)?view=full'
                },
                {
                    'uuid': 'c314d9f9-028a-4318-9215-95d1f4315553',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-ATC',
                    'code': 'N02BA51',
                    'comments': 'ATC|NERVOUS SYSTEM|ANALGESICS|OTHER ANALGESICS AND ANTIPYRETICS|Salicylic acid and derivatives|acetylsalicylic acid, combinations excl. psycholeptics',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atc_ddd_index/?code=N02BA51&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(c314d9f9-028a-4318-9215-95d1f4315553)?view=full'
                },
                {
                    'uuid': 'c4023b6e-0ce7-4b88-8edb-f0098d7496a1',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-ATC',
                    'code': 'B01AC06',
                    'comments': 'ATC|BLOOD AND BLOOD FORMING ORGANS|ANTITHROMBOTIC AGENTS|ANTITHROMBOTIC AGENTS|Platelet aggregation inhibitors excl. heparin|acetylsalicylic acid',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atc_ddd_index/?code=B01AC06&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(c4023b6e-0ce7-4b88-8edb-f0098d7496a1)?view=full'
                },
                {
                    'uuid': 'c5b01253-82f7-4efb-953e-96e74b3092b1',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WIKIPEDIA',
                    'code': 'ASPIRIN',
                    'type': 'PRIMARY',
                    'url': 'https://en.wikipedia.org/wiki/Aspirin',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(c5b01253-82f7-4efb-953e-96e74b3092b1)?view=full'
                },
                {
                    'uuid': 'c6179f86-7237-40fa-8ae9-5071eb1b38ea',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-ATC',
                    'code': 'C10BX06',
                    'comments': 'ATC|CARDIOVASCULAR SYSTEM|LIPID MODIFYING AGENTS|LIPID MODIFYING AGENTS, COMBINATIONS|HMG CoA reductase inhibitors, other combinations|atorvastatin, acetylsalicylic acid and ramipril',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atc_ddd_index/?code=C10BX06&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(c6179f86-7237-40fa-8ae9-5071eb1b38ea)?view=full'
                },
                {
                    'uuid': 'c66ade9d-63da-479d-bd28-851e134cfea2',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO INTERNATIONAL PHARMACOPEIA',
                    'code': 'ASPIRIN',
                    'comments': 'Description: Colourless crystals or a white, crystalline powder; odourless or almost odourless. Solubility: Soluble in about 300 parts of water; freely soluble in ethanol (~750 g/l) TS; soluble in ether R. Category: Analgesic; antipyretic. Storage: Acetylsalicylic acid should be kept in a tightly closed container, protected from light. Additional information: Even in the absence of light, Acetylsalicylic acid is gradually degraded on exposure to a humid atmosphere, the decomposition being faster at higher temperatures. Definition: Acetylsalicylic acid contains not less than 99.0% and not more than 100.5% of C9H8O4, calculated with reference to the dried substance.',
                    'type': 'PRIMARY',
                    'url': 'http://apps.who.int/phint/pdf/b/Jb.6.1.5.pdf',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(c66ade9d-63da-479d-bd28-851e134cfea2)?view=full'
                },
                {
                    'uuid': 'c77ffa10-9381-40f9-8662-aa97c23dd15b',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-ATC',
                    'code': 'N02BA15',
                    'comments': 'ATC|NERVOUS SYSTEM|ANALGESICS|OTHER ANALGESICS AND ANTIPYRETICS|Salicylic acid and derivatives|carbasalate calcium',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atc_ddd_index/?code=N02BA15&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(c77ffa10-9381-40f9-8662-aa97c23dd15b)?view=full'
                },
                {
                    'uuid': 'ca1296f1-ca2e-4244-afa0-1992b44fce06',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-VATC',
                    'code': 'QA01AD05',
                    'comments': 'VATC|STOMATOLOGICAL PREPARATIONS|STOMATOLOGICAL PREPARATIONS|Other agents for local oral treatment|acetylsalicylic acid',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atcvet/atcvet_index/?code=QA01AD05&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(ca1296f1-ca2e-4244-afa0-1992b44fce06)?view=full'
                },
                {
                    'uuid': 'cd85d503-08e6-4429-8acf-45aad4bfc034',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-ATC',
                    'code': 'C10BX02',
                    'comments': 'ATC|CARDIOVASCULAR SYSTEM|LIPID MODIFYING AGENTS|LIPID MODIFYING AGENTS, COMBINATIONS|HMG CoA reductase inhibitors, other combinations|pravastatin and acetylsalicylic acid',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atc_ddd_index/?code=C10BX02&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(cd85d503-08e6-4429-8acf-45aad4bfc034)?view=full'
                },
                {
                    'uuid': 'd2efd642-0b04-4b3b-abd2-349baabd2dd3',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'NDF-RT',
                    'code': 'N0000175721',
                    'comments': 'Chemical Ingredients [Chemical/Ingredient]|Chemical Classes for Pharmacologic Classification [Chemical/Ingredient]|Nonsteroidal Anti-inflammatory Compounds [Chemical/Ingredient]',
                    'type': 'PRIMARY',
                    'url': 'https://nciterms.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=VA_NDFRT&code=N0000175721',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(d2efd642-0b04-4b3b-abd2-349baabd2dd3)?view=full'
                },
                {
                    'uuid': 'd9bc0bf7-478d-4dd0-8f91-cb1f0bb9ed22',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-VATC',
                    'code': 'QC10BX01',
                    'comments': 'VATC|LIPID MODIFYING AGENTS|LIPID MODIFYING AGENTS, COMBINATIONS|HMG CoA reductase inhibitors, other combinations|simvastatin and acetylsalicylic acid',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atcvet/atcvet_index/?code=QC10BX01&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(d9bc0bf7-478d-4dd0-8f91-cb1f0bb9ed22)?view=full'
                },
                {
                    'uuid': 'dfe6ccb0-a72e-4312-8860-c714a699fd44',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'EPA PESTICIDE CODE',
                    'code': '129061',
                    'comments': 'EPA PESTICIDE |CONVENTIONAL CHEMICAL',
                    'type': 'PRIMARY',
                    'url': 'http://iaspub.epa.gov/apex/pesticides/f?p=CHEMICALSEARCH:3:0::NO:21,3,31,7,12,25:P3_XCHEMICAL_ID:1031',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(dfe6ccb0-a72e-4312-8860-c714a699fd44)?view=full'
                },
                {
                    'uuid': 'e2d2afa9-e9f8-4c2a-b5b7-4dd724f5bbbb',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-ESSENTIAL MEDICINES LIST',
                    'code': '7.1',
                    'comments': 'WHO ESSENTIAL MEDICINES LIST| Antimigraine medicines| For treatment of acute attack ',
                    'type': 'PRIMARY',
                    'url': 'http://prais.paho.org/medicine/19/?section=75#type62',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(e2d2afa9-e9f8-4c2a-b5b7-4dd724f5bbbb)?view=full'
                },
                {
                    'uuid': 'e3c53aa7-652e-4097-9b87-10738d65fdc2',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'ChEMBL',
                    'code': 'CHEMBL25',
                    'type': 'PRIMARY',
                    'url': 'https://www.ebi.ac.uk/chembl/compound/inspect/CHEMBL25',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(e3c53aa7-652e-4097-9b87-10738d65fdc2)?view=full'
                },
                {
                    'uuid': 'e4bee99b-9fbe-1a7a-1fec-dfc6f526914a',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'EPA CompTox',
                    'code': '50-78-2',
                    'type': 'PRIMARY',
                    'url': 'https://comptox.epa.gov/dashboard/dsstoxdb/results?utf8=%E2%9C%93&search=50-78-2',
                    'references': [
                        'e42d822d-ae63-de9f-7e90-372c4646c77d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(e4bee99b-9fbe-1a7a-1fec-dfc6f526914a)?view=full'
                },
                {
                    'uuid': 'e6439cbf-f144-411b-b95f-13943ab250d6',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-ESSENTIAL MEDICINES LIST',
                    'code': '2.1',
                    'comments': 'WHO ESSENTIAL MEDICINES LIST| Analgesics, antipyretics, non-steroidal anti-inflammatory medicines (NSAIMs), medicines used to treat gout and disease modifying agents in rheumatoid disorders (DMARDs)| Non-opioids and non-steroidal anti-inflammatory medicines (NSAIMs)',
                    'type': 'PRIMARY',
                    'url': 'http://prais.paho.org/medicine/19/?section=34#type60',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(e6439cbf-f144-411b-b95f-13943ab250d6)?view=full'
                },
                {
                    'uuid': 'f0f598e0-9429-4110-a46e-c60cd1f1abd7',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-VATC',
                    'code': 'QN02BA01',
                    'comments': 'VATC|ANALGESICS|OTHER ANALGESICS AND ANTIPYRETICS|Salicylic acid and derivatives|acetylsalicylic acid',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atcvet/atcvet_index/?code=QN02BA01&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(f0f598e0-9429-4110-a46e-c60cd1f1abd7)?view=full'
                },
                {
                    'uuid': 'f4a078e7-240d-49d3-b4bd-ce3ac294fff1',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'EMA ASSESSMENT REPORTS',
                    'code': 'DUOCOVER (AUTHORIZED: ACUTE CORONARY SYNDROME)',
                    'comments': 'EMA EPAR |DISEASES |CARDIOVASCULAR DISEASES |HEART DISEASES |MYOCARDIAL ISCHEMIA |ACUTE CORONARY SYNDROME',
                    'type': 'PRIMARY',
                    'url': 'http://www.ema.europa.eu/ema/index.jsp?curl=pages/medicines/human/medicines/001144/human_med_001326.jsp&mid=WC0b01ac058001d124',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(f4a078e7-240d-49d3-b4bd-ce3ac294fff1)?view=full'
                },
                {
                    'uuid': 'f63cb1da-10cd-4fac-989f-584013b9ed6d',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-VATC',
                    'code': 'QC10BX04',
                    'comments': 'VATC|LIPID MODIFYING AGENTS|LIPID MODIFYING AGENTS, COMBINATIONS|HMG CoA reductase inhibitors, other combinations|simvastatin, acetylsalicylic acid and ramipril',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atcvet/atcvet_index/?code=QC10BX04&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(f63cb1da-10cd-4fac-989f-584013b9ed6d)?view=full'
                },
                {
                    'uuid': 'fdd3288a-4b3f-4bba-a6c8-d840402ee145',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'WHO-ATC',
                    'code': 'N02BA65',
                    'comments': 'ATC|NERVOUS SYSTEM|ANALGESICS|OTHER ANALGESICS AND ANTIPYRETICS|Salicylic acid and derivatives|carbasalate calcium combinations excl. psycholeptics',
                    'type': 'PRIMARY',
                    'url': 'http://www.whocc.no/atc_ddd_index/?code=N02BA65&showdescription=yes',
                    'references': [
                        '7fe598a7-d0bd-4eb6-8427-6742e7156e05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(fdd3288a-4b3f-4bba-a6c8-d840402ee145)?view=full'
                }
            ],
            'notes': [
                {
                    'uuid': '4cfbab57-a38b-403d-bcc6-562cd3527c38',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Code \'N0000000160\'[NDF-RT] collides (possible duplicate) with existing code & codeSystem for substance:\n[XXE1CET956]INDOMETHACIN',
                    'references': [
                        'a8741bd5-df1a-4c0f-997b-2c43a020f6fe'
                    ],
                    'access': [
                        'admin'
                    ]
                },
                {
                    'uuid': '52b36f99-4c2c-4a7e-9c38-de40363e41bb',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Code \'QC10BX04\'[WHO-VATC] collides (possible duplicate) with existing code & codeSystem for substance:\n[L35JN3I7SJ]RAMIPRIL',
                    'references': [
                        'a8741bd5-df1a-4c0f-997b-2c43a020f6fe'
                    ],
                    'access': [
                        'admin'
                    ]
                },
                {
                    'uuid': '574da558-2eb1-41db-b22a-a9a47d6e167b',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Code \'C10BX02\'[WHO-ATC] collides (possible duplicate) with existing code & codeSystem for substance:\n[KXO2KT9N0G]PRAVASTATIN',
                    'references': [
                        'a8741bd5-df1a-4c0f-997b-2c43a020f6fe'
                    ],
                    'access': [
                        'admin'
                    ]
                },
                {
                    'uuid': '576b8c45-81d5-4f6a-aafb-936a07bfefbd',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Code \'QC10BX01\'[WHO-VATC] collides (possible duplicate) with existing code & codeSystem for substance:\n[AGG2FN16EV]SIMVASTATIN',
                    'references': [
                        'a8741bd5-df1a-4c0f-997b-2c43a020f6fe'
                    ],
                    'access': [
                        'admin'
                    ]
                },
                {
                    'uuid': '60f3c0b9-8f6c-4d2d-8aee-e1fe8ff9537e',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Code \'DUOCOVER (AUTHORIZED: MYOCARDIAL INFARCTION)\'[EMA ASSESSMENT REPORTS] collides (possible duplicate) with existing code & codeSystem for substance:\n[08I79HTP27]CLOPIDOGREL BISULFATE',
                    'references': [
                        'a8741bd5-df1a-4c0f-997b-2c43a020f6fe'
                    ],
                    'access': [
                        'admin'
                    ]
                },
                {
                    'uuid': '6126c9a7-f1dc-4139-9df8-bec70aa2c801',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Code \'B01AC56\'[WHO-ATC] collides (possible duplicate) with existing code & codeSystem for substance:\n[N3PA6559FT]ESOMEPRAZOLE',
                    'references': [
                        'a8741bd5-df1a-4c0f-997b-2c43a020f6fe'
                    ],
                    'access': [
                        'admin'
                    ]
                },
                {
                    'uuid': '62c0f2c9-53c0-4d6e-909e-2933b5acba0d',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Code \'N0000175722\'[NDF-RT] collides (possible duplicate) with existing code & codeSystem for substance:\n[7C546U4DEN]DIFLUNISAL',
                    'references': [
                        'a8741bd5-df1a-4c0f-997b-2c43a020f6fe'
                    ],
                    'access': [
                        'admin'
                    ]
                },
                {
                    'uuid': '7b1127bb-a26b-49c9-af68-bec2377adebd',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Code \'DUOPLAVIN (AUTHORIZED: ACUTE CORONARY SYNDROME)\'[EMA ASSESSMENT REPORTS] collides (possible duplicate) with existing code & codeSystem for substance:\n[08I79HTP27]CLOPIDOGREL BISULFATE',
                    'references': [
                        'a8741bd5-df1a-4c0f-997b-2c43a020f6fe'
                    ],
                    'access': [
                        'admin'
                    ]
                },
                {
                    'uuid': '8b6989af-ee99-4a16-9617-1448064cdef8',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Code \'7.1\'[WHO-ESSENTIAL MEDICINES LIST] collides (possible duplicate) with existing code & codeSystem for substance:\n[WK2XYI10QM]IBUPROFEN',
                    'references': [
                        'a8741bd5-df1a-4c0f-997b-2c43a020f6fe'
                    ],
                    'access': [
                        'admin'
                    ]
                },
                {
                    'uuid': '8ce12652-5c94-4c3a-ad81-087863fcf3ae',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Code \'2.1\'[WHO-ESSENTIAL MEDICINES LIST] collides (possible duplicate) with existing code & codeSystem for substance:\n[WK2XYI10QM]IBUPROFEN',
                    'references': [
                        'a8741bd5-df1a-4c0f-997b-2c43a020f6fe'
                    ],
                    'access': [
                        'admin'
                    ]
                },
                {
                    'uuid': 'b97b35b1-a460-4667-a643-df776b8f0dbd',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Code \'DUOCOVER (AUTHORIZED: ACUTE CORONARY SYNDROME)\'[EMA ASSESSMENT REPORTS] collides (possible duplicate) with existing code & codeSystem for substance:\n[08I79HTP27]CLOPIDOGREL BISULFATE',
                    'references': [
                        'a8741bd5-df1a-4c0f-997b-2c43a020f6fe'
                    ],
                    'access': [
                        'admin'
                    ]
                },
                {
                    'uuid': 'ba79c50c-a03d-4a04-b5b8-34ae9acb7d65',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Code \'QC10BX02\'[WHO-VATC] collides (possible duplicate) with existing code & codeSystem for substance:\n[KXO2KT9N0G]PRAVASTATIN',
                    'references': [
                        'a8741bd5-df1a-4c0f-997b-2c43a020f6fe'
                    ],
                    'access': [
                        'admin'
                    ]
                },
                {
                    'uuid': 'bde9748f-fdbb-4df8-8345-48d75a919e04',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Code \'DUOPLAVIN (AUTHORIZED: MYOCARDIAL INFARCTION)\'[EMA ASSESSMENT REPORTS] collides (possible duplicate) with existing code & codeSystem for substance:\n[08I79HTP27]CLOPIDOGREL BISULFATE',
                    'references': [
                        'a8741bd5-df1a-4c0f-997b-2c43a020f6fe'
                    ],
                    'access': [
                        'admin'
                    ]
                },
                {
                    'uuid': 'c2731255-472f-4238-b39b-471a84400367',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Code \'C10BX04\'[WHO-ATC] collides (possible duplicate) with existing code & codeSystem for substance:\n[AGG2FN16EV]SIMVASTATIN',
                    'references': [
                        'a8741bd5-df1a-4c0f-997b-2c43a020f6fe'
                    ],
                    'access': [
                        'admin'
                    ]
                },
                {
                    'uuid': 'c2c7d614-4a18-4972-a1cc-5edbba8c5aeb',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Code \'N0000175721\'[NDF-RT] collides (possible duplicate) with existing code & codeSystem for substance:\n[JCX84Q7J1L]CELECOXIB',
                    'references': [
                        'a8741bd5-df1a-4c0f-997b-2c43a020f6fe'
                    ],
                    'access': [
                        'admin'
                    ]
                },
                {
                    'uuid': 'd30cccf2-2428-4dbe-8147-95999be121fe',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Code \'QB01AC56\'[WHO-VATC] collides (possible duplicate) with existing code & codeSystem for substance:\n[N3PA6559FT]ESOMEPRAZOLE',
                    'references': [
                        'a8741bd5-df1a-4c0f-997b-2c43a020f6fe'
                    ],
                    'access': [
                        'admin'
                    ]
                },
                {
                    'uuid': 'd542ae9c-e1d4-456d-976a-037dae74833b',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Code \'C10BX06\'[WHO-ATC] collides (possible duplicate) with existing code & codeSystem for substance:\n[L35JN3I7SJ]RAMIPRIL',
                    'references': [
                        'a8741bd5-df1a-4c0f-997b-2c43a020f6fe'
                    ],
                    'access': [
                        'admin'
                    ]
                },
                {
                    'uuid': 'e4373275-c5e9-4c60-9043-1cd756382b42',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Code \'C10BX08\'[WHO-ATC] collides (possible duplicate) with existing code & codeSystem for substance:\n[A0JWA85V8F]ATORVASTATIN',
                    'references': [
                        'a8741bd5-df1a-4c0f-997b-2c43a020f6fe'
                    ],
                    'access': [
                        'admin'
                    ]
                },
                {
                    'uuid': 'ecc9097c-6015-48d8-83d5-9546c2062048',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Code \'C10BX01\'[WHO-ATC] collides (possible duplicate) with existing code & codeSystem for substance:\n[AGG2FN16EV]SIMVASTATIN',
                    'references': [
                        'a8741bd5-df1a-4c0f-997b-2c43a020f6fe'
                    ],
                    'access': [
                        'admin'
                    ]
                },
                {
                    'uuid': 'ee645dbd-fa0c-4481-bee3-6f3d4f9b27e4',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Structure has 1 possible duplicate:\n[XAN4V337CI]ASPIRIN LYSINE',
                    'references': [
                        'a8741bd5-df1a-4c0f-997b-2c43a020f6fe'
                    ],
                    'access': [
                        'admin'
                    ]
                }
            ],
            'properties': [],
            'relationships': [
                {
                    'uuid': '061f2321-16f5-4775-ba57-ffa028e65ad9',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'comments': 'IDENTIFIED AS IMPURITY E\nLimits: impurity E: not more than 1.5 times the area of the principal peak in the chromatogram obtained with reference solution (a) (0.15 per cent)Herbal Medicines 4th ED 2103',
                    'relatedSubstance': {
                        'uuid': '25d1c7e3-f0e7-49f2-8e37-7bbf71e5c6f6',
                        'created': 1520353318000,
                        'createdBy': 'admin',
                        'lastEdited': 1520353318000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'refPname': 'SALSALATE',
                        'refuuid': '4b40bd34-96c2-4b98-b9b9-5063d6397406',
                        'substanceClass': 'reference',
                        'approvalID': 'V9MO595C9I',
                        'linkingID': 'V9MO595C9I',
                        'name': 'SALSALATE',
                        'references': [],
                        'access': []
                    },
                    'originatorUuid': '061f2321-16f5-4775-ba57-ffa028e65ad9',
                    'type': 'IMPURITY->PARENT',
                    'references': [
                        'b95e2121-d89b-443a-b1c1-ec0ecb963705'
                    ],
                    'access': []
                },
                {
                    'uuid': '2d1f9be9-decf-4745-a86d-f23df91c32b3',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'comments': 'IDENTIFIED AS IMPURITY A\nLimits: impurity A: not more than 1.5 times the area of the principal peak in the chromatogram obtained with reference solution (a) (0.15 per cent)',
                    'relatedSubstance': {
                        'uuid': '81482302-f2bf-47f3-98d2-b4c61fed3205',
                        'created': 1520353318000,
                        'createdBy': 'admin',
                        'lastEdited': 1520353318000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'refPname': '4-HYDROXYBENZOIC ACID',
                        'refuuid': 'beb8e4b3-5011-4f42-9cce-271456343519',
                        'substanceClass': 'reference',
                        'approvalID': 'JG8Z55Y12H',
                        'linkingID': 'JG8Z55Y12H',
                        'name': '4-HYDROXYBENZOIC ACID',
                        'references': [],
                        'access': []
                    },
                    'originatorUuid': '2d1f9be9-decf-4745-a86d-f23df91c32b3',
                    'type': 'IMPURITY->PARENT',
                    'references': [
                        'b95e2121-d89b-443a-b1c1-ec0ecb963705'
                    ],
                    'access': []
                },
                {
                    'uuid': '37021f40-6758-40d1-84e6-722ef6197df0',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'comments': 'IDENTIFIED AS IMPURITY C\nLimits: impurity C: not more than 1.5 times the area of the principal peak in the chromatogram obtained with reference solution (a) (0.15 per cent)',
                    'relatedSubstance': {
                        'uuid': '252d7e9c-9f52-48c7-8577-c6868fad003c',
                        'created': 1520353318000,
                        'createdBy': 'admin',
                        'lastEdited': 1520353318000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'refPname': 'SALICYLIC ACID',
                        'refuuid': '77ecc185-155e-4f2d-8b74-81c91be840d2',
                        'substanceClass': 'reference',
                        'approvalID': 'O414PZ4LPZ',
                        'linkingID': 'O414PZ4LPZ',
                        'name': 'SALICYLIC ACID',
                        'references': [],
                        'access': []
                    },
                    'originatorUuid': '37021f40-6758-40d1-84e6-722ef6197df0',
                    'type': 'IMPURITY->PARENT',
                    'references': [
                        'b95e2121-d89b-443a-b1c1-ec0ecb963705'
                    ],
                    'access': []
                },
                {
                    'uuid': '386440ce-e3de-4a99-8dd4-55f7ab93be3d',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'amount': {
                        'uuid': '1f5b370b-a753-4f94-9df9-1f18009c7115',
                        'created': 1520353318000,
                        'createdBy': 'admin',
                        'lastEdited': 1520353318000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'type': 'RELATIONSHIP_AMOUNT',
                        'highLimit': 30.0,
                        'lowLimit': 5.0,
                        'references': [],
                        'access': []
                    },
                    'interactionType': 'MAJOR',
                    'qualification': 'URINE',
                    'relatedSubstance': {
                        'uuid': '63cabcf8-68fe-4275-b252-75fa992b59d0',
                        'created': 1520353318000,
                        'createdBy': 'admin',
                        'lastEdited': 1520353318000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'refPname': 'GENTISIC ACID',
                        'refuuid': 'b0201685-7e19-4c8a-a3cf-3e04505e02e5',
                        'substanceClass': 'reference',
                        'approvalID': 'VP36V95O3T',
                        'linkingID': 'VP36V95O3T',
                        'name': 'GENTISIC ACID',
                        'references': [],
                        'access': []
                    },
                    'originatorUuid': '386440ce-e3de-4a99-8dd4-55f7ab93be3d',
                    'type': 'METABOLITE->PARENT',
                    'references': [
                        '3b38330d-93b5-4c7c-bf99-1032b869c1db'
                    ],
                    'access': []
                },
                {
                    'uuid': '45c03733-34e4-441c-9785-3cccd0c876c0',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'amount': {
                        'uuid': '051a8cf2-62c6-4125-a99e-32e6af0971e7',
                        'created': 1520353318000,
                        'createdBy': 'admin',
                        'lastEdited': 1520353318000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'type': 'RELATIONSHIP_AMOUNT',
                        'highLimit': 10.0,
                        'lowLimit': 3.0,
                        'references': [],
                        'access': []
                    },
                    'interactionType': 'MINOR',
                    'qualification': 'URINE',
                    'relatedSubstance': {
                        'uuid': 'ed604ad8-9d93-477f-a645-16f35fa47058',
                        'created': 1520353318000,
                        'createdBy': 'admin',
                        'lastEdited': 1520353318000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'refPname': 'SALICYLIC ACID',
                        'refuuid': '77ecc185-155e-4f2d-8b74-81c91be840d2',
                        'substanceClass': 'reference',
                        'approvalID': 'O414PZ4LPZ',
                        'linkingID': 'O414PZ4LPZ',
                        'name': 'SALICYLIC ACID',
                        'references': [],
                        'access': []
                    },
                    'originatorUuid': '45c03733-34e4-441c-9785-3cccd0c876c0',
                    'type': 'METABOLITE ACTIVE->PARENT',
                    'references': [
                        'f99118ca-88f6-407e-83b0-90e5770b2c0a'
                    ],
                    'access': []
                },
                {
                    'uuid': '46728ac3-5398-432a-9136-b1adfdedf297',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'comments': 'Limits: impurity B: not more than 1.5 times the area of the principal peak in the chromatogram obtained with reference solution (a) (0.15 per cent)',
                    'relatedSubstance': {
                        'uuid': '7522b7d4-fdd0-4357-966e-7222e91c71b4',
                        'created': 1520353318000,
                        'createdBy': 'admin',
                        'lastEdited': 1520353318000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'refPname': '4-HYDROXYISOPHTHALIC ACID',
                        'refuuid': '0b8cdd85-6608-4bf3-b443-f79209a3a284',
                        'substanceClass': 'reference',
                        'approvalID': 'P87FF77O00',
                        'linkingID': 'P87FF77O00',
                        'name': '4-HYDROXYISOPHTHALIC ACID',
                        'references': [],
                        'access': []
                    },
                    'originatorUuid': '46728ac3-5398-432a-9136-b1adfdedf297',
                    'type': 'IMPURITY->PARENT',
                    'references': [
                        'b95e2121-d89b-443a-b1c1-ec0ecb963705'
                    ],
                    'access': []
                },
                {
                    'uuid': '66bd2d74-8cc0-40ec-8fe6-81cc94838207',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'comments': 'IDENTIFIED AS IMPURITY F\nLimits: impurity F: not more than 1.5 times the area of the principal peak in the chromatogram obtained with reference solution (a) (0.15 per cent)',
                    'relatedSubstance': {
                        'uuid': '56e8cc65-e72d-45f0-b9d7-bd63094519f8',
                        'created': 1520353318000,
                        'createdBy': 'admin',
                        'lastEdited': 1520353318000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'refPname': 'ASPIRIN ANHYDRIDE',
                        'refuuid': 'b01ae0ed-0de4-471a-aca5-7902f31b05ab',
                        'substanceClass': 'reference',
                        'approvalID': 'XIA5Z82RHB',
                        'linkingID': 'XIA5Z82RHB',
                        'name': 'ASPIRIN ANHYDRIDE',
                        'references': [],
                        'access': []
                    },
                    'originatorUuid': '66bd2d74-8cc0-40ec-8fe6-81cc94838207',
                    'type': 'IMPURITY->PARENT',
                    'references': [
                        'b95e2121-d89b-443a-b1c1-ec0ecb963705'
                    ],
                    'access': []
                },
                {
                    'uuid': '7246ec31-9e0c-42fd-91cf-439d6aecdea7',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'comments': 'IDENTIFIED AS IMPURITY C\nLimits: impurity C: not more than 1.5 times the area of the principal peak in the chromatogram obtained with reference solution (a) (0.15 per cent)',
                    'relatedSubstance': {
                        'uuid': 'd65920f7-9191-43b6-9e81-c946aff1bf62',
                        'created': 1520353318000,
                        'createdBy': 'admin',
                        'lastEdited': 1520353318000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'refPname': 'SALICYLIC ACID',
                        'refuuid': '77ecc185-155e-4f2d-8b74-81c91be840d2',
                        'substanceClass': 'reference',
                        'approvalID': 'O414PZ4LPZ',
                        'linkingID': 'O414PZ4LPZ',
                        'name': 'SALICYLIC ACID',
                        'references': [],
                        'access': []
                    },
                    'originatorUuid': '7246ec31-9e0c-42fd-91cf-439d6aecdea7',
                    'type': 'IMPURITY->PARENT',
                    'references': [
                        'b95e2121-d89b-443a-b1c1-ec0ecb963705'
                    ],
                    'access': []
                },
                {
                    'uuid': '9b291694-1ccd-4eba-a652-e71d627a6d44',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'comments': 'Limits: impurity A: not more than 1.5 times the area of the principal peak in the chromatogram obtained with reference solution (a) (0.15 per cent)',
                    'relatedSubstance': {
                        'uuid': '00ec0474-7405-4864-b389-faa86c3e63a5',
                        'created': 1520353318000,
                        'createdBy': 'admin',
                        'lastEdited': 1520353318000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'refPname': '4-HYDROXYBENZOIC ACID',
                        'refuuid': 'beb8e4b3-5011-4f42-9cce-271456343519',
                        'substanceClass': 'reference',
                        'approvalID': 'JG8Z55Y12H',
                        'linkingID': 'JG8Z55Y12H',
                        'name': '4-HYDROXYBENZOIC ACID',
                        'references': [],
                        'access': []
                    },
                    'originatorUuid': '9b291694-1ccd-4eba-a652-e71d627a6d44',
                    'type': 'IMPURITY->PARENT',
                    'references': [
                        'b95e2121-d89b-443a-b1c1-ec0ecb963705'
                    ],
                    'access': []
                },
                {
                    'uuid': 'b0ddbc68-a8c5-4668-92e3-152283bd2f8d',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'amount': {
                        'uuid': 'eaf8dad8-98f4-4279-940d-54e8c60b9b3e',
                        'created': 1520353318000,
                        'createdBy': 'admin',
                        'lastEdited': 1520353318000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'type': 'RELATIONSHIP_AMOUNT',
                        'highLimit': 70.0,
                        'lowLimit': 30.0,
                        'units': 'MOLE PERCENT OF AMOUNT EXCRETED',
                        'references': [],
                        'access': []
                    },
                    'interactionType': 'MAJOR',
                    'qualification': 'URINE',
                    'relatedSubstance': {
                        'uuid': '377a16e4-45d6-44ef-b285-c1968dae09d0',
                        'created': 1520353318000,
                        'createdBy': 'admin',
                        'lastEdited': 1520353318000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'refPname': 'N-SALICYLOYLGLYCINE',
                        'refuuid': 'c2cf606e-9a47-4b3e-9c01-ec56a7378742',
                        'substanceClass': 'reference',
                        'approvalID': '5BR3P7J05U',
                        'linkingID': '5BR3P7J05U',
                        'name': 'N-SALICYLOYLGLYCINE',
                        'references': [],
                        'access': []
                    },
                    'originatorUuid': 'b0ddbc68-a8c5-4668-92e3-152283bd2f8d',
                    'type': 'METABOLITE INACTIVE->PARENT',
                    'references': [
                        '3b38330d-93b5-4c7c-bf99-1032b869c1db'
                    ],
                    'access': []
                },
                {
                    'uuid': 'b15e003f-bc4f-4b90-bff1-c2ef163f687c',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'comments': 'IDENTIFIED AS IMPURITY D\nLimits: impurity D: not more than 1.5 times the area of the principal peak in the chromatogram obtained with reference solution (a) (0.15 per cent)Herbal Medicines 4th ED 2103',
                    'relatedSubstance': {
                        'uuid': '541c457c-366f-4869-969e-739c938c648c',
                        'created': 1520353318000,
                        'createdBy': 'admin',
                        'lastEdited': 1520353318000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'refPname': 'ACETYLSALICYLSALICYLIC ACID',
                        'refuuid': '8657e9d9-7e84-4797-aa45-362ac12b8e33',
                        'substanceClass': 'reference',
                        'approvalID': 'VBE72MCP5L',
                        'linkingID': 'VBE72MCP5L',
                        'name': 'ACETYLSALICYLSALICYLIC ACID',
                        'references': [],
                        'access': []
                    },
                    'originatorUuid': 'b15e003f-bc4f-4b90-bff1-c2ef163f687c',
                    'type': 'IMPURITY->PARENT',
                    'references': [
                        'b95e2121-d89b-443a-b1c1-ec0ecb963705'
                    ],
                    'access': []
                },
                {
                    'uuid': 'b3021de4-f9b7-4c14-b226-c7a994818aca',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'comments': 'IDENTIFIED AS IMPURITY E\nLimits: impurity E: not more than 1.5 times the area of the principal peak in the chromatogram obtained with reference solution (a) (0.15 per cent)',
                    'relatedSubstance': {
                        'uuid': 'd63652e8-1199-4b71-9f6c-a606853ebeaa',
                        'created': 1520353318000,
                        'createdBy': 'admin',
                        'lastEdited': 1520353318000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'refPname': 'SALSALATE',
                        'refuuid': '4b40bd34-96c2-4b98-b9b9-5063d6397406',
                        'substanceClass': 'reference',
                        'approvalID': 'V9MO595C9I',
                        'linkingID': 'V9MO595C9I',
                        'name': 'SALSALATE',
                        'references': [],
                        'access': []
                    },
                    'originatorUuid': 'b3021de4-f9b7-4c14-b226-c7a994818aca',
                    'type': 'IMPURITY->PARENT',
                    'references': [
                        'b95e2121-d89b-443a-b1c1-ec0ecb963705'
                    ],
                    'access': []
                },
                {
                    'uuid': 'd105983c-ffe0-4f07-8834-6890b4a03ef3',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'comments': 'IDENTIFIED AS IMPURITY B\nLimits: impurity B: not more than 1.5 times the area of the principal peak in the chromatogram obtained with reference solution (a) (0.15 per cent)',
                    'relatedSubstance': {
                        'uuid': 'e8d79863-f6eb-43c8-80c3-ffebcc5cfcfb',
                        'created': 1520353318000,
                        'createdBy': 'admin',
                        'lastEdited': 1520353318000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'refPname': '4-HYDROXYISOPHTHALIC ACID',
                        'refuuid': '0b8cdd85-6608-4bf3-b443-f79209a3a284',
                        'substanceClass': 'reference',
                        'approvalID': 'P87FF77O00',
                        'linkingID': 'P87FF77O00',
                        'name': '4-HYDROXYISOPHTHALIC ACID',
                        'references': [],
                        'access': []
                    },
                    'originatorUuid': 'd105983c-ffe0-4f07-8834-6890b4a03ef3',
                    'type': 'IMPURITY->PARENT',
                    'references': [
                        'b95e2121-d89b-443a-b1c1-ec0ecb963705'
                    ],
                    'access': []
                },
                {
                    'uuid': 'fa478461-0aac-49d8-8a9b-c27f2cd22460',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'relatedSubstance': {
                        'uuid': 'dd2bb2cb-b3de-4ca5-80fe-85131eb6ce2c',
                        'created': 1520353318000,
                        'createdBy': 'admin',
                        'lastEdited': 1520353318000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'refPname': 'ASPIRIN',
                        'refuuid': 'a05ec20c-8fe2-4e02-ba7f-df69e5e30248',
                        'substanceClass': 'reference',
                        'approvalID': 'R16CO5Y76E',
                        'linkingID': 'R16CO5Y76E',
                        'name': 'ASPIRIN',
                        'references': [],
                        'access': []
                    },
                    'originatorUuid': 'fa478461-0aac-49d8-8a9b-c27f2cd22460',
                    'type': 'ACTIVE MOIETY',
                    'references': [],
                    'access': []
                }
            ],
            'references': [
                {
                    'uuid': '021928c7-a306-4c64-8b4d-67924b411770',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ASPIRIN [USP]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(021928c7-a306-4c64-8b4d-67924b411770)?view=full'
                },
                {
                    'uuid': '098f0f09-2036-4008-a870-f473a32fc45b',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'USP/NF',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(098f0f09-2036-4008-a870-f473a32fc45b)?view=full'
                },
                {
                    'uuid': '09efee30-c1a7-4d61-b4b9-92a52c95a2dd',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ACETYLSALICYLIC ACID [WHO-DD]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(09efee30-c1a7-4d61-b4b9-92a52c95a2dd)?view=full'
                },
                {
                    'uuid': '0fedf8bf-9112-4ae7-a876-63aab5fb0ac4',
                    'created': 1520353319000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353319000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'USP Dictionary 2010',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(0fedf8bf-9112-4ae7-a876-63aab5fb0ac4)?view=full'
                },
                {
                    'uuid': '164ecc00-1619-4fad-9ec4-0b10b6fe1e91',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ACETYLSALICYLIC ACID [EP]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(164ecc00-1619-4fad-9ec4-0b10b6fe1e91)?view=full'
                },
                {
                    'uuid': '18815669-0ccb-4d9f-b665-41bd6a024220',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'PCPC',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(18815669-0ccb-4d9f-b665-41bd6a024220)?view=full'
                },
                {
                    'uuid': '3b38330d-93b5-4c7c-bf99-1032b869c1db',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'BIOL. PHARM. BULL. 27(5) 706?709 (2004)',
                    'docType': 'JOURNAL ARTICLE',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'url': 'https://www.jstage.jst.go.jp/article/bpb/27/5/27_5_706/_pdf',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(3b38330d-93b5-4c7c-bf99-1032b869c1db)?view=full'
                },
                {
                    'uuid': '3f43d255-788b-4df8-b924-cc25dfedb171',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'HSDB',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(3f43d255-788b-4df8-b924-cc25dfedb171)?view=full'
                },
                {
                    'uuid': '46a42348-c88b-408d-b596-a27280aff449',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'fda_srs',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(46a42348-c88b-408d-b596-a27280aff449)?view=full'
                },
                {
                    'uuid': '46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'Drugs@FDA 2011',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(46e82f2b-8ec5-4d3a-8039-62ba0f7ab34d)?view=full'
                },
                {
                    'uuid': '4b57ca01-374d-6da4-8084-8b29c1a1db30',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'WEBSITE',
                    'docType': 'WEBSITE',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN',
                        'PUBLIC_DOMAIN_RELEASE'
                    ],
                    'url': 'https://toxnet.nlm.nih.gov/cgi-bin/sis/search/r?dbs+lactmed:@term+@rel+@rn+50-78-2',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(4b57ca01-374d-6da4-8084-8b29c1a1db30)?view=full'
                },
                {
                    'uuid': '5eb258ea-39e8-4689-8b81-04d259813051',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'SRS import [R16CO5Y76E]',
                    'docType': 'SRS',
                    'documentDate': 1493389714000,
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'url': 'http://fdasis.nlm.nih.gov/srs/srsdirect.jsp?regno=R16CO5Y76E',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(5eb258ea-39e8-4689-8b81-04d259813051)?view=full'
                },
                {
                    'uuid': '5ec89d1e-64a6-4148-8801-b5c0b4ad39fa',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'http://www.ema.europa.eu/ema/index.jsp?curl=pages/medicines/human/medicines/002272/human_med_001791.',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'url': 'http://www.ema.europa.eu/ema/index.jsp?curl=pages/medicines/human/medicines/002272/human_med_001791.',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(5ec89d1e-64a6-4148-8801-b5c0b4ad39fa)?view=full'
                },
                {
                    'uuid': '642e6dae-ab5f-4331-b46f-36e569a5dd63',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ASPIRIN [MI]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(642e6dae-ab5f-4331-b46f-36e569a5dd63)?view=full'
                },
                {
                    'uuid': '64d12b0f-0d9d-4896-8770-b827ea3128ff',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'http://www.ema.europa.eu/ema/index.jsp?curl=pages/medicines/human/medicines/001144/human_med_001326.',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'url': 'http://www.ema.europa.eu/ema/index.jsp?curl=pages/medicines/human/medicines/001144/human_med_001326.',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(64d12b0f-0d9d-4896-8770-b827ea3128ff)?view=full'
                },
                {
                    'uuid': '6b443371-95be-47a4-901e-9c314a8fb5db',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'USP 33',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(6b443371-95be-47a4-901e-9c314a8fb5db)?view=full'
                },
                {
                    'uuid': '6e4e22a6-0d29-4532-960e-9d99bda9fad8',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'FDA-SRS',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(6e4e22a6-0d29-4532-960e-9d99bda9fad8)?view=full'
                },
                {
                    'uuid': '745256bc-b919-4ff3-b3f2-e6ff4c6c7e77',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=73f74f6d-e624-4551-8924-1c747ffb2140',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'url': 'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=73f74f6d-e624-4551-8924-1c747ffb2140',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(745256bc-b919-4ff3-b3f2-e6ff4c6c7e77)?view=full'
                },
                {
                    'uuid': '747bac63-454a-481c-b7e2-6f6db0bee5c9',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'MARTINDALE 2011',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(747bac63-454a-481c-b7e2-6f6db0bee5c9)?view=full'
                },
                {
                    'uuid': '7c51c2b1-c5f9-4c91-a806-69d7f24a4570',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'HPUS 2004',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(7c51c2b1-c5f9-4c91-a806-69d7f24a4570)?view=full'
                },
                {
                    'uuid': '7da2f850-3e18-4d09-92c2-128028795de0',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'http://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4c2a1403-3862-1efd-0a91-444989222b37',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'url': 'http://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4c2a1403-3862-1efd-0a91-444989222b37',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(7da2f850-3e18-4d09-92c2-128028795de0)?view=full'
                },
                {
                    'uuid': '7fe598a7-d0bd-4eb6-8427-6742e7156e05',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'SRS CODE IMPORT',
                    'docType': 'SRS',
                    'documentDate': 1493389714000,
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(7fe598a7-d0bd-4eb6-8427-6742e7156e05)?view=full'
                },
                {
                    'uuid': '81938fb2-747b-471f-a2a4-f82a1e2bf089',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ASPIRIN [USP-RS]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(81938fb2-747b-471f-a2a4-f82a1e2bf089)?view=full'
                },
                {
                    'uuid': '88ce6680-a831-0fad-a42d-92aea8a62f00',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'JAN',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN',
                        'PUBLIC_DOMAIN_RELEASE'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(88ce6680-a831-0fad-a42d-92aea8a62f00)?view=full'
                },
                {
                    'uuid': '8a6afa6e-1bdb-4b33-b673-a1e239123a0e',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'https://clinicaltrials.gov/ct2/show/NCT01117636',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'url': 'https://clinicaltrials.gov/ct2/show/NCT01117636',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(8a6afa6e-1bdb-4b33-b673-a1e239123a0e)?view=full'
                },
                {
                    'uuid': '8ed14aba-d149-49f7-bd9a-aca313488d9c',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ASPIRIN [VANDF]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(8ed14aba-d149-49f7-bd9a-aca313488d9c)?view=full'
                },
                {
                    'uuid': '919c5a16-f3ac-4b69-8379-603f07c4d74e',
                    'created': 1520353319000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353319000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'USP Dictionary 2011',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(919c5a16-f3ac-4b69-8379-603f07c4d74e)?view=full'
                },
                {
                    'uuid': '92025853-d80d-4081-80ac-196d09e27303',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ACETYLSALICYLIC ACID [EMA EPAR]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(92025853-d80d-4081-80ac-196d09e27303)?view=full'
                },
                {
                    'uuid': '9bff8ba8-0ef5-4c4d-97de-48ec020106b7',
                    'created': 1520353319000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353319000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'USP DICTIONARY 2008',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(9bff8ba8-0ef5-4c4d-97de-48ec020106b7)?view=full'
                },
                {
                    'uuid': 'a2bacf49-c3ab-42b1-948e-4caf9d13dcc6',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'MERCK INDEX',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(a2bacf49-c3ab-42b1-948e-4caf9d13dcc6)?view=full'
                },
                {
                    'uuid': 'a8741bd5-df1a-4c0f-997b-2c43a020f6fe',
                    'created': 1520353319000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353319000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'GSRS System-generated Validation messages',
                    'docType': 'VALIDATION_MESSAGE',
                    'documentDate': 1520353318000,
                    'publicDomain': false,
                    'tags': [],
                    'access': [
                        'admin'
                    ],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(a8741bd5-df1a-4c0f-997b-2c43a020f6fe)?view=full'
                },
                {
                    'uuid': 'a9fd4df5-0685-47c5-8cae-52b7564e7d54',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'WHO-IP',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(a9fd4df5-0685-47c5-8cae-52b7564e7d54)?view=full'
                },
                {
                    'uuid': 'b3548777-047f-44d3-9c55-4909a0fde423',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'rxnorm',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(b3548777-047f-44d3-9c55-4909a0fde423)?view=full'
                },
                {
                    'uuid': 'b3e56dca-af76-4b98-a9b4-243cc1bf6eb6',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'FDA SRS 2011',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(b3e56dca-af76-4b98-a9b4-243cc1bf6eb6)?view=full'
                },
                {
                    'uuid': 'b795c9a5-b1e7-4092-9e4e-d167d97e73ef',
                    'created': 1520353319000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353319000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'EP 6.5',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN',
                        'PUBLIC_DOMAIN_RELEASE',
                        'AUTO_SELECTED'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(b795c9a5-b1e7-4092-9e4e-d167d97e73ef)?view=full'
                },
                {
                    'uuid': 'b95e2121-d89b-443a-b1c1-ec0ecb963705',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'EUROPEAN PHARMACOPEDIA ONLINE',
                    'docType': 'EUROPEAN PHARMACOPEIA',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(b95e2121-d89b-443a-b1c1-ec0ecb963705)?view=full'
                },
                {
                    'uuid': 'c0646662-7ba2-480e-98eb-1d7c8c02ce07',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ACETYLSALICYLIC ACID [INCI]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(c0646662-7ba2-480e-98eb-1d7c8c02ce07)?view=full'
                },
                {
                    'uuid': 'c2c31c52-cf50-477b-b020-aa85b4cfc4d4',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'NDF-RT',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(c2c31c52-cf50-477b-b020-aa85b4cfc4d4)?view=full'
                },
                {
                    'uuid': 'c814e853-bd01-4f1f-b23a-38686fbf7c90',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ORANGE BOOK 2011',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(c814e853-bd01-4f1f-b23a-38686fbf7c90)?view=full'
                },
                {
                    'uuid': 'cdf3e379-17de-437e-9246-71b18dd5802e',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ASPIRIN [ORANGE BOOK]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(cdf3e379-17de-437e-9246-71b18dd5802e)?view=full'
                },
                {
                    'uuid': 'd059d77b-1f6c-4c77-9d67-7fa1c56deac5',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'http://www.ema.europa.eu/ema/index.jsp?curl=pages/medicines/human/medicines/001143/human_med_001325.',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'url': 'http://www.ema.europa.eu/ema/index.jsp?curl=pages/medicines/human/medicines/001143/human_med_001325.',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(d059d77b-1f6c-4c77-9d67-7fa1c56deac5)?view=full'
                },
                {
                    'uuid': 'd64e9fda-15d4-440e-b9b4-eaaeb6d61dd7',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'WHO-DD',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(d64e9fda-15d4-440e-b9b4-eaaeb6d61dd7)?view=full'
                },
                {
                    'uuid': 'd80b788d-5afd-46c9-b8d8-5fad1dd7d946',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'HPUS',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(d80b788d-5afd-46c9-b8d8-5fad1dd7d946)?view=full'
                },
                {
                    'uuid': 'd87b9521-c829-4f0c-8f66-101f6f3a67b5',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ASPIRIN [HSDB]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(d87b9521-c829-4f0c-8f66-101f6f3a67b5)?view=full'
                },
                {
                    'uuid': 'dc38b753-2a77-4359-8b2f-d89f10cd7732',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ACETYLSALICYLICUM ACIDUM [HPUS]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(dc38b753-2a77-4359-8b2f-d89f10cd7732)?view=full'
                },
                {
                    'uuid': 'dd19a315-71b2-45a2-a337-5c64b26e4586',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'EMA',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(dd19a315-71b2-45a2-a337-5c64b26e4586)?view=full'
                },
                {
                    'uuid': 'e42d822d-ae63-de9f-7e90-372c4646c77d',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'WEBSITE',
                    'docType': 'WEBSITE',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN',
                        'PUBLIC_DOMAIN_RELEASE'
                    ],
                    'url': 'https://comptox.epa.gov/dashboard/dsstoxdb/results?utf8=%E2%9C%93&search=50-78-2',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(e42d822d-ae63-de9f-7e90-372c4646c77d)?view=full'
                },
                {
                    'uuid': 'e7094fbb-05b7-4bb6-9165-0eefd2e8b1e7',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ACETYLSALICYLIC ACID [GREEN BOOK]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(e7094fbb-05b7-4bb6-9165-0eefd2e8b1e7)?view=full'
                },
                {
                    'uuid': 'f4dfdbd4-ea02-4b6b-a6ff-22ab95cb9bed',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'USP DICTIONARY 2010',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(f4dfdbd4-ea02-4b6b-a6ff-22ab95cb9bed)?view=full'
                },
                {
                    'uuid': 'f823da75-6cf7-9b20-ab9f-21969eb0691d',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'WEBSITE',
                    'docType': 'WEBSITE',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN',
                        'PUBLIC_DOMAIN_RELEASE'
                    ],
                    'url': 'https://toxnet.nlm.nih.gov/cgi-bin/sis/search2/r?dbs+hsdb:@term+@rn+@rel+50-78-2',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(f823da75-6cf7-9b20-ab9f-21969eb0691d)?view=full'
                },
                {
                    'uuid': 'f99118ca-88f6-407e-83b0-90e5770b2c0a',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'HTTPS://WWW.JSTAGE.JST.GO.JP/ARTICLE/BPB/27/5/27_5_706/_PDF',
                    'docType': 'JOURNAL ARTICLE',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'url': 'Biol. Pharm. Bull. 27(5) 706?709 (2004)',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(f99118ca-88f6-407e-83b0-90e5770b2c0a)?view=full'
                },
                {
                    'uuid': 'fa052f29-7e10-4aab-a1b7-abeaaf7d7b12',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ASPIRIN [MART.]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(fa052f29-7e10-4aab-a1b7-abeaaf7d7b12)?view=full'
                },
                {
                    'uuid': 'fc18f2d9-bab9-4051-a4da-5bed64a6762a',
                    'created': 1520353319000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353319000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'dump-public-2018-03-05.gsrs',
                    'docType': 'BATCH_IMPORT',
                    'documentDate': 1520353318000,
                    'publicDomain': false,
                    'tags': [],
                    'id': 'b9fdcca829e0ff2e96ec',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(fc18f2d9-bab9-4051-a4da-5bed64a6762a)?view=full'
                },
                {
                    'uuid': 'fda2dc61-1264-40af-8758-3390e4d60ad6',
                    'created': 1520353318000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353318000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'EP 7.2',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(fda2dc61-1264-40af-8758-3390e4d60ad6)?view=full'
                }
            ],
            'approvalID': 'R16CO5Y76E',
            'tags': [
                'MART.',
                'GREEN BOOK',
                'HPUS',
                'HSDB',
                'INCI',
                'EP',
                'ORANGE BOOK',
                'USP',
                'MI',
                'EMA EPAR',
                'USP-RS',
                'WHO-DD',
                'VANDF'
            ],
            'structure': {
                'id': '4b9639ec-1bb2-4f87-8830-f4f41a862891',
                'created': 1520353318000,
                'lastEdited': 1520353318000,
                'deprecated': false,
                'digest': '895c8b8d7305ccf5ad21924e23d58c5b5ff4794b',
                'molfile': '\n  Symyx   04271718552D 1   1.00000     0.00000     0\n\n 13 13  0     0  0            999 V2000\n    4.6125   -1.9917    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.6125   -0.6792    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.4542   -2.6792    0.0000 C   0  0  0  0  0  0           0  0  0\n    2.3167   -1.9917    0.0000 O   0  0  0  0  0  0           0  0  0\n    1.1542   -2.6375    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.7417   -0.0250    0.0000 O   0  0  0  0  0  0           0  0  0\n    0.0000   -1.9917    0.0000 O   0  0  0  0  0  0           0  0  0\n    3.4792    0.0000    0.0000 O   0  0  0  0  0  0           0  0  0\n    5.7750   -2.6792    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.4542   -3.9667    0.0000 C   0  0  0  0  0  0           0  0  0\n    1.1542   -3.9667    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.7750   -4.0042    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.5792   -4.6917    0.0000 C   0  0  0  0  0  0           0  0  0\n  2  1  1  0     0  0\n  3  1  2  0     0  0\n  4  3  1  0     0  0\n  5  4  1  0     0  0\n  6  2  2  0     0  0\n  7  5  2  0     0  0\n  8  2  1  0     0  0\n  9  1  1  0     0  0\n 10  3  1  0     0  0\n 11  5  1  0     0  0\n 12  9  2  0     0  0\n 13 12  1  0     0  0\n 13 10  2  0     0  0\nM  END\n',
                'smiles': 'CC(=O)OC1=CC=CC=C1C(O)=O',
                'formula': 'C9H8O4',
                'opticalActivity': 'UNSPECIFIED',
                'atropisomerism': 'No',
                'stereoCenters': 0,
                'definedStereo': 0,
                'ezCenters': 0,
                'charge': 0,
                'mwt': 180.1574,
                'count': 1,
                'createdBy': 'admin',
                'lastEditedBy': 'admin',
                'hash': 'NNQ793F142LD',
                'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(4b9639ec-1bb2-4f87-8830-f4f41a862891)?view=full',
                'stereochemistry': 'ACHIRAL',
                'references': [
                    '5eb258ea-39e8-4689-8b81-04d259813051',
                    '0fedf8bf-9112-4ae7-a876-63aab5fb0ac4'
                ],
                'access': []
            },
            'moieties': [
                {
                    'uuid': 'a242c635-cafd-43d2-abc7-21c2ebcad5c4',
                    'created': 1520353319000,
                    'createdBy': 'admin',
                    'lastEdited': 1520353319000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'id': 'a242c635-cafd-43d2-abc7-21c2ebcad5c4',
                    'digest': '512b12d553729ae966b1937450a11f945f1a11a3',
                    'molfile': '\n  Marvin  04291703242D          \n\n 13 13  0  0  0  0            999 V2000\n    0.7164   -2.4620    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.7164   -1.6370    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000   -1.2362    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    1.4379   -1.2362    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    2.1439   -1.6629    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.1439   -2.4620    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.8422   -2.9120    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.5844   -2.4853    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.5844   -1.6629    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.8629   -1.2362    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.8629   -0.4216    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.5637   -0.0155    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    2.1594    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  3  2  2  0  0  0  0\n  2  4  1  0  0  0  0\n  4  5  1  0  0  0  0\n  6  5  1  0  0  0  0\n  5 10  2  0  0  0  0\n  7  6  2  0  0  0  0\n  7  8  1  0  0  0  0\n  8  9  2  0  0  0  0\n  9 10  1  0  0  0  0\n 11 10  1  0  0  0  0\n 12 11  1  0  0  0  0\n 13 11  2  0  0  0  0\nM  END\n',
                    'smiles': 'CC(=O)OC1=C(C=CC=C1)C(O)=O',
                    'formula': 'C9H8O4',
                    'opticalActivity': 'NONE',
                    'stereoCenters': 0,
                    'definedStereo': 0,
                    'ezCenters': 0,
                    'charge': 0,
                    'mwt': 180.1574,
                    'count': 1,
                    'hash': 'NNQ793F142LD',
                    'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(a242c635-cafd-43d2-abc7-21c2ebcad5c4)?view=full',
                    'stereochemistry': 'ACHIRAL',
                    'references': [],
                    'access': [],
                    'countAmount': {
                        'uuid': 'f43cf4c1-18a1-43ea-b862-c86f0a899153',
                        'created': 1520353319000,
                        'createdBy': 'admin',
                        'lastEdited': 1520353319000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'type': 'MOL RATIO',
                        'average': 1.0,
                        'units': 'MOL RATIO',
                        'references': [],
                        'access': []
                    }
                }
            ],
            '_approvalIDDisplay': 'R16CO5Y76E',
            '_name': 'ASPIRIN',
            'access': [],
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(a05ec20c-8fe2-4e02-ba7f-df69e5e30248)?view=full'
        },
        {
            'uuid': 'ba3fd1e6-c206-4a4a-9ae3-02eb74d9f756',
            'created': 1520370263000,
            'createdBy': 'admin',
            'lastEdited': 1520370263000,
            'lastEditedBy': 'admin',
            'deprecated': false,
            'definitionType': 'PRIMARY',
            'definitionLevel': 'COMPLETE',
            'substanceClass': 'chemical',
            'status': 'approved',
            'version': '1',
            'approvedBy': 'FDA_SRS',
            'names': [
                {
                    'uuid': '57d4906c-ead6-476f-a06b-32371ff90050',
                    'created': 1520370263000,
                    'createdBy': 'admin',
                    'lastEdited': 1520370263000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'TRIDEUTERIOMETHYLASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '29a74e6f-ce53-4bd8-9c15-e2b4436d175c'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(57d4906c-ead6-476f-a06b-32371ff90050)?view=full'
                },
                {
                    'uuid': 'b37dd45f-21ac-4d4b-9b18-d411b335474c',
                    'created': 1520370263000,
                    'createdBy': 'admin',
                    'lastEdited': 1520370263000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN CD3',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': true,
                    'references': [
                        '29a74e6f-ce53-4bd8-9c15-e2b4436d175c'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(b37dd45f-21ac-4d4b-9b18-d411b335474c)?view=full'
                },
                {
                    'uuid': 'e3d40652-7756-4422-83d8-765ac7aa8fd1',
                    'created': 1520370263000,
                    'createdBy': 'admin',
                    'lastEdited': 1520370263000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'BENZOIC ACID, (ACETYL-2,2,2-D3-OXY)-',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '73938c9c-1abc-4c95-a149-6c54fdf89d3c'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(e3d40652-7756-4422-83d8-765ac7aa8fd1)?view=full'
                }
            ],
            'codes': [
                {
                    'uuid': 'a92bf68e-196e-47d0-abb2-6950b3b305e8',
                    'created': 1520370263000,
                    'createdBy': 'admin',
                    'lastEdited': 1520370263000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'PUBCHEM',
                    'code': '12280114',
                    'type': 'PRIMARY',
                    'url': 'https://pubchem.ncbi.nlm.nih.gov/compound/12280114',
                    'references': [
                        '4cf77e7b-c95c-4926-b5fe-9dae62ae8cf2'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(a92bf68e-196e-47d0-abb2-6950b3b305e8)?view=full'
                },
                {
                    'uuid': 'fe8175bb-f31e-4c25-b586-b00f32d68fd0',
                    'created': 1520370263000,
                    'createdBy': 'admin',
                    'lastEdited': 1520370263000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'CAS',
                    'code': '921943-73-9',
                    'type': 'PRIMARY',
                    'url': 'http://chem.sis.nlm.nih.gov/chemidplus/direct.jsp?regno=921943-73-9&result=advanced',
                    'references': [
                        '4cf77e7b-c95c-4926-b5fe-9dae62ae8cf2'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(fe8175bb-f31e-4c25-b586-b00f32d68fd0)?view=full'
                }
            ],
            'notes': [
                {
                    'uuid': '0afcc266-d709-4d40-b2e0-a15802f18b4b',
                    'created': 1520370263000,
                    'createdBy': 'admin',
                    'lastEdited': 1520370263000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Structure has 9 possible duplicates:\n[R16CO5Y76E]ASPIRIN\n[XAN4V337CI]ASPIRIN LYSINE\n[N667F17JP1]CARBASPIRIN CALCIUM\n[4995924SMK]ASPIRIN MAGNESIUM\n[6QT214X4XU]ALOXIPRIN\n[89R59534MK]LITHIUM ACETYLSALICYLATE\n[NK259942HJ]ASPIRIN GLYCINE CALCIUM\n[5XE48797BQ]ASPIRIN POTASSIUM\n[E62HT5S2E9]ASPIRIN SODIUM',
                    'references': [
                        '2a2a04cf-ad7c-461a-b782-e5b96676047b'
                    ],
                    'access': [
                        'admin'
                    ]
                }
            ],
            'properties': [],
            'relationships': [],
            'references': [
                {
                    'uuid': '0a46c515-32ee-470f-8b12-529d5e9e38f0',
                    'created': 1520370263000,
                    'createdBy': 'admin',
                    'lastEdited': 1520370263000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'SRS import [7F6Y89636M]',
                    'docType': 'SRS',
                    'documentDate': 1493391977000,
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'url': 'http://fdasis.nlm.nih.gov/srs/srsdirect.jsp?regno=7F6Y89636M',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(0a46c515-32ee-470f-8b12-529d5e9e38f0)?view=full'
                },
                {
                    'uuid': '29a74e6f-ce53-4bd8-9c15-e2b4436d175c',
                    'created': 1520370263000,
                    'createdBy': 'admin',
                    'lastEdited': 1520370263000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'FDA_SRS',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN',
                        'PUBLIC_DOMAIN_RELEASE',
                        'AUTO_SELECTED'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(29a74e6f-ce53-4bd8-9c15-e2b4436d175c)?view=full'
                },
                {
                    'uuid': '2a2a04cf-ad7c-461a-b782-e5b96676047b',
                    'created': 1520370263000,
                    'createdBy': 'admin',
                    'lastEdited': 1520370263000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'GSRS System-generated Validation messages',
                    'docType': 'VALIDATION_MESSAGE',
                    'documentDate': 1520370263000,
                    'publicDomain': false,
                    'tags': [],
                    'access': [
                        'admin'
                    ],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(2a2a04cf-ad7c-461a-b782-e5b96676047b)?view=full'
                },
                {
                    'uuid': '4cf77e7b-c95c-4926-b5fe-9dae62ae8cf2',
                    'created': 1520370263000,
                    'createdBy': 'admin',
                    'lastEdited': 1520370263000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'SRS CODE IMPORT',
                    'docType': 'SRS',
                    'documentDate': 1493391977000,
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(4cf77e7b-c95c-4926-b5fe-9dae62ae8cf2)?view=full'
                },
                {
                    'uuid': '73938c9c-1abc-4c95-a149-6c54fdf89d3c',
                    'created': 1520370263000,
                    'createdBy': 'admin',
                    'lastEdited': 1520370263000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'STN',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(73938c9c-1abc-4c95-a149-6c54fdf89d3c)?view=full'
                },
                {
                    'uuid': 'f672e4bd-4338-4382-a43d-b448e43c3665',
                    'created': 1520370263000,
                    'createdBy': 'admin',
                    'lastEdited': 1520370263000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'dump-public-2018-03-05.gsrs',
                    'docType': 'BATCH_IMPORT',
                    'documentDate': 1520370262000,
                    'publicDomain': false,
                    'tags': [],
                    'id': 'b9fdcca829e0ff2e96ec',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(f672e4bd-4338-4382-a43d-b448e43c3665)?view=full'
                }
            ],
            'approvalID': '7F6Y89636M',
            'tags': [],
            'structure': {
                'id': 'eb6c5337-e33b-4014-bc8b-d8205f66d5aa',
                'created': 1520370263000,
                'lastEdited': 1520370263000,
                'deprecated': false,
                'digest': '6005e0676d99f3da7dc03baa3a7b529b5e4e9bc7',
                'molfile': '\n  Symyx   04271720102D 1   1.00000     0.00000     0\n\n 16 16  0     0  0            999 V2000\n    7.7004   -7.0317    0.0000 C   0  0  0  0  0  0           0  0  0\n    7.7004   -6.2823    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.3524   -5.9077    0.0000 O   0  0  0  0  0  0           0  0  0\n    7.0525   -5.9077    0.0000 O   0  0  0  0  0  0           0  0  0\n    7.0525   -7.4063    0.0000 C   0  0  0  0  0  0           0  0  0\n    6.4046   -7.0317    0.0000 O   0  0  0  0  0  0           0  0  0\n    5.7567   -7.4063    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.1088   -7.0317    0.0000 O   0  0  0  0  0  0           0  0  0\n    5.7567   -8.1556    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.1088   -8.5302    0.0000 H   1  0  0  0  0  0           0  0  0\n    5.7567   -8.9048    0.0000 H   1  0  0  0  0  0           0  0  0\n    6.4046   -8.5302    0.0000 H   1  0  0  0  0  0           0  0  0\n    7.0525   -8.1556    0.0000 C   0  0  0  0  0  0           0  0  0\n    7.7004   -8.5302    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.3524   -8.1556    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.3524   -7.4063    0.0000 C   0  0  0  0  0  0           0  0  0\n  2  1  1  0     0  0\n  3  2  2  0     0  0\n  4  2  1  0     0  0\n  5  1  2  0     0  0\n  6  5  1  0     0  0\n  7  6  1  0     0  0\n  8  7  2  0     0  0\n  9  7  1  0     0  0\n  9 10  1  0     0  0\n  9 11  1  0     0  0\n  9 12  1  0     0  0\n 13  5  1  0     0  0\n 14 13  2  0     0  0\n 14 15  1  0     0  0\n 15 16  2  0     0  0\n 16  1  1  0     0  0\nM  ISO  3  10   2  11   2  12   2\nM  END\n',
                'smiles': '[2H]C([2H])([2H])C(=O)OC1=CC=CC=C1C(O)=O',
                'formula': 'C9H8O4',
                'opticalActivity': 'UNSPECIFIED',
                'atropisomerism': 'No',
                'stereoCenters': 0,
                'definedStereo': 0,
                'ezCenters': 0,
                'charge': 0,
                'mwt': 183.1759,
                'count': 1,
                'createdBy': 'admin',
                'lastEditedBy': 'admin',
                'hash': 'NNQ1X6A91CVX',
                'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(eb6c5337-e33b-4014-bc8b-d8205f66d5aa)?view=full',
                'stereochemistry': 'ACHIRAL',
                'references': [
                    '0a46c515-32ee-470f-8b12-529d5e9e38f0',
                    '73938c9c-1abc-4c95-a149-6c54fdf89d3c'
                ],
                'access': []
            },
            'moieties': [
                {
                    'uuid': '984f96e3-7037-4c9a-ac46-b3b7e0e86f4c',
                    'created': 1520370263000,
                    'createdBy': 'admin',
                    'lastEdited': 1520370263000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'id': '984f96e3-7037-4c9a-ac46-b3b7e0e86f4c',
                    'digest': 'f8f4f57c441fab8d4a6eb25e9937ab3bd27222d2',
                    'molfile': '\n  Marvin  04291707062D          \n\n 16 16  0  0  0  0            999 V2000\n    5.6249   -9.3920    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n    6.3383   -8.9795    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.3383   -9.8044    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n    7.0516   -9.3920    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n    6.3383   -8.1545    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.6249   -7.7421    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    7.0516   -7.7421    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    7.7650   -8.1545    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    7.7650   -8.9795    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    8.4784   -9.3920    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.1962   -8.9795    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.1962   -8.1545    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    8.4784   -7.7421    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    8.4784   -6.9170    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.1962   -6.5045    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    7.7650   -6.5045    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  2  1  1  0  0  0  0\n  2  3  1  0  0  0  0\n  2  4  1  0  0  0  0\n  2  5  1  0  0  0  0\n  6  5  2  0  0  0  0\n  5  7  1  0  0  0  0\n  7  8  1  0  0  0  0\n  9  8  1  0  0  0  0\n  8 13  2  0  0  0  0\n 10  9  2  0  0  0  0\n 10 11  1  0  0  0  0\n 11 12  2  0  0  0  0\n 12 13  1  0  0  0  0\n 14 13  1  0  0  0  0\n 15 14  1  0  0  0  0\n 16 14  2  0  0  0  0\nM  ISO  3   1   2   3   2   4   2\nM  END\n',
                    'smiles': '[2H]C([2H])([2H])C(=O)OC1=C(C=CC=C1)C(O)=O',
                    'formula': 'C9H8O4',
                    'opticalActivity': 'NONE',
                    'stereoCenters': 0,
                    'definedStereo': 0,
                    'ezCenters': 0,
                    'charge': 0,
                    'mwt': 183.1759,
                    'count': 1,
                    'hash': 'NNQ1X6A91CVX',
                    'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(984f96e3-7037-4c9a-ac46-b3b7e0e86f4c)?view=full',
                    'stereochemistry': 'ACHIRAL',
                    'references': [],
                    'access': [],
                    'countAmount': {
                        'uuid': '4354c6bd-8fbc-4790-9f32-d7f92535140b',
                        'created': 1520370263000,
                        'createdBy': 'admin',
                        'lastEdited': 1520370263000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'type': 'MOL RATIO',
                        'average': 1.0,
                        'units': 'MOL RATIO',
                        'references': [],
                        'access': []
                    }
                }
            ],
            '_approvalIDDisplay': '7F6Y89636M',
            '_name': 'ASPIRIN CD3',
            'access': [],
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(ba3fd1e6-c206-4a4a-9ae3-02eb74d9f756)?view=full'
        },
        {
            'uuid': '39305c46-e2bd-4343-bdd3-8502874c9f1e',
            'created': 1520374592000,
            'createdBy': 'admin',
            'lastEdited': 1520374592000,
            'lastEditedBy': 'admin',
            'deprecated': false,
            'definitionType': 'PRIMARY',
            'definitionLevel': 'COMPLETE',
            'substanceClass': 'chemical',
            'status': 'approved',
            'version': '1',
            'approvedBy': 'FDA_SRS',
            'names': [
                {
                    'uuid': '005fd798-cd11-4109-b683-0b01af32f38c',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLATE ALUMINUM',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'f4806bad-123c-458e-8445-49ef1895028d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(005fd798-cd11-4109-b683-0b01af32f38c)?view=full'
                },
                {
                    'uuid': '05e434a5-d9e6-4dd1-92dc-fc5f9e2a206d',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ALUMINIUM, BIS(2-(ACETYLOXY)BENZOATO-O(SUP 1))HYDROXY-',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '87e2d8aa-6d7f-4055-a024-9b0b1cd8593e'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(05e434a5-d9e6-4dd1-92dc-fc5f9e2a206d)?view=full'
                },
                {
                    'uuid': '090b1918-98ce-4409-9cfa-009c55ac544f',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLATE ALUMINIUM',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '87e2d8aa-6d7f-4055-a024-9b0b1cd8593e'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(090b1918-98ce-4409-9cfa-009c55ac544f)?view=full'
                },
                {
                    'uuid': '29efa99a-77cd-4c90-9c7a-1ca397e0c620',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN, ALUMINUM',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '415087e1-f759-4794-b6ab-bc69abb0dcab'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(29efa99a-77cd-4c90-9c7a-1ca397e0c620)?view=full'
                },
                {
                    'uuid': '2a58da91-9f0c-47ad-87c6-69e55ff55cad',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ALUMINIUM BIS(ACETYLSALICYLATE)',
                    'type': 'sys',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '87e2d8aa-6d7f-4055-a024-9b0b1cd8593e',
                        '92681a98-a736-4c99-acc0-887df8b81c9d',
                        '15ce1916-0c2d-4e5e-94d6-60fdcfb1fbc7'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(2a58da91-9f0c-47ad-87c6-69e55ff55cad)?view=full'
                },
                {
                    'uuid': '406568ce-73a5-4c2a-85fe-11025e933f78',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN ALUMINIUM',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '87e2d8aa-6d7f-4055-a024-9b0b1cd8593e'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(406568ce-73a5-4c2a-85fe-11025e933f78)?view=full'
                },
                {
                    'uuid': '4e5e6515-00da-49d4-82d6-cfb1734c01f1',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ALUMINUM BIS(ACETYLSALICYLATE)/HYDROXIDE',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'd7607151-c8d4-4a3d-b6ac-b40deceddd2d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(4e5e6515-00da-49d4-82d6-cfb1734c01f1)?view=full'
                },
                {
                    'uuid': '51ab40c3-9fd5-4c48-8521-4ed7dd4decec',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLIC ACID ALUMINIUM',
                    'type': 'sys',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'bf7d320e-1cd9-4b94-b1c9-1dbf9807bdb4',
                        '92681a98-a736-4c99-acc0-887df8b81c9d',
                        '17cd12fe-7f9a-4c5e-8c88-c895b6483d98'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(51ab40c3-9fd5-4c48-8521-4ed7dd4decec)?view=full'
                },
                {
                    'uuid': '52f05bde-2a56-4b5d-b9b1-197d2bac3547',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN ALUMINUM',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': true,
                    'references': [
                        '75ce23fa-b163-49f3-8cea-6be6c43a70bf',
                        'e2a29346-2078-473c-b5a7-27c5095da959',
                        'fcb51d26-8469-4255-a3ec-0417533ef81e'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(52f05bde-2a56-4b5d-b9b1-197d2bac3547)?view=full'
                },
                {
                    'uuid': '6beb1ffb-a652-4e9c-a198-5450005f0441',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ALUMINIUM, BIS(2-(ACETYLOXY)BENZOATO)-',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '87e2d8aa-6d7f-4055-a024-9b0b1cd8593e'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(6beb1ffb-a652-4e9c-a198-5450005f0441)?view=full'
                },
                {
                    'uuid': '76ee30c9-f837-488e-b70e-03d1ba8973f3',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ALUMINIUM BIS(O-ACETYL SALICYLATE)',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '8dba98c3-c3b2-4248-ace4-c3f4ca4b1b5f'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(76ee30c9-f837-488e-b70e-03d1ba8973f3)?view=full'
                },
                {
                    'uuid': '892e54ff-5a98-4be6-add2-186a761d70e7',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ALUMINUM BIS(ACETYLSALICYLATE) [MI]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '8dba98c3-c3b2-4248-ace4-c3f4ca4b1b5f'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(892e54ff-5a98-4be6-add2-186a761d70e7)?view=full'
                },
                {
                    'uuid': '958c4bd4-f8a8-4b3d-b7cc-6542e8423e76',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN ALUMINUM [JAN]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'e2a29346-2078-473c-b5a7-27c5095da959'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(958c4bd4-f8a8-4b3d-b7cc-6542e8423e76)?view=full'
                },
                {
                    'uuid': '99dcce59-0962-48b5-a642-5309dc09f45e',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLIC ACID ALUMINIUM [WHO-DD]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '92681a98-a736-4c99-acc0-887df8b81c9d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(99dcce59-0962-48b5-a642-5309dc09f45e)?view=full'
                },
                {
                    'uuid': 'a0d8e83e-74fd-4044-950e-8bdd467b3d4d',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ALUMINIUM, HYDROXYBIS(SALICYLIC ACID ACETATO)-',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '87e2d8aa-6d7f-4055-a024-9b0b1cd8593e'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(a0d8e83e-74fd-4044-950e-8bdd467b3d4d)?view=full'
                },
                {
                    'uuid': 'a1287298-c9b3-4019-9829-a3a00437e5b7',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'BIS(2-(ACETYLOXY)BENZOATO-O(SUP 1))HYDROXYALUMINIUM',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '87e2d8aa-6d7f-4055-a024-9b0b1cd8593e'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(a1287298-c9b3-4019-9829-a3a00437e5b7)?view=full'
                },
                {
                    'uuid': 'a8db116a-d2fe-4c82-a8ef-213026eebc49',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ALUMINUM BIS(ACETYLSALICYLATE)',
                    'type': 'sys',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '0dac3f08-e0e6-49c0-9718-01daa026c40d',
                        '8dba98c3-c3b2-4248-ace4-c3f4ca4b1b5f'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(a8db116a-d2fe-4c82-a8ef-213026eebc49)?view=full'
                },
                {
                    'uuid': 'c392e70f-c98b-4213-9cf6-048d2972370a',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN, ALUMINIUM',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '87e2d8aa-6d7f-4055-a024-9b0b1cd8593e'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(c392e70f-c98b-4213-9cf6-048d2972370a)?view=full'
                },
                {
                    'uuid': 'd121bc88-0a71-467d-9d27-07d90c8111c9',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ALUMINUM ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'e1f69a5b-c6ac-4ed6-8e2a-d18a945de4fc'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(d121bc88-0a71-467d-9d27-07d90c8111c9)?view=full'
                },
                {
                    'uuid': 'd8fc7c68-66f1-43d7-9402-d10b6615a484',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ALUMINIUM BIS(ACETYLSALICYLATE) [WHO-DD]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '92681a98-a736-4c99-acc0-887df8b81c9d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(d8fc7c68-66f1-43d7-9402-d10b6615a484)?view=full'
                },
                {
                    'uuid': 'dcc37203-8c84-4429-abb0-03be2d7ce9fc',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'HYDROXYBIS(SALICYLIC ACID ACETATO)ALUMINIUM',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '87e2d8aa-6d7f-4055-a024-9b0b1cd8593e'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(dcc37203-8c84-4429-abb0-03be2d7ce9fc)?view=full'
                },
                {
                    'uuid': 'e82a7357-d9d0-432d-a6bc-f79a68e2e9a4',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ALUMINIUM ASPIRIN [MART.]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '1e0a0782-c8c1-40dc-852d-8275710770f6'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(e82a7357-d9d0-432d-a6bc-f79a68e2e9a4)?view=full'
                },
                {
                    'uuid': 'fd7a5bfe-3a3b-4e7b-80c2-2e45c977ed0c',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ALUMINIUM, BIS(2-(ACETYLOXY)BENZOATO-.KAPPA.O)HYDROXY-',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '87e2d8aa-6d7f-4055-a024-9b0b1cd8593e'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(fd7a5bfe-3a3b-4e7b-80c2-2e45c977ed0c)?view=full'
                }
            ],
            'codes': [
                {
                    'uuid': '8ccec753-3800-4b85-aebe-5bcb801861b3',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'CAS',
                    'code': '23413-80-1',
                    'type': 'PRIMARY',
                    'url': 'http://chem.sis.nlm.nih.gov/chemidplus/direct.jsp?regno=23413-80-1&result=advanced',
                    'references': [
                        'b670a497-60d2-4aae-81e4-87a593d83992'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(8ccec753-3800-4b85-aebe-5bcb801861b3)?view=full'
                },
                {
                    'uuid': '9e809a75-0a01-4392-b0f4-f1b4cfe27c88',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'RXCUI',
                    'code': '611',
                    'comments': 'RxNorm',
                    'type': 'PRIMARY',
                    'url': 'https://rxnav.nlm.nih.gov/REST/rxcui/611/allProperties.xml?prop=all',
                    'references': [
                        'b670a497-60d2-4aae-81e4-87a593d83992'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(9e809a75-0a01-4392-b0f4-f1b4cfe27c88)?view=full'
                },
                {
                    'uuid': 'c416f2ce-64b1-4ec9-ac49-88699c8e5221',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'ECHA (EC/EINECS)',
                    'code': '245-645-0',
                    'type': 'PRIMARY',
                    'url': 'https://echa.europa.eu/substance-information/-/substanceinfo/100.041.481',
                    'references': [
                        'b670a497-60d2-4aae-81e4-87a593d83992'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(c416f2ce-64b1-4ec9-ac49-88699c8e5221)?view=full'
                },
                {
                    'uuid': 'de4d4b92-082d-43d3-a98a-1435338f1d49',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'NCI_THESAURUS',
                    'code': 'C76795',
                    'type': 'PRIMARY',
                    'url': 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=15.09d&ns=NCI_Thesaurus&code=C76795',
                    'references': [
                        'b670a497-60d2-4aae-81e4-87a593d83992'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(de4d4b92-082d-43d3-a98a-1435338f1d49)?view=full'
                },
                {
                    'uuid': 'e1812deb-becd-485d-8d5c-03bb9010636d',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'MERCK INDEX',
                    'code': 'M20',
                    'comments': 'Merck Index',
                    'type': 'PRIMARY',
                    'url': 'https://www.rsc.org/Merck-Index/monograph/M20?q=authorize',
                    'references': [
                        'b670a497-60d2-4aae-81e4-87a593d83992'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(e1812deb-becd-485d-8d5c-03bb9010636d)?view=full'
                },
                {
                    'uuid': 'e55d0b78-ea7d-439c-916a-667ef6e0d025',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'EVMPD',
                    'code': 'SUB12957MIG',
                    'type': 'PRIMARY',
                    'references': [
                        'b670a497-60d2-4aae-81e4-87a593d83992'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(e55d0b78-ea7d-439c-916a-667ef6e0d025)?view=full'
                },
                {
                    'uuid': 'e99f482c-8983-4194-897d-ea95f218e656',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'PUBCHEM',
                    'code': '3032790',
                    'type': 'PRIMARY',
                    'url': 'https://pubchem.ncbi.nlm.nih.gov/compound/3032790',
                    'references': [
                        'b670a497-60d2-4aae-81e4-87a593d83992'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(e99f482c-8983-4194-897d-ea95f218e656)?view=full'
                }
            ],
            'notes': [],
            'properties': [],
            'relationships': [
                {
                    'uuid': '5fffb1d7-d302-4009-8118-f9d372271395',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'relatedSubstance': {
                        'uuid': '58a7db5b-d775-4ecd-b57d-b8b028b517a8',
                        'created': 1520374592000,
                        'createdBy': 'admin',
                        'lastEdited': 1520374592000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'refPname': 'ASPIRIN',
                        'refuuid': 'a05ec20c-8fe2-4e02-ba7f-df69e5e30248',
                        'substanceClass': 'reference',
                        'approvalID': 'R16CO5Y76E',
                        'linkingID': 'R16CO5Y76E',
                        'name': 'ASPIRIN',
                        'references': [],
                        'access': []
                    },
                    'originatorUuid': '5fffb1d7-d302-4009-8118-f9d372271395',
                    'type': 'ACTIVE MOIETY',
                    'references': [],
                    'access': []
                }
            ],
            'references': [
                {
                    'uuid': '0dac3f08-e0e6-49c0-9718-01daa026c40d',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ALUMINUM BIS(ACETYLSALICYLATE) [MI]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(0dac3f08-e0e6-49c0-9718-01daa026c40d)?view=full'
                },
                {
                    'uuid': '15ce1916-0c2d-4e5e-94d6-60fdcfb1fbc7',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ALUMINIUM BIS(ACETYLSALICYLATE) [WHO-DD]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(15ce1916-0c2d-4e5e-94d6-60fdcfb1fbc7)?view=full'
                },
                {
                    'uuid': '17cd12fe-7f9a-4c5e-8c88-c895b6483d98',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ACETYLSALICYLIC ACID ALUMINIUM [WHO-DD]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(17cd12fe-7f9a-4c5e-8c88-c895b6483d98)?view=full'
                },
                {
                    'uuid': '1e0a0782-c8c1-40dc-852d-8275710770f6',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'MARTINDALE 2011',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(1e0a0782-c8c1-40dc-852d-8275710770f6)?view=full'
                },
                {
                    'uuid': '415087e1-f759-4794-b6ab-bc69abb0dcab',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'OTC',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(415087e1-f759-4794-b6ab-bc69abb0dcab)?view=full'
                },
                {
                    'uuid': '6bfa69bf-08a0-42b2-b582-3d374d4030d2',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'USP Dictionary;',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(6bfa69bf-08a0-42b2-b582-3d374d4030d2)?view=full'
                },
                {
                    'uuid': '75ce23fa-b163-49f3-8cea-6be6c43a70bf',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ASPIRIN ALUMINUM [JAN]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(75ce23fa-b163-49f3-8cea-6be6c43a70bf)?view=full'
                },
                {
                    'uuid': '87e2d8aa-6d7f-4055-a024-9b0b1cd8593e',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'FDA-SRS 2010',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(87e2d8aa-6d7f-4055-a024-9b0b1cd8593e)?view=full'
                },
                {
                    'uuid': '8dba98c3-c3b2-4248-ace4-c3f4ca4b1b5f',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'MERCK',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(8dba98c3-c3b2-4248-ace4-c3f4ca4b1b5f)?view=full'
                },
                {
                    'uuid': '92681a98-a736-4c99-acc0-887df8b81c9d',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'WHO-DD',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(92681a98-a736-4c99-acc0-887df8b81c9d)?view=full'
                },
                {
                    'uuid': 'b670a497-60d2-4aae-81e4-87a593d83992',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'SRS CODE IMPORT',
                    'docType': 'SRS',
                    'documentDate': 1493389656000,
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(b670a497-60d2-4aae-81e4-87a593d83992)?view=full'
                },
                {
                    'uuid': 'bf7d320e-1cd9-4b94-b1c9-1dbf9807bdb4',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'WHO',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(bf7d320e-1cd9-4b94-b1c9-1dbf9807bdb4)?view=full'
                },
                {
                    'uuid': 'd7607151-c8d4-4a3d-b6ac-b40deceddd2d',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'SWISS MEDIC',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(d7607151-c8d4-4a3d-b6ac-b40deceddd2d)?view=full'
                },
                {
                    'uuid': 'e1f69a5b-c6ac-4ed6-8e2a-d18a945de4fc',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'rxnorm',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(e1f69a5b-c6ac-4ed6-8e2a-d18a945de4fc)?view=full'
                },
                {
                    'uuid': 'e2a29346-2078-473c-b5a7-27c5095da959',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'jan',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(e2a29346-2078-473c-b5a7-27c5095da959)?view=full'
                },
                {
                    'uuid': 'f4806bad-123c-458e-8445-49ef1895028d',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'STN',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(f4806bad-123c-458e-8445-49ef1895028d)?view=full'
                },
                {
                    'uuid': 'f62fb0e6-5ee6-4cf7-b030-09bed7d868c9',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'SRS import [E33TS05V6B]',
                    'docType': 'SRS',
                    'documentDate': 1493389656000,
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'url': 'http://fdasis.nlm.nih.gov/srs/srsdirect.jsp?regno=E33TS05V6B',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(f62fb0e6-5ee6-4cf7-b030-09bed7d868c9)?view=full'
                },
                {
                    'uuid': 'f795cbf3-e597-40ba-ac5f-714b32c99f42',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'dump-public-2018-03-05.gsrs',
                    'docType': 'BATCH_IMPORT',
                    'documentDate': 1520374592000,
                    'publicDomain': false,
                    'tags': [],
                    'id': 'b9fdcca829e0ff2e96ec',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(f795cbf3-e597-40ba-ac5f-714b32c99f42)?view=full'
                },
                {
                    'uuid': 'fcb51d26-8469-4255-a3ec-0417533ef81e',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'USP Dictionary',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN',
                        'PUBLIC_DOMAIN_RELEASE',
                        'AUTO_SELECTED'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(fcb51d26-8469-4255-a3ec-0417533ef81e)?view=full'
                }
            ],
            'approvalID': 'E33TS05V6B',
            'tags': [
                'MART.',
                'WHO-DD',
                'WHO-DD',
                'JAN',
                'MI'
            ],
            'structure': {
                'id': 'ca024e80-60d2-4b5f-ba1e-ba4dc8b21599',
                'created': 1520374592000,
                'lastEdited': 1520374592000,
                'deprecated': false,
                'digest': '97e36bd4456b5628aaa8b59c119acb044a5f7067',
                'molfile': '\n  Symyx   04271718532D 1   1.00000     0.00000     0\n\n 28 26  0     0  0            999 V2000\n   -2.7854   -2.6928    0.0000 C   0  0  0  0  0  0           0  0  0\n   -1.6375   -2.0395    0.0000 C   0  0  0  0  0  0           0  0  0\n   -2.7986   -4.0427    0.0000 C   0  0  0  0  0  0           0  0  0\n   -1.6498   -4.6881    0.0000 O   0  0  0  0  0  0           0  0  0\n   -1.6340   -6.0215    0.0000 C   0  0  0  0  0  0           0  0  0\n   -0.4861   -2.6978    0.0000 O   0  5  0  0  0  0           0  0  0\n   -1.6311   -0.7366    0.0000 O   0  0  0  0  0  0           0  0  0\n   -0.5018   -6.7051    0.0000 O   0  0  0  0  0  0           0  0  0\n   -3.9466   -2.0257    0.0000 C   0  0  0  0  0  0           0  0  0\n   -3.9248   -4.6837    0.0000 C   0  0  0  0  0  0           0  0  0\n   -2.7891   -6.6790    0.0000 C   0  0  0  0  0  0           0  0  0\n   -5.1126   -2.6894    0.0000 C   0  0  0  0  0  0           0  0  0\n   -5.1139   -4.0517    0.0000 C   0  0  0  0  0  0           0  0  0\n    1.6375   -3.4042    0.0000 Al  0  1  0  0  0  0           0  0  0\n    3.0542   -3.4042    0.0000 O   0  5  0  0  0  0           0  0  0\n   -2.7854   -2.6928    0.0000 C   0  0  0  0  0  0           0  0  0\n   -1.6375   -2.0395    0.0000 C   0  0  0  0  0  0           0  0  0\n   -2.7986   -4.0427    0.0000 C   0  0  0  0  0  0           0  0  0\n   -1.6498   -4.6881    0.0000 O   0  0  0  0  0  0           0  0  0\n   -1.6340   -6.0215    0.0000 C   0  0  0  0  0  0           0  0  0\n   -0.4861   -2.6978    0.0000 O   0  5  0  0  0  0           0  0  0\n   -1.6311   -0.7366    0.0000 O   0  0  0  0  0  0           0  0  0\n   -0.5018   -6.7051    0.0000 O   0  0  0  0  0  0           0  0  0\n   -3.9466   -2.0257    0.0000 C   0  0  0  0  0  0           0  0  0\n   -3.9248   -4.6837    0.0000 C   0  0  0  0  0  0           0  0  0\n   -2.7891   -6.6790    0.0000 C   0  0  0  0  0  0           0  0  0\n   -5.1126   -2.6894    0.0000 C   0  0  0  0  0  0           0  0  0\n   -5.1139   -4.0517    0.0000 C   0  0  0  0  0  0           0  0  0\n  6  2  1  0     0  0\n  7  2  2  0     0  0\n  8  5  2  0     0  0\n  9  1  1  0     0  0\n 10  3  1  0     0  0\n 11  5  1  0     0  0\n 12  9  2  0     0  0\n 13 12  1  0     0  0\n 13 10  2  0     0  0\n  2  1  1  0     0  0\n  3  1  2  0     0  0\n  4  3  1  0     0  0\n  5  4  1  0     0  0\n 23 20  2  0     0  0\n 24 16  1  0     0  0\n 25 18  1  0     0  0\n 26 20  1  0     0  0\n 27 24  2  0     0  0\n 28 27  1  0     0  0\n 28 25  2  0     0  0\n 17 16  1  0     0  0\n 18 16  2  0     0  0\n 19 18  1  0     0  0\n 20 19  1  0     0  0\n 21 17  1  0     0  0\n 22 17  2  0     0  0\nM  CHG  4   6  -1  14   3  15  -1  21  -1\nM  STY  1   1 MUL\nM  SLB  1   1   1\nM  SCN  1   1 HT\nM  SAL   1 15   1   2   3   4   5   6   7   8   9  10  11  12  13  16  17\nM  SAL   1 11  18  19  20  21  22  23  24  25  26  27  28\nM  SPA   1 13   1   2   3   4   5   6   7   8   9  10  11  12  13\nM  SMT   1 2\nM  SDI   1  4   -5.6500   -7.2500   -5.6500   -0.2000\nM  SDI   1  4    0.2000   -0.2000    0.2000   -7.2500\nM  END\n',
                'smiles': '[OH-].[Al+3].CC(=O)OC1=C(C=CC=C1)C([O-])=O.CC(=O)OC2=C(C=CC=C2)C([O-])=O',
                'formula': '2C9H7O4.Al.HO',
                'opticalActivity': 'UNSPECIFIED',
                'atropisomerism': 'No',
                'stereoCenters': 0,
                'definedStereo': 0,
                'ezCenters': 0,
                'charge': 0,
                'mwt': 402.2878,
                'count': 1,
                'createdBy': 'admin',
                'lastEditedBy': 'admin',
                'hash': 'YHND6SXURDHC',
                'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(ca024e80-60d2-4b5f-ba1e-ba4dc8b21599)?view=full',
                'stereochemistry': 'ACHIRAL',
                'references': [
                    'f62fb0e6-5ee6-4cf7-b030-09bed7d868c9',
                    '6bfa69bf-08a0-42b2-b582-3d374d4030d2'
                ],
                'access': []
            },
            'moieties': [
                {
                    'uuid': '954938d4-6f4d-4cd7-9715-3072c38ef52f',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'id': '954938d4-6f4d-4cd7-9715-3072c38ef52f',
                    'digest': '2faba7d9053e7ba44b913cc66f3c656d6de52e05',
                    'molfile': '\n  Marvin  04291703152D          \n\n  1  0  0  0  0  0            999 V2000\n    1.8815   -2.0971    0.0000 O   0  5  0  0  0  0  0  0  0  0  0  0\nM  CHG  1   1  -1\nM  END\n',
                    'smiles': '[OH-]',
                    'formula': 'HO',
                    'opticalActivity': 'NONE',
                    'stereoCenters': 0,
                    'definedStereo': 0,
                    'ezCenters': 0,
                    'charge': -1,
                    'mwt': 17.0073,
                    'count': 1,
                    'hash': 'VQJWYZ562M4C',
                    'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(954938d4-6f4d-4cd7-9715-3072c38ef52f)?view=full',
                    'stereochemistry': 'ACHIRAL',
                    'references': [],
                    'access': [],
                    'countAmount': {
                        'uuid': '4be52c55-8d95-426a-8682-cebf1b92caf7',
                        'created': 1520374592000,
                        'createdBy': 'admin',
                        'lastEdited': 1520374592000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'type': 'MOL RATIO',
                        'average': 1.0,
                        'units': 'MOL RATIO',
                        'references': [],
                        'access': []
                    }
                },
                {
                    'uuid': '597cb62e-32e6-4b05-b8a1-48b2394aa400',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'id': '597cb62e-32e6-4b05-b8a1-48b2394aa400',
                    'digest': '620f7ba86dcde8c32fd75b3168e0fa87c71bb755',
                    'molfile': '\n  Marvin  04291703152D          \n\n 13 13  0  0  0  0            999 V2000\n   -1.7182   -4.1146    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.0066   -3.7095    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.3091   -4.1307    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.0164   -2.8881    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.7241   -2.4905    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -2.4179   -2.8854    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -3.1504   -2.4960    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -3.1496   -1.6568    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -2.4313   -1.2479    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.7159   -1.6589    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.0088   -1.2564    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.2995   -1.6620    0.0000 O   0  5  0  0  0  0  0  0  0  0  0  0\n   -1.0048   -0.4538    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  3  2  2  0  0  0  0\n  2  4  1  0  0  0  0\n  4  5  1  0  0  0  0\n  6  5  1  0  0  0  0\n  5 10  2  0  0  0  0\n  7  6  2  0  0  0  0\n  7  8  1  0  0  0  0\n  8  9  2  0  0  0  0\n  9 10  1  0  0  0  0\n 11 10  1  0  0  0  0\n 12 11  1  0  0  0  0\n 13 11  2  0  0  0  0\nM  CHG  1  12  -1\nM  END\n',
                    'smiles': 'CC(=O)OC1=C(C=CC=C1)C([O-])=O',
                    'formula': 'C9H7O4',
                    'opticalActivity': 'NONE',
                    'stereoCenters': 0,
                    'definedStereo': 0,
                    'ezCenters': 0,
                    'charge': -1,
                    'mwt': 179.1495,
                    'count': 2,
                    'hash': 'NNQ793F142LD',
                    'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(597cb62e-32e6-4b05-b8a1-48b2394aa400)?view=full',
                    'stereochemistry': 'ACHIRAL',
                    'references': [],
                    'access': [],
                    'countAmount': {
                        'uuid': '65824687-04e3-499d-805d-7874aa4c59b3',
                        'created': 1520374592000,
                        'createdBy': 'admin',
                        'lastEdited': 1520374592000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'type': 'MOL RATIO',
                        'average': 2.0,
                        'units': 'MOL RATIO',
                        'references': [],
                        'access': []
                    }
                },
                {
                    'uuid': '38b27076-9004-4d71-9ff7-16575d91897e',
                    'created': 1520374592000,
                    'createdBy': 'admin',
                    'lastEdited': 1520374592000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'id': '38b27076-9004-4d71-9ff7-16575d91897e',
                    'digest': '394edb4e0222bf883f40bf58a10790d035af1a09',
                    'molfile': '\n  Marvin  04291703152D          \n\n  1  0  0  0  0  0            999 V2000\n    1.0088   -2.0971    0.0000 Al  0  1  0  0  0  0  0  0  0  0  0  0\nM  CHG  1   1   3\nM  END\n',
                    'smiles': '[Al+3]',
                    'formula': 'Al',
                    'opticalActivity': 'NONE',
                    'stereoCenters': 0,
                    'definedStereo': 0,
                    'ezCenters': 0,
                    'charge': 3,
                    'mwt': 26.9815386,
                    'count': 1,
                    'hash': 'VDTT9FYX4XVV',
                    'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(38b27076-9004-4d71-9ff7-16575d91897e)?view=full',
                    'stereochemistry': 'ACHIRAL',
                    'references': [],
                    'access': [],
                    'countAmount': {
                        'uuid': '047de43d-4d57-45fd-ac89-e723f1ae28e9',
                        'created': 1520374592000,
                        'createdBy': 'admin',
                        'lastEdited': 1520374592000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'type': 'MOL RATIO',
                        'average': 1.0,
                        'units': 'MOL RATIO',
                        'references': [],
                        'access': []
                    }
                }
            ],
            '_approvalIDDisplay': 'E33TS05V6B',
            '_name': 'ASPIRIN ALUMINUM',
            'access': [],
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(39305c46-e2bd-4343-bdd3-8502874c9f1e)?view=full'
        },
        {
            'uuid': '8231d86a-8996-4d88-831d-670daeed7d78',
            'created': 1520373953000,
            'createdBy': 'admin',
            'lastEdited': 1520373953000,
            'lastEditedBy': 'admin',
            'deprecated': false,
            'definitionType': 'PRIMARY',
            'definitionLevel': 'COMPLETE',
            'substanceClass': 'chemical',
            'status': 'approved',
            'version': '1',
            'approvedBy': 'FDA_SRS',
            'names': [
                {
                    'uuid': '0b6420db-f475-48a6-b85b-ccacc733b509',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLATE LYSINE',
                    'type': 'sys',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'ab0a094e-d51a-47c6-8d5c-76342b824007',
                        '390e14bf-5f63-4363-bbf2-2fab724b6209',
                        'c3382819-a569-4a43-8166-e638e8aaa85c'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(0b6420db-f475-48a6-b85b-ccacc733b509)?view=full'
                },
                {
                    'uuid': '11357530-e993-4ed5-9358-787d0e731c1f',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'DL-LYSINE-ACETYLSALICYLATE',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'ce3778d1-0bcd-4db7-bd51-98be257978d9'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(11357530-e993-4ed5-9358-787d0e731c1f)?view=full'
                },
                {
                    'uuid': '12e9445b-6832-4771-ae45-6fc013192cbc',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN DL-LYSINE [JAN]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'ab0a094e-d51a-47c6-8d5c-76342b824007'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(12e9445b-6832-4771-ae45-6fc013192cbc)?view=full'
                },
                {
                    'uuid': '41d88aac-be51-4d8e-9aa6-283991ac85e1',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLATE LYSINE [WHO-DD]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '390e14bf-5f63-4363-bbf2-2fab724b6209'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(41d88aac-be51-4d8e-9aa6-283991ac85e1)?view=full'
                },
                {
                    'uuid': '4eadde08-d145-486e-bdc3-3abe69ea3f05',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'LYSINE ASPIRIN [MART.]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'b446b773-950b-48b0-8bc9-fcf99e119e32'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(4eadde08-d145-486e-bdc3-3abe69ea3f05)?view=full'
                },
                {
                    'uuid': '56817f63-e05f-48f5-9817-c9132e3203fe',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'SOLPIRIN',
                    'type': 'bn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '34110f25-828a-44fe-8ac8-2c7b82167866'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(56817f63-e05f-48f5-9817-c9132e3203fe)?view=full'
                },
                {
                    'uuid': '5aac174d-5d9f-4286-8a68-b72159180b17',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'EGICALM',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '34110f25-828a-44fe-8ac8-2c7b82167866'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(5aac174d-5d9f-4286-8a68-b72159180b17)?view=full'
                },
                {
                    'uuid': '5ce2e762-26cb-4011-959f-86ca79611384',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'DL-LYSINE ACETYLSALICYLATE',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '34110f25-828a-44fe-8ac8-2c7b82167866'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(5ce2e762-26cb-4011-959f-86ca79611384)?view=full'
                },
                {
                    'uuid': '6bced7b2-7260-42dc-9017-75ca5897ca17',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPEGIC',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '34110f25-828a-44fe-8ac8-2c7b82167866'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(6bced7b2-7260-42dc-9017-75ca5897ca17)?view=full'
                },
                {
                    'uuid': '78d6b7ab-edfc-430b-a7b9-78ac78bb92ef',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN DL-LYSINE',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': true,
                    'references': [
                        'ce3778d1-0bcd-4db7-bd51-98be257978d9',
                        'ab0a094e-d51a-47c6-8d5c-76342b824007',
                        '716cc3ed-9513-4370-9154-9c5e03c90332'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(78d6b7ab-edfc-430b-a7b9-78ac78bb92ef)?view=full'
                },
                {
                    'uuid': '81944f6b-5801-4756-bcf1-8cde050e585d',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'VENOPIRIN',
                    'type': 'bn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '34110f25-828a-44fe-8ac8-2c7b82167866'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(81944f6b-5801-4756-bcf1-8cde050e585d)?view=full'
                },
                {
                    'uuid': 'b0a2556b-7468-4d5c-8b66-f1703a2bdd9d',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRISINE',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '34110f25-828a-44fe-8ac8-2c7b82167866'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(b0a2556b-7468-4d5c-8b66-f1703a2bdd9d)?view=full'
                },
                {
                    'uuid': 'b48e4377-67b3-49e8-a07d-9dd913d4112c',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIDOL',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '34110f25-828a-44fe-8ac8-2c7b82167866'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(b48e4377-67b3-49e8-a07d-9dd913d4112c)?view=full'
                },
                {
                    'uuid': 'c4f8f1df-7b2f-433d-8423-973fadc1bcf0',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'VETALGINE',
                    'type': 'bn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '34110f25-828a-44fe-8ac8-2c7b82167866'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(c4f8f1df-7b2f-433d-8423-973fadc1bcf0)?view=full'
                },
                {
                    'uuid': 'da88e410-7f81-48ed-bbd1-dfac6d498924',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'LYSINE ACETYLSALICYLATE [MI]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '417a791a-0593-4f70-b1b4-22f1467430ac'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(da88e410-7f81-48ed-bbd1-dfac6d498924)?view=full'
                }
            ],
            'codes': [
                {
                    'uuid': '381c6dc7-ae06-4b7c-bbf3-644824070dc1',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'EVMPD',
                    'code': 'SUB12727MIG',
                    'type': 'PRIMARY',
                    'references': [
                        '460e680a-75d5-429f-86ee-9d8f9c947ef8'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(381c6dc7-ae06-4b7c-bbf3-644824070dc1)?view=full'
                },
                {
                    'uuid': '415a0a95-37ad-4911-bcbf-a1e33c7acd30',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'EVMPD',
                    'code': 'SUB34053',
                    'type': 'PRIMARY',
                    'references': [
                        '460e680a-75d5-429f-86ee-9d8f9c947ef8'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(415a0a95-37ad-4911-bcbf-a1e33c7acd30)?view=full'
                },
                {
                    'uuid': '47037db9-f8d6-4cab-84e2-08ed7640ffbd',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'MERCK INDEX',
                    'code': 'M6968',
                    'comments': 'Merck Index',
                    'type': 'PRIMARY',
                    'url': 'https://www.rsc.org/Merck-Index/monograph/M6968?q=authorize',
                    'references': [
                        '460e680a-75d5-429f-86ee-9d8f9c947ef8'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(47037db9-f8d6-4cab-84e2-08ed7640ffbd)?view=full'
                },
                {
                    'uuid': '533167f2-bc65-47c2-bfa5-a82fdf835728',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'NCI_THESAURUS',
                    'code': 'C91032',
                    'type': 'PRIMARY',
                    'url': 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=15.09d&ns=NCI_Thesaurus&code=C91032',
                    'references': [
                        '460e680a-75d5-429f-86ee-9d8f9c947ef8'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(533167f2-bc65-47c2-bfa5-a82fdf835728)?view=full'
                },
                {
                    'uuid': 'afb929bb-9a4d-4511-818b-46e182c8e738',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'CAS',
                    'code': '62952-06-1',
                    'type': 'PRIMARY',
                    'url': 'http://chem.sis.nlm.nih.gov/chemidplus/direct.jsp?regno=62952-06-1&result=advanced',
                    'references': [
                        '460e680a-75d5-429f-86ee-9d8f9c947ef8'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(afb929bb-9a4d-4511-818b-46e182c8e738)?view=full'
                },
                {
                    'uuid': 'e708669a-71cd-4c77-94b2-88d6400f5bb6',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'ECHA (EC/EINECS)',
                    'code': '263-769-3',
                    'type': 'PRIMARY',
                    'url': 'https://echa.europa.eu/substance-information/-/substanceinfo/100.057.954',
                    'references': [
                        '460e680a-75d5-429f-86ee-9d8f9c947ef8'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(e708669a-71cd-4c77-94b2-88d6400f5bb6)?view=full'
                }
            ],
            'notes': [
                {
                    'uuid': 'd5e601ec-8524-4163-a8ec-56ad41e339a4',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Structure has 1 possible duplicate:\n[XAN4V337CI]ASPIRIN LYSINE',
                    'references': [
                        '6eb6f38d-525b-4a25-babd-8701931c280d'
                    ],
                    'access': [
                        'admin'
                    ]
                },
                {
                    'uuid': 'e618fdc1-3468-407a-b6d2-f5140cf8fcad',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Code \'SUB34053\'[EVMPD] collides (possible duplicate) with existing code & codeSystem for substance:\n[XAN4V337CI]ASPIRIN LYSINE',
                    'references': [
                        '6eb6f38d-525b-4a25-babd-8701931c280d'
                    ],
                    'access': [
                        'admin'
                    ]
                }
            ],
            'properties': [],
            'relationships': [
                {
                    'uuid': '1a544f65-4759-4d11-88bf-19e59dda0ed0',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'relatedSubstance': {
                        'uuid': 'b78d0b90-27a5-42ea-bb25-65d9001e167d',
                        'created': 1520373953000,
                        'createdBy': 'admin',
                        'lastEdited': 1520373953000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'refPname': 'ASPIRIN',
                        'refuuid': 'a05ec20c-8fe2-4e02-ba7f-df69e5e30248',
                        'substanceClass': 'reference',
                        'approvalID': 'R16CO5Y76E',
                        'linkingID': 'R16CO5Y76E',
                        'name': 'ASPIRIN',
                        'references': [],
                        'access': []
                    },
                    'originatorUuid': '1a544f65-4759-4d11-88bf-19e59dda0ed0',
                    'type': 'ACTIVE MOIETY',
                    'references': [],
                    'access': []
                }
            ],
            'references': [
                {
                    'uuid': '34110f25-828a-44fe-8ac8-2c7b82167866',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'STN',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(34110f25-828a-44fe-8ac8-2c7b82167866)?view=full'
                },
                {
                    'uuid': '390e14bf-5f63-4363-bbf2-2fab724b6209',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'WHO-DD',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(390e14bf-5f63-4363-bbf2-2fab724b6209)?view=full'
                },
                {
                    'uuid': '417a791a-0593-4f70-b1b4-22f1467430ac',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'MERCK INDEX',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(417a791a-0593-4f70-b1b4-22f1467430ac)?view=full'
                },
                {
                    'uuid': '460e680a-75d5-429f-86ee-9d8f9c947ef8',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'SRS CODE IMPORT',
                    'docType': 'SRS',
                    'documentDate': 1493390756000,
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(460e680a-75d5-429f-86ee-9d8f9c947ef8)?view=full'
                },
                {
                    'uuid': '5c017f2e-b0fc-4e34-ab56-df8b41d47882',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'SRS import [2JJ274J145]',
                    'docType': 'SRS',
                    'documentDate': 1493390756000,
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'url': 'http://fdasis.nlm.nih.gov/srs/srsdirect.jsp?regno=2JJ274J145',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(5c017f2e-b0fc-4e34-ab56-df8b41d47882)?view=full'
                },
                {
                    'uuid': '6eb6f38d-525b-4a25-babd-8701931c280d',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'GSRS System-generated Validation messages',
                    'docType': 'VALIDATION_MESSAGE',
                    'documentDate': 1520373953000,
                    'publicDomain': false,
                    'tags': [],
                    'access': [
                        'admin'
                    ],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(6eb6f38d-525b-4a25-babd-8701931c280d)?view=full'
                },
                {
                    'uuid': '716cc3ed-9513-4370-9154-9c5e03c90332',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ASPIRIN DL-LYSINE [JAN]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(716cc3ed-9513-4370-9154-9c5e03c90332)?view=full'
                },
                {
                    'uuid': '872d37e0-be47-4204-8fea-38980c111420',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'dump-public-2018-03-05.gsrs',
                    'docType': 'BATCH_IMPORT',
                    'documentDate': 1520373953000,
                    'publicDomain': false,
                    'tags': [],
                    'id': 'b9fdcca829e0ff2e96ec',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(872d37e0-be47-4204-8fea-38980c111420)?view=full'
                },
                {
                    'uuid': 'ab0a094e-d51a-47c6-8d5c-76342b824007',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'FDA_SRS',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(ab0a094e-d51a-47c6-8d5c-76342b824007)?view=full'
                },
                {
                    'uuid': 'b446b773-950b-48b0-8bc9-fcf99e119e32',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'MARTINDALE 2011',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(b446b773-950b-48b0-8bc9-fcf99e119e32)?view=full'
                },
                {
                    'uuid': 'c3382819-a569-4a43-8166-e638e8aaa85c',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ACETYLSALICYLATE LYSINE [WHO-DD]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(c3382819-a569-4a43-8166-e638e8aaa85c)?view=full'
                },
                {
                    'uuid': 'ce3778d1-0bcd-4db7-bd51-98be257978d9',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'USP DICTIONARY 2009',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN',
                        'PUBLIC_DOMAIN_RELEASE',
                        'AUTO_SELECTED'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(ce3778d1-0bcd-4db7-bd51-98be257978d9)?view=full'
                }
            ],
            'approvalID': '2JJ274J145',
            'tags': [
                'MART.',
                'JAN',
                'MI',
                'WHO-DD'
            ],
            'structure': {
                'id': '0ca4dbf2-4b92-4022-abc4-14bce7b1fdc1',
                'created': 1520373953000,
                'lastEdited': 1520373953000,
                'deprecated': false,
                'digest': '9a0eeb68c7c616f6f2d82bef12aa5b9f27fd2ff5',
                'molfile': '\n  Symyx   04271719122D 1   1.00000     0.00000     0\n\n 23 22  0     0  0            999 V2000\n    8.9508   -4.6768    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.9508   -3.9413    0.0000 C   0  0  0  0  0  0           0  0  0\n    9.5948   -3.5711    0.0000 O   0  0  0  0  0  0           0  0  0\n    8.3165   -3.5711    0.0000 O   0  0  0  0  0  0           0  0  0\n    9.5948   -5.0469    0.0000 C   0  0  0  0  0  0           0  0  0\n    9.5948   -5.7885    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.9508   -6.1525    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.3069   -5.7885    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.3069   -5.0469    0.0000 C   0  0  0  0  0  0           0  0  0\n   10.2311   -4.6768    0.0000 O   0  0  0  0  0  0           0  0  0\n   10.8785   -5.0407    0.0000 C   0  0  0  0  0  0           0  0  0\n   11.5871   -4.7318    0.0000 O   0  0  0  0  0  0           0  0  0\n   10.8785   -5.7493    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.0981   -5.0303    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.4734   -5.4376    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.8102   -5.0861    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.1697   -5.4508    0.0000 C   0  0  0  0  0  0           0  0  0\n    2.5061   -5.0861    0.0000 N   0  0  0  0  0  0           0  0  0\n    5.7509   -5.4019    0.0000 C   0  0  3  0  0  0           0  0  0\n    6.4046   -5.0180    0.0000 C   0  0  0  0  0  0           0  0  0\n    7.0458   -5.4019    0.0000 O   0  0  0  0  0  0           0  0  0\n    6.4046   -4.2702    0.0000 O   0  0  0  0  0  0           0  0  0\n    5.7509   -6.1525    0.0000 N   0  0  0  0  0  0           0  0  0\n  1  9  2  0     0  0\n  5 10  1  0     0  0\n 10 11  1  0     0  0\n 11 12  2  0     0  0\n 11 13  1  0     0  0\n  1  2  1  0     0  0\n  2  3  2  0     0  0\n  2  4  1  0     0  0\n  1  5  1  0     0  0\n  5  6  2  0     0  0\n  6  7  1  0     0  0\n  8  7  2  0     0  0\n  9  8  1  0     0  0\n 14 15  1  0     0  0\n 15 16  1  0     0  0\n 16 17  1  0     0  0\n 17 18  1  0     0  0\n 14 19  1  0     0  0\n 19 20  1  0     0  0\n 20 21  1  0     0  0\n 20 22  2  0     0  0\n 19 23  1  0     0  0\nM  END\n',
                'smiles': 'NCCCCC(N)C(O)=O.CC(=O)OC1=C(C=CC=C1)C(O)=O',
                'formula': 'C9H8O4.C6H14N2O2',
                'opticalActivity': '( + / - )',
                'atropisomerism': 'No',
                'stereoCenters': 1,
                'definedStereo': 0,
                'ezCenters': 0,
                'charge': 0,
                'mwt': 326.345,
                'count': 1,
                'createdBy': 'admin',
                'lastEditedBy': 'admin',
                'hash': 'UHTWFUC726YG',
                'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(0ca4dbf2-4b92-4022-abc4-14bce7b1fdc1)?view=full',
                'stereochemistry': 'RACEMIC',
                'references': [
                    'ce3778d1-0bcd-4db7-bd51-98be257978d9',
                    '5c017f2e-b0fc-4e34-ab56-df8b41d47882'
                ],
                'access': []
            },
            'moieties': [
                {
                    'uuid': '43d94a15-d47d-43bc-a2e3-f3823660d810',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'id': '43d94a15-d47d-43bc-a2e3-f3823660d810',
                    'digest': 'ac952ec85b946338fb450de6401168575c02a2fc',
                    'molfile': '\n  Marvin  04291704042D          \n\n 13 13  0  0  0  0            999 V2000\n   12.0846   -6.3867    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   12.0846   -5.5995    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   12.8717   -5.2564    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   11.3654   -5.1953    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   10.6585   -5.6064    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   10.6585   -6.4302    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.9431   -6.8346    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.2278   -6.4302    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.2278   -5.6064    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.9431   -5.1953    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.9431   -4.3783    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   10.6585   -3.9670    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    9.2385   -3.9670    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  2  1  1  0  0  0  0\n  2  3  2  0  0  0  0\n  4  2  1  0  0  0  0\n  5  4  1  0  0  0  0\n  5  6  1  0  0  0  0\n 10  5  2  0  0  0  0\n  6  7  2  0  0  0  0\n  8  7  1  0  0  0  0\n  9  8  2  0  0  0  0\n 10  9  1  0  0  0  0\n 10 11  1  0  0  0  0\n 11 12  1  0  0  0  0\n 11 13  2  0  0  0  0\nM  END\n',
                    'smiles': 'CC(=O)OC1=C(C=CC=C1)C(O)=O',
                    'formula': 'C9H8O4',
                    'opticalActivity': 'NONE',
                    'stereoCenters': 0,
                    'definedStereo': 0,
                    'ezCenters': 0,
                    'charge': 0,
                    'mwt': 180.1574,
                    'count': 1,
                    'hash': 'NNQ793F142LD',
                    'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(43d94a15-d47d-43bc-a2e3-f3823660d810)?view=full',
                    'stereochemistry': 'ACHIRAL',
                    'references': [],
                    'access': [],
                    'countAmount': {
                        'uuid': 'd0bc83a8-517e-4d68-b20b-588c13ccaa5a',
                        'created': 1520373953000,
                        'createdBy': 'admin',
                        'lastEdited': 1520373953000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'type': 'MOL RATIO',
                        'average': 1.0,
                        'units': 'MOL RATIO',
                        'references': [],
                        'access': []
                    }
                },
                {
                    'uuid': 'f57fe5e2-4175-436f-a046-1fe37104cace',
                    'created': 1520373953000,
                    'createdBy': 'admin',
                    'lastEdited': 1520373953000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'id': 'f57fe5e2-4175-436f-a046-1fe37104cace',
                    'digest': '48ef3bd049d21c33177a86049297bf32b54a0bc9',
                    'molfile': '\n  Marvin  04291704042D          \n\n 10  9  0  0  0  0            999 V2000\n    2.7839   -5.6500    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    3.5211   -6.0551    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.2326   -5.6500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.9693   -6.0404    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.6633   -5.5880    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.3885   -6.0008    0.0000 C   0  0  0  0  0  0  0  0  0  3  0  0\n    6.3885   -6.8346    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    7.1146   -5.5743    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    7.8269   -6.0008    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    7.1146   -4.7436    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  2  1  1  0  0  0  0\n  3  2  1  0  0  0  0\n  4  3  1  0  0  0  0\n  5  4  1  0  0  0  0\n  5  6  1  0  0  0  0\n  6  7  1  0  0  0  0\n  6  8  1  0  0  0  0\n  8  9  1  0  0  0  0\n  8 10  2  0  0  0  0\nM  END\n',
                    'smiles': 'NCCCCC(N)C(O)=O',
                    'formula': 'C6H14N2O2',
                    'opticalActivity': '( + / - )',
                    'stereoCenters': 1,
                    'definedStereo': 0,
                    'ezCenters': 0,
                    'charge': 0,
                    'mwt': 146.1876,
                    'count': 1,
                    'hash': 'NQYQCKZ2F4V6',
                    'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(f57fe5e2-4175-436f-a046-1fe37104cace)?view=full',
                    'stereochemistry': 'RACEMIC',
                    'references': [],
                    'access': [],
                    'countAmount': {
                        'uuid': 'e1caf05c-342b-4ffb-a9a0-c328656824e3',
                        'created': 1520373953000,
                        'createdBy': 'admin',
                        'lastEdited': 1520373953000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'type': 'MOL RATIO',
                        'average': 1.0,
                        'units': 'MOL RATIO',
                        'references': [],
                        'access': []
                    }
                }
            ],
            '_approvalIDDisplay': '2JJ274J145',
            '_name': 'ASPIRIN DL-LYSINE',
            'access': [],
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(8231d86a-8996-4d88-831d-670daeed7d78)?view=full'
        },
        {
            'uuid': 'b929da66-df59-487b-a5d5-0354a07c1a0f',
            'created': 1520356242000,
            'createdBy': 'admin',
            'lastEdited': 1520356242000,
            'lastEditedBy': 'admin',
            'deprecated': false,
            'definitionType': 'PRIMARY',
            'definitionLevel': 'COMPLETE',
            'substanceClass': 'chemical',
            'status': 'approved',
            'version': '2',
            'approvedBy': 'FDA_SRS',
            'names': [
                {
                    'uuid': '21e4823e-a439-4b5e-a728-ffd7e7f2cc31',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLATE COPPER',
                    'type': 'sys',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'e109a6c6-d4bd-4d0c-b100-606247eab0ca',
                        '5d63d66c-e3f9-4dcd-a330-9e7c9b2d0fbf',
                        '118ff3f3-235f-49ae-9160-8059c5fb9ed8'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(21e4823e-a439-4b5e-a728-ffd7e7f2cc31)?view=full'
                },
                {
                    'uuid': '656491af-a97c-4b0d-b918-62a0c703977c',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'COPPER ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '0978a1e2-40b6-42b1-8512-0d59e365b797'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(656491af-a97c-4b0d-b918-62a0c703977c)?view=full'
                },
                {
                    'uuid': '70f6110c-bc80-404d-852f-0fff8f068e54',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLATE COPPER [WHO-DD]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '118ff3f3-235f-49ae-9160-8059c5fb9ed8'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(70f6110c-bc80-404d-852f-0fff8f068e54)?view=full'
                },
                {
                    'uuid': '98ad56d0-78d2-46ce-a4ed-86fd6cb5ddc5',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'COPPER, BIS(2-((ACETYL-.KAPPA.O)OXY)BENZOATO-.KAPPA.O)-',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '0978a1e2-40b6-42b1-8512-0d59e365b797'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(98ad56d0-78d2-46ce-a4ed-86fd6cb5ddc5)?view=full'
                },
                {
                    'uuid': 'af306325-c628-4b28-984c-e57a0b445d2a',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'COPPER(II) ACETYLSALICYLATE STN (SCIFINDER)',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '0978a1e2-40b6-42b1-8512-0d59e365b797'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(af306325-c628-4b28-984c-e57a0b445d2a)?view=full'
                },
                {
                    'uuid': 'c505f516-413e-4261-9b77-53d02781fc4f',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'BIS(2-ACETOXYBENZOATO)COPPER',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '845d9a7d-00fd-4c21-8984-b222fdacff3a'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(c505f516-413e-4261-9b77-53d02781fc4f)?view=full'
                },
                {
                    'uuid': 'f2707b4b-29b2-4f08-8fca-a78895ef7c67',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN COPPER',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': true,
                    'references': [
                        '0978a1e2-40b6-42b1-8512-0d59e365b797'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(f2707b4b-29b2-4f08-8fca-a78895ef7c67)?view=full'
                },
                {
                    'uuid': 'f8a794bc-6398-4113-9cce-2f91c34ba0bb',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLIC ACID-COPPER CHELATE',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '874e881a-2b23-4718-bb63-8500512665cf'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(f8a794bc-6398-4113-9cce-2f91c34ba0bb)?view=full'
                }
            ],
            'codes': [
                {
                    'uuid': '0eefa484-caf3-497c-bd9e-f1b1e2d53d68',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'PUBCHEM',
                    'code': '31869',
                    'type': 'PRIMARY',
                    'url': 'https://pubchem.ncbi.nlm.nih.gov/compound/31869',
                    'references': [
                        '805b1edb-df2a-4acb-9cd7-1405d9facb9b'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(0eefa484-caf3-497c-bd9e-f1b1e2d53d68)?view=full'
                },
                {
                    'uuid': '259569dd-b253-4872-9e03-4a1aaa9af138',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'CAS',
                    'code': '23325-63-5',
                    'type': 'PRIMARY',
                    'url': 'http://chem.sis.nlm.nih.gov/chemidplus/direct.jsp?regno=23325-63-5&result=advanced',
                    'references': [
                        '805b1edb-df2a-4acb-9cd7-1405d9facb9b'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(259569dd-b253-4872-9e03-4a1aaa9af138)?view=full'
                },
                {
                    'uuid': '3c130b82-f70f-4a31-b058-8218d5ee1664',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'ECHA (EC/EINECS)',
                    'code': '245-583-4',
                    'type': 'PRIMARY',
                    'url': 'https://echa.europa.eu/substance-information/-/substanceinfo/100.041.425',
                    'references': [
                        '805b1edb-df2a-4acb-9cd7-1405d9facb9b'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(3c130b82-f70f-4a31-b058-8218d5ee1664)?view=full'
                },
                {
                    'uuid': 'ba16a12a-a152-4c34-895d-2a8acae912d8',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'EVMPD',
                    'code': 'SUB00273MIG',
                    'type': 'PRIMARY',
                    'references': [
                        '805b1edb-df2a-4acb-9cd7-1405d9facb9b'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(ba16a12a-a152-4c34-895d-2a8acae912d8)?view=full'
                },
                {
                    'uuid': 'f559a006-5f06-6617-a8f7-5c1043723036',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'EPA CompTox',
                    'code': '23325-63-5',
                    'type': 'PRIMARY',
                    'url': 'https://comptox.epa.gov/dashboard/dsstoxdb/results?utf8=%E2%9C%93&search=23325-63-5',
                    'references': [
                        'f7aa791e-d065-f72b-6840-0368a5813ea4'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(f559a006-5f06-6617-a8f7-5c1043723036)?view=full'
                }
            ],
            'notes': [],
            'properties': [],
            'relationships': [
                {
                    'uuid': 'b6c13de8-f122-461c-b705-6d0adfe8378f',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'relatedSubstance': {
                        'uuid': '428e1354-1e5f-4376-80ab-e233e3d4a850',
                        'created': 1520356242000,
                        'createdBy': 'admin',
                        'lastEdited': 1520356242000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'refPname': 'ASPIRIN',
                        'refuuid': 'a05ec20c-8fe2-4e02-ba7f-df69e5e30248',
                        'substanceClass': 'reference',
                        'approvalID': 'R16CO5Y76E',
                        'linkingID': 'R16CO5Y76E',
                        'name': 'ASPIRIN',
                        'references': [],
                        'access': []
                    },
                    'originatorUuid': 'b6c13de8-f122-461c-b705-6d0adfe8378f',
                    'type': 'ACTIVE MOIETY',
                    'references': [],
                    'access': []
                }
            ],
            'references': [
                {
                    'uuid': '0978a1e2-40b6-42b1-8512-0d59e365b797',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'stn',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(0978a1e2-40b6-42b1-8512-0d59e365b797)?view=full'
                },
                {
                    'uuid': '118ff3f3-235f-49ae-9160-8059c5fb9ed8',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'WHO-DD',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(118ff3f3-235f-49ae-9160-8059c5fb9ed8)?view=full'
                },
                {
                    'uuid': '5d63d66c-e3f9-4dcd-a330-9e7c9b2d0fbf',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'EMA',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(5d63d66c-e3f9-4dcd-a330-9e7c9b2d0fbf)?view=full'
                },
                {
                    'uuid': '805b1edb-df2a-4acb-9cd7-1405d9facb9b',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'SRS CODE IMPORT',
                    'docType': 'SRS',
                    'documentDate': 1493390874000,
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(805b1edb-df2a-4acb-9cd7-1405d9facb9b)?view=full'
                },
                {
                    'uuid': '845d9a7d-00fd-4c21-8984-b222fdacff3a',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'chemid',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(845d9a7d-00fd-4c21-8984-b222fdacff3a)?view=full'
                },
                {
                    'uuid': '874e881a-2b23-4718-bb63-8500512665cf',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'AERS',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN',
                        'PUBLIC_DOMAIN_RELEASE',
                        'AUTO_SELECTED'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(874e881a-2b23-4718-bb63-8500512665cf)?view=full'
                },
                {
                    'uuid': '9745ba19-8bce-4348-8cd7-255ad530dc8d',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'dump-public-2018-03-05.gsrs',
                    'docType': 'BATCH_IMPORT',
                    'documentDate': 1520356242000,
                    'publicDomain': false,
                    'tags': [],
                    'id': 'b9fdcca829e0ff2e96ec',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(9745ba19-8bce-4348-8cd7-255ad530dc8d)?view=full'
                },
                {
                    'uuid': 'a89cfd5a-e352-41d9-a376-dd8bb0d0d8d9',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'SRS import [5DR11472UI]',
                    'docType': 'SRS',
                    'documentDate': 1493390874000,
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'url': 'http://fdasis.nlm.nih.gov/srs/srsdirect.jsp?regno=5DR11472UI',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(a89cfd5a-e352-41d9-a376-dd8bb0d0d8d9)?view=full'
                },
                {
                    'uuid': 'e109a6c6-d4bd-4d0c-b100-606247eab0ca',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ACETYLSALICYLATE COPPER [WHO-DD]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(e109a6c6-d4bd-4d0c-b100-606247eab0ca)?view=full'
                },
                {
                    'uuid': 'f7aa791e-d065-f72b-6840-0368a5813ea4',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'WEBSITE',
                    'docType': 'WEBSITE',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN',
                        'PUBLIC_DOMAIN_RELEASE'
                    ],
                    'url': 'https://comptox.epa.gov/dashboard/dsstoxdb/results?utf8=%E2%9C%93&search=23325-63-5',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(f7aa791e-d065-f72b-6840-0368a5813ea4)?view=full'
                }
            ],
            'approvalID': '5DR11472UI',
            'tags': [
                'WHO-DD'
            ],
            'structure': {
                'id': '0925ac37-109b-476a-9ca8-d76fa93ae048',
                'created': 1520356242000,
                'lastEdited': 1520356242000,
                'deprecated': false,
                'digest': '050cb6ea4106ede0b663a0f7e7e5c0dda6c7df48',
                'molfile': '\n  Symyx   04271719162D 1   1.00000     0.00000     0\n\n 27 26  0     0  0            999 V2000\n   18.8862   -8.3938    0.0000 Cu  0  2  0  0  0  0           0  0  0\n   15.0804   -6.5002    0.0000 O   0  5  0  0  0  0           0  0  0\n   15.7952   -7.7424    0.0000 O   0  0  0  0  0  0           0  0  0\n   15.0804   -7.3269    0.0000 C   0  0  0  0  0  0           0  0  0\n   14.3608  -10.2228    0.0000 O   0  0  0  0  0  0           0  0  0\n   15.7928  -10.2248    0.0000 C   0  0  0  0  0  0           0  0  0\n   15.0774   -9.8105    0.0000 C   0  0  0  0  0  0           0  0  0\n   15.0774   -8.9837    0.0000 O   0  0  0  0  0  0           0  0  0\n   13.6460   -7.3184    0.0000 C   0  0  0  0  0  0           0  0  0\n   12.9287   -7.7382    0.0000 C   0  0  0  0  0  0           0  0  0\n   12.9287   -8.5692    0.0000 C   0  0  0  0  0  0           0  0  0\n   13.6460   -8.9806    0.0000 C   0  0  0  0  0  0           0  0  0\n   14.3632   -8.5692    0.0000 C   0  0  0  0  0  0           0  0  0\n   14.3632   -7.7382    0.0000 C   0  0  0  0  0  0           0  0  0\n   15.0804   -6.5002    0.0000 O   0  5  0  0  0  0           0  0  0\n   15.7952   -7.7424    0.0000 O   0  0  0  0  0  0           0  0  0\n   15.0804   -7.3269    0.0000 C   0  0  0  0  0  0           0  0  0\n   14.3608  -10.2228    0.0000 O   0  0  0  0  0  0           0  0  0\n   15.7928  -10.2248    0.0000 C   0  0  0  0  0  0           0  0  0\n   15.0774   -9.8105    0.0000 C   0  0  0  0  0  0           0  0  0\n   15.0774   -8.9837    0.0000 O   0  0  0  0  0  0           0  0  0\n   13.6460   -7.3184    0.0000 C   0  0  0  0  0  0           0  0  0\n   12.9287   -7.7382    0.0000 C   0  0  0  0  0  0           0  0  0\n   12.9287   -8.5692    0.0000 C   0  0  0  0  0  0           0  0  0\n   13.6460   -8.9806    0.0000 C   0  0  0  0  0  0           0  0  0\n   14.3632   -8.5692    0.0000 C   0  0  0  0  0  0           0  0  0\n   14.3632   -7.7382    0.0000 C   0  0  0  0  0  0           0  0  0\n 14  9  2  0     0  0\n 10  9  1  0     0  0\n 11 10  2  0     0  0\n 12 11  1  0     0  0\n 13 12  2  0     0  0\n 14 13  1  0     0  0\n 13  8  1  0     0  0\n  8  7  1  0     0  0\n  7  6  1  0     0  0\n  7  5  2  0     0  0\n 14  4  1  0     0  0\n  4  3  2  0     0  0\n  4  2  1  0     0  0\n 27 22  2  0     0  0\n 23 22  1  0     0  0\n 24 23  2  0     0  0\n 25 24  1  0     0  0\n 26 25  2  0     0  0\n 27 26  1  0     0  0\n 26 21  1  0     0  0\n 21 20  1  0     0  0\n 20 19  1  0     0  0\n 20 18  2  0     0  0\n 27 17  1  0     0  0\n 17 16  2  0     0  0\n 17 15  1  0     0  0\nM  CHG  3   1   2   2  -1  15  -1\nM  STY  1   1 MUL\nM  SLB  1   1   1\nM  SCN  1   1 HT\nM  SAL   1 15   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16\nM  SAL   1 11  17  18  19  20  21  22  23  24  25  26  27\nM  SPA   1 13   2   3   4   5   6   7   8   9  10  11  12  13  14\nM  SMT   1 2\nM  SDI   1  4   12.4159  -11.0399   12.4159   -5.7043\nM  SDI   1  4   16.9204   -5.7043   16.9204  -11.0399\nM  END\n',
                'smiles': '[Cu++].CC(=O)OC1=C(C=CC=C1)C([O-])=O.CC(=O)OC2=C(C=CC=C2)C([O-])=O',
                'formula': '2C9H7O4.Cu',
                'opticalActivity': 'UNSPECIFIED',
                'atropisomerism': 'No',
                'stereoCenters': 0,
                'definedStereo': 0,
                'ezCenters': 0,
                'charge': 0,
                'mwt': 421.845,
                'count': 1,
                'createdBy': 'admin',
                'lastEditedBy': 'admin',
                'hash': 'GKY8258TYG71',
                'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(0925ac37-109b-476a-9ca8-d76fa93ae048)?view=full',
                'stereochemistry': 'ACHIRAL',
                'references': [
                    '0978a1e2-40b6-42b1-8512-0d59e365b797',
                    'a89cfd5a-e352-41d9-a376-dd8bb0d0d8d9'
                ],
                'access': []
            },
            'moieties': [
                {
                    'uuid': '95932938-95ca-4844-9f44-7e5c8a03aa79',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'id': '95932938-95ca-4844-9f44-7e5c8a03aa79',
                    'digest': '27c568ca09d313638d5ff756ffead8d4aaa73f00',
                    'molfile': '\n  Marvin  04291704182D          \n\n 13 13  0  0  0  0            999 V2000\n   15.7564  -10.2013    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   15.0427   -9.7879    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   14.3277  -10.1993    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   15.0427   -8.9630    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   14.3301   -8.5495    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   13.6146   -8.9599    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   12.8989   -8.5495    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   12.8989   -7.7204    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   13.6146   -7.3016    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   14.3301   -7.7204    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   15.0457   -7.3100    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   15.0457   -6.4852    0.0000 O   0  5  0  0  0  0  0  0  0  0  0  0\n   15.7588   -7.7246    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  2  1  1  0  0  0  0\n  2  3  2  0  0  0  0\n  4  2  1  0  0  0  0\n  5  4  1  0  0  0  0\n  5  6  1  0  0  0  0\n 10  5  2  0  0  0  0\n  6  7  2  0  0  0  0\n  7  8  1  0  0  0  0\n  8  9  2  0  0  0  0\n 10  9  1  0  0  0  0\n 10 11  1  0  0  0  0\n 11 12  1  0  0  0  0\n 11 13  2  0  0  0  0\nM  CHG  1  12  -1\nM  END\n',
                    'smiles': 'CC(=O)OC1=C(C=CC=C1)C([O-])=O',
                    'formula': 'C9H7O4',
                    'opticalActivity': 'NONE',
                    'stereoCenters': 0,
                    'definedStereo': 0,
                    'ezCenters': 0,
                    'charge': -1,
                    'mwt': 179.1495,
                    'count': 2,
                    'hash': 'NNQ793F142LD',
                    'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(95932938-95ca-4844-9f44-7e5c8a03aa79)?view=full',
                    'stereochemistry': 'ACHIRAL',
                    'references': [],
                    'access': [],
                    'countAmount': {
                        'uuid': 'bc258c48-c21b-4e34-bca0-945c9d755804',
                        'created': 1520356242000,
                        'createdBy': 'admin',
                        'lastEdited': 1520356242000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'type': 'MOL RATIO',
                        'average': 2.0,
                        'units': 'MOL RATIO',
                        'references': [],
                        'access': []
                    }
                },
                {
                    'uuid': '857b5256-503f-486f-b97b-b076e0729b08',
                    'created': 1520356242000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356242000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'id': '857b5256-503f-486f-b97b-b076e0729b08',
                    'digest': '8029ac05b8d2b53444b8054b27563cf418e149d8',
                    'molfile': '\n  Marvin  04291704182D          \n\n  1  0  0  0  0  0            999 V2000\n   18.8427   -8.3745    0.0000 Cu  0  2  0  0  0  0  0  0  0  0  0  0\nM  CHG  1   1   2\nM  END\n',
                    'smiles': '[Cu++]',
                    'formula': 'Cu',
                    'opticalActivity': 'NONE',
                    'stereoCenters': 0,
                    'definedStereo': 0,
                    'ezCenters': 0,
                    'charge': 2,
                    'mwt': 63.546,
                    'count': 1,
                    'hash': 'VSRJD7T6ZP6D',
                    'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(857b5256-503f-486f-b97b-b076e0729b08)?view=full',
                    'stereochemistry': 'ACHIRAL',
                    'references': [],
                    'access': [],
                    'countAmount': {
                        'uuid': '8bbe06e5-8012-48b5-8001-2bd611c24095',
                        'created': 1520356242000,
                        'createdBy': 'admin',
                        'lastEdited': 1520356242000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'type': 'MOL RATIO',
                        'average': 1.0,
                        'units': 'MOL RATIO',
                        'references': [],
                        'access': []
                    }
                }
            ],
            '_approvalIDDisplay': '5DR11472UI',
            '_name': 'ASPIRIN COPPER',
            'access': [],
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(b929da66-df59-487b-a5d5-0354a07c1a0f)?view=full'
        },
        {
            'uuid': 'f10e9236-3789-4d8a-9dca-bf3fe4c9627b',
            'created': 1520352961000,
            'createdBy': 'admin',
            'lastEdited': 1520352961000,
            'lastEditedBy': 'admin',
            'deprecated': false,
            'definitionType': 'PRIMARY',
            'definitionLevel': 'COMPLETE',
            'substanceClass': 'chemical',
            'status': 'approved',
            'version': '2',
            'approvedBy': 'FDA_SRS',
            'names': [
                {
                    'uuid': '023a0abf-01b2-4d11-9c18-bee840456f46',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLLEUCINE LYSINE [WHO-DD]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'c24d0091-aae2-4c80-a296-f7795b04fb7d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(023a0abf-01b2-4d11-9c18-bee840456f46)?view=full'
                },
                {
                    'uuid': '43936484-2274-4a30-8ed1-997deb87f861',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'LYSINE ACETYLSALICYLATE',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '955a3117-5474-47bf-b1a4-3150292c52a7'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(43936484-2274-4a30-8ed1-997deb87f861)?view=full'
                },
                {
                    'uuid': '6ab9eeb6-b5c5-456d-a7ed-a54a69a46c29',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'FLECTADOL',
                    'type': 'bn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'a41fd8c7-a903-40e0-a1e7-003a958a26d1'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(6ab9eeb6-b5c5-456d-a7ed-a54a69a46c29)?view=full'
                },
                {
                    'uuid': '73571d78-8385-44be-b076-7b9b6a6eb1e0',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'LASPAL',
                    'type': 'bn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'a41fd8c7-a903-40e0-a1e7-003a958a26d1'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(73571d78-8385-44be-b076-7b9b6a6eb1e0)?view=full'
                },
                {
                    'uuid': '8f65a2db-6023-460e-95c2-da1309585543',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN LYSINE',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': true,
                    'references': [
                        '955a3117-5474-47bf-b1a4-3150292c52a7'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(8f65a2db-6023-460e-95c2-da1309585543)?view=full'
                },
                {
                    'uuid': '91b642d6-a25a-4290-87d8-a1c30badc54d',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'L-LYSINE ACETYLSALICYLATE',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'a41fd8c7-a903-40e0-a1e7-003a958a26d1'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(91b642d6-a25a-4290-87d8-a1c30badc54d)?view=full'
                },
                {
                    'uuid': 'd464b937-ab64-4d47-b96b-562302aba7f7',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'L-LYSINE, 2-(ACETYLOXY)BENZOATE (1:1)',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '955a3117-5474-47bf-b1a4-3150292c52a7'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(d464b937-ab64-4d47-b96b-562302aba7f7)?view=full'
                },
                {
                    'uuid': 'd4b301b8-ffa5-1d3a-5bb6-832a7b4b23d7',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'LYSINE ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '213e3c9d-13c5-a1f4-d255-348cd16d193d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(d4b301b8-ffa5-1d3a-5bb6-832a7b4b23d7)?view=full'
                }
            ],
            'codes': [
                {
                    'uuid': '176ee49e-1d98-4593-8e24-cf6941092e5b',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'ECHA (EC/EINECS)',
                    'code': '253-723-0',
                    'type': 'PRIMARY',
                    'url': 'https://echa.europa.eu/substance-information/-/substanceinfo/100.048.822',
                    'references': [
                        'd4ce9f6f-6c89-446b-881a-946a86e8ee1a'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(176ee49e-1d98-4593-8e24-cf6941092e5b)?view=full'
                },
                {
                    'uuid': '1fe0cc31-14cb-4169-97a2-4f04da3bb74c',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'PUBCHEM',
                    'code': '91626',
                    'type': 'PRIMARY',
                    'url': 'https://pubchem.ncbi.nlm.nih.gov/compound/91626',
                    'references': [
                        'd4ce9f6f-6c89-446b-881a-946a86e8ee1a'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(1fe0cc31-14cb-4169-97a2-4f04da3bb74c)?view=full'
                },
                {
                    'uuid': '782f2148-147b-4588-bd90-7ab7744e610e',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'CAS',
                    'code': '37933-78-1',
                    'type': 'PRIMARY',
                    'url': 'http://chem.sis.nlm.nih.gov/chemidplus/direct.jsp?regno=37933-78-1&result=advanced',
                    'references': [
                        'd4ce9f6f-6c89-446b-881a-946a86e8ee1a'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(782f2148-147b-4588-bd90-7ab7744e610e)?view=full'
                },
                {
                    'uuid': 'bc3ef752-ec5c-41aa-aa74-9ed16052383d',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'EVMPD',
                    'code': 'SUB34053',
                    'type': 'PRIMARY',
                    'references': [
                        'd4ce9f6f-6c89-446b-881a-946a86e8ee1a'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(bc3ef752-ec5c-41aa-aa74-9ed16052383d)?view=full'
                }
            ],
            'notes': [],
            'properties': [],
            'relationships': [
                {
                    'uuid': 'ee056bac-46c8-4c7b-a03d-08d5f074cd73',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'relatedSubstance': {
                        'uuid': '762f81c5-aa12-45b2-9033-0552151b7d67',
                        'created': 1520352961000,
                        'createdBy': 'admin',
                        'lastEdited': 1520352961000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'refPname': 'ASPIRIN',
                        'refuuid': 'a05ec20c-8fe2-4e02-ba7f-df69e5e30248',
                        'substanceClass': 'reference',
                        'approvalID': 'R16CO5Y76E',
                        'linkingID': 'R16CO5Y76E',
                        'name': 'ASPIRIN',
                        'references': [],
                        'access': []
                    },
                    'originatorUuid': 'ee056bac-46c8-4c7b-a03d-08d5f074cd73',
                    'type': 'ACTIVE MOIETY',
                    'references': [],
                    'access': []
                }
            ],
            'references': [
                {
                    'uuid': '213e3c9d-13c5-a1f4-d255-348cd16d193d',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': '21 CFR part 310.545',
                    'docType': 'CFR',
                    'publicDomain': true,
                    'tags': [],
                    'url': 'https://www.ecfr.gov/cgi-bin/retrieveECFR?gp=1&SID=69eb7c6aae5116eeaa7b7c6b6dc19858&ty=HTML&h=L&mc=true&r=PART&n=pt21.5.310#se21.5.310_1545',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(213e3c9d-13c5-a1f4-d255-348cd16d193d)?view=full'
                },
                {
                    'uuid': '7d41d8c0-d288-4126-8c6b-663f9d963c15',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'SRS import [XAN4V337CI]',
                    'docType': 'SRS',
                    'documentDate': 1493389743000,
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'url': 'http://fdasis.nlm.nih.gov/srs/srsdirect.jsp?regno=XAN4V337CI',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(7d41d8c0-d288-4126-8c6b-663f9d963c15)?view=full'
                },
                {
                    'uuid': '84e42447-c0a9-475a-ad2e-b145b0b5e191',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'fda_srs',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(84e42447-c0a9-475a-ad2e-b145b0b5e191)?view=full'
                },
                {
                    'uuid': '8a5c1783-4b4d-40f4-9266-8a74453801b5',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'dump-public-2018-03-05.gsrs',
                    'docType': 'BATCH_IMPORT',
                    'documentDate': 1520352960000,
                    'publicDomain': false,
                    'tags': [],
                    'id': 'b9fdcca829e0ff2e96ec',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(8a5c1783-4b4d-40f4-9266-8a74453801b5)?view=full'
                },
                {
                    'uuid': '955a3117-5474-47bf-b1a4-3150292c52a7',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'FDA_SRS',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN',
                        'PUBLIC_DOMAIN_RELEASE',
                        'AUTO_SELECTED'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(955a3117-5474-47bf-b1a4-3150292c52a7)?view=full'
                },
                {
                    'uuid': 'a41fd8c7-a903-40e0-a1e7-003a958a26d1',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'STN',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(a41fd8c7-a903-40e0-a1e7-003a958a26d1)?view=full'
                },
                {
                    'uuid': 'c24d0091-aae2-4c80-a296-f7795b04fb7d',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'who-dd',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(c24d0091-aae2-4c80-a296-f7795b04fb7d)?view=full'
                },
                {
                    'uuid': 'd4ce9f6f-6c89-446b-881a-946a86e8ee1a',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'SRS CODE IMPORT',
                    'docType': 'SRS',
                    'documentDate': 1493389743000,
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(d4ce9f6f-6c89-446b-881a-946a86e8ee1a)?view=full'
                }
            ],
            'approvalID': 'XAN4V337CI',
            'tags': [
                'WHO-DD'
            ],
            'structure': {
                'id': 'ee169699-c94d-409e-86cb-be15a78a6a9e',
                'created': 1520352961000,
                'lastEdited': 1520352961000,
                'deprecated': false,
                'digest': '654516c5f2c0bb47a09402a47a37954f1614d8b9',
                'molfile': '\n  Symyx   04271718592D 1   1.00000     0.00000     0\n\n 23 22  0     1  0            999 V2000\n    9.9748   -4.5570    0.0000 C   0  0  0  0  0  0           0  0  0\n    9.3374   -4.1361    0.0000 C   0  0  0  0  0  0           0  0  0\n    9.3374   -3.4445    0.0000 O   0  0  0  0  0  0           0  0  0\n    8.5998   -4.4569    0.0000 O   0  0  0  0  0  0           0  0  0\n    9.9748   -5.2861    0.0000 C   0  0  0  0  0  0           0  0  0\n    9.2790   -5.5986    0.0000 O   0  0  0  0  0  0           0  0  0\n    9.2790   -6.2903    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.6207   -6.7361    0.0000 O   0  0  0  0  0  0           0  0  0\n    9.9248   -6.7944    0.0000 C   0  0  0  0  0  0           0  0  0\n   10.6082   -5.6611    0.0000 C   0  0  0  0  0  0           0  0  0\n   11.2623   -5.2694    0.0000 C   0  0  0  0  0  0           0  0  0\n   11.2623   -4.5403    0.0000 C   0  0  0  0  0  0           0  0  0\n   10.6248   -4.1736    0.0000 C   0  0  0  0  0  0           0  0  0\n    6.5457   -4.6695    0.0000 C   0  0  0  0  0  0           0  0  0\n    6.5457   -3.9486    0.0000 O   0  0  0  0  0  0           0  0  0\n    5.8915   -5.0528    0.0000 C   0  0  1  0  0  0           0  0  0\n    5.8915   -5.7736    0.0000 N   0  0  0  0  0  0           0  0  0\n    5.2499   -4.6695    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.6165   -5.0195    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.9832   -4.6695    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.3248   -5.0195    0.0000 C   0  0  0  0  0  0           0  0  0\n    2.6874   -4.6695    0.0000 N   0  0  0  0  0  0           0  0  0\n    7.1790   -5.0528    0.0000 O   0  0  0  0  0  0           0  0  0\n 10  5  1  0     0  0\n 11 10  2  0     0  0\n 11 12  1  0     0  0\n 12 13  2  0     0  0\n 13  1  1  0     0  0\n  2  1  1  0     0  0\n  3  2  2  0     0  0\n  4  2  1  0     0  0\n  5  1  2  0     0  0\n  6  5  1  0     0  0\n  7  6  1  0     0  0\n  8  7  2  0     0  0\n  9  7  1  0     0  0\n 15 14  2  0     0  0\n 16 14  1  0     0  0\n 16 17  1  1     0  0\n 18 16  1  0     0  0\n 19 18  1  0     0  0\n 20 19  1  0     0  0\n 21 20  1  0     0  0\n 22 21  1  0     0  0\n 23 14  1  0     0  0\nM  END\n',
                'smiles': 'NCCCC[C@H](N)C(O)=O.CC(=O)OC1=C(C=CC=C1)C(O)=O',
                'formula': 'C9H8O4.C6H14N2O2',
                'opticalActivity': 'UNSPECIFIED',
                'atropisomerism': 'No',
                'stereoCenters': 1,
                'definedStereo': 1,
                'ezCenters': 0,
                'charge': 0,
                'mwt': 326.345,
                'count': 1,
                'createdBy': 'admin',
                'lastEditedBy': 'admin',
                'hash': 'UHT4LB22R561',
                'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(ee169699-c94d-409e-86cb-be15a78a6a9e)?view=full',
                'stereochemistry': 'ABSOLUTE',
                'references': [
                    '7d41d8c0-d288-4126-8c6b-663f9d963c15',
                    '84e42447-c0a9-475a-ad2e-b145b0b5e191'
                ],
                'access': []
            },
            'moieties': [
                {
                    'uuid': 'b2710288-8a0a-45b6-8473-b35b845141f8',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'id': 'b2710288-8a0a-45b6-8473-b35b845141f8',
                    'digest': '6f6939a9eda12bcb6eea613329736e86a394e7cb',
                    'molfile': '\n  Marvin  04291703292D          \n\n 10  9  0  0  1  0            999 V2000\n    6.5185   -5.5905    0.0000 C   0  0  1  0  0  0  0  0  0  2  0  0\n    6.5185   -6.3880    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    5.8086   -5.1664    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.1078   -5.5537    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.4071   -5.1664    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.6786   -5.5537    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.9734   -5.1664    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    7.2423   -5.1664    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    7.2423   -4.3688    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    7.9430   -5.5905    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  1  0  0  0\n  3  1  1  0  0  0  0\n  1  8  1  0  0  0  0\n  4  3  1  0  0  0  0\n  5  4  1  0  0  0  0\n  6  5  1  0  0  0  0\n  7  6  1  0  0  0  0\n  9  8  1  0  0  0  0\n 10  8  2  0  0  0  0\nM  END\n',
                    'smiles': 'NCCCC[C@H](N)C(O)=O',
                    'formula': 'C6H14N2O2',
                    'opticalActivity': 'UNSPECIFIED',
                    'stereoCenters': 1,
                    'definedStereo': 1,
                    'ezCenters': 0,
                    'charge': 0,
                    'mwt': 146.1876,
                    'count': 1,
                    'hash': 'NQYLK44FVG4U',
                    'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(b2710288-8a0a-45b6-8473-b35b845141f8)?view=full',
                    'stereochemistry': 'ABSOLUTE',
                    'references': [],
                    'access': [],
                    'countAmount': {
                        'uuid': 'bedf4eff-f18e-4eb0-b2e6-7a8f961fa073',
                        'created': 1520352961000,
                        'createdBy': 'admin',
                        'lastEdited': 1520352961000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'type': 'MOL RATIO',
                        'average': 1.0,
                        'units': 'MOL RATIO',
                        'references': [],
                        'access': []
                    }
                },
                {
                    'uuid': 'e2703aad-644b-48ff-a915-2199343ec7f9',
                    'created': 1520352961000,
                    'createdBy': 'admin',
                    'lastEdited': 1520352961000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'id': 'e2703aad-644b-48ff-a915-2199343ec7f9',
                    'digest': '75233961460a92d9538d03d45e53d41960e18d07',
                    'molfile': '\n  Marvin  04291703292D          \n\n 13 13  0  0  1  0            999 V2000\n   10.9810   -7.5175    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   10.2665   -6.9597    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.5381   -7.4530    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   10.2665   -6.1944    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   11.0363   -5.8486    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   11.7371   -6.2636    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   12.4608   -5.8302    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   12.4608   -5.0235    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   11.7555   -4.6178    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   11.0363   -5.0420    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   10.3311   -4.5763    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   10.3311   -3.8111    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    9.5150   -4.9312    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  3  2  2  0  0  0  0\n  2  4  1  0  0  0  0\n  4  5  1  0  0  0  0\n  6  5  1  0  0  0  0\n  5 10  2  0  0  0  0\n  7  6  2  0  0  0  0\n  7  8  1  0  0  0  0\n  8  9  2  0  0  0  0\n  9 10  1  0  0  0  0\n 11 10  1  0  0  0  0\n 12 11  1  0  0  0  0\n 13 11  2  0  0  0  0\nM  END\n',
                    'smiles': 'CC(=O)OC1=C(C=CC=C1)C(O)=O',
                    'formula': 'C9H8O4',
                    'opticalActivity': 'NONE',
                    'stereoCenters': 0,
                    'definedStereo': 0,
                    'ezCenters': 0,
                    'charge': 0,
                    'mwt': 180.1574,
                    'count': 1,
                    'hash': 'NNQ793F142LD',
                    'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(e2703aad-644b-48ff-a915-2199343ec7f9)?view=full',
                    'stereochemistry': 'ACHIRAL',
                    'references': [],
                    'access': [],
                    'countAmount': {
                        'uuid': '897173e2-cdea-489c-b3f9-fcfe09ab2894',
                        'created': 1520352961000,
                        'createdBy': 'admin',
                        'lastEdited': 1520352961000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'type': 'MOL RATIO',
                        'average': 1.0,
                        'units': 'MOL RATIO',
                        'references': [],
                        'access': []
                    }
                }
            ],
            '_approvalIDDisplay': 'XAN4V337CI',
            '_name': 'ASPIRIN LYSINE',
            'access': [],
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(f10e9236-3789-4d8a-9dca-bf3fe4c9627b)?view=full'
        },
        {
            'uuid': '5c23b29c-e42b-467a-bf4f-e5b2f990a947',
            'created': 1520368445000,
            'createdBy': 'admin',
            'lastEdited': 1520368445000,
            'lastEditedBy': 'admin',
            'deprecated': false,
            'definitionType': 'PRIMARY',
            'definitionLevel': 'COMPLETE',
            'substanceClass': 'chemical',
            'status': 'approved',
            'version': '1',
            'approvedBy': 'FDA_SRS',
            'names': [
                {
                    'uuid': '068cbf99-080d-41c0-9d69-22cd2fc1f2ae',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ARGININE ACETYLSALICYLATE',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'dd2f63ff-4776-4cd5-be45-2f27abc3caae'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(068cbf99-080d-41c0-9d69-22cd2fc1f2ae)?view=full'
                },
                {
                    'uuid': '12dc8f12-eef6-4a8a-98c6-1d4bb422e7ba',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLATE ARGININE [WHO-DD]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'e7dd12d6-7978-4413-9a5b-b492baff3e37'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(12dc8f12-eef6-4a8a-98c6-1d4bb422e7ba)?view=full'
                },
                {
                    'uuid': '16a5babd-e019-49e2-8e6f-53330c31f9b7',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'L-ARGININE ACETYLSALICYLATE SALT (1:1)',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'dd2f63ff-4776-4cd5-be45-2f27abc3caae'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(16a5babd-e019-49e2-8e6f-53330c31f9b7)?view=full'
                },
                {
                    'uuid': '1929d1f6-eec2-4ab9-85ee-7f2e358d7eed',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLATE ARGININE',
                    'type': 'sys',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'e7dd12d6-7978-4413-9a5b-b492baff3e37',
                        '069583db-8265-47a6-a110-5dba5244a7f0'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(1929d1f6-eec2-4ab9-85ee-7f2e358d7eed)?view=full'
                },
                {
                    'uuid': '2a85811e-f197-468e-979c-f2274d8d040f',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN ARGININE SALT',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'dd2f63ff-4776-4cd5-be45-2f27abc3caae'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(2a85811e-f197-468e-979c-f2274d8d040f)?view=full'
                },
                {
                    'uuid': '3ecbbda5-2320-4988-a41a-88fc6057dadb',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN ARGININE',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': true,
                    'references': [
                        'cc4b46fc-1474-49e8-bdc5-8df2b2be7bef'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(3ecbbda5-2320-4988-a41a-88fc6057dadb)?view=full'
                },
                {
                    'uuid': '9905fd54-881e-4c57-a6a6-4c7cd698a10d',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'L-ARGININE ACETYLSALICYLATE',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'dd2f63ff-4776-4cd5-be45-2f27abc3caae'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(9905fd54-881e-4c57-a6a6-4c7cd698a10d)?view=full'
                },
                {
                    'uuid': '9d298c4c-0432-4541-8e75-0821ae06861f',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'L-ARGININE, 2-(ACETYLOXY)BENZOATE (1:1)',
                    'type': 'sys',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'dd2f63ff-4776-4cd5-be45-2f27abc3caae'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(9d298c4c-0432-4541-8e75-0821ae06861f)?view=full'
                },
                {
                    'uuid': 'ba09ddd3-dc3c-48f4-9838-92921bc7348b',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'L-ARGININE, MONO(2-(ACETYLOXY)BENZOATE)',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'dd2f63ff-4776-4cd5-be45-2f27abc3caae'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(ba09ddd3-dc3c-48f4-9838-92921bc7348b)?view=full'
                },
                {
                    'uuid': 'da72f554-97b0-4fb5-8cdb-c099bbd03a20',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'BENZOIC ACID, 2-(ACETYLOXY)-, COMPD. WITH L-ARGININE (1:1)',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'dd2f63ff-4776-4cd5-be45-2f27abc3caae'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(da72f554-97b0-4fb5-8cdb-c099bbd03a20)?view=full'
                }
            ],
            'codes': [
                {
                    'uuid': '30ce75c0-d6f0-4606-a03f-d079ff3d2a0c',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'PUBCHEM',
                    'code': '169926',
                    'type': 'PRIMARY',
                    'url': 'https://pubchem.ncbi.nlm.nih.gov/compound/169926',
                    'references': [
                        '822beba3-ffc0-4c5a-9f43-3b457515502b'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(30ce75c0-d6f0-4606-a03f-d079ff3d2a0c)?view=full'
                },
                {
                    'uuid': '4bd5d5c7-7588-4ae6-8914-b6ae06cb2484',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'CAS',
                    'code': '37466-21-0',
                    'type': 'PRIMARY',
                    'url': 'http://chem.sis.nlm.nih.gov/chemidplus/direct.jsp?regno=37466-21-0&result=advanced',
                    'references': [
                        '822beba3-ffc0-4c5a-9f43-3b457515502b'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(4bd5d5c7-7588-4ae6-8914-b6ae06cb2484)?view=full'
                },
                {
                    'uuid': '52e55b80-f327-4690-b87b-f0d0d6640ef8',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'EVMPD',
                    'code': 'SUB183619',
                    'type': 'PRIMARY',
                    'references': [
                        '822beba3-ffc0-4c5a-9f43-3b457515502b'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(52e55b80-f327-4690-b87b-f0d0d6640ef8)?view=full'
                },
                {
                    'uuid': 'da4be265-d72e-4cf8-b9c4-cbe87b74ecbe',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'ECHA (EC/EINECS)',
                    'code': '253-514-4',
                    'type': 'PRIMARY',
                    'url': 'https://echa.europa.eu/substance-information/-/substanceinfo/100.048.632',
                    'references': [
                        '822beba3-ffc0-4c5a-9f43-3b457515502b'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(da4be265-d72e-4cf8-b9c4-cbe87b74ecbe)?view=full'
                }
            ],
            'notes': [],
            'properties': [],
            'relationships': [
                {
                    'uuid': '9194a9cf-947c-4745-a3ac-6246dfa3e13b',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'relatedSubstance': {
                        'uuid': 'a02eec52-814a-4b7d-be6c-99f37a5a9f8b',
                        'created': 1520368445000,
                        'createdBy': 'admin',
                        'lastEdited': 1520368445000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'refPname': 'ASPIRIN',
                        'refuuid': 'a05ec20c-8fe2-4e02-ba7f-df69e5e30248',
                        'substanceClass': 'reference',
                        'approvalID': 'R16CO5Y76E',
                        'linkingID': 'R16CO5Y76E',
                        'name': 'ASPIRIN',
                        'references': [],
                        'access': []
                    },
                    'originatorUuid': '9194a9cf-947c-4745-a3ac-6246dfa3e13b',
                    'type': 'ACTIVE MOIETY',
                    'references': [],
                    'access': []
                }
            ],
            'references': [
                {
                    'uuid': '069583db-8265-47a6-a110-5dba5244a7f0',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ACETYLSALICYLATE ARGININE [WHO-DD]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(069583db-8265-47a6-a110-5dba5244a7f0)?view=full'
                },
                {
                    'uuid': '3acb9056-0bc3-44b7-8ff3-395b0dcfbb0b',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'SRS import [4FES8WRA60]',
                    'docType': 'SRS',
                    'documentDate': 1493392141000,
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'url': 'http://fdasis.nlm.nih.gov/srs/srsdirect.jsp?regno=4FES8WRA60',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(3acb9056-0bc3-44b7-8ff3-395b0dcfbb0b)?view=full'
                },
                {
                    'uuid': '822beba3-ffc0-4c5a-9f43-3b457515502b',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'SRS CODE IMPORT',
                    'docType': 'SRS',
                    'documentDate': 1493392141000,
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(822beba3-ffc0-4c5a-9f43-3b457515502b)?view=full'
                },
                {
                    'uuid': 'cc4b46fc-1474-49e8-bdc5-8df2b2be7bef',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'FDA_SRS',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(cc4b46fc-1474-49e8-bdc5-8df2b2be7bef)?view=full'
                },
                {
                    'uuid': 'dd2f63ff-4776-4cd5-be45-2f27abc3caae',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'STN',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(dd2f63ff-4776-4cd5-be45-2f27abc3caae)?view=full'
                },
                {
                    'uuid': 'e7dd12d6-7978-4413-9a5b-b492baff3e37',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'WHO-DD',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN',
                        'PUBLIC_DOMAIN_RELEASE',
                        'AUTO_SELECTED'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(e7dd12d6-7978-4413-9a5b-b492baff3e37)?view=full'
                },
                {
                    'uuid': 'f296f340-f690-4301-8222-bf0e44f9bd09',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'dump-public-2018-03-05.gsrs',
                    'docType': 'BATCH_IMPORT',
                    'documentDate': 1520368444000,
                    'publicDomain': false,
                    'tags': [],
                    'id': 'b9fdcca829e0ff2e96ec',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(f296f340-f690-4301-8222-bf0e44f9bd09)?view=full'
                }
            ],
            'approvalID': '4FES8WRA60',
            'tags': [
                'WHO-DD'
            ],
            'structure': {
                'id': 'a4fd95f5-6b0e-41dd-bb4c-ad8f703140cd',
                'created': 1520368445000,
                'lastEdited': 1520368445000,
                'deprecated': false,
                'digest': '41784922d481d58450b108b80e2197698ec7609a',
                'molfile': '\n  Symyx   04271720172D 1   1.00000     0.00000     0\n\n 25 24  0     1  0            999 V2000\n    3.2578   -1.8901    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.2578   -1.3692    0.0000 N   0  0  0  0  0  0           0  0  0\n    3.6995   -2.1609    0.0000 N   0  0  0  0  0  0           0  0  0\n    4.1536   -1.8942    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.5953   -2.1525    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.0578   -1.8901    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.5161   -2.1609    0.0000 C   0  0  1  0  0  0           0  0  0\n    5.9703   -1.8942    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.9703   -1.3776    0.0000 O   0  0  0  0  0  0           0  0  0\n    6.4161   -2.1484    0.0000 O   0  0  0  0  0  0           0  0  0\n    5.5161   -2.6775    0.0000 N   0  0  0  0  0  0           0  0  0\n    2.8036   -2.1525    0.0000 N   0  0  0  0  0  0           0  0  0\n   10.4805   -6.4033    0.0000 C   0  0  0  0  0  0           0  0  0\n    9.6930   -5.8949    0.0000 C   0  0  0  0  0  0           0  0  0\n    9.6930   -4.9949    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.8972   -4.5116    0.0000 O   0  0  0  0  0  0           0  0  0\n    8.0847   -4.9657    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.0847   -5.8949    0.0000 C   0  0  0  0  0  0           0  0  0\n    7.2763   -4.5116    0.0000 O   0  0  0  0  0  0           0  0  0\n   10.5055   -4.5116    0.0000 C   0  0  0  0  0  0           0  0  0\n   11.3180   -4.9949    0.0000 C   0  0  0  0  0  0           0  0  0\n   11.3180   -5.9199    0.0000 C   0  0  0  0  0  0           0  0  0\n   10.5055   -3.5949    0.0000 C   0  0  0  0  0  0           0  0  0\n    9.7097   -3.1199    0.0000 O   0  0  0  0  0  0           0  0  0\n   11.2930   -3.1366    0.0000 O   0  0  0  0  0  0           0  0  0\n  2  1  2  0     0  0\n  3  1  1  0     0  0\n  4  3  1  0     0  0\n  5  4  1  0     0  0\n  6  5  1  0     0  0\n  7  6  1  0     0  0\n  8  7  1  0     0  0\n  9  8  2  0     0  0\n 10  8  1  0     0  0\n  7 11  1  1     0  0\n 12  1  1  0     0  0\n 13 14  2  0     0  0\n 14 15  1  0     0  0\n 16 15  1  0     0  0\n 17 16  1  0     0  0\n 18 17  1  0     0  0\n 19 17  2  0     0  0\n 15 20  2  0     0  0\n 21 20  1  0     0  0\n 22 21  2  0     0  0\n 13 22  1  0     0  0\n 23 20  1  0     0  0\n 24 23  1  0     0  0\n 25 23  2  0     0  0\nM  END\n',
                'smiles': 'N[C@@H](CCCNC(N)=N)C(O)=O.CC(=O)OC1=CC=CC=C1C(O)=O',
                'formula': 'C9H8O4.C6H14N4O2',
                'opticalActivity': 'UNSPECIFIED',
                'atropisomerism': 'No',
                'stereoCenters': 1,
                'definedStereo': 1,
                'ezCenters': 0,
                'charge': 0,
                'mwt': 354.3584,
                'count': 1,
                'createdBy': 'admin',
                'lastEditedBy': 'admin',
                'hash': 'KUD4A6TVGW6V',
                'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(a4fd95f5-6b0e-41dd-bb4c-ad8f703140cd)?view=full',
                'stereochemistry': 'ABSOLUTE',
                'references': [
                    'dd2f63ff-4776-4cd5-be45-2f27abc3caae',
                    '3acb9056-0bc3-44b7-8ff3-395b0dcfbb0b'
                ],
                'access': []
            },
            'moieties': [
                {
                    'uuid': '30746aff-4707-4a78-ab3b-73693ba85318',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'id': '30746aff-4707-4a78-ab3b-73693ba85318',
                    'digest': '8f2dacf6b7b6fc276107eda7d0e98eada6a44f3f',
                    'molfile': '\n  Marvin  04291707242D          \n\n 13 13  0  0  1  0            999 V2000\n    7.2760   -5.3052    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    7.2760   -4.4690    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.5484   -4.0603    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    8.0072   -4.0603    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    8.7234   -4.4952    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    8.7234   -5.3052    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.4321   -5.7628    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   10.1858   -5.3277    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   10.1858   -4.4952    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.4546   -4.0603    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.4546   -3.2353    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    8.7384   -2.8078    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   10.1633   -2.8228    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  3  2  2  0  0  0  0\n  2  4  1  0  0  0  0\n  4  5  1  0  0  0  0\n  6  5  1  0  0  0  0\n  5 10  2  0  0  0  0\n  7  6  2  0  0  0  0\n  7  8  1  0  0  0  0\n  8  9  2  0  0  0  0\n  9 10  1  0  0  0  0\n 11 10  1  0  0  0  0\n 12 11  1  0  0  0  0\n 13 11  2  0  0  0  0\nM  END\n',
                    'smiles': 'CC(=O)OC1=C(C=CC=C1)C(O)=O',
                    'formula': 'C9H8O4',
                    'opticalActivity': 'NONE',
                    'stereoCenters': 0,
                    'definedStereo': 0,
                    'ezCenters': 0,
                    'charge': 0,
                    'mwt': 180.1574,
                    'count': 1,
                    'hash': 'NNQ793F142LD',
                    'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(30746aff-4707-4a78-ab3b-73693ba85318)?view=full',
                    'stereochemistry': 'ACHIRAL',
                    'references': [],
                    'access': [],
                    'countAmount': {
                        'uuid': '176699cc-029c-4a14-9536-d2ad35605bd7',
                        'created': 1520368445000,
                        'createdBy': 'admin',
                        'lastEdited': 1520368445000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'type': 'MOL RATIO',
                        'average': 1.0,
                        'units': 'MOL RATIO',
                        'references': [],
                        'access': []
                    }
                },
                {
                    'uuid': 'bfe0c0fb-b38f-42c0-b9e4-b9e4dcca3201',
                    'created': 1520368445000,
                    'createdBy': 'admin',
                    'lastEdited': 1520368445000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'id': 'bfe0c0fb-b38f-42c0-b9e4-b9e4dcca3201',
                    'digest': '03e887d6befeee78fe923ba33df947f07f92d04f',
                    'molfile': '\n  Marvin  04291707242D          \n\n 12 11  0  0  1  0            999 V2000\n    4.9643   -1.9447    0.0000 C   0  0  1  0  0  0  0  0  0  2  0  0\n    4.9643   -2.4097    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    4.5519   -1.7010    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.1356   -1.9372    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.7381   -1.7047    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.3294   -1.9447    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    2.9319   -1.7010    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.9319   -1.2322    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    2.5231   -1.9372    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    5.3731   -1.7047    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.3731   -1.2398    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    5.7743   -1.9335    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  1  0  0  0\n  1  3  1  0  0  0  0\n 10  1  1  0  0  0  0\n  3  4  1  0  0  0  0\n  4  5  1  0  0  0  0\n  5  6  1  0  0  0  0\n  6  7  1  0  0  0  0\n  8  7  1  0  0  0  0\n  9  7  2  0  0  0  0\n 11 10  1  0  0  0  0\n 12 10  2  0  0  0  0\nM  END\n',
                    'smiles': 'N[C@@H](CCCNC(N)=N)C(O)=O',
                    'formula': 'C6H14N4O2',
                    'opticalActivity': 'UNSPECIFIED',
                    'stereoCenters': 1,
                    'definedStereo': 1,
                    'ezCenters': 0,
                    'charge': 0,
                    'mwt': 174.201,
                    'count': 1,
                    'hash': 'Q4C8CG2XA8B3',
                    'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(bfe0c0fb-b38f-42c0-b9e4-b9e4dcca3201)?view=full',
                    'stereochemistry': 'ABSOLUTE',
                    'references': [],
                    'access': [],
                    'countAmount': {
                        'uuid': '68019731-c980-46c3-a59b-5e5e88cbedfc',
                        'created': 1520368445000,
                        'createdBy': 'admin',
                        'lastEdited': 1520368445000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'type': 'MOL RATIO',
                        'average': 1.0,
                        'units': 'MOL RATIO',
                        'references': [],
                        'access': []
                    }
                }
            ],
            '_approvalIDDisplay': '4FES8WRA60',
            '_name': 'ASPIRIN ARGININE',
            'access': [],
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(5c23b29c-e42b-467a-bf4f-e5b2f990a947)?view=full'
        },
        {
            'uuid': '8919c8de-dccd-4d97-a4bc-82cd34a0616b',
            'created': 1520356605000,
            'createdBy': 'admin',
            'lastEdited': 1520356605000,
            'lastEditedBy': 'admin',
            'deprecated': false,
            'definitionType': 'PRIMARY',
            'definitionLevel': 'COMPLETE',
            'substanceClass': 'chemical',
            'status': 'approved',
            'version': '2',
            'approvedBy': 'FDA_SRS',
            'names': [
                {
                    'uuid': '775354e9-0ff3-43b2-9383-4a3cf3649024',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'CALCIUM ACETYLSALICYLATE [MI]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '9629cb8c-5363-4795-a729-f8541c15123c'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(775354e9-0ff3-43b2-9383-4a3cf3649024)?view=full'
                },
                {
                    'uuid': '8a380a34-9109-488b-89ec-94a340a7c9e0',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN, CALCIUM',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '18bc15a8-3282-4e07-9bc3-7a1bab544898'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(8a380a34-9109-488b-89ec-94a340a7c9e0)?view=full'
                },
                {
                    'uuid': '942b68ab-51d0-4ee2-854b-28a7bb1d5777',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'CALCIUM ACETYLSALICYLATE',
                    'type': 'sys',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'c9ceacc8-81c0-4f18-bd1d-adb3eea7bbe5',
                        '7bb9e10a-36d1-41bf-b601-1b743caf27f8',
                        '9629cb8c-5363-4795-a729-f8541c15123c'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(942b68ab-51d0-4ee2-854b-28a7bb1d5777)?view=full'
                },
                {
                    'uuid': '9fb16917-e82d-4cc0-ad77-6130f2de83eb',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN CALCIUM',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': true,
                    'references': [
                        'b178952c-fb46-4801-82a6-e7b0d9e4b5e7'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(9fb16917-e82d-4cc0-ad77-6130f2de83eb)?view=full'
                },
                {
                    'uuid': 'a9e1f5c4-60c8-4e01-9ce4-927b6b1f8817',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'CALCIUM ASPIRIN',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '7bb9e10a-36d1-41bf-b601-1b743caf27f8'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(a9e1f5c4-60c8-4e01-9ce4-927b6b1f8817)?view=full'
                },
                {
                    'uuid': 'd1180d75-b041-4de0-8396-0f7dfaa5713b',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLATE CALCIUM [WHO-DD]',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '5b29fc46-cc56-4686-bae1-8c5bae467824'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(d1180d75-b041-4de0-8396-0f7dfaa5713b)?view=full'
                },
                {
                    'uuid': 'da010c19-78d8-4d01-b8d4-49c060214854',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': '2-(ACETYLOXY)BENZOIC ACID CALCIUM SALT',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '7bb9e10a-36d1-41bf-b601-1b743caf27f8'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(da010c19-78d8-4d01-b8d4-49c060214854)?view=full'
                },
                {
                    'uuid': 'ff634686-9d98-418f-8c7b-6bcf85d4441e',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLATE CALCIUM',
                    'type': 'sys',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'e4df34a7-7d82-40c8-88ad-5d3f0fcb8ff1',
                        '5b29fc46-cc56-4686-bae1-8c5bae467824'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(ff634686-9d98-418f-8c7b-6bcf85d4441e)?view=full'
                },
                {
                    'uuid': 'ff6e49a2-21a2-4582-81bc-862994f8c0f5',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLIC ACID CALCIUM SALT',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '7bb9e10a-36d1-41bf-b601-1b743caf27f8'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(ff6e49a2-21a2-4582-81bc-862994f8c0f5)?view=full'
                }
            ],
            'codes': [
                {
                    'uuid': '6240f2b6-2944-4085-a484-2a2990de5484',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'MERCK INDEX',
                    'code': 'M2920',
                    'comments': 'Merck Index',
                    'type': 'PRIMARY',
                    'url': 'https://www.rsc.org/Merck-Index/monograph/M2920?q=authorize',
                    'references': [
                        '2bc07495-215c-4df4-abe1-1ef56bb99505'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(6240f2b6-2944-4085-a484-2a2990de5484)?view=full'
                },
                {
                    'uuid': '66f5d94a-946b-4d51-8a62-b8a5aaec7101',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'ECHA (EC/EINECS)',
                    'code': '200-707-6',
                    'type': 'PRIMARY',
                    'url': 'https://echa.europa.eu/substance-information/-/substanceinfo/100.000.643',
                    'references': [
                        '2bc07495-215c-4df4-abe1-1ef56bb99505'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(66f5d94a-946b-4d51-8a62-b8a5aaec7101)?view=full'
                },
                {
                    'uuid': '6b051f79-fabf-aa2f-dcdd-92b2cf15f4ec',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'EPA CompTox',
                    'code': '69-46-5',
                    'type': 'PRIMARY',
                    'url': 'https://comptox.epa.gov/dashboard/dsstoxdb/results?utf8=%E2%9C%93&search=69-46-5',
                    'references': [
                        '66f9e515-f31b-46e4-34f1-cd131ceaa275'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(6b051f79-fabf-aa2f-dcdd-92b2cf15f4ec)?view=full'
                },
                {
                    'uuid': '7515a05a-7505-40ff-be48-25ef9994c18f',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'NCI_THESAURUS',
                    'code': 'C83539',
                    'type': 'PRIMARY',
                    'url': 'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=15.09d&ns=NCI_Thesaurus&code=C83539',
                    'references': [
                        '2bc07495-215c-4df4-abe1-1ef56bb99505'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(7515a05a-7505-40ff-be48-25ef9994c18f)?view=full'
                },
                {
                    'uuid': '96ddec6f-df03-4d40-9530-7f392bde09e5',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'EVMPD',
                    'code': 'SUB12726MIG',
                    'type': 'PRIMARY',
                    'references': [
                        '2bc07495-215c-4df4-abe1-1ef56bb99505'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(96ddec6f-df03-4d40-9530-7f392bde09e5)?view=full'
                },
                {
                    'uuid': 'e27404fd-f3b7-457e-87f5-c220fe0c6580',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'CAS',
                    'code': '69-46-5',
                    'type': 'PRIMARY',
                    'url': 'http://chem.sis.nlm.nih.gov/chemidplus/direct.jsp?regno=69-46-5&result=advanced',
                    'references': [
                        '2bc07495-215c-4df4-abe1-1ef56bb99505'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(e27404fd-f3b7-457e-87f5-c220fe0c6580)?view=full'
                }
            ],
            'notes': [
                {
                    'uuid': '2ef61147-d954-48d8-be5b-3b5d10692ee6',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'note': '[Validation]WARNING:Code \'M2920\'[MERCK INDEX] collides (possible duplicate) with existing code & codeSystem for substance:\n[N667F17JP1]CARBASPIRIN CALCIUM',
                    'references': [
                        '0c445d16-6d4f-4817-b47c-ab2da11bcc4d'
                    ],
                    'access': [
                        'admin'
                    ]
                }
            ],
            'properties': [],
            'relationships': [
                {
                    'uuid': '502f8b44-c4f2-42f8-af90-5ac9b507bf3c',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'relatedSubstance': {
                        'uuid': '3ece8897-4f45-4c6c-99f5-fcad050212d0',
                        'created': 1520356605000,
                        'createdBy': 'admin',
                        'lastEdited': 1520356605000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'refPname': 'ASPIRIN',
                        'refuuid': 'a05ec20c-8fe2-4e02-ba7f-df69e5e30248',
                        'substanceClass': 'reference',
                        'approvalID': 'R16CO5Y76E',
                        'linkingID': 'R16CO5Y76E',
                        'name': 'ASPIRIN',
                        'references': [],
                        'access': []
                    },
                    'originatorUuid': '502f8b44-c4f2-42f8-af90-5ac9b507bf3c',
                    'type': 'ACTIVE MOIETY',
                    'references': [],
                    'access': []
                }
            ],
            'references': [
                {
                    'uuid': '0c445d16-6d4f-4817-b47c-ab2da11bcc4d',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'GSRS System-generated Validation messages',
                    'docType': 'VALIDATION_MESSAGE',
                    'documentDate': 1520356605000,
                    'publicDomain': false,
                    'tags': [],
                    'access': [
                        'admin'
                    ],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(0c445d16-6d4f-4817-b47c-ab2da11bcc4d)?view=full'
                },
                {
                    'uuid': '0c985d72-55e0-497c-b5fc-612db1ea56c9',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'dump-public-2018-03-05.gsrs',
                    'docType': 'BATCH_IMPORT',
                    'documentDate': 1520356605000,
                    'publicDomain': false,
                    'tags': [],
                    'id': 'b9fdcca829e0ff2e96ec',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(0c985d72-55e0-497c-b5fc-612db1ea56c9)?view=full'
                },
                {
                    'uuid': '18bc15a8-3282-4e07-9bc3-7a1bab544898',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'OTC',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(18bc15a8-3282-4e07-9bc3-7a1bab544898)?view=full'
                },
                {
                    'uuid': '2bc07495-215c-4df4-abe1-1ef56bb99505',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'SRS CODE IMPORT',
                    'docType': 'SRS',
                    'documentDate': 1493389694000,
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(2bc07495-215c-4df4-abe1-1ef56bb99505)?view=full'
                },
                {
                    'uuid': '5b29fc46-cc56-4686-bae1-8c5bae467824',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'who-dd',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(5b29fc46-cc56-4686-bae1-8c5bae467824)?view=full'
                },
                {
                    'uuid': '66f9e515-f31b-46e4-34f1-cd131ceaa275',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'WEBSITE',
                    'docType': 'WEBSITE',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN',
                        'PUBLIC_DOMAIN_RELEASE'
                    ],
                    'url': 'https://comptox.epa.gov/dashboard/dsstoxdb/results?utf8=%E2%9C%93&search=69-46-5',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(66f9e515-f31b-46e4-34f1-cd131ceaa275)?view=full'
                },
                {
                    'uuid': '7bb9e10a-36d1-41bf-b601-1b743caf27f8',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'MERCK',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN',
                        'PUBLIC_DOMAIN_RELEASE',
                        'AUTO_SELECTED'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(7bb9e10a-36d1-41bf-b601-1b743caf27f8)?view=full'
                },
                {
                    'uuid': '9629cb8c-5363-4795-a729-f8541c15123c',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'MERCK INDEX',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(9629cb8c-5363-4795-a729-f8541c15123c)?view=full'
                },
                {
                    'uuid': 'b178952c-fb46-4801-82a6-e7b0d9e4b5e7',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'FDA_SRS',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(b178952c-fb46-4801-82a6-e7b0d9e4b5e7)?view=full'
                },
                {
                    'uuid': 'c29e8b78-01c0-4647-9156-9cb07c8ee030',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'SRS import [WOD7W0DGZS]',
                    'docType': 'SRS',
                    'documentDate': 1493389694000,
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'url': 'http://fdasis.nlm.nih.gov/srs/srsdirect.jsp?regno=WOD7W0DGZS',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(c29e8b78-01c0-4647-9156-9cb07c8ee030)?view=full'
                },
                {
                    'uuid': 'c9ceacc8-81c0-4f18-bd1d-adb3eea7bbe5',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'CALCIUM ACETYLSALICYLATE [MI]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(c9ceacc8-81c0-4f18-bd1d-adb3eea7bbe5)?view=full'
                },
                {
                    'uuid': 'e4df34a7-7d82-40c8-88ad-5d3f0fcb8ff1',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'ACETYLSALICYLATE CALCIUM [WHO-DD]',
                    'docType': 'SRS_LOCATOR',
                    'publicDomain': true,
                    'tags': [],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(e4df34a7-7d82-40c8-88ad-5d3f0fcb8ff1)?view=full'
                }
            ],
            'approvalID': 'WOD7W0DGZS',
            'tags': [
                'MI',
                'WHO-DD'
            ],
            'structure': {
                'id': '2ec1e9f6-ba3f-4123-a215-d1f59f37c9d7',
                'created': 1520356605000,
                'lastEdited': 1520356605000,
                'deprecated': false,
                'digest': '9ad68f2d6d89e3a53d7b80cd93413ab80f653dbb',
                'molfile': '\n  Symyx   04271718532D 1   1.00000     0.00000     0\n\n 27 26  0     0  0            999 V2000\n   -0.6583   -4.1959    0.0000 Ca  0  2  0  0  0  0           0  0  0\n    3.2902   -3.1000    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.2891   -4.2815    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.3081   -4.8735    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.3328   -4.2810    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.3300   -3.0963    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.3063   -2.5122    0.0000 C   0  0  0  0  0  0           0  0  0\n    2.2691   -2.5103    0.0000 C   0  0  0  0  0  0           0  0  0\n    2.2691   -1.3312    0.0000 O   0  0  0  0  0  0           0  0  0\n    1.2479   -3.0998    0.0000 O   0  5  0  0  0  0           0  0  0\n    2.2668   -4.8692    0.0000 O   0  0  0  0  0  0           0  0  0\n    2.2646   -6.0483    0.0000 C   0  0  0  0  0  0           0  0  0\n    1.2423   -6.6360    0.0000 O   0  0  0  0  0  0           0  0  0\n    3.2847   -6.6398    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.2902   -3.1000    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.2891   -4.2815    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.3081   -4.8735    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.3328   -4.2810    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.3300   -3.0963    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.3063   -2.5122    0.0000 C   0  0  0  0  0  0           0  0  0\n    2.2691   -2.5103    0.0000 C   0  0  0  0  0  0           0  0  0\n    2.2691   -1.3312    0.0000 O   0  0  0  0  0  0           0  0  0\n    1.2479   -3.0998    0.0000 O   0  5  0  0  0  0           0  0  0\n    2.2668   -4.8692    0.0000 O   0  0  0  0  0  0           0  0  0\n    2.2646   -6.0483    0.0000 C   0  0  0  0  0  0           0  0  0\n    1.2423   -6.6360    0.0000 O   0  0  0  0  0  0           0  0  0\n    3.2847   -6.6398    0.0000 C   0  0  0  0  0  0           0  0  0\n  8 10  1  0     0  0\n  4  5  2  0     0  0\n  3 11  1  0     0  0\n 11 12  1  0     0  0\n  5  6  1  0     0  0\n 12 13  2  0     0  0\n  2  3  2  0     0  0\n 12 14  1  0     0  0\n  6  7  2  0     0  0\n  7  2  1  0     0  0\n  2  8  1  0     0  0\n  3  4  1  0     0  0\n  8  9  2  0     0  0\n 24 25  1  0     0  0\n 18 19  1  0     0  0\n 25 26  2  0     0  0\n 15 16  2  0     0  0\n 25 27  1  0     0  0\n 19 20  2  0     0  0\n 20 15  1  0     0  0\n 15 21  1  0     0  0\n 16 17  1  0     0  0\n 21 22  2  0     0  0\n 21 23  1  0     0  0\n 17 18  2  0     0  0\n 16 24  1  0     0  0\nM  CHG  3   1   2  10  -1  23  -1\nM  STY  1   1 MUL\nM  SLB  1   1   1\nM  SCN  1   1 HT\nM  SAL   1 15   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16\nM  SAL   1 11  17  18  19  20  21  22  23  24  25  26  27\nM  SPA   1 13   2   3   4   5   6   7   8   9  10  11  12  13  14\nM  SMT   1 2\nM  SDI   1  4    0.7500   -7.3000    0.7500   -0.8500\nM  SDI   1  4    5.8000   -0.8500    5.8000   -7.3000\nM  END\n',
                'smiles': '[Ca++].CC(=O)OC1=CC=CC=C1C([O-])=O.CC(=O)OC2=CC=CC=C2C([O-])=O',
                'formula': '2C9H7O4.Ca',
                'opticalActivity': 'UNSPECIFIED',
                'atropisomerism': 'No',
                'stereoCenters': 0,
                'definedStereo': 0,
                'ezCenters': 0,
                'charge': 0,
                'mwt': 398.377,
                'count': 1,
                'createdBy': 'admin',
                'lastEditedBy': 'admin',
                'hash': 'GZZAJ3UDY2PM',
                'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(2ec1e9f6-ba3f-4123-a215-d1f59f37c9d7)?view=full',
                'stereochemistry': 'ACHIRAL',
                'references': [
                    '7bb9e10a-36d1-41bf-b601-1b743caf27f8',
                    'c29e8b78-01c0-4647-9156-9cb07c8ee030'
                ],
                'access': []
            },
            'moieties': [
                {
                    'uuid': '09dce3c5-1096-472a-8739-37f5607209a1',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'id': '09dce3c5-1096-472a-8739-37f5607209a1',
                    'digest': 'd33d2c3247db2aab78b877acbc39c7aa9d13e0f3',
                    'molfile': '\n  Marvin  04291703202D          \n\n 13 13  0  0  0  0            999 V2000\n    2.2982   -4.6456    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.5844   -4.2317    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.8692   -4.6429    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    1.5860   -3.4068    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    2.3012   -2.9956    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.0142   -3.4098    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.7311   -2.9952    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.7292   -2.1663    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.0129   -1.7577    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.3020   -2.1689    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.5876   -1.7563    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.5876   -0.9314    0.0000 O   0  5  0  0  0  0  0  0  0  0  0  0\n    0.8731   -2.1688    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  2  1  1  0  0  0  0\n  2  3  2  0  0  0  0\n  4  2  1  0  0  0  0\n  5  4  1  0  0  0  0\n  5  6  1  0  0  0  0\n 10  5  2  0  0  0  0\n  6  7  2  0  0  0  0\n  7  8  1  0  0  0  0\n  8  9  2  0  0  0  0\n  9 10  1  0  0  0  0\n 10 11  1  0  0  0  0\n 11 12  1  0  0  0  0\n 11 13  2  0  0  0  0\nM  CHG  1  12  -1\nM  END\n',
                    'smiles': 'CC(=O)OC1=C(C=CC=C1)C([O-])=O',
                    'formula': 'C9H7O4',
                    'opticalActivity': 'NONE',
                    'stereoCenters': 0,
                    'definedStereo': 0,
                    'ezCenters': 0,
                    'charge': -1,
                    'mwt': 179.1495,
                    'count': 2,
                    'hash': 'NNQ793F142LD',
                    'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(09dce3c5-1096-472a-8739-37f5607209a1)?view=full',
                    'stereochemistry': 'ACHIRAL',
                    'references': [],
                    'access': [],
                    'countAmount': {
                        'uuid': '47aef0b7-df3f-4ad7-ab88-49064a5fc186',
                        'created': 1520356605000,
                        'createdBy': 'admin',
                        'lastEdited': 1520356605000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'type': 'MOL RATIO',
                        'average': 2.0,
                        'units': 'MOL RATIO',
                        'references': [],
                        'access': []
                    }
                },
                {
                    'uuid': 'f67ef05c-86bf-4faf-a50c-3969ed485069',
                    'created': 1520356605000,
                    'createdBy': 'admin',
                    'lastEdited': 1520356605000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'id': 'f67ef05c-86bf-4faf-a50c-3969ed485069',
                    'digest': '1177707fa2b1f15b00a62bfda6c946ec717e6434',
                    'molfile': '\n  Marvin  04291703202D          \n\n  1  0  0  0  0  0            999 V2000\n   -0.4606   -2.9357    0.0000 Ca  0  2  0  0  0  0  0  0  0  0  0  0\nM  CHG  1   1   2\nM  END\n',
                    'smiles': '[Ca++]',
                    'formula': 'Ca',
                    'opticalActivity': 'NONE',
                    'stereoCenters': 0,
                    'definedStereo': 0,
                    'ezCenters': 0,
                    'charge': 2,
                    'mwt': 40.078,
                    'count': 1,
                    'hash': 'V6WH9AARYJAJ',
                    'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(f67ef05c-86bf-4faf-a50c-3969ed485069)?view=full',
                    'stereochemistry': 'ACHIRAL',
                    'references': [],
                    'access': [],
                    'countAmount': {
                        'uuid': 'dcc94ff8-42a3-4e4a-9c8e-ddf3afec7d91',
                        'created': 1520356605000,
                        'createdBy': 'admin',
                        'lastEdited': 1520356605000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'type': 'MOL RATIO',
                        'average': 1.0,
                        'units': 'MOL RATIO',
                        'references': [],
                        'access': []
                    }
                }
            ],
            '_approvalIDDisplay': 'WOD7W0DGZS',
            '_name': 'ASPIRIN CALCIUM',
            'access': [],
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(8919c8de-dccd-4d97-a4bc-82cd34a0616b)?view=full'
        },
        {
            'uuid': 'ddd4b3a1-709d-4052-9710-6d805767d4bf',
            'created': 1520354833000,
            'createdBy': 'admin',
            'lastEdited': 1520354833000,
            'lastEditedBy': 'admin',
            'deprecated': false,
            'definitionType': 'PRIMARY',
            'definitionLevel': 'COMPLETE',
            'substanceClass': 'chemical',
            'status': 'approved',
            'version': '2',
            'approvedBy': 'FDA_SRS',
            'names': [
                {
                    'uuid': '57c0395d-31e0-4291-9e88-17a270aab797',
                    'created': 1520354833000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354833000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'GLYCINE-CALCIUM ACETYLSALICYLATE DOUBLE SALT',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46777fa3-cab6-41ca-8d0f-4b48cf68244d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(57c0395d-31e0-4291-9e88-17a270aab797)?view=full'
                },
                {
                    'uuid': '5ccd5979-fa5c-4e20-beb5-8cd0929d2d7c',
                    'created': 1520354833000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354833000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN GLYCINE CALCIUM',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': true,
                    'references': [
                        '2fc9880d-4ff7-4f81-ad05-880cb90a0c05'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(5ccd5979-fa5c-4e20-beb5-8cd0929d2d7c)?view=full'
                },
                {
                    'uuid': '6847666f-00fa-40b3-beb5-d23d9c255971',
                    'created': 1520354833000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354833000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'CALCIUM, (GLYCINATO)(SALICYLATO)-, ACETATE (ESTER)',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46777fa3-cab6-41ca-8d0f-4b48cf68244d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(6847666f-00fa-40b3-beb5-d23d9c255971)?view=full'
                },
                {
                    'uuid': '72c3232b-c78b-41aa-b3fa-a0e38ef3a64d',
                    'created': 1520354833000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354833000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'CALCIUM ACETYLSALICYLATE-GLYCINE DOUBLE SALT',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '46777fa3-cab6-41ca-8d0f-4b48cf68244d'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(72c3232b-c78b-41aa-b3fa-a0e38ef3a64d)?view=full'
                }
            ],
            'codes': [
                {
                    'uuid': '32e0daa2-4df3-4d1c-a9e4-f10620ab0eba',
                    'created': 1520354833000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354833000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'CAS',
                    'code': '22194-39-4',
                    'type': 'PRIMARY',
                    'url': 'http://chem.sis.nlm.nih.gov/chemidplus/direct.jsp?regno=22194-39-4&result=advanced',
                    'references': [
                        '0383d37a-a9da-4236-b644-d54aba7fd47a'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(32e0daa2-4df3-4d1c-a9e4-f10620ab0eba)?view=full'
                },
                {
                    'uuid': '39d54453-1f77-4625-85c7-a9688728c2a8',
                    'created': 1520354833000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354833000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'PUBCHEM',
                    'code': '30987',
                    'type': 'PRIMARY',
                    'url': 'https://pubchem.ncbi.nlm.nih.gov/compound/30987',
                    'references': [
                        '0383d37a-a9da-4236-b644-d54aba7fd47a'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(39d54453-1f77-4625-85c7-a9688728c2a8)?view=full'
                },
                {
                    'uuid': '48d9fdb2-5c6c-5736-6e87-8198f39114a6',
                    'created': 1520354833000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354833000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'EPA CompTox',
                    'code': '22194-39-4',
                    'type': 'PRIMARY',
                    'url': 'https://comptox.epa.gov/dashboard/dsstoxdb/results?utf8=%E2%9C%93&search=22194-39-4',
                    'references': [
                        'cc821d2c-c766-4f6c-cefa-a4c4d73e7e77'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(48d9fdb2-5c6c-5736-6e87-8198f39114a6)?view=full'
                }
            ],
            'notes': [],
            'properties': [],
            'relationships': [
                {
                    'uuid': '1a18b80c-12af-4364-8616-5f90612f5d72',
                    'created': 1520354833000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354833000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'relatedSubstance': {
                        'uuid': '74aec2b9-8f73-4718-88f3-0fe305fa3f28',
                        'created': 1520354833000,
                        'createdBy': 'admin',
                        'lastEdited': 1520354833000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'refPname': 'ASPIRIN',
                        'refuuid': 'a05ec20c-8fe2-4e02-ba7f-df69e5e30248',
                        'substanceClass': 'reference',
                        'approvalID': 'R16CO5Y76E',
                        'linkingID': 'R16CO5Y76E',
                        'name': 'ASPIRIN',
                        'references': [],
                        'access': []
                    },
                    'originatorUuid': '1a18b80c-12af-4364-8616-5f90612f5d72',
                    'type': 'ACTIVE MOIETY',
                    'references': [],
                    'access': []
                }
            ],
            'references': [
                {
                    'uuid': '0383d37a-a9da-4236-b644-d54aba7fd47a',
                    'created': 1520354833000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354833000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'SRS CODE IMPORT',
                    'docType': 'SRS',
                    'documentDate': 1493389751000,
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(0383d37a-a9da-4236-b644-d54aba7fd47a)?view=full'
                },
                {
                    'uuid': '2fc9880d-4ff7-4f81-ad05-880cb90a0c05',
                    'created': 1520354833000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354833000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'FDA_SRS',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN',
                        'PUBLIC_DOMAIN_RELEASE',
                        'AUTO_SELECTED'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(2fc9880d-4ff7-4f81-ad05-880cb90a0c05)?view=full'
                },
                {
                    'uuid': '46777fa3-cab6-41ca-8d0f-4b48cf68244d',
                    'created': 1520354833000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354833000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'STN',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(46777fa3-cab6-41ca-8d0f-4b48cf68244d)?view=full'
                },
                {
                    'uuid': '8713f705-be97-4b34-b025-19deffb99f9f',
                    'created': 1520354833000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354833000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'SRS import [NK259942HJ]',
                    'docType': 'SRS',
                    'documentDate': 1493389751000,
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'url': 'http://fdasis.nlm.nih.gov/srs/srsdirect.jsp?regno=NK259942HJ',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(8713f705-be97-4b34-b025-19deffb99f9f)?view=full'
                },
                {
                    'uuid': '97046f85-77bf-4412-85cf-3575db4f2b09',
                    'created': 1520354833000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354833000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'dump-public-2018-03-05.gsrs',
                    'docType': 'BATCH_IMPORT',
                    'documentDate': 1520354833000,
                    'publicDomain': false,
                    'tags': [],
                    'id': 'b9fdcca829e0ff2e96ec',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(97046f85-77bf-4412-85cf-3575db4f2b09)?view=full'
                },
                {
                    'uuid': 'cc821d2c-c766-4f6c-cefa-a4c4d73e7e77',
                    'created': 1520354833000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354833000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'WEBSITE',
                    'docType': 'WEBSITE',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN',
                        'PUBLIC_DOMAIN_RELEASE'
                    ],
                    'url': 'https://comptox.epa.gov/dashboard/dsstoxdb/results?utf8=%E2%9C%93&search=22194-39-4',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(cc821d2c-c766-4f6c-cefa-a4c4d73e7e77)?view=full'
                }
            ],
            'approvalID': 'NK259942HJ',
            'tags': [],
            'structure': {
                'id': '674fde28-88af-42bc-9139-1490eac0bc51',
                'created': 1520354833000,
                'lastEdited': 1520354833000,
                'deprecated': false,
                'digest': '9aa47a3ff0e8c048ce678158f5facfe477c8d49e',
                'molfile': '\n  Symyx   04271718592D 1   1.00000     0.00000     0\n\n 19 17  0     0  0            999 V2000\n    4.5042   -2.5875    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.7875   -1.2792    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.2292   -3.0125    0.0000 C   0  0  0  0  0  0           0  0  0\n    2.2667   -2.1167    0.0000 O   0  0  0  0  0  0           0  0  0\n    1.0000   -2.5292    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.7750   -0.4000    0.0000 O   0  5  0  0  0  0           0  0  0\n    6.0500   -0.8792    0.0000 O   0  0  0  0  0  0           0  0  0\n    0.0000   -1.6417    0.0000 O   0  0  0  0  0  0           0  0  0\n    5.5042   -3.4792    0.0000 C   0  0  0  0  0  0           0  0  0\n    2.9667   -4.3042    0.0000 C   0  0  0  0  0  0           0  0  0\n    0.6917   -3.8375    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.2000   -4.7875    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.9375   -5.2000    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.5792   -2.6292    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.5792   -3.9667    0.0000 O   0  5  0  0  0  0           0  0  0\n    7.4542   -1.9792    0.0000 O   0  0  0  0  0  0           0  0  0\n   10.8792   -2.6292    0.0000 N   0  0  0  0  0  0           0  0  0\n    9.7500   -1.9792    0.0000 C   0  0  0  0  0  0           0  0  0\n    7.2792    0.0000    0.0000 Ca  0  2  0  0  0  0           0  0  0\n 11  5  1  0     0  0\n 12  9  2  0     0  0\n 13 10  2  0     0  0\n 13 12  1  0     0  0\n  2  1  1  0     0  0\n  3  1  2  0     0  0\n  4  3  1  0     0  0\n  5  4  1  0     0  0\n  6  2  1  0     0  0\n  7  2  2  0     0  0\n  8  5  2  0     0  0\n  9  1  1  0     0  0\n 15 14  1  0     0  0\n 16 14  2  0     0  0\n 17 18  1  0     0  0\n 18 14  1  0     0  0\n 10  3  1  0     0  0\nM  CHG  3   6  -1  15  -1  19   2\nM  END\n',
                'smiles': '[Ca++].NCC([O-])=O.CC(=O)OC1=CC=CC=C1C([O-])=O',
                'formula': 'C9H7O4.C2H4NO2.Ca',
                'opticalActivity': 'UNSPECIFIED',
                'atropisomerism': 'No',
                'stereoCenters': 0,
                'definedStereo': 0,
                'ezCenters': 0,
                'charge': 0,
                'mwt': 293.286,
                'count': 1,
                'createdBy': 'admin',
                'lastEditedBy': 'admin',
                'hash': 'Y3555PXWBXLN',
                'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(674fde28-88af-42bc-9139-1490eac0bc51)?view=full',
                'stereochemistry': 'ACHIRAL',
                'references': [
                    '8713f705-be97-4b34-b025-19deffb99f9f',
                    '46777fa3-cab6-41ca-8d0f-4b48cf68244d'
                ],
                'access': []
            },
            'moieties': [
                {
                    'uuid': '6b673bd6-6f85-432d-b8d1-193eae6dcfcc',
                    'created': 1520354833000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354833000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'id': '6b673bd6-6f85-432d-b8d1-193eae6dcfcc',
                    'digest': 'ec5deea7ee38cb277f5930c99557e2efd8eefb3a',
                    'molfile': '\n  Marvin  04291703302D          \n\n  1  0  0  0  0  0            999 V2000\n    4.4862    0.0000    0.0000 Ca  0  2  0  0  0  0  0  0  0  0  0  0\nM  CHG  1   1   2\nM  END\n',
                    'smiles': '[Ca++]',
                    'formula': 'Ca',
                    'opticalActivity': 'NONE',
                    'stereoCenters': 0,
                    'definedStereo': 0,
                    'ezCenters': 0,
                    'charge': 2,
                    'mwt': 40.078,
                    'count': 1,
                    'hash': 'V6WH9AARYJAJ',
                    'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(6b673bd6-6f85-432d-b8d1-193eae6dcfcc)?view=full',
                    'stereochemistry': 'ACHIRAL',
                    'references': [],
                    'access': [],
                    'countAmount': {
                        'uuid': 'e234db0b-e4e6-4bf0-8769-010e39000b24',
                        'created': 1520354833000,
                        'createdBy': 'admin',
                        'lastEdited': 1520354833000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'type': 'MOL RATIO',
                        'average': 1.0,
                        'units': 'MOL RATIO',
                        'references': [],
                        'access': []
                    }
                },
                {
                    'uuid': 'e734f726-5dcc-4e80-95b0-a954500b931f',
                    'created': 1520354833000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354833000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'id': 'e734f726-5dcc-4e80-95b0-a954500b931f',
                    'digest': 'ec46e421253d1e39cda8c418fdca0f1c8723c924',
                    'molfile': '\n  Marvin  04291703302D          \n\n 13 13  0  0  0  0            999 V2000\n    0.4263   -2.3651    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.6163   -1.5588    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000   -1.0118    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    1.3970   -1.3045    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    1.9902   -1.8566    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.8284   -2.6527    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.4267   -3.2048    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.2048   -2.9506    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.3923   -2.1443    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.7760   -1.5947    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.9506   -0.7884    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.3266   -0.2465    0.0000 O   0  5  0  0  0  0  0  0  0  0  0  0\n    3.7286   -0.5419    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  3  2  2  0  0  0  0\n  2  4  1  0  0  0  0\n  4  5  1  0  0  0  0\n  6  5  1  0  0  0  0\n  5 10  2  0  0  0  0\n  7  6  2  0  0  0  0\n  7  8  1  0  0  0  0\n  8  9  2  0  0  0  0\n  9 10  1  0  0  0  0\n 11 10  1  0  0  0  0\n 12 11  1  0  0  0  0\n 13 11  2  0  0  0  0\nM  CHG  1  12  -1\nM  END\n',
                    'smiles': 'CC(=O)OC1=C(C=CC=C1)C([O-])=O',
                    'formula': 'C9H7O4',
                    'opticalActivity': 'NONE',
                    'stereoCenters': 0,
                    'definedStereo': 0,
                    'ezCenters': 0,
                    'charge': -1,
                    'mwt': 179.1495,
                    'count': 1,
                    'hash': 'NNQ793F142LD',
                    'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(e734f726-5dcc-4e80-95b0-a954500b931f)?view=full',
                    'stereochemistry': 'ACHIRAL',
                    'references': [],
                    'access': [],
                    'countAmount': {
                        'uuid': 'e661c1ff-c555-479c-b303-f405d09c7da8',
                        'created': 1520354833000,
                        'createdBy': 'admin',
                        'lastEdited': 1520354833000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'type': 'MOL RATIO',
                        'average': 1.0,
                        'units': 'MOL RATIO',
                        'references': [],
                        'access': []
                    }
                },
                {
                    'uuid': 'ea0927ed-d95d-48f7-992f-f4fdd4ab8e51',
                    'created': 1520354833000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354833000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'id': 'ea0927ed-d95d-48f7-992f-f4fdd4ab8e51',
                    'digest': '66108be104a145d2485ffdbb418a6a1ba55c397f',
                    'molfile': '\n  Marvin  04291703302D          \n\n  5  4  0  0  0  0            999 V2000\n    6.7049   -1.6204    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    6.0090   -1.2198    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.2874   -1.6204    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.2874   -2.4447    0.0000 O   0  5  0  0  0  0  0  0  0  0  0  0\n    4.5941   -1.2198    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  1  0  0  0  0\n  4  3  1  0  0  0  0\n  5  3  2  0  0  0  0\nM  CHG  1   4  -1\nM  END\n',
                    'smiles': 'NCC([O-])=O',
                    'formula': 'C2H4NO2',
                    'opticalActivity': 'NONE',
                    'stereoCenters': 0,
                    'definedStereo': 0,
                    'ezCenters': 0,
                    'charge': -1,
                    'mwt': 74.0587,
                    'count': 1,
                    'hash': 'YXX31QZ3CNMJ',
                    'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(ea0927ed-d95d-48f7-992f-f4fdd4ab8e51)?view=full',
                    'stereochemistry': 'ACHIRAL',
                    'references': [],
                    'access': [],
                    'countAmount': {
                        'uuid': '7cbbe4d3-1ba7-4816-a125-4deb9955e528',
                        'created': 1520354833000,
                        'createdBy': 'admin',
                        'lastEdited': 1520354833000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'type': 'MOL RATIO',
                        'average': 1.0,
                        'units': 'MOL RATIO',
                        'references': [],
                        'access': []
                    }
                }
            ],
            '_approvalIDDisplay': 'NK259942HJ',
            '_name': 'ASPIRIN GLYCINE CALCIUM',
            'access': [],
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(ddd4b3a1-709d-4052-9710-6d805767d4bf)?view=full'
        },
        {
            'uuid': 'b01ae0ed-0de4-471a-aca5-7902f31b05ab',
            'created': 1520354929000,
            'createdBy': 'admin',
            'lastEdited': 1520354929000,
            'lastEditedBy': 'admin',
            'deprecated': false,
            'definitionType': 'PRIMARY',
            'definitionLevel': 'COMPLETE',
            'substanceClass': 'chemical',
            'status': 'approved',
            'version': '2',
            'approvedBy': 'FDA_SRS',
            'names': [
                {
                    'uuid': '091fa7b5-2c5e-4ec7-a5b0-8410532bf19e',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'NSC-80056',
                    'type': 'cd',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'b9bfa1ea-edb8-4430-bc84-eb1fc26f79ec'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(091fa7b5-2c5e-4ec7-a5b0-8410532bf19e)?view=full'
                },
                {
                    'uuid': '29a8900f-ae85-41c4-b1a2-8d30825c6545',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'CONTRAFLU',
                    'type': 'bn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'bd7a021f-e323-4c2b-aa44-c0185bf85653'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(29a8900f-ae85-41c4-b1a2-8d30825c6545)?view=full'
                },
                {
                    'uuid': '4725e7e4-d229-4c13-afb3-e46f03403efd',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': '2-(ACETYLOXY)BENZOIC ANHYDRIDE',
                    'type': 'sys',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        '0c02cdb3-6d57-4739-98be-5a3993b0ef06'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(4725e7e4-d229-4c13-afb3-e46f03403efd)?view=full'
                },
                {
                    'uuid': '524dccf8-d857-408b-8e35-5fe7cd7560bd',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'VIGAL',
                    'type': 'bn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'bd7a021f-e323-4c2b-aa44-c0185bf85653'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(524dccf8-d857-408b-8e35-5fe7cd7560bd)?view=full'
                },
                {
                    'uuid': '5e6049d8-9fa8-478d-9713-4f6dcc1686a9',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'SALICYLIC ANHYDRIDE DIACETATE',
                    'type': 'sys',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'bd7a021f-e323-4c2b-aa44-c0185bf85653'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(5e6049d8-9fa8-478d-9713-4f6dcc1686a9)?view=full'
                },
                {
                    'uuid': '7b37cc78-7532-4e7d-a096-fc467d3b626f',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'NSC-63848',
                    'type': 'cd',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'b9bfa1ea-edb8-4430-bc84-eb1fc26f79ec'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(7b37cc78-7532-4e7d-a096-fc467d3b626f)?view=full'
                },
                {
                    'uuid': 'a3bd6a74-f941-4a9c-9bcc-0e5e855a865c',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'O-ACETYLSALICYLIC ANHYDRIDE',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'bd7a021f-e323-4c2b-aa44-c0185bf85653'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(a3bd6a74-f941-4a9c-9bcc-0e5e855a865c)?view=full'
                },
                {
                    'uuid': 'c20fefdc-f6bc-4158-8651-ddaa895d1c60',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ACETYLSALICYLIC ANHYDRIDE',
                    'type': 'sys',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': false,
                    'references': [
                        'aef16335-6a28-4a34-ae93-3d7216634c7c'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(c20fefdc-f6bc-4158-8651-ddaa895d1c60)?view=full'
                },
                {
                    'uuid': 'f45f163e-2cfc-48c1-986d-4185570943c6',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'name': 'ASPIRIN ANHYDRIDE',
                    'type': 'cn',
                    'domains': [],
                    'languages': [
                        'en'
                    ],
                    'nameJurisdiction': [],
                    'nameOrgs': [],
                    'preferred': false,
                    'displayName': true,
                    'references': [
                        'ad53c341-cf98-45ae-9ce7-d931e2e3ce98'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/names(f45f163e-2cfc-48c1-986d-4185570943c6)?view=full'
                }
            ],
            'codes': [
                {
                    'uuid': '0309effd-6673-7789-6ada-7e032f90b9c5',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'EPA CompTox',
                    'code': '1466-82-6',
                    'type': 'PRIMARY',
                    'url': 'https://comptox.epa.gov/dashboard/dsstoxdb/results?utf8=%E2%9C%93&search=1466-82-6',
                    'references': [
                        '50f9e24a-00bf-8f94-1b7a-05488b7afd0e'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(0309effd-6673-7789-6ada-7e032f90b9c5)?view=full'
                },
                {
                    'uuid': '44bae626-f271-4cef-bdfb-d1858652ef5d',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'PUBCHEM',
                    'code': '15110',
                    'type': 'PRIMARY',
                    'url': 'https://pubchem.ncbi.nlm.nih.gov/compound/15110',
                    'references': [
                        'b1d06529-ff92-43b2-a5fa-7379a270e288'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(44bae626-f271-4cef-bdfb-d1858652ef5d)?view=full'
                },
                {
                    'uuid': 'c71bf543-94c9-4e2e-b8e3-5c3305d663df',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'ECHA (EC/EINECS)',
                    'code': '215-987-5',
                    'type': 'PRIMARY',
                    'url': 'https://echa.europa.eu/substance-information/-/substanceinfo/100.014.534',
                    'references': [
                        'b1d06529-ff92-43b2-a5fa-7379a270e288'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(c71bf543-94c9-4e2e-b8e3-5c3305d663df)?view=full'
                },
                {
                    'uuid': 'f13e3376-5992-44a4-a72b-0ea1d2b686ed',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'codeSystem': 'CAS',
                    'code': '1466-82-6',
                    'type': 'PRIMARY',
                    'url': 'http://chem.sis.nlm.nih.gov/chemidplus/direct.jsp?regno=1466-82-6&result=advanced',
                    'references': [
                        'b1d06529-ff92-43b2-a5fa-7379a270e288'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/codes(f13e3376-5992-44a4-a72b-0ea1d2b686ed)?view=full'
                }
            ],
            'notes': [],
            'properties': [],
            'relationships': [
                {
                    'uuid': 'a9307beb-53ee-4b3c-810a-0bd54c6c396b',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'comments': 'IDENTIFIED AS IMPURITY F\nLimits: impurity F: not more than 1.5 times the area of the principal peak in the chromatogram obtained with reference solution (a) (0.15 per cent)',
                    'relatedSubstance': {
                        'uuid': '2bb0693e-9f45-4ae6-9799-acfc32af234b',
                        'created': 1520354929000,
                        'createdBy': 'admin',
                        'lastEdited': 1520354929000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'refPname': 'ASPIRIN',
                        'refuuid': 'a05ec20c-8fe2-4e02-ba7f-df69e5e30248',
                        'substanceClass': 'reference',
                        'approvalID': 'R16CO5Y76E',
                        'linkingID': 'R16CO5Y76E',
                        'name': 'ASPIRIN',
                        'references': [],
                        'access': []
                    },
                    'originatorUuid': 'a9307beb-53ee-4b3c-810a-0bd54c6c396b',
                    'type': 'PARENT->IMPURITY',
                    'references': [
                        'cb455313-b726-42db-8e43-22d230a27264'
                    ],
                    'access': []
                }
            ],
            'references': [
                {
                    'uuid': '0c02cdb3-6d57-4739-98be-5a3993b0ef06',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'EURO PHARM',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(0c02cdb3-6d57-4739-98be-5a3993b0ef06)?view=full'
                },
                {
                    'uuid': '34720075-276f-4b3d-a346-adf31fed98bd',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'SRS import [XIA5Z82RHB]',
                    'docType': 'SRS',
                    'documentDate': 1493390991000,
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'url': 'http://fdasis.nlm.nih.gov/srs/srsdirect.jsp?regno=XIA5Z82RHB',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(34720075-276f-4b3d-a346-adf31fed98bd)?view=full'
                },
                {
                    'uuid': '47b1e975-c7d7-4fdc-b60b-9d80d8172453',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'dump-public-2018-03-05.gsrs',
                    'docType': 'BATCH_IMPORT',
                    'documentDate': 1520354929000,
                    'publicDomain': false,
                    'tags': [],
                    'id': 'b9fdcca829e0ff2e96ec',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(47b1e975-c7d7-4fdc-b60b-9d80d8172453)?view=full'
                },
                {
                    'uuid': '50f9e24a-00bf-8f94-1b7a-05488b7afd0e',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'WEBSITE',
                    'docType': 'WEBSITE',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN',
                        'PUBLIC_DOMAIN_RELEASE'
                    ],
                    'url': 'https://comptox.epa.gov/dashboard/dsstoxdb/results?utf8=%E2%9C%93&search=1466-82-6',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(50f9e24a-00bf-8f94-1b7a-05488b7afd0e)?view=full'
                },
                {
                    'uuid': 'ad53c341-cf98-45ae-9ce7-d931e2e3ce98',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'http://www.chemicalregister.com/Acetylsalicylic_anhydride/Suppliers/pid38308.htm.htm',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'url': 'http://www.chemicalregister.com/Acetylsalicylic_anhydride/Suppliers/pid38308.htm.htm',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(ad53c341-cf98-45ae-9ce7-d931e2e3ce98)?view=full'
                },
                {
                    'uuid': 'aef16335-6a28-4a34-ae93-3d7216634c7c',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'STN',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN',
                        'PUBLIC_DOMAIN_RELEASE',
                        'AUTO_SELECTED'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(aef16335-6a28-4a34-ae93-3d7216634c7c)?view=full'
                },
                {
                    'uuid': 'b1d06529-ff92-43b2-a5fa-7379a270e288',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'SRS CODE IMPORT',
                    'docType': 'SRS',
                    'documentDate': 1493390991000,
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(b1d06529-ff92-43b2-a5fa-7379a270e288)?view=full'
                },
                {
                    'uuid': 'b9bfa1ea-edb8-4430-bc84-eb1fc26f79ec',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'FDA-SRS',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(b9bfa1ea-edb8-4430-bc84-eb1fc26f79ec)?view=full'
                },
                {
                    'uuid': 'bd7a021f-e323-4c2b-aa44-c0185bf85653',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'http://www.chemicalregister.com/Acetylsalicylic_anhydride/Suppliers/pid38308.htm',
                    'docType': 'SRS',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'url': 'http://www.chemicalregister.com/Acetylsalicylic_anhydride/Suppliers/pid38308.htm',
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(bd7a021f-e323-4c2b-aa44-c0185bf85653)?view=full'
                },
                {
                    'uuid': 'cb455313-b726-42db-8e43-22d230a27264',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'citation': 'EUROPEAN PHARMACOPEDIA ONLINE',
                    'docType': 'EUROPEAN PHARMACOPEIA',
                    'publicDomain': true,
                    'tags': [
                        'NOMEN'
                    ],
                    'access': [],
                    '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/references(cb455313-b726-42db-8e43-22d230a27264)?view=full'
                }
            ],
            'approvalID': 'XIA5Z82RHB',
            'tags': [],
            'structure': {
                'id': '7ca6f731-b941-48b0-820d-bc374572bea6',
                'created': 1520354929000,
                'lastEdited': 1520354929000,
                'deprecated': false,
                'digest': 'e4659a3246b3e8aa5668b96b30f9802a53e86964',
                'molfile': '\n  Symyx   04271719242D 1   1.00000     0.00000     0\n\n 25 26  0     0  0            999 V2000\n    6.8917   -3.3250    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.6042   -3.3250    0.0000 C   0  0  0  0  0  0           0  0  0\n    8.0542   -3.9917    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.4417   -3.9917    0.0000 C   0  0  0  0  0  0           0  0  0\n    5.7542   -3.9917    0.0000 O   0  0  0  0  0  0           0  0  0\n    9.1917   -3.3250    0.0000 C   0  0  0  0  0  0           0  0  0\n    2.3000   -3.3250    0.0000 C   0  0  0  0  0  0           0  0  0\n    9.1917   -2.0000    0.0000 O   0  0  0  0  0  0           0  0  0\n    2.3000   -2.0000    0.0000 O   0  0  0  0  0  0           0  0  0\n   10.3542   -1.3292    0.0000 C   0  0  0  0  0  0           0  0  0\n    1.1375   -1.3292    0.0000 C   0  0  0  0  0  0           0  0  0\n    4.6042   -2.0000    0.0000 O   0  0  0  0  0  0           0  0  0\n    6.8917   -2.0000    0.0000 O   0  0  0  0  0  0           0  0  0\n    1.1375    0.0000    0.0000 O   0  0  0  0  0  0           0  0  0\n   10.3542    0.0000    0.0000 O   0  0  0  0  0  0           0  0  0\n    8.0542   -5.3167    0.0000 C   0  0  0  0  0  0           0  0  0\n    3.4417   -5.3167    0.0000 C   0  0  0  0  0  0           0  0  0\n    1.1375   -3.9917    0.0000 C   0  0  0  0  0  0           0  0  0\n   10.3542   -3.9917    0.0000 C   0  0  0  0  0  0           0  0  0\n   11.5125   -2.0000    0.0000 C   0  0  0  0  0  0           0  0  0\n    0.0000   -2.0000    0.0000 C   0  0  0  0  0  0           0  0  0\n    2.3000   -5.9792    0.0000 C   0  0  0  0  0  0           0  0  0\n    9.1917   -5.9792    0.0000 C   0  0  0  0  0  0           0  0  0\n   10.3542   -5.3167    0.0000 C   0  0  0  0  0  0           0  0  0\n    1.1375   -5.3167    0.0000 C   0  0  0  0  0  0           0  0  0\n  2  5  1  0     0  0\n  3  1  1  0     0  0\n  4  2  1  0     0  0\n  5  1  1  0     0  0\n  6  3  2  0     0  0\n  7  4  2  0     0  0\n  8  6  1  0     0  0\n  9  7  1  0     0  0\n 10  8  1  0     0  0\n 11  9  1  0     0  0\n 12  2  2  0     0  0\n 13  1  2  0     0  0\n 14 11  2  0     0  0\n 15 10  2  0     0  0\n 16  3  1  0     0  0\n 17  4  1  0     0  0\n 18  7  1  0     0  0\n 19  6  1  0     0  0\n 20 10  1  0     0  0\n 21 11  1  0     0  0\n 22 17  2  0     0  0\n 23 16  2  0     0  0\n 24 23  1  0     0  0\n 25 22  1  0     0  0\n 19 24  2  0     0  0\n 18 25  2  0     0  0\nM  END\n',
                'smiles': 'CC(=O)OC1=CC=CC=C1C(=O)OC(=O)C2=CC=CC=C2OC(C)=O',
                'formula': 'C18H14O7',
                'opticalActivity': 'UNSPECIFIED',
                'atropisomerism': 'No',
                'stereoCenters': 0,
                'definedStereo': 0,
                'ezCenters': 0,
                'charge': 0,
                'mwt': 342.2996,
                'count': 1,
                'createdBy': 'admin',
                'lastEditedBy': 'admin',
                'hash': '4KQ2BBCY255R',
                'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(7ca6f731-b941-48b0-820d-bc374572bea6)?view=full',
                'stereochemistry': 'ACHIRAL',
                'references': [
                    'aef16335-6a28-4a34-ae93-3d7216634c7c',
                    '34720075-276f-4b3d-a346-adf31fed98bd'
                ],
                'access': []
            },
            'moieties': [
                {
                    'uuid': '0f5c100b-d164-4175-8a2a-05b0cf951116',
                    'created': 1520354929000,
                    'createdBy': 'admin',
                    'lastEdited': 1520354929000,
                    'lastEditedBy': 'admin',
                    'deprecated': false,
                    'id': '0f5c100b-d164-4175-8a2a-05b0cf951116',
                    'digest': 'cc4c34733d542857fe7cb549762424c31b0ee42b',
                    'molfile': '\n  Marvin  04291704392D          \n\n 25 26  0  0  0  0            999 V2000\n    7.1682   -1.2453    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.4470   -0.8276    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.4470    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    5.7231   -1.2453    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    5.7231   -2.0703    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.4470   -2.4854    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.4470   -3.3104    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.7231   -3.7229    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.0149   -3.3104    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.0149   -2.4854    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.2911   -2.0703    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.2911   -1.2453    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    3.5828   -2.4854    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    2.8668   -2.0703    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.8668   -1.2453    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    2.1429   -2.4854    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.1429   -3.3104    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.4321   -3.7229    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.7083   -3.3104    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.7083   -2.4854    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.4321   -2.0703    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.4321   -1.2453    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    0.7083   -0.8276    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0000   -1.2453    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.7083    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  3  2  2  0  0  0  0\n  2  4  1  0  0  0  0\n  4  5  1  0  0  0  0\n  6  5  1  0  0  0  0\n  5 10  2  0  0  0  0\n  6  7  2  0  0  0  0\n  7  8  1  0  0  0  0\n  8  9  2  0  0  0  0\n  9 10  1  0  0  0  0\n 10 11  1  0  0  0  0\n 12 11  2  0  0  0  0\n 13 11  1  0  0  0  0\n 14 13  1  0  0  0  0\n 15 14  2  0  0  0  0\n 16 14  1  0  0  0  0\n 17 16  1  0  0  0  0\n 21 16  2  0  0  0  0\n 18 17  2  0  0  0  0\n 19 18  1  0  0  0  0\n 20 19  2  0  0  0  0\n 20 21  1  0  0  0  0\n 22 21  1  0  0  0  0\n 23 22  1  0  0  0  0\n 24 23  1  0  0  0  0\n 25 23  2  0  0  0  0\nM  END\n',
                    'smiles': 'CC(=O)OC1=C(C=CC=C1)C(=O)OC(=O)C2=C(OC(C)=O)C=CC=C2',
                    'formula': 'C18H14O7',
                    'opticalActivity': 'NONE',
                    'stereoCenters': 0,
                    'definedStereo': 0,
                    'ezCenters': 0,
                    'charge': 0,
                    'mwt': 342.2996,
                    'count': 1,
                    'hash': '4KQ2BBCY255R',
                    'self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/structures(0f5c100b-d164-4175-8a2a-05b0cf951116)?view=full',
                    'stereochemistry': 'ACHIRAL',
                    'references': [],
                    'access': [],
                    'countAmount': {
                        'uuid': '598b982e-d2ad-4dc6-96bd-6a8248235b66',
                        'created': 1520354929000,
                        'createdBy': 'admin',
                        'lastEdited': 1520354929000,
                        'lastEditedBy': 'admin',
                        'deprecated': false,
                        'type': 'MOL RATIO',
                        'average': 1.0,
                        'units': 'MOL RATIO',
                        'references': [],
                        'access': []
                    }
                }
            ],
            '_approvalIDDisplay': 'XIA5Z82RHB',
            '_name': 'ASPIRIN ANHYDRIDE',
            'access': [],
            '_self': 'https://ginas.ncats.nih.gov/ginas/app/api/v1/substances(b01ae0ed-0de4-471a-aca5-7902f31b05ab)?view=full'
        }
    ]
}

import { NavItem } from '@gsrs-core/config';

export const navItems: Array<NavItem> = [
    {
        display: 'Browse Substances',
        path: 'browse-substance',
        order: 10
    },
    {
        display: 'Register',
        order: 40,
        children: [
            {
                display: 'Chemical',
                path: 'substances/register/chemical',
                order: 10
            },
            {
                display: 'Protein',
                path: 'substances/register/protein',
                order: 20
            },
            {
                display: 'Polymer',
                path: 'substances/register/polymer',
                order: 30
            },
            {
                display: 'Nucleic Acid',
                path: 'substances/register/nucleicAcid',
                order: 40
            },
            {
                display: 'Mixture',
                path: 'substances/register/mixture',
                order: 50
            },
            {
                display: 'Structurally Diverse',
                path: 'substances/register/structurallyDiverse',
                order: 60
            },
            {
                display: 'Concept',
                path: 'substances/register/concept',
                order: 70
            },
            {
                display: 'G1 Specified Substance',
                path: 'substances/register/specifiedSubstanceG1',
                order: 80
            }
        ]
    }
];

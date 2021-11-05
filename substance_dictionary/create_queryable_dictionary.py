import pandas as pd
from io import BytesIO
import requests

dictionary_df = pd.read_excel('dictionary_current_all_entities.xlsx')

print(dictionary_df.head())

dictionary_df = dictionary_df[
    dictionary_df['Lucene Path'].notna()
    & (dictionary_df['Status'] == 'Current')
    & ~(dictionary_df['Data Type'].str.contains("object"))
    & (~(dictionary_df['Data Type'].str.contains("array"))
        | (dictionary_df['Data Type'] == 'array <string>'))
]

dictionary_df = dictionary_df.loc[:, ['Lucene Path', 'Display Name', 'Description', 'Data Type', 'CV DOMAIN', 'Included in Advanced Search', 'Entity', 'Suggest Field Name']]

# While technically a number, we should add a "format" field to specify the
# timestamp rather than rely on the description

def set_type(df_properties):
    if 'timestamp' in df_properties['Description'].lower():
        return 'timestamp'
    elif df_properties['Data Type'] == 'array <string>':
        return 'string'
    else:
        return df_properties['Data Type']

dictionary_df['type'] = dictionary_df.loc[:, ['Lucene Path', 'Data Type', 'Description']].apply(set_type, axis=1)

dictionary_df.rename(columns={"Lucene Path": "lucenePath", "Description": "description", "Display Name": "displayName", "CV DOMAIN": "cvDomain", "Included in Advanced Search": "priority", "Suggest Field Name": "suggest"}, inplace=True)

columns_to_include = ['lucenePath', 'description', 'type', 'cvDomain', 'priority', 'suggest']

dictionary_df['priority'] = dictionary_df['priority'].replace(['TRUE', '1.0', 1.0],'x');
dictionary_df.drop(columns=['Data Type'], inplace=True)
dictionary_df.sort_values('displayName', inplace=True)
dictionary_df.set_index('displayName', inplace=True)

application_df = dictionary_df[dictionary_df['Entity']=='Application']
substance_df = dictionary_df[dictionary_df['Entity']=='Substance']
productall_df = dictionary_df[dictionary_df['Entity']=='ProductAll']
product_df = dictionary_df[dictionary_df['Entity']=='Product']
ctus_df = dictionary_df[dictionary_df['Entity']=='ClinicalTrialUS']
cteu_df = dictionary_df[dictionary_df['Entity']=='ClinicalTrialEurope']

# You can preview the sub dictionary here
print(cteu_df)

application_df.loc[:, columns_to_include].to_json('application_dictionary.json',orient='index', indent=4)
substance_df.loc[:, columns_to_include].to_json('substance_dictionary.json',orient='index', indent=4)

#TODO: fix the conventions for the filenames below
productall_df.loc[:, columns_to_include].to_json('product_dictionary.json',orient='index', indent=4)
product_df.loc[:, columns_to_include].to_json('productCORE_dictionary.json',orient='index', indent=4)


ctus_df.loc[:, columns_to_include].to_json('ctus_dictionary.json',orient='index', indent=4)
cteu_df.loc[:, columns_to_include].to_json('cteu_dictionary.json',orient='index', indent=4)


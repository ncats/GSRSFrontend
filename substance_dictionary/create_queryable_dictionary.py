import pandas as pd

dictionary_df = pd.read_csv('dictionary.csv')
dictionary_df = dictionary_df[
    dictionary_df['Lucene Path'].notna()
    & (dictionary_df['Status'] == 'Current')
    & ~(dictionary_df['Data Type'].str.contains("object"))
    & (~(dictionary_df['Data Type'].str.contains("array"))
        | (dictionary_df['Data Type'] == 'array <string>'))
]

dictionary_df = dictionary_df.loc[:, ['Lucene Path', 'Display Name', 'Description', 'Data Type', 'CV DOMAIN']]

def set_type(df_properties):
    if 'timestamp' in df_properties['Description'].lower():
        return 'timestamp'
    elif df_properties['Data Type'] == 'array <string>':
        return 'string'
    else:
        return df_properties['Data Type']
    

dictionary_df['type'] = dictionary_df.loc[:, ['Lucene Path', 'Data Type', 'Description']].apply(set_type, axis=1)

dictionary_df.rename(columns={"Lucene Path": "lucenePath", "Description": "description", "Display Name": "displayName", "CV DOMAIN": "cvDomain"}, inplace=True)
dictionary_df.drop(columns=['Data Type'], inplace=True)
dictionary_df.sort_values('displayName', inplace=True)
dictionary_df.set_index('displayName', inplace=True)
dictionary_df.to_json('../src/app/core/assets/data/substance_dictionary.json', orient='index')

data_types_df = dictionary_df.loc[:, 'type'][dictionary_df['type'].unique()]

data_types_df.to_csv('./data_types.csv')

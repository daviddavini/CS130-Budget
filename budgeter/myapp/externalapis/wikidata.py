import json
import requests

def get_business_info(wikidata_id):
    url = f"https://www.wikidata.org/wiki/Special:EntityData/{wikidata_id}.json"
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch data from Wikidata for ID {wikidata_id}")
    data = response.json()
    entity = data['entities'].get(wikidata_id, {})
    if not entity:
        raise Exception(f"No entity found for Wikidata ID {wikidata_id}")
    labels = {lang: info['value'] for lang, info in entity.get('labels', {}).items()}
    descriptions = {lang: info['value'] for lang, info in entity.get('descriptions', {}).items()}
    sitelinks = {site: info['url'] for site, info in entity.get('sitelinks', {}).items()}
    claims = entity.get('claims', {})
    info = {
        'wikidata_id': wikidata_id,
        'labels': labels,
        'descriptions': descriptions,
        'sitelinks': sitelinks,
        'number_of_locations': None,
        'number_of_branches': None,
        'industry': None,
        'website': None,
        'instance_of': [],
        'logo_url': None,
    }
    def extract_property(claims, prop_id):
        if prop_id in claims:
            values = []
            for claim in claims[prop_id]:
                mainsnak = claim.get('mainsnak', {})
                datavalue = mainsnak.get('datavalue', {})
                if 'value' in datavalue:
                    values.append(datavalue['value'])
            return values
        return []

    num_locations = extract_property(claims, 'P2545')
    if num_locations:
        amount = num_locations[0].get('amount')
        if amount:
            info['number_of_locations'] = int(float(amount))
    num_branches = extract_property(claims, 'P8368')
    if num_branches:
        amount = num_branches[0].get('amount')
        if amount:
            info['number_of_branches'] = int(float(amount))
    websites = extract_property(claims, 'P856')
    if websites:
        info['website'] = websites[0]
    industries = extract_property(claims, 'P452')
    info['industry'] = []
    for industry in industries:
        if 'id' in industry:
            industry_id = industry['id']
            industry_label = get_label_for_id(industry_id)
            info['industry'].append({'id': industry_id, 'label': industry_label})
    instances = extract_property(claims, 'P31')
    for instance in instances:
        if 'id' in instance:
            instance_id = instance['id']
            instance_label = get_label_for_id(instance_id)
            info['instance_of'].append({'id': instance_id, 'label': instance_label})
    logos = extract_property(claims, 'P154')
    if logos:
        logo_filename = logos[0]
        logo_url = get_commons_image_url(logo_filename)
        info['logo_url'] = logo_url
    
    return info

def get_label_for_id(entity_id):
    url = f"https://www.wikidata.org/wiki/Special:EntityData/{entity_id}.json"
    response = requests.get(url)
    if response.status_code != 200:
        return None
    data = response.json()
    entity = data['entities'].get(entity_id, {})
    labels = entity.get('labels', {})
    # Return the English label if available, else any label
    return labels.get('en', {}).get('value') or next(iter(labels.values())).get('value')

def get_commons_image_url(filename):
    import hashlib
    name = filename.replace(' ', '_')
    md5_hash = hashlib.md5(name.encode('utf-8')).hexdigest()
    url = f"https://upload.wikimedia.org/wikipedia/commons/{md5_hash[0]}/{md5_hash[0:2]}/{name}"
    return url

if __name__ == "__main__":
    node = {
        'id': '123456',
        'tags': {
            'name': 'Example Store',
            'wikidata': 'Q244457'
        }
    }
    
    wikidata_id = node['tags'].get('wikidata')
    if wikidata_id:
        business_info = get_business_info(wikidata_id)
        print(json.dumps(business_info, indent=4))
    else:
        print("No Wikidata ID available for this node.")

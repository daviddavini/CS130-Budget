import json
import xml.etree.ElementTree as ET
import requests

from math import sin, cos, sqrt, atan2, radians

# radius of earth
R = 6373.0

def distance(lat1, lon1, lat2, lon2):
    lat1 = radians(lat1)
    lat2 = radians(lat2)
    lon1 = radians(lon1)
    lon2 = radians(lon2)

    dlon = lon2 - lon1
    dlat = lat2 - lat1

    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    distance = R * c

    return distance


def nearby_stores(radius: float, lat: float, lon: float):
    query = f"""node["shop"](around:{radius},{lat},{lon});node["shop"](around:{radius},{lat},{lon}); out body;"""
    response = requests.get(
        "https://overpass-api.de/api/interpreter",
        params={"data":query}
    )
    root = ET.fromstring(response.text)
    nodes = []
    for node in root.findall('node'):
        node_tags ={}
        node_tags["id"] = node.get("id")
        node_lat = node.get("lat")
        node_lon = node.get("lon")
        node_tags["lat"] = node_lat
        node_tags["lon"] = node_lon
        node_tags["distance_km"] = distance(
            float(lat),float(lon),
            float(node_lat),float(node_lon),
        )
        for tag in node.findall('tag'):
            key = tag.get("k")
            value = tag.get("v")
            node_tags[key] = value
        nodes.append(node_tags)
    return nodes

if __name__ == "__main__":
    nodes = nearby_stores(
        radius=1000,
        lat=34.068920,
        lon=-118.445183,
    )
    print(json.dumps(nodes, indent=4))
    print(len(nodes))

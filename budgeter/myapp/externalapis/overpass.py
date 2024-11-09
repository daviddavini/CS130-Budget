import json
import xml.etree.ElementTree as ET
import requests

from .haversine import distance

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

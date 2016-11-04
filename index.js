function flatten(gj, parent) {
    switch ((gj && gj.type) || null) {
        case 'FeatureCollection':
          var features = gj.features.reduce(function(mem, feature) {
            return mem.concat(flatten(feature, gj));
          }, []);

          // Flatten feature collections 
          if(parent && parent.type === "FeatureCollection") {
            return features;
          }
          else {
            gj.features = features;
          }
          return gj;
        case 'Feature':
            if (!gj.geometry) return gj;
            return flatten(gj.geometry, gj).map(function(geom) {
                return {
                    type: 'Feature',
                    properties: JSON.parse(JSON.stringify(gj.properties)),
                    geometry: geom
                };
            });
        case 'MultiPoint':
            return gj.coordinates.map(function(_) {
                return { type: 'Point', coordinates: _ };
            });
        case 'MultiPolygon':
            return gj.coordinates.map(function(_) {
                return { type: 'Polygon', coordinates: _ };
            });
        case 'MultiLineString':
            return gj.coordinates.map(function(_) {
                return { type: 'LineString', coordinates: _ };
            });
        case 'GeometryCollection':
            return gj.geometries.map(function(geometry) {
              return flatten(geometry, gj);
            }).reduce(function(memo, geoms) {
                return memo.concat(geoms);
            }, []);
        case 'Point':
        case 'Polygon':
        case 'LineString':
            return [gj];
    }
}

module.exports = flatten;

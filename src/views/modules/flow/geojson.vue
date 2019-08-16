<template>
  <div>
    <div id="map"> </div>
    <el-form :inline="true" @keyup.enter.native="changeColor()">
      <el-form-item>
        <el-button type="primary" @click="changeColor(1)">8</el-button>
        <el-button type="primary" @click="changeColor(2)">12</el-button>
        <el-button type="primary" @click="changeColor(3)">14</el-button>
        <el-button type="primary" @click="changeColor(4)">18</el-button>
        <el-button type="primary" @click="changeColor(5)">21</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import data from '../../../assets/geojson/data-geojson'
  import * as L from 'leaflet'

  var map
  export default {
    name: 'GeoJson',
    data () {
      return {
        data: {geojson: data}
      }
    },
    mounted () {
      map = L.map('map', {
        center: [39.9632081, 116.3551266],
        zoom: 15
      });
      L.tileLayer(
        'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href=“http://osm.org/copyright”>OpenStreetMap</a> contributors'
        }
      ).addTo(map);
      L.geoJSON(data, {
        style: function (feature) {
          switch (feature.properties.congestion) {
            case 0:
              return {color: '#009933'}
            case 1:
              return {color: '#ffff00'}
            case 2:
              return {color: '#ff0000'}
          }
        }
      }).addTo(map)
    },
    methods: {
      changeColor (id) {
        if (id == 1) {
          L.geoJSON(data, {
            style: function (feature) {
              switch (feature.properties.congestion) {
                case 0:
                  return {color: '#ff0000'}
                case 1:
                  return {color: '#ffff00'}
                case 2:
                  return {color: '#009933'}
              }
            }
          }).addTo(map)
        } else if (id == 2) {
          L.geoJSON(data, {
            style: function (feature) {
              switch (feature.properties.congestion) {
                case 0:
                  return {color: '#ffff00'}
                case 1:
                  return {color: '#009933'}
                case 2:
                  return {color: '#ff0000'}
              }
            }
          }).addTo(map)
        } else if (id == 3) {
          L.geoJSON(data, {
            style: function (feature) {
              switch (feature.properties.congestion) {
                case 0:
                  return {color: '#009933'}
                case 1:
                  return {color: '#ff0000'}
                case 2:
                  return {color: '#ffff00'}
              }
            }
          }).addTo(map)
        } else if (id == 4) {
          L.geoJSON(data, {
            style: function (feature) {
              switch (feature.properties.congestion) {
                case 0:
                  return {color: '#ff0000'}
                case 1:
                  return {color: '#009933'}
                case 2:
                  return {color: '#ffff00'}
              }
            }
          }).addTo(map)
        } else {
          L.geoJSON(data, {
            style: function (feature) {
              switch (feature.properties.congestion) {
                case 0:
                  return {color: '#ffff00'}
                case 1:
                  return {color: '#ff0000'}
                case 2:
                  return {color: '#009933'}
              }
            }
          }).addTo(map)
        }
      }
    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  #map {
    width: 100%;
    height: calc(100vh);
  }
  .mod-flow-echarts {
    > .el-alert {
      margin-bottom: 10px;
    }
    > .el-row {
      margin-top: -10px;
      margin-bottom: -20px;
      .el-col {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
    .chart-line {
      min-height: 500px;
    }
  }
</style>

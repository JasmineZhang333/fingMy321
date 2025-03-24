import React, { useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Card, Statistic } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'

import { classmatesData } from './data/classmates'

// 将数据格式转换为地图组件需要的格式
const classmates = classmatesData.map(mate => ({
  id: mate.id,
  name: mate.name,
  city: mate.city,
  country: mate.country,
  position: [mate.location.lat, mate.location.lng]
}))

const App = () => {
  const [selectedMarker, setSelectedMarker] = useState(null)

  // 按城市对同学进行分组
  const classmatesByCity = useMemo(() => {
    const groupedData = {}
    classmates.forEach(mate => {
      if (!groupedData[mate.city]) {
        groupedData[mate.city] = {
          city: mate.city,
          country: mate.country,
          classmates: []
        }
      }
      groupedData[mate.city].classmates.push(mate.name)
    })
    return groupedData
  }, [])

  const statistics = useMemo(() => {
    const countryStats = {}
    const cityStats = {}

    classmates.forEach(mate => {
      countryStats[mate.country] = (countryStats[mate.country] || 0) + 1
      cityStats[mate.city] = (cityStats[mate.city] || 0) + 1
    })

    const sortedCountryStats = Object.entries(countryStats)
      .sort(([, a], [, b]) => b - a)
      .map(([country, count]) => ({ name: country, count }))

    const sortedCityStats = Object.entries(cityStats)
      .sort(([, a], [, b]) => b - a)
      .map(([city, count]) => ({ name: city, count }))

    return {
      totalCount: classmates.length,
      countryCount: Object.keys(countryStats).length,
      cityCount: Object.keys(cityStats).length,
      countryStats: sortedCountryStats,
      cityStats: sortedCityStats,
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <MapContainer
        center={[35.8617, 104.1954]}
        zoom={4}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {classmates.map(mate => (
          <Marker
            key={mate.id}
            position={mate.position}
            eventHandlers={{
              click: () => setSelectedMarker(mate),
            }}
          >
            <Popup>
              <div style={{ padding: '5px' }}>
                <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                  {mate.city}, {mate.country}
                </p>
                <p style={{ margin: 0 }}>
                  {classmatesByCity[mate.city].classmates.join('、')}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="statistics-panel">
        <Card title="321er分布统计" style={{ width: 400 }} headStyle={{ fontSize: '20px', fontWeight: 'bold', color: '#4A90E2' }}>
          <Statistic
            title="总人数"
            value={statistics.totalCount}
            prefix={<EnvironmentOutlined />}
          />
          <div style={{ display: 'flex', gap: '24px', marginTop: '16px' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ marginBottom: '8px' }}>国家分布 ({statistics.countryCount})</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {statistics.countryStats.map(stat => (
                  <li key={stat.name} style={{ marginBottom: '4px' }}>
                    {stat.name}: {stat.count}人
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ marginBottom: '8px' }}>城市分布 ({statistics.cityCount})</h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {statistics.cityStats.map(stat => (
                  <li key={stat.name} style={{ marginBottom: '4px' }}>
                    {stat.name}: {stat.count}人
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default App
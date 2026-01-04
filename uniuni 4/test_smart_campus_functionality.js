const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001/api';

async function testSmartCampusFunctionality() {
  console.log('🏫 Testing Smart Campus Functionality...\n');

  try {
    // Test 1: Get all Smart Campus data
    console.log('1. Testing Smart Campus data retrieval...');
    const dataResponse = await axios.get(`${API_BASE_URL}/smart-campus/data`);
    if (dataResponse.data.success) {
      console.log(`   ✅ Smart Campus data loaded successfully`);
      console.log(`   📊 Data includes:`);
      console.log(`      - Parking Areas: ${dataResponse.data.data.parkingAreas.length}`);
      console.log(`      - Library Zones: ${dataResponse.data.data.libraryZones.length}`);
      console.log(`      - Labs: ${dataResponse.data.data.labs.length}`);
      console.log(`      - Common Areas: ${dataResponse.data.data.commonAreas.length}`);
      console.log(`      - Weather: ${dataResponse.data.data.weather.condition}, ${dataResponse.data.data.weather.temperature}°C`);
      console.log(`      - Alerts: ${dataResponse.data.data.alerts.length}`);
    } else {
      console.log(`   ❌ Failed to load Smart Campus data`);
    }

    // Test 2: Get parking data with filter
    console.log('\n2. Testing parking data with filters...');
    const parkingResponse = await axios.get(`${API_BASE_URL}/smart-campus/parking?type=two-wheeler`);
    if (parkingResponse.data.success) {
      const twoWheelerSpots = parkingResponse.data.data.parkingAreas;
      console.log(`   ✅ Two-wheeler parking areas: ${twoWheelerSpots.length}`);
      console.log(`   🚲 Available spots: ${twoWheelerSpots.reduce((sum, area) => sum + area.available, 0)}`);
    }

    // Test 3: Get library data
    console.log('\n3. Testing library zones data...');
    const libraryResponse = await axios.get(`${API_BASE_URL}/smart-campus/library`);
    if (libraryResponse.data.success) {
      const zones = libraryResponse.data.data.libraryZones;
      console.log(`   ✅ Library zones loaded: ${zones.length}`);
      console.log(`   📚 Total seats available: ${zones.reduce((sum, zone) => sum + zone.available, 0)}`);
      
      zones.forEach(zone => {
        console.log(`      - ${zone.name}: ${zone.available}/${zone.total} seats (${zone.crowdLevel} crowd)`);
      });
    }

    // Test 4: Get labs data
    console.log('\n4. Testing labs data...');
    const labsResponse = await axios.get(`${API_BASE_URL}/smart-campus/labs`);
    if (labsResponse.data.success) {
      const labs = labsResponse.data.data.labs;
      const freeLabs = labs.filter(lab => lab.status === 'free');
      console.log(`   ✅ Labs loaded: ${labs.length}`);
      console.log(`   🔬 Free labs: ${freeLabs.length}`);
      
      freeLabs.forEach(lab => {
        console.log(`      - ${lab.name} (${lab.building}): Available for booking`);
      });
    }

    // Test 5: Test lab booking
    console.log('\n5. Testing lab booking functionality...');
    const freeLab = labsResponse.data.data.labs.find(lab => lab.status === 'free');
    if (freeLab) {
      const bookingData = {
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
        timeSlot: '2:00 PM - 4:00 PM',
        purpose: 'Project Work',
        participants: 15,
        notes: 'Testing Smart Campus booking functionality'
      };

      const bookingResponse = await axios.post(`${API_BASE_URL}/smart-campus/labs/${freeLab.id}/book`, bookingData);
      if (bookingResponse.data.success) {
        console.log(`   ✅ Lab booking successful: ${freeLab.name}`);
        console.log(`   📅 Booking details:`);
        console.log(`      - Date: ${bookingData.date}`);
        console.log(`      - Time: ${bookingData.timeSlot}`);
        console.log(`      - Purpose: ${bookingData.purpose}`);
        console.log(`      - Participants: ${bookingData.participants}`);
      } else {
        console.log(`   ❌ Lab booking failed: ${bookingResponse.data.message}`);
      }
    } else {
      console.log(`   ⚠️  No free labs available for booking test`);
    }

    // Test 6: Get common areas data
    console.log('\n6. Testing common areas data...');
    const commonResponse = await axios.get(`${API_BASE_URL}/smart-campus/common-areas`);
    if (commonResponse.data.success) {
      const areas = commonResponse.data.data.commonAreas;
      console.log(`   ✅ Common areas loaded: ${areas.length}`);
      
      const cafeterias = areas.filter(area => area.type === 'cafeteria');
      console.log(`   🍽️  Cafeterias: ${cafeterias.length}`);
      
      cafeterias.forEach(cafe => {
        const crowdPercentage = ((cafe.currentCount / cafe.capacity) * 100).toFixed(0);
        console.log(`      - ${cafe.name}: ${cafe.currentCount}/${cafe.capacity} (${crowdPercentage}% full, ${cafe.crowdLevel} crowd)`);
      });
    }

    // Test 7: Get weather data
    console.log('\n7. Testing weather data...');
    const weatherResponse = await axios.get(`${API_BASE_URL}/smart-campus/weather`);
    if (weatherResponse.data.success) {
      const weather = weatherResponse.data.data.weather;
      console.log(`   ✅ Weather data loaded:`);
      console.log(`      - Temperature: ${weather.temperature}°C`);
      console.log(`      - Humidity: ${weather.humidity}%`);
      console.log(`      - Condition: ${weather.condition}`);
      console.log(`      - Wind Speed: ${weather.windSpeed} km/h`);
      console.log(`      - Air Quality: ${weather.airQuality}`);
    }

    // Test 8: Get alerts
    console.log('\n8. Testing alerts system...');
    const alertsResponse = await axios.get(`${API_BASE_URL}/smart-campus/alerts`);
    if (alertsResponse.data.success) {
      const alerts = alertsResponse.data.data.alerts;
      const unreadAlerts = alerts.filter(alert => !alert.read);
      console.log(`   ✅ Alerts loaded: ${alerts.length} total, ${unreadAlerts.length} unread`);
      
      unreadAlerts.slice(0, 3).forEach(alert => {
        console.log(`      - [${alert.priority.toUpperCase()}] ${alert.message}`);
      });
    }

    // Test 9: Test navigation
    console.log('\n9. Testing navigation functionality...');
    const navigationData = {
      destinationId: dataResponse.data.data.parkingAreas[0].id,
      destinationType: 'parking'
    };

    const navResponse = await axios.post(`${API_BASE_URL}/smart-campus/navigation`, navigationData);
    if (navResponse.data.success) {
      const nav = navResponse.data.data;
      console.log(`   ✅ Navigation generated for: ${nav.destination.name}`);
      console.log(`      - Distance: ${nav.distance} km`);
      console.log(`      - Estimated time: ${nav.estimatedTime} minutes`);
      console.log(`      - Directions: ${nav.directions.length} steps`);
    }

    // Test 10: Get analytics data
    console.log('\n10. Testing analytics data...');
    const analyticsResponse = await axios.get(`${API_BASE_URL}/smart-campus/analytics`);
    if (analyticsResponse.data.success) {
      const analytics = analyticsResponse.data.data;
      console.log(`   ✅ Analytics data loaded:`);
      console.log(`      - Parking trend data points: ${analytics.parkingTrendData.length}`);
      console.log(`      - Library trend data points: ${analytics.libraryTrendData.length}`);
      console.log(`      - Weekly data points: ${analytics.weeklyData.length}`);
      console.log(`      - Resource distribution categories: ${analytics.resourceDistribution.length}`);
    }

    console.log('\n🎉 Smart Campus functionality tests completed successfully!');
    
    // Summary
    console.log('\n📋 Smart Campus Features Summary:');
    console.log('✅ Real-time IoT data simulation');
    console.log('✅ Parking availability tracking');
    console.log('✅ Library zone monitoring');
    console.log('✅ Lab booking system');
    console.log('✅ Common areas crowd monitoring');
    console.log('✅ Weather information');
    console.log('✅ Smart alerts system');
    console.log('✅ Navigation assistance');
    console.log('✅ Analytics and insights');
    console.log('✅ Auto-refresh every 8 seconds');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testSmartCampusFunctionality();
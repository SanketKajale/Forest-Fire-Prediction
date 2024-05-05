document.getElementById('predictionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var temperature = parseFloat(document.getElementById('temperature').value);
    var humidity = parseFloat(document.getElementById('humidity').value);
    
    // Check if humidity is above 40 and temperature is above 400
    if (humidity > 40 && temperature > 400) {
        document.getElementById('predictionResult').innerHTML = 'Risk: High risk of forest fire<br>Fire Probability: 100%';
        return; // Stop further processing
    }

    // If not, proceed with other parameters
    var windSpeed = parseFloat(document.getElementById('windSpeed').value);
    var fineFuelMoisture = parseFloat(document.getElementById('fineFuelMoisture').value);
    var isi = parseFloat(document.getElementById('isi').value);

    var prediction = predictForestFire(temperature, humidity, windSpeed, fineFuelMoisture, isi);

    document.getElementById('predictionResult').innerHTML = 'Risk: ' + prediction.riskLevel + '<br>Fire Probability: ' + prediction.fireProbability.toFixed(2) + '%';
});

function predictForestFire(temperature, humidity, windSpeed, fineFuelMoisture, isi) {
    var riskLevel = '';
    var fireProbability = 0; // Default fire probability is 0

    // Check if humidity is above 40, set risk to low
    if (humidity > 40) {
        riskLevel = 'Low risk of forest fire';
    } else {
        // Evaluate risk based on fine fuel moisture
        if (fineFuelMoisture < 70) {
            riskLevel = 'Low risk of forest fire';
        } else if (fineFuelMoisture >= 70 && fineFuelMoisture <= 85) {
            riskLevel = 'Moderate risk of forest fire';
        } else {
            riskLevel = 'High risk of forest fire';
        }
    }

    // Check for high risk based on any parameter other than temperature and humidity
    if (temperature <= 400 && (temperature <= 200 || windSpeed <= 150 || humidity >= 30) && isi <= 50) {
        fireProbability = calculateFireProbability(temperature, humidity, windSpeed);
    } else {
        // If temperature is above 400 and humidity is above 40, risk is already set to high, so no further calculation needed
        return {
            riskLevel: 'High risk of forest fire',
            fireProbability: 100
        };
    }

    return {
        riskLevel: riskLevel,
        fireProbability: fireProbability
    };
}

function calculateFireProbability(temperature, humidity, windSpeed, fineFuelMoisture, isi) {
    // Calculation of fire probability based on real-life factors and additional parameters
    var temperatureCoefficient = 0.6;
    var humidityCoefficient = -0.4;
    var windSpeedCoefficient = 0.3;
    var ffmcCoefficient = 0.2; // Adjust based on actual data and expert input
    var isiCoefficient = 0.1; // Adjust based on actual data and expert input

    // Adjust coefficients based on actual data and expert input
    var adjustedTemperature = temperature * temperatureCoefficient;
    var adjustedHumidity = humidity * humidityCoefficient;
    var adjustedWindSpeed = windSpeed * windSpeedCoefficient;
    var adjustedFineFuelMoisture = fineFuelMoisture * ffmcCoefficient;
    var adjustedISI = isi * isiCoefficient;

    // Calculate overall fire probability
    var fireProbability = (adjustedTemperature + adjustedHumidity + adjustedWindSpeed + adjustedFineFuelMoisture + adjustedISI) / 5;

    // Ensure the probability is within reasonable bounds (1-100)
    return Math.min(Math.max(fireProbability, 1), 100);
}

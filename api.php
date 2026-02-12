<?php
include("database.php");
$db=$conn;

$ch = curl_init();
$apiKey = "902415655d01af97329828935952cacd";
$city =  "Texas";
$apiURL  = "yout own api key";

$json_data = file_get_contents($apiURL);

$response_data = json_decode($json_data, true);

$temperature = $response_data['main']['temp'];
$humidity = $response_data['main']['humidity'];
$pressure = $response_data['main']['pressure'];
$windspeed = $response_data['wind']['speed'];
$currentdate = date("Y-m-d");

$query = "REPLACE INTO weather_data (`weather_date`, `temperature`, `humidity`, `pressure`, `wind_speed`)  values ('".$currentdate."', $temperature, $humidity, $pressure, $windspeed)";

$result = $db->query($query);

$query="SELECT `weather_date`,`temperature`,`humidity`,`pressure`,`wind_speed` FROM weather_data order by `weather_date` DESC limit 7";
$result = $conn->query($query);

if ($result->num_rows > 0)  
    { 
        while($row = $result->fetch_assoc()) 
        { 
            $data[] = $row; 
        } 
    }  
    else { 
        echo "0 results"; 
    } 
    $response = [];
    $response['data'] =  $data;
    
    echo json_encode($response, JSON_PRETTY_PRINT);


?>
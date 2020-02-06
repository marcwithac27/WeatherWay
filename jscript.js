$(document).ready(function() {
    $("#forecast-container").hide();
    
    
    $("#getWeatherForecast").click(function(){
        $("#forecast-container").show();
        $("#traffic").show();
        $("#trafficDisplay").show();
        var city = $("#city").val();
        var key = 'd12bb65a84aedaec65cea8dea381e38d';
        console.log(key)
        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/weather?q='+ city + '&units=imperial&appid=' + key,
            method: 'GET'
            }).then( function(data){
                console.log(data)
                var name = data.name
                var temp = data.main.temp
                var humidity = data.main.humidity
                var wind = data.wind.speed
                var weathers = data.weather
                var weatherL = weathers.slice()
                console.log(temp)
                $("#city-name").append(name);
                $("#temp").append(temp);
                $("#humidity").append(humidity);
                $("#wind").append(wind);
                    weatherL.forEach(function(weather){
                    
                        var icon = weather.icon
                        var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";
                     console.log(icon)
                     $('#showWeatherForcast').append('<img id="clouds" src=' + iconUrl +'>')
                     
                     
                     
                    });
                    $("#city").val('');
                    
                });
                $("#city-name").empty();
                $("#temp").empty();
                $("#humidity").empty();
                $("#wind").empty();
                $('#showWeatherForcast').empty();  
            });
            $('#getDestination').click(function(){
                var platform = new H.service.Platform({
                    'apikey': 'ECNl-2HfORn6yI2QvDHuMby39s-jNv_6gW7-VWFjgjk'
                 });
                 var geocoderservice = platform.getGeocodingService();
                 var routerService = platform.getRoutingService();
                 var geocoder = query  => {
                     return new Promise((resolve,reject) => {
     
                     
                geocoderservice.geocode(
                    {
                        "searchtext": query
                    },
                    success => {
                        resolve (success.Response.View[0].Result[0].Location.DisplayPosition);
                        //console.log(location);
                        var marker1 = new H.map.Marker(
                            {
                                lat: location.Latitude,
                                lng: location.Longitude
                            }
                        )
                        map.addObject(marker1)
                    },
                    error => {
                        reject(error)
                    }
                );
                     });
             }
             
             const calculateRoute = (start, finish) => {
                     return new Promise((resolve, reject) => {
                         const params = {
                             mode: "fastest;car;traffic:enabled",
                             waypoint0: start.Latitude + "," + start.Longitude,
                             waypoint1: finish.Latitude + "," + finish.Longitude,
                             representation: "display"
                         };
                         routerService.calculateRoute(params, success => {
                             resolve(success.response.route[0].shape);
                         }, error => {
                             reject(error);
                         });
                     });
                 };
                 const calculateIsoline = (start, range) => {
                     return new Promise((resolve, reject) => {
                         const params = {
                             start: start.Latitude + "," + start.Longitude,
                             mode: "fastest;car;traffic:enabled",
                             departure: "now",
                             rangeType: "time",
                             range: range
                         };
                         routerService.calculateIsoline(params, success => {
                             resolve(success.response.isoline[0].component[0].shape);
                         }, error => {
                             reject(error);
                         });
                     });
                 };
             var start = async () =>{
                 var starter = await geocoder($('#startpoint').val());
                 
                 var ending = await geocoder($('#endpoint').val())
                 const map = new H.Map(
                     document.getElementById("map"),
                     platform.createDefaultLayers().vector.normal.map,
                     {
                         zoom: 10,
                         center: { lat: starter.Latitude, lng: starter.Longitude},
                         
                     }
                 );
                 var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
                 var startermarker = new H.map.Marker({ lat: starter.Latitude, lng: starter.Longitude});
                 
                 var endingmarker = new H.map.Marker({ lat: ending.Latitude, lng: ending.Longitude});
                 var startToFinish = await calculateRoute(starter, ending);
                 
                 var startToFinishLineString = new H.geo.LineString();
                 startToFinish.forEach(points => {
                     var parts = points.split(",");
                     startToFinishLineString.pushPoint({
                         lat: parts[0],
                         lng: parts[1]
                     });
                 });
                 var startToFinishPolyline = new H.map.Polyline(
                     startToFinishLineString,
                     {
                         style: {
                             lineWidth: 5
                         }
                     }
                 );
                 var startToFinishIsoLineDate = await calculateIsoline(ending, 1000)
                 console.log(startToFinishIsoLineDate)
                 var startToFinishIsoLineLineString = new H.geo.LineString();
                 startToFinishIsoLineDate.forEach(points => {
                     var parts = points.split(",");
                     startToFinishIsoLineLineString.pushPoint({
                         lat: parts[0],
                         lng: parts[1]
                     })
                 });
                 var startToFinishIsoLineDatePolygon = new H.map.Polygon(
                     startToFinishIsoLineLineString
                 )
                 console.log(startToFinishIsoLineLineString)
                 map.addObjects([startermarker, endingmarker, startToFinishPolyline, startToFinishIsoLineDatePolygon])
                
                 /*var lineString = new H.geo.LineString();
                     lineString.pushPoint(startermarker.getGeometry());
                     lineString.pushPoint(longwoodmarker.getGeometry());
                     lineString.pushPoint(oviedomarker.getGeometry());
                     var polygon = new H.map.Polygon(lineString);
                 ;*/
                 
             }
             
             start();
              
            })
            
              
});
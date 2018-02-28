var map;
var info;
var marker;
var map_Places = [
    {
        title: 'Egypt',
        location: {
            lat: 30.047503,
            lng: 31.233702
        }
    },
    {
        title: 'Algeria',
        location: {
            lat: 28.0339,
            lng: 1.6596
        }
    },
    {
        title: 'Saudi Arabia ',
        location: {
            lat: 24.774265,
            lng: 46.738586
        }
    },
    {
        title: 'Russia',
        location: {
            lat: 61.5240,
            lng: 105.3188
        }
    },
    {
        title: 'Maldives',
        location: {
            lat: 3.2028,
            lng: 73.2207
        }
    },
    {
        title: 'Japan',
        location: {
            lat: 36.204824,
            lng: 138.252924
        }
    },
    {
        title: 'Turkey',
        location: {
            lat: 38.9637,
            lng: 35.2433
        }
    },
];

var places = function (data) {
    this.title = data.title;
    this.location = data.location;
};

function VM() {
    var self = this;
    this.search = ko.observable("");
    this.List = ko.observableArray([]);


    map_Places.forEach(function (locationItem) {
        self.List.push(new places(locationItem));
    });
    MarkersAndThirdParty(this.List());
    this.FilterList = ko.computed(function () {
        info.close();
        if (this.search() === "") {
            ResetMarkers(this.List());
            return this.List();
        }
        else {
            var ob = ko.observableArray([]);
            var l = this.List().length;
            for (var i = 0; i < l; i++) {
                if (this.List()[i].title.indexOf(this.search()) !== -1) {
                    ob.push(this.List()[i]);
                    this.List()[i].marker.setVisible(true);
                } else {
                    this.List()[i].marker.setVisible(false);
                }
            }
            return ob();
        }
    }, this);

    this.showinfo = function (loc) {
        if(marker!=null){
            marker.setAnimation(null);
        }
        info.marker = loc.marker;
        info.setContent("<p>"+loc.content+"</p>");
        info.open(map, loc.marker);

        loc.marker.setMap(map);
        loc.marker.setAnimation(google.maps.Animation.BOUNCE);
        marker = loc.marker;

//        loc.marker.setAnimation(google.maps.Animation
//            .BOUNCE);
    };

}

function MarkersAndThirdParty(list) {
    var link = "https://api.foursquare.com/v2/venues/search?ll=";
    var auth = "&oauth_token=SZBQ2LAJX5C33S1DRSCJRWHAFCLUU3T4K40CGVDFUXMJPEZK&v=20180224";
    list.forEach(function (loc) {
        loc.marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.Drop,
            title: loc.title,
            position: loc.location
        });
        loc.marker.addListener('click', function () {
            if(marker!=null){
                marker.setAnimation(null);
            }
            info.marker = loc.marker;
            info.setContent("<p>"+loc.content+"</p>");
            info.open(map, loc.marker);
            loc.marker.setAnimation(google.maps.Animation.BOUNCE);
            marker=loc.marker;

        });
        url = link + loc.location.lat + "," + loc.location.lng + auth;
        $.ajax({url: url}).done(function (data) {
            try {
                loc.content = data.response.venues[0].name;

            }catch (e){
                loc.content = "No Name For This Location";

            }

        }).fail(function () {
            loc.content = "Error";
        });

    });
}
function ResetMarkers(list) {
    var l = list.length;
    for (var i = 0; i < l; i++) {
        list[i].marker.setVisible(true);
        list[i].marker.setAnimation(google.maps.Animation.DROP);
        marker = null;
    }
}

function init() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: map_Places[0].location,
        zoom: 5
    });
    info = new google.maps.InfoWindow();
    var viewModel = new VM();

    ko.applyBindings(viewModel);
}

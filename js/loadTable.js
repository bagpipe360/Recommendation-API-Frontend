$(document).ready(function () {
    $('#drivers').DataTable({
        responsive: true,
        ajax: {
            url: 'http://driver-recommendations.b5wwpuqgpx.us-east-1.elasticbeanstalk.com/drivers',
            dataSrc: function (json) {
                var datatableData = [];
                var datatableRow;
                for (var i = 0, ien = json.length; i < ien; i++) {
                    datatableRow = [];
                    datatableRow.push(json[i].name);
                    datatableRow.push(json[i].current_location.latitude);
                    datatableRow.push(json[i].current_location.longitude);
                    datatableRow.push(buildDriverButton(json[i].id));
                    datatableRow.push(buildDriverRecommendationList(json[i].id));
                    datatableData.push(datatableRow);
                }
                return datatableData;
            }
        }

    });

    function loadRecommendations(id, callback) {
        $.ajax({
            url: 'http://driver-recommendations.b5wwpuqgpx.us-east-1.elasticbeanstalk.com/drivers/' + id + '/recommendations',
            success: function(data) {
                callback(data);
            }
        })
    }

    $('#drivers_wrapper').on('click', '.load-rec', function () {
        var id = $(this).data('driverId');
        var $recList = $('#recommendation-list-' + id);
        addRecsLoadingByOne();
        loadRecommendations(id, function (response) {
            minusRecsLoadingByOne();
            if (response.error) {
                $recList.html('Unable to pull recommendations for driver.');
            } else {
                $recList.html(formatRecommendations(response));    
            }
        });
    });

    $('#load-all').click(function() {
        $('.load-rec').trigger('click');
    });
});

function formatRecommendations(deliveries) {
    var liString = "";
    for (var i = 0; i < deliveries.length; i++) {
        liString += '<li><b>ID </b>:' + deliveries[i].id + ' <br />' + deliveries[i].distance.toFixed(2) + ' miles away from driver. <br />' + 
                    '<b>Pickup</b> Lat: ' + deliveries[i].pickup_location.latitude + ', Long: ' + deliveries[i].pickup_location.longitude + '</li>';
    }
    return liString;
}

function buildDriverButton(id) {
    var button = '<button class="btn btn-sm btn-success load-rec" data-driver-id="' + id + '">Load Recommendations</button>';
    return button;
}

function buildDriverRecommendationList(id) {
    var list = '<ol id="recommendation-list-' + id + '" class="recommendation-list" data-driver-id="' + id + '"></ol>';
    return list;
}

function addRecsLoadingByOne() {
    var $counter = $('#recs-loading');
    var current = parseInt($counter.text());
    $counter.html(current + 1);
}

function minusRecsLoadingByOne() {
    var $counter = $('#recs-loading');
    var current = parseInt($counter.text());
    $counter.html(current - 1);

}



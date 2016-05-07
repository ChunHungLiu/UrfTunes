// Example server call: http://172.81.178.14:8080/na/rndminternetman/
(function() {
    function parseSearch(search) {
        var args = {};
        if (!search)
            return args;
        if (search.indexOf('?') === 0)
            search = search.substr(1);
        var items = search.split('&');
        for (var i = 0; i < items.length; ++i) {
            var split = items[i].split('=');
            if (split.length !== 2)
                continue;
            var name = split[0];
            var value = split[1];
            args[name] = decodeURIComponent(value);
        }
        return args;
    }
    
    window.onpopstate = function(event)
    {
        var args = parseSearch(location.search);
        if (args.summoner) {
            songBuilder.stop();
            args.region = args.region || 'na';
            $('#summonerName').val(args.summoner);
            $('#region').val(args.region);
            loadSummoner(args.summoner, args.region, false, false);
        } else {
            $('#summonerName').focus();
        }
    };
    
    $(document).ready(function() {
        var args = parseSearch(location.search);
        if (args.summoner) {
            args.region = args.region || 'na';
            $('#summonerName').val(args.summoner);
            $('#region').val(args.region);
            loadSummoner(args.summoner, args.region, false, false);
        } else {
            var summoner = localStorage.getItem("summoner");
            var region = localStorage.getItem("region") || "na";
            if (summoner) {
                $('#summonerName').val(summoner);
                $('#region').val(region);
                loadSummoner(summoner, region, false, false);
                history.replaceState(null, summonerName, '?summoner=' + encodeURIComponent(summoner) + '&region=' + encodeURIComponent(region));
            } else {
                $('#summonerName').focus();
            }
        }
        
        $("#summonerForm").submit(function(e) {
            loadSummoner($('#summonerName').val(), $('#region').val(), true, true);
            e.preventDefault();
            return false;
        });
    });
    
    function setChampionIconOpacities() {
        for (var i = 0; i < championNames.length; ++i) {
            $('#' + championNames[i]).css('opacity', 0.05 + 0.19 * window.masteries[championNames[i]]);
        }
    }

    function loadSummoner(summonerName, region, playOnLoad, pushState) {
        if (!summonerName) {
            $('#summonerName').focus();
            return;
        }
            
        // Get the standardized summoner name, which has spaces removed and is lowercase.
        summonerName = summonerName.replace(/\s+/g, '').toLowerCase();
        
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onload = function() {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                championMasteryLevels = JSON.parse(xmlHttp.responseText);
                for (var i = 0; i < championNames.length; ++i) {
                    if (!championMasteryLevels[championNames[i]]) {
                        championMasteryLevels[championNames[i]] = 0;
                    }
                }
                window.masteries = championMasteryLevels;
                
                setChampionIconOpacities();
                
                songBuilder.build();
                if (playOnLoad)
                    songBuilder.play();
                $('#play').prop('disabled', false);
                $('#stop').prop('disabled', false);
                
                localStorage.setItem("summoner", summonerName);
                localStorage.setItem("region", region);
                if (pushState)
                    history.pushState(null, summonerName, '?summoner=' + encodeURIComponent(summonerName) + '&region=' + encodeURIComponent(region));
            } else {
                $('#play').prop('disabled', true);
                $('#stop').prop('disabled', true);
            }
        }
        xmlHttp.onerror = function() {
            alert('Something disasterous has occured, terribly sorry about that.');
        }
        xmlHttp.open('GET', 'http://172.81.178.14:8080/' + region + '/' + summonerName, true);
        xmlHttp.send(null);
    }
})();
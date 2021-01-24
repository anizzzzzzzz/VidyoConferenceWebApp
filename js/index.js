$.fn.serializeObject = function(){
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function getUrl(){
    let url = window.location.hostname;
    if(url == 'localhost')
        return 'http://'+url+'/vidyo-webchat';
    else
        return 'https://'+url;    
}

function getVidyoCallUrl(token, roomId){
    let local = window.location.hostname == 'localhost';
    let url = getUrl();
    
    if(local){
        return url+'/index.html?token='+token+'&roomId='+roomId;
    }
    else{
        return url+'?token='+token+'&roomId='+roomId;
    }
}

// index.html?token=cHJvdmlzaW9uAGFuaXNoQGY4MjIyNC52aWR5by5pbwAxMDA2Mzc3NzgzODkyOAAAMjVkN2RjYjdjOWY3MThlNzQzMGJhYTUxNTBiZmJjYjE5NmY3MWViZDk5M2Q4NGY2N2EyOTMwODVjMDIxZGNiMjQ3MDA4NzUxZDQ5MWI4MDU5ZDZhMjc0N2U5M2MyZmIx&roomId=nitans
$(function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    $('#token').val(urlParams.get('token'));
    $('#roomId').val(urlParams.get('roomId'));

    $('form').submit(function() {
        let userdata = $('form').serializeObject();
        localStorage.displayName = userdata['displayName'];
        localStorage.token = userdata['token'];
        localStorage.roomId = userdata['roomId'];

        $(location).attr('href', getUrl() + '/conference.html')
        return false;
    });

    $('#generateURL').click(function(){
        let userdata = $('form').serializeObject();
        $('#vidyoUrl').val(getVidyoCallUrl(userdata['token'], userdata['roomId']));
    });
});
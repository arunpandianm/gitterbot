var API_Key = "ae28f23f134c4364ad45e7b7355cfa91c92038bb";
var userList = [];
var userlist_html = "";

//Gitter Room Name List Generation
$(function(){
  $.ajax({
    type: 'GET',
    url: 'https://api.gitter.im/v1/rooms?access_token=' + API_Key,
    async: false,
    dataType: 'json',
    success: function(data){
      for (var i = 0; i < data.length; i++) {
        $('#gitterRoomList').append('<option>' + data[i]["name"] + '</option>');
      }
    },
    error: function(xhr, textStatus, errorThrown) {

    }
  });
});

//Get Gitter Room Info
$(function(){
  $('#listUserButton').click(function(){
    var selectedGroup = document.getElementById('selectedGroup').value;
    //alert(selectedGroup);
    //Find the User Count and groupId
    var url = 'https://api.gitter.im/v1/rooms?access_token=' + API_Key;
    var roomId = "";
    var topic = "";
    var lastAccessTime = "";
    var noOfUsers = 0;
    $.ajax({
        type: 'GET',
        url: url,
        async: false,
        dataType: 'json',
        success: function(data) {
            //Do stuff with the JSON data

            for (var i = 0; i < data.length; i++) {
                if (data[i]["name"] === selectedGroup) {
                    roomId = data[i]["id"];
                    noOfUsers = data[i]["userCount"];
                    topic = data[i]["topic"];
                    lastAccessTime = data[i]["lastAccessTime"];
                    break;
                }
            }
            $('groupName').append(selectedGroup);
            $('topicDiscusion').append(topic);
            $('userCount').append(noOfUsers);
            $('lastAccessTime').append(lastAccessTime);
        },
        error: function(xhr, textStatus, errorThrown) {
        }
    });

    //find the members of group
    var jsonData = [];

    for (var i = 0; i < noOfUsers; i += 100) {
        $.ajax({
            type: 'GET',
            url: 'https://api.gitter.im/v1/rooms/' + roomId + '/users?access_token=' + key + '&skip=' + i + '&limit=100',
            async: false,
            dataType: 'json',
            success: function(data) {
                $.merge(jsonData, data);
                },
            error: function(xhr, textStatus, errorThrown) {
                }
        });
    }

  getData(jsonData);
});
//End of click method

function getData(jsonData) {
    var len = jsonData.length;
    for (var i = 0; i < len; i++) {
            userList.push({avatar: jsonData[i]["avatarUrlMedium"], name: jsonData[i]["displayName"], uname: jsonData[i]["username"], role: jsonData[i]["role"]});
        }
        userlist_html += userList.map(function(a) {
                return dataFormatter(a.name, a.uname, a.role, a.id, a.avatar);
            }).join('');
        $('#userList').append(userlist_html);
    }

function dataFormatter(name, uname, role, id, urlmedium) {
    var temp_html = "";
        temp_html += '<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">';
        temp_html += '<div class="profile_details">';
        temp_html += '<div class="well profile_view">';
        temp_html += '<div class="col-sm-12">';
        temp_html += '<h4 class="brief"><i>' + name + '</i></h4>';
        temp_html += '<div class="left col-xs-7">';
        temp_html += '<h2>"' + uname + '"</h2>';
        temp_html += '<p><strong>Role: </strong>' + role + '</p>';
        temp_html += '<p><strong>Gitter User ID: </strong>' + id + '</p>';
        temp_html += '</div>';
        temp_html += '<div class="right col-xs-5 text-center">';
        temp_html += '<img src="' + urlmedium + '" alt="Avatar or profile picture of gitter room user" class="img-circle img-responsive">';
        temp_html += '</div>';
        temp_html += '</div>';
        temp_html += '<div class="col-xs-12 bottom text-center">';
        temp_html += '<div class="col-xs-12 col-sm-6 emphasis">';
        temp_html += '<button type="button" class="btn btn-primary btn-xs" id = "profile_btn">';
        temp_html += '<i class="fa fa-github"> </i>';
        temp_html += '<a href="http://www.github.com/' + uname + '" target="_blank"><span class="profile_link">View GitHub Profile</span></a>';
        temp_html += '</button>';
        temp_html += '</div></div></div></div></div>';

        return temp_html;
    }

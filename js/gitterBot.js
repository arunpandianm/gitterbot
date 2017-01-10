//Global declaration
var API_Key = "ae28f23f134c4364ad45e7b7355cfa91c92038bb";
var _userInfoJsonData = [];
var _userList = [];
var _userListHtml = "";
var _gitterRoomJsonData = [];
var _selectedGroup = "";
var _roomId = "";
var _topic = "";
var _lastAccessTime = "";
var _noOfUsers = 0;


$(function(){

  //Gitter Room Name List Generation
  $('#getRoomName').click(function(){
    $.ajax({
      type: 'GET',
      url: 'https://api.gitter.im/v1/rooms?access_token=' + API_Key,
      dataType: 'json',
      success: function(data){
        for (var i = 0; i < data.length; i++) {
          $('#gitterRoomList').append('<option>' + data[i]["name"] + '</option>');
        }

        $.merge(_gitterRoomJsonData, data);

      },
      error: function(xhr, textStatus, errorThrown){
        console.error();
      }
    });//end of getter room list ajax
      //console.log(_gitterRoomJsonData);
  });//end of #getRoomName

  //Fetch users from selected group name
  $('#listUserButton').click(function(){
    //Get the user input

    _selectedGroup = $("#selectedGroup").val();
    //alert(_selectedGroup);
    for (var i = 0; i < _gitterRoomJsonData.length; i++) {
        if (_gitterRoomJsonData[i]["name"] == _selectedGroup) {
            _roomId = _gitterRoomJsonData[i]["id"];
            _noOfUsers = _gitterRoomJsonData[i]["userCount"];
            _topic = _gitterRoomJsonData[i]["topic"];
            _lastAccessTime = _gitterRoomJsonData[i]["lastAccessTime"];
            break;
        }
    }
    $('#groupName').append(_selectedGroup);
    $('#topicDiscusion').append(_topic);
    $('#userCount').append(_noOfUsers);
    $('#lastAccessTime').append(_lastAccessTime);

    //Get the user list
    getData(_roomId, _noOfUsers);

  });//end of #listUserButton

});//end of main function


function getData(_roomId, _noOfUsers) {
    //get the user list from gitter room
    for (var i = 0; i < _noOfUsers; i += 100) {
        $.ajax({
            type: 'GET',
            url: 'https://api.gitter.im/v1/rooms/' + _roomId + '/users?access_token=' + API_Key + '&skip=' + i + '&limit=100',
            dataType: 'json',
            success: function(data1) {
              $.each(data1, function(i, list){
                var temp_html= "";
                    temp_html += '<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">';
                    temp_html += '<div class="profile_details">';
                    temp_html += '<div class="well profile_view">';
                    temp_html += '<div class="col-sm-12">';
                    temp_html += '<h4 class="brief"><i>' + list.displayName + '</i></h4>';
                    temp_html += '<div class="left col-xs-7">';
                    temp_html += '<h5>' + list.username + '</h5>';
                    temp_html += '<p><strong>Role: </strong></br>' + list.role + '</p>';
                    temp_html += '<p><strong>Gitter User ID: </strong>' + list.id + '</p>';
                    temp_html += '</div>';
                    temp_html += '<div class="right col-xs-5 text-center">';
                    temp_html += '<img src="' + list.avatarUrlMedium + '" alt="Avatar or profile picture of gitter room user" class="img-circle img-responsive">';
                    temp_html += '</div>';
                    temp_html += '</div>';
                    temp_html += '<div class="col-xs-12 bottom text-center">';
                    temp_html += '<div class="col-xs-12 col-sm-6 emphasis">';
                    temp_html += '<button type="button" class="btn btn-primary btn-xs" id = "profile_btn">';
                    temp_html += '<i class="fa fa-github"> </i>';
                    temp_html += '<a href="http://www.github.com/' + list.username + '" target="_blank"><span class="profile_link">View GitHub Profile</span></a>';
                    temp_html += '</button>';
                    temp_html += '</div></div></div></div></div>';

                $('#userList').append(temp_html);
                });
                },
            error: function(xhr, textStatus, errorThrown) {
                }
        });
    }
}

/** CONTROLLER **/
angular.module('app').controller('Shell', Shell);

function Shell() {

  var vm = this;

  vm.messages = [
    {
      'username': 'username1',
      'content': 'Hi!'
    },
    {
      'username': 'username2',
      'content': 'Hello!'
    },
    {
      'username': 'username2',
      'content': 'Hello!'
    },
    {
      'username': 'username2',
      'content': 'Hello!'
    },
    {
      'username': 'username2',
      'content': 'Hello!'
    },
    {
      'username': 'username2',
      'content': 'Hello!'
    }
  ];
  //test = $cookieStore.get('globals')
  
  vm.username = 'test';

  vm.sendMessage = function(message, username) {
    if(message && message !== '' && username) {
      vm.messages.push({
        'username': username,
        'content': message
      });
    }
  };
  vm.visible = true;
  vm.expandOnNew = true;
}
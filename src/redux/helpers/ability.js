import { AbilityBuilder } from '@casl/ability'

/*
[
  {
    "actions": ["create", "read", "update", "delete"],
    "subject": "Post",
    "conditions": {
      "author": "${user.id}"
    }
  },
  {
    "actions": ["read", "update"],
    "subject": "User",
    "conditions": {
      "id": "${user.id}"
    }
  }
]
*/

//doing this so I don't have to split logic between define and update
//on login the user.service updates the abilityBuilder which is exported from here
//on normal load we just grab it from local storage
function defineAbilitiesFor(user) {
    let rules = [];
    if (user && user.Roles) {
        if (user.Roles.includes('Domain Admins')) {
            rules.push({ actions: 'manage', subject: 'all' });
        } else {
            rules.push({ actions: 'manage', subject: user.Roles[0] });
        }
    }

    return rules;
}

//add timestamp to localstorage and delete it??? or also check cookie? need to refresh cookie as well...
//just going to add keep-alive login for now...
function keepAliveLogin() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user.Email) {
    //make request to server to refresh login? hopefully that works
    fetch(`https://api2.auburnalabama.org/me`);
  }
}
const keepAliveTime = 1000 * 60 * 60 * 10;
setTimeout(keepAliveLogin, keepAliveTime)

//define an empty ability set
let abilityManager = AbilityBuilder.define(() => {});
//get logged in user, if available
const user = JSON.parse(localStorage.getItem('user'));
//update user
abilityManager.update(defineAbilitiesFor(user));


//export
export default abilityManager;
export { defineAbilitiesFor };

//export default AbilityBuilder.define(can => {
    // if (user && user.Roles) {
    //     if (user.Roles.includes('Domain Admins')) {
    //         can('manage', 'all');
    //     } else {
    //         can('manage', user.Roles[0]);
    //     }
    // }
//});

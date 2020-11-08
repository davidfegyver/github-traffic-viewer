//library imports
const superagent = require('superagent');

//user things
//CHANGE HERE
const uname = "davidfegyver"
const pass = "ThisIsAN1ceP@$$" // Lol, this is not my password :D
let buff = new Buffer(`${uname}:${pass}`);
let baseEncoded = buff.toString('base64');


let reposList = [];

//a simple get api datas function
async function getData(url) {
    let {body} = await superagent
        .get("https://api.github.com/" + url)
        .set('User-Agent', uname)
        .set("Authorization", `basic ${baseEncoded}`);
    return body;
}

//main function
async function main() {
    let repos = await getData(`users/${uname}/repos`); // get your repos
    for (let i = 0; i < repos.length; i++) { // loop througt your repos,
        let clones = await getData(`repos/${repos[i].full_name}/traffic/clones`); // and see the repo's clones and 
        let views = await getData(`repos/${repos[i].full_name}/traffic/views`); // views

        reposList.push({ // add it to a list. 
            "name": repos[i].name, // with the repo's name,
            "clones": clones.uniques, // unique clones counts,
            "views": views.uniques // and its unique views count.
        });
    }

    reposList = reposList.sort((a, b) => { // sort the array by unique view count
        let views1 = a.views;
        let views2 = b.views;
        return views2 - views1;
    });

    console.log(reposList); // list your sorted list

}



main();
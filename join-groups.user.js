// ==UserScript==
// @name         Join all steam groups from profile
// @namespace    meow
// @version      0.0.1
// @description  Join all of someone's steam groups
// @author       Marc 
// @match        *://steamcommunity.com/id/*
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js
// @grant        none
// ==/UserScript==
//


async function joinGroups() {
    // Get the profile ID
    const profileId = window.location.pathname.split('/')[2];

    // Log the profile id to the console
    console.log('Profile ID:', profileId);

    // Get the profile XML
    const resProfile = await fetch(`https://steamcommunity.com/id/${profileId}/?xml=1`);

    // We use jQuery's XML parser to parse XML => json
    const json = await $.parseXML(await resProfile.text());

    // Get all group IDs
    const groups = await $(json).find('groupID64');

    // Set params for POST request
    const params = {
        action: 'join',
        sessionID: Cookies.get('sessionid')
    };

    for (let i = 0; i < groups.length; i++) {
        // join the group
        const resGrp = await fetch('https://steamcommunity.com/gid/' + groups[i].textContent, {
            "credentials": "include",
            "headers": {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "en,en-GB;q=0.5",
                "Content-Type": "application/x-www-form-urlencoded",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-User": "?1",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache"
            },
            "referrer": "https://steamcommunity.com/groups/WorldCyberGames2011",
            "body": "action=join&sessionID=" + params.sessionID,
            "method": "POST",
            "mode": "cors"
        });

        // Log to console whether we successfully joined or not.
        // The "Join Group" button is only present if we are not in the group.
        const resHTML = await resGrp.text();
        if (!resHTML.includes('Join Group')) {
            console.log("joined https://steamcommunity.com/gid/" + groups[i].textContent);
        } {
            console.warn("failed join https://steamcommunity.com/gid/" + groups[i].textContent);
        }

    }
}

// Start joining them grps
joinGroups();

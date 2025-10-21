async function turnstileLoad() {
    // const urlSearchParams = new URLSearchParams(window.location.search);
    // const params = Object.fromEntries(urlSearchParams.entries());
    // console.log(params);
    // if(Object.keys(Object.fromEntries(urlSearchParams.entries())).filter((k) => { return k != 'page' }).length == 0){
    //     return
    // }


    cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("cf_turnstile_token="))
    if (cookie) {
    return
    }

    // A simple modal to contain Cloudflare Turnstile
    let overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.right = '0';
    overlay.style.bottom = '0';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.border = '1px solid grey';
    overlay.style.zIndex = '10000';
    overlay.style.display = 'none';
    overlay.innerHTML = '<p style="color: white; text-align: center; margin-top: 50vh;">One more step before you proceed...</p><div style="display: flex; flex-wrap: nowrap; align-items: center; justify-content: center;" id="turnstile_widget"></div>';
    document.body.appendChild(overlay);

    overlay.style.display = 'block';

    await new Promise((resolve, reject) => {
    turnstile.render('#turnstile_widget', {
        'sitekey': '0x4AAAAAAB4xlu0mY5PvCeUb',
        //'sitekey': '1x00000000000000000000AA',
        'error-callback': function (e) {
            overlay.style.display = 'none';
            reject(e);
        },
        'callback': async function (token) {
        const rawResponse = await fetch(window.location.protocol + "//" + window.location.hostname + "/cf/submit",
        //const rawResponse = await fetch(window.location.protocol + "//" + window.location.hostname + ":9988/submit",
            {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Expose-Headers': '*'
            },
            body: JSON.stringify({ 'cf-turnstile-response': token, })
            }
        );
        overlay.style.display = 'none';
        },
    })
    })
}

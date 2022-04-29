<!-- <script>
    import { onMount } from "svelte";
    import { Plane } from "svelte-loading-spinners";
    let data = {};
    let time = new Date();
    let carga = false;
    var myHeaders = new Headers();
    myHeaders.append("x-access-token", "goldapi-6rn18l1wvf68d-io");
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    };

    fetch("https://www.goldapi.io/api/XAU/USD", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            data = JSON.parse(result);
            console.log(data);
            carga = true;
        })
        .catch((error) => console.log("error", error));

    const cargarOro = () => {
        var myHeaders = new Headers();
        myHeaders.append("x-access-token", "goldapi-6rn18l1wvf68d-io");
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };

        fetch("https://www.goldapi.io/api/XAU/USD", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                data = JSON.parse(result);
                console.log(data);
            })
            .catch((error) => console.log("error", error));
    };

    onMount(() => {
        const interval = setInterval(() => {
            time = new Date();
            console.log(time);
            cargarOro();
        }, 90000);

        return () => {
            clearInterval(interval);
        };
    });
</script>

<div class="col-xl-3 col-sm-6">
    <div class="card">
        <div
            class="card-body d-flex align-items-center justify-content-between"
        >
            {#if carga}
                <div class="card-data me-2">
                    <h5>GOLD / USD DOLLAR</h5>
                    <h2 class="fs-40 font-w600">{data.price}</h2>
                    <small class="text-success">{data.chp}% ({data.ch})</small>
                </div>
                <div>
                    <img src="images/oro.png" width="50" alt="" />
                </div>
            {:else}
                <div class="card-data me-2">
                    <center>
                        <Plane />
                    </center>
                </div>
            {/if}
        </div>
    </div>
</div> -->
<div class="col-xl-3 col-sm-6">
    <div class="card">
        <div
            class="tradingview-widget-container my-2"
            style="width: 100%; height: 126px;"
        >
            <style>
                .tradingview-widget-copyright {
                    font-size: 13px !important;
                    line-height: 32px !important;
                    text-align: center !important;
                    vertical-align: middle !important;
                    /* @mixin sf-pro-display-font; */
                    font-family: -apple-system, BlinkMacSystemFont,
                        "Trebuchet MS", Roboto, Ubuntu, sans-serif !important;
                    color: #9db2bd !important;
                }

                .tradingview-widget-copyright .blue-text {
                    color: #2962ff !important;
                }

                .tradingview-widget-copyright a {
                    text-decoration: none !important;
                    color: #9db2bd !important;
                }

                .tradingview-widget-copyright a:visited {
                    color: #9db2bd !important;
                }

                .tradingview-widget-copyright a:hover .blue-text {
                    color: #1e53e5 !important;
                }

                .tradingview-widget-copyright a:active .blue-text {
                    color: #1848cc !important;
                }

                .tradingview-widget-copyright a:visited .blue-text {
                    color: #2962ff !important;
                }
            </style><iframe
                scrolling="no"
                allowtransparency="true"
                frameborder="0"
                src="https://s.tradingview.com/embed-widget/single-quote/?locale=en#%7B%22symbol%22%3A%22FOREXCOM%3AXAUUSD%22%2C%22colorTheme%22%3A%22light%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A126%2C%22isTransparent%22%3Afalse%2C%22utm_source%22%3A%22www.goldapi.io%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22single-quote%22%7D"
                style="box-sizing: border-box; height: 126px; width: 100%;"
            />
        </div>
    </div>
</div>
